'use client';

import { useState, useEffect, useRef } from 'react';
import PostCard from './PostCard';
import Toast from '../ui/Toast';
import { Music, Settings2, Moon, Sun, CloudMoon, Check, Loader2, Video, FileAudio, X, Clipboard as ClipboardIcon, Trash2, History } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import Image from 'next/image';
import { useVideoDownload, SelectionType } from '@/lib/hooks/use-video-download';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import dynamic from 'next/dynamic';

// --- TİP TANIMLAMALARI ---
type PostData = {
  id: string;
  author: { name: string; handle: string; avatar: string };
  content: string;
  image?: string;
  timestamp: string;
  metrics: { likes: number; reposts: number; replies: number };
  historyMeta?: { quality: string; type: string; originalUrl: string } // Added for history
};

type FeedItem =
  | { type: 'post'; data: PostData }
  | { type: 'ad'; id: string };

interface MainFeedProps {
  dict: any;
  initialItems: any[];
}

export default function MainFeed({ dict, initialItems }: MainFeedProps) {
  const [activeTab, setActiveTab] = useState<'foryou' | 'history'>('foryou');
  const [isFocused, setIsFocused] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { theme, setTheme } = useTheme();

  const {
    inputUrl, setInputUrl, data, error, loading, downloading, progress,
    selection, setSelection, notification, closeNotification,
    handleAnalyze, executeDownload, reset, history, clearHistory, removeFromHistory
  } = useVideoDownload(dict);

  const logoSrc = theme === 'default' ? '/logo.avif' : '/logo-white.avif';

  // --- REKLAM BİLEŞENİ ---
  // --- REKLAM BİLEŞENİ (Lazy Load) ---
  const AdBanner = dynamic(() => import('./AdBanner'), {
    ssr: false,
    loading: () => (
      <div className="border-b border-(--border) p-4 bg-(--background-secondary)/30 animate-pulse">
        <div className="w-full h-32 bg-(--background-secondary) rounded-xl border border-(--border) flex flex-col items-center justify-center relative overflow-hidden">
        </div>
      </div>
    )
  });

  // DOM Optimization: Limit initial render to first 4 items
  const [displayItems, setDisplayItems] = useState<FeedItem[]>(() => initialItems.slice(0, 4));

  useEffect(() => {
    // Hydrate remaining items after first paint
    if (initialItems.length > 4) {
      const timer = setTimeout(() => {
        setDisplayItems(initialItems);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialItems]);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    setInputUrl(pastedText);
    if (pastedText.includes('x.com') || pastedText.includes('twitter.com')) {
      const success = await handleAnalyze(pastedText);
      if (success) setIsSettingsMenuOpen(true);
    }
  };

  const handleManualAnalyze = async () => {
    const success = await handleAnalyze();
    if (success) setIsSettingsMenuOpen(true);
  };

  const handlePasteAndAnalyze = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.readText) {
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        inputRef.current?.focus();
        return;
      }
      setInputUrl(text);
      if (text.includes('x.com') || text.includes('twitter.com')) {
        const success = await handleAnalyze(text);
        if (success) setIsSettingsMenuOpen(true);
      } else {
        inputRef.current?.focus();
      }
    } catch (err) {
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleClearInput = () => {
    setInputUrl('');
    reset();
    setIsSettingsMenuOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectFormat = (sel: SelectionType) => {
    setSelection(sel);
  };

  useEffect(() => {
    if (!inputUrl.trim()) {
      reset();
      setDisplayItems(initialItems);
      setIsSettingsMenuOpen(false);
    }
  }, [inputUrl]);

  // Handle Tab and Data Changes
  useEffect(() => {
    if (activeTab === 'history') {
      if (history.length > 0) {
        // Map history to FeedItems
        const historyFeed: FeedItem[] = history.map(h => ({
          type: 'post',
          data: {
            id: h.id,
            author: h.author,
            content: h.content,
            image: h.image,
            timestamp: new Date(h.timestamp).toLocaleDateString(),
            metrics: { likes: 0, reposts: 0, replies: 0 },
            historyMeta: {
              quality: h.quality,
              type: h.type,
              originalUrl: h.originalUrl
            }
          }
        }));
        setDisplayItems(historyFeed);
      } else {
        // Empty state for history handled in render
        setDisplayItems([]);
      }
    } else {
      // Downloader Tab
      if (data) {
        const newPost: FeedItem = {
          type: 'post',
          data: {
            id: data.id,
            author: {
              name: data.author.name,
              handle: `@${data.author.screenName}`,
              avatar: data.author.avatarUrl
            },
            content: data.text,
            image: data.media.thumbnailUrl,
            timestamp: 'Now',
            metrics: { likes: data.statistics.likes || 0, reposts: 0, replies: 0 },
          }
        };
        setDisplayItems([newPost, ...initialItems]);
      } else {
        setDisplayItems(initialItems);
      }
    }
  }, [theme, data, activeTab, history, initialItems]);

  // Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTextAreaColorClass = () => {
    if (error) return 'text-red-500 placeholder-red-500/50';
    if (data) return 'text-(--accent) font-medium';
    return 'text-(--text-primary) placeholder-(--text-secondary)';
  };

  return (
    <>
      {notification && (
        <Toast
          message={notification.msg}
          type={notification.type}
          isVisible={!!notification}
          onClose={closeNotification}
        />
      )}

      <div className="sticky top-0 z-10 bg-(--background)/80 backdrop-blur-md border-b border-(--border)">
        <div className="flex">
          <button onClick={() => setActiveTab('foryou')} className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) relative flex items-center justify-center cursor-pointer">
            <span className={activeTab === 'foryou' && 'font-bold text-(--text-primary)' || 'text-(--text-secondary)'}>{dict.feed.tabs.download}</span>
            {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-16" />}
          </button>
          <button onClick={() => setActiveTab('history')} className="flex-1 py-4 text-center font-semibold hover:bg-(--background-secondary) relative flex items-center justify-center cursor-pointer">
            <span className={activeTab === 'history' && 'font-bold text-(--text-primary)' || 'text-(--text-secondary)'}>{dict?.history?.title || 'History'}</span>
            {activeTab === 'history' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-(--accent) rounded-full w-12" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <div id="download-area" className="p-4 border-b border-(--border) scroll-mt-24">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative border border-(--border)">
              <Image src={logoSrc} alt="XDownloaderz" fill className="object-cover" sizes="40px" />
            </div>
            <div className="flex-1 flex flex-col gap-3">

              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onPaste={handlePaste}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleManualAnalyze();
                    }
                  }}
                  placeholder={dict.feed.inputPlaceholder}
                  className={`w-full bg-transparent text-xl outline-none resize-none min-h-12 ${getTextAreaColorClass()}`}
                  rows={2}
                  disabled={loading || downloading}
                />
              </div>

              {!loading && (
                inputUrl ? (
                  <button
                    onClick={handleClearInput}
                    className="flex items-center gap-2 text-(--text-secondary) hover:text-red-500 font-semibold text-sm hover:bg-red-500/10 rounded-full px-3 py-1 w-fit cursor-pointer"
                  >
                    <X size={16} />
                    <span>{dict.feed.clearButton}</span>
                  </button>
                ) : (
                  isFocused && (
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handlePasteAndAnalyze}
                      className="flex items-center gap-2 text-(--accent) font-semibold text-sm hover:bg-(--accent)/10 rounded-full px-3 py-1 w-fit cursor-pointer"
                    >
                      <ClipboardIcon size={20} />
                      <span>{dict.feed.pasteButton}</span>
                    </button>
                  )
                )
              )}

              {loading && (
                <div className="flex items-center gap-2 text-(--text-secondary) font-semibold text-sm px-3 py-1">
                  <Loader2 size={16} className="animate-spin" />
                  <span>{dict.feed.analyzing}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-(--border)">
                <div className="flex items-center gap-2">
                  <div className="relative" ref={settingsRef}>
                    <button
                      onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                      disabled={!data}
                      className={`p-2 rounded-full cursor-pointer flex items-center gap-2
                            ${!data ? 'text-(--text-secondary) opacity-50 cursor-not-allowed' : ''}
                            ${selection?.type === 'video' ? 'bg-blue-500/10 text-blue-500 ring-2 ring-blue-500/20' : 'text-(--accent) hover:bg-(--accent)/10'}
                        `}
                      title={dict.feed.settings.title}
                      aria-label={dict.feed.accessibility.settings}
                    >
                      <Settings2 size={20} />
                      {selection?.type === 'video' && (
                        <span className="text-xs font-bold hidden sm:block">{selection.qualityLabel}</span>
                      )}
                    </button>

                    {isSettingsMenuOpen && data && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-(--background) border border-(--border) rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-(--border) bg-(--background-secondary)/50">
                          <h3 className="font-bold text-sm text-(--text-primary)">{dict.feed.settings.title}</h3>
                        </div>

                        <div className="p-2 flex flex-col gap-1 max-h-80 overflow-y-auto custom-scrollbar">
                          <button
                            onClick={() => handleSelectFormat({
                              type: 'audio',
                              url: data.media.variants[0].url
                            })}
                            className={`flex items-center justify-between p-3 rounded-lg group cursor-pointer w-full text-left
                                        ${selection?.type === 'audio' ? 'bg-pink-500/10 border border-pink-500/20' : 'hover:bg-(--background-secondary)'}
                                    `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs
                                            ${selection?.type === 'audio' ? 'bg-pink-500 text-white' : 'bg-pink-500/10 text-pink-500'}
                                        `}>
                                MP3
                              </div>
                              <div className="flex flex-col">
                                <span className={`font-semibold text-sm ${selection?.type === 'audio' ? 'text-pink-500' : 'text-(--text-primary)'}`}>
                                  {dict.feed.settings.audio}
                                </span>
                                <span className="text-xs text-(--text-secondary)">{dict.feed.settings.autoConvert}</span>
                              </div>
                            </div>
                            {selection?.type === 'audio' && <Check size={16} className="text-pink-500" />}
                          </button>
                          <div className="h-px bg-(--border) my-1 mx-2"></div>
                          {data.media.variants.map((variant, idx) => {
                            const qualityLabel = variant.quality || (variant.bitrate ? `${Math.round(variant.bitrate / 1000)}kbps` : dict.feed.settings.standard);
                            const isSelected = selection?.type === 'video' && selection.url === variant.url;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectFormat({
                                  type: 'video',
                                  url: variant.url,
                                  qualityLabel: qualityLabel
                                })}
                                className={`flex items-center justify-between p-3 rounded-lg group cursor-pointer w-full text-left
                                                ${isSelected ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-(--background-secondary)'}
                                            `}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs
                                                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'}
                                                `}>
                                    MP4
                                  </div>
                                  <div className="flex flex-col">
                                    <span className={`font-semibold text-sm ${isSelected ? 'text-blue-500' : 'text-(--text-primary)'}`}>
                                      {qualityLabel}
                                    </span>
                                    <span className="text-xs text-(--text-secondary)">
                                      {idx === 0 ? dict.feed.settings.highQuality : dict.feed.settings.dataSaver}
                                    </span>
                                  </div>
                                </div>
                                {isSelected && <Check size={16} className="text-blue-500" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`p-2 rounded-full ${selection?.type === 'audio' ? 'bg-pink-500/10 text-pink-500 ring-2 ring-pink-500/20 opacity-100' : 'text-pink-500/50 opacity-50'}`}>
                    <Music size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 relative">
                    <LanguageSwitcher />

                    <div className="relative" ref={themeRef}>
                      <button
                        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                        className={`p-2 rounded-full cursor-pointer ${isThemeMenuOpen ? 'bg-(--accent)/20 text-(--accent)' : 'hover:bg-(--accent)/10 text-(--accent)'}`}
                        aria-label={dict.feed.accessibility.themeToggle}
                      >
                        {theme === 'default' && <Sun size={20} />}
                        {theme === 'dim' && <CloudMoon size={20} />}
                        {theme === 'lights-out' && <Moon size={20} />}
                      </button>
                      {isThemeMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-(--background) border border-(--border) rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <button onClick={() => { setTheme('default'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg text-(--text-primary) cursor-pointer group">
                            <div className="p-2 bg-blue-500 rounded-full text-white shadow-sm group-hover:scale-110"><Sun size={16} /></div>
                            <span className="font-bold text-sm">{dict.feed.theme.default}</span>
                            {theme === 'default' && <Check className="ml-auto text-blue-500" size={18} />}
                          </button>
                          <button onClick={() => { setTheme('dim'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg text-(--text-primary) cursor-pointer group">
                            <div className="p-2 bg-[#15202b] rounded-full text-white border border-gray-600 shadow-sm group-hover:scale-110"><CloudMoon size={16} /></div>
                            <span className="font-bold text-sm">{dict.feed.theme.dim}</span>
                            {theme === 'dim' && <Check className="ml-auto text-blue-500" size={18} />}
                          </button>
                          <button onClick={() => { setTheme('lights-out'); setIsThemeMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-(--background-secondary) rounded-lg text-(--text-primary) cursor-pointer group">
                            <div className="p-2 bg-black rounded-full text-white border border-gray-800 shadow-sm group-hover:scale-110"><Moon size={16} /></div>
                            <span className="font-bold text-sm">{dict.feed.theme.lightsOut}</span>
                            {theme === 'lights-out' && <Check className="ml-auto text-blue-500" size={18} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-(--border) mx-1"></div>
                  <button onClick={executeDownload} disabled={!selection || downloading || loading} className={`font-bold px-6 py-2 rounded-full transition-transform duration-200 shadow-md flex items-center gap-2 ${(!selection || downloading || loading) ? 'bg-(--background-secondary) text-(--text-secondary) cursor-not-allowed opacity-70' : 'bg-(--accent) text-white hover:bg-(--accent-hover) cursor-pointer hover:scale-105 active:scale-95'}`}>
                    {downloading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{selection?.type === 'audio' && progress > 0 ? `%${progress}` : dict.feed.downloading}</span>
                      </>
                    ) : (
                      <>
                        <span>{dict.feed.downloadButton}</span>
                        {selection && (selection.type === 'audio' ? <FileAudio size={18} /> : <Video size={18} />)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <div className="flex items-center justify-between p-4 border-b border-(--border)">
            <h2 className="font-bold text-xl">{dict?.history?.title || 'History'}</h2>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-full font-medium transition-colors text-sm"
            >
              <Trash2 size={16} />
              {dict?.history?.clearAll || 'Clear All'}
            </button>
          </div>
        )}

        {/* --- Empty History State --- */}
        {activeTab === 'history' && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-(--background-secondary) rounded-full flex items-center justify-center mb-6">
              <History size={40} className="text-(--text-secondary)" />
            </div>
            <h3 className="text-xl font-bold text-(--text-primary) mb-2">
              {dict?.history?.noHistory || "You haven't downloaded anything yet."}
            </h3>
            <p className="text-(--text-secondary) max-w-md mb-8">
              X (Twitter) Video Downloader & Converter
            </p>
            <button
              onClick={() => setActiveTab('foryou')}
              className="bg-(--accent) text-white font-bold py-3 px-8 rounded-full hover:bg-(--accent-hover) transition-transform active:scale-95 shadow-lg"
            >
              {dict?.common?.title || dict?.sidebar?.download || 'Start Downloading'}
            </button>
          </div>
        )}

        {/* --- DİNAMİK RENDER --- */}
        {displayItems.map((item, index) => {
          if (item.type === 'post') {
            return (
              <PostCard
                key={`${item.data.id}-${index}`}
                data={item.data}
                priority={index === 0}
                dict={dict}
                isHistoryItem={activeTab === 'history'}
                qualityBadge={item.data.historyMeta ? `${item.data.historyMeta.type === 'video' ? 'MP4' : 'MP3'} • ${item.data.historyMeta.quality}` : undefined}
                onReDownload={() => {
                  if (item.data.historyMeta?.originalUrl) {
                    setInputUrl(item.data.historyMeta.originalUrl);
                    handleAnalyze(item.data.historyMeta.originalUrl);
                    setActiveTab('foryou');
                  }
                }}
                onDelete={() => removeFromHistory(item.data.id)}
              />
            );
          } else {
            return null; // <AdBanner key={item.id} dict={dict} />;
          }
        })}
      </div>
    </>
  );
}