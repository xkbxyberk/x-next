
import json
import os
import glob

translations = {
    "en": {
        "title": "Manage Your History",
        "description": "Every video you download is automatically saved to the 'History' tab on your device. You can easily access your past downloads anytime without needing to search for the link again.",
        "feature": "Feature: Use the 'Re-download' button to instantly process the same video again with different quality options.",
        "privacy": "Privacy Note: Your history is stored locally on your browser. No one else can see your download history.",
        "author": "XDownloaderz Guide",
        "guide_step": "User Guide: Step 5"
    },
    "tr": {
        "title": "Geçmişinizi Yönetin",
        "description": "İndirdiğiniz her video, cihazınızdaki 'Geçmiş' sekmesine otomatik olarak kaydedilir. Geçmiş indirmelerinize, linki tekrar aramaya gerek kalmadan istediğiniz zaman kolayca erişebilirsiniz.",
        "feature": "Özellik: 'Tekrar İndir' butonu ile aynı videoyu farklı kalite seçenekleriyle anında tekrar işleyebilirsiniz.",
        "privacy": "Gizlilik Notu: Geçmişiniz tamamen tarayıcınızda yerel olarak saklanır. İndirme geçmişinizi sizden başka kimse göremez.",
        "author": "XDownloaderz Rehber",
        "guide_step": "Kullanım Kılavuzu: Adım 5"
    },
    "es": {
        "title": "Gestiona tu Historial",
        "description": "Cada video que descargas se guarda automáticamente en la pestaña 'Historial' de tu dispositivo. Puedes acceder fácilmente a tus descargas anteriores en cualquier momento sin necesidad de buscar el enlace nuevamente.",
        "feature": "Función: Usa el botón 'Volver a descargar' para procesar instantáneamente el mismo video nuevamente con diferentes opciones de calidad.",
        "privacy": "Nota de Privacidad: Tu historial se almacena localmente en tu navegador. Nadie más puede ver tu historial de descargas.",
        "author": "Guía XDownloaderz",
        "guide_step": "Guía del Usuario: Paso 5"
    },
    "fr": {
        "title": "Gérez votre historique",
        "description": "Chaque vidéo que vous téléchargez est automatiquement enregistrée dans l'onglet 'Historique' de votre appareil. Vous pouvez facilement accéder à vos téléchargements passés à tout moment sans avoir à rechercher le lien à nouveau.",
        "feature": "Fonctionnalité : Utilisez le bouton 'Télécharger à nouveau' pour traiter instantanément la même vidéo avec différentes options de qualité.",
        "privacy": "Note de confidentialité : Votre historique est stocké localement sur votre navigateur. Personne d'autre ne peut voir votre historique de téléchargement.",
        "author": "Guide XDownloaderz",
        "guide_step": "Guide de l'utilisateur : Étape 5"
    },
    "de": {
        "title": "Verwalten Sie Ihren Verlauf",
        "description": "Jedes Video, das Sie herunterladen, wird automatisch im Tab 'Verlauf' auf Ihrem Gerät gespeichert. Sie können jederzeit problemlos auf Ihre vergangenen Downloads zugreifen, ohne erneut nach dem Link suchen zu müssen.",
        "feature": "Funktion: Verwenden Sie die Schaltfläche 'Erneut herunterladen', um dasselbe Video sofort mit verschiedenen Qualitätsoptionen erneut zu verarbeiten.",
        "privacy": "Datenschutzhinweis: Ihr Verlauf wird lokal in Ihrem Browser gespeichert. Niemand sonst kann Ihren Download-Verlauf sehen.",
        "author": "XDownloaderz Anleitung",
        "guide_step": "Benutzerhandbuch: Schritt 5"
    },
    "ja": {
        "title": "履歴の管理",
        "description": "ダウンロードしたすべての動画は、デバイスの「履歴」タブに自動的に保存されます。リンクを再度検索することなく、いつでも過去のダウンロードに簡単にアクセスできます。",
        "feature": "機能：「再ダウンロード」ボタンを使用して、異なる品質オプションで同じ動画を即座に再処理します。",
        "privacy": "プライバシーに関する注意：履歴はブラウザにローカルに保存されます。他の誰もあなたのダウンロード履歴を見ることはできません。",
        "author": "XDownloaderz ガイド",
        "guide_step": "ユーザーガイド：ステップ5"
    },
    "pt": {
        "title": "Gerencie seu Histórico",
        "description": "Cada vídeo que você baixa é salvo automaticamente na guia 'Histórico' do seu dispositivo. Você pode acessar facilmente seus downloads anteriores a qualquer momento, sem precisar procurar o link novamente.",
        "feature": "Recurso: Use o botão 'Baixar novamente' para processar instantaneamente o mesmo vídeo novamente com diferentes opções de qualidade.",
        "privacy": "Nota de Privacidade: Seu histórico é armazenado localmente no seu navegador. Ninguém mais pode ver seu histórico de downloads.",
        "author": "Guia XDownloaderz",
        "guide_step": "Guia do Usuário: Passo 5"
    },
    "it": {
        "title": "Gestisci la tua cronologia",
        "description": "Ogni video scaricato viene salvato automaticamente nella scheda 'Cronologia' del tuo dispositivo. Puoi accedere facilmente ai tuoi download passati in qualsiasi momento senza dover cercare nuovamente il link.",
        "feature": "Funzionalità: Usa il pulsante 'Scarica di nuovo' per elaborare istantaneamente lo stesso video con diverse opzioni di qualità.",
        "privacy": "Nota sulla privacy: La tua cronologia è memorizzata localmente nel tuo browser. Nessun altro può vedere la tua cronologia dei download.",
        "author": "Guida XDownloaderz",
        "guide_step": "Guida utente: Passo 5"
    },
    "ru": {
        "title": "Управление историей",
        "description": "Каждое загруженное вами видео автоматически сохраняется во вкладке «История» на вашем устройстве. Вы можете легко получить доступ к своим прошлым загрузкам в любое время, не ища ссылку снова.",
        "feature": "Функция: Используйте кнопку «Скачать снова», чтобы мгновенно обработать то же видео с другими параметрами качества.",
        "privacy": "Примечание о конфиденциальности: Ваша история хранится локально в вашем браузере. Никто другой не может видеть вашу историю загрузок.",
        "author": "Гид XDownloaderz",
        "guide_step": "Руководство пользователя: Шаг 5"
    },
    "zh": {
        "title": "管理您的历史记录",
        "description": "您下载的每个视频都会自动保存到设备上的“历史记录”选项卡中。您可以随时轻松访问过去的下载内容，而无需再次搜索链接。",
        "feature": "功能：使用“重新下载”按钮可以使用不同的质量选项立即再次处理同一视频。",
        "privacy": "隐私说明：您的历史记录存储在本地浏览器中。没有人可以看到您的下载历史记录。",
        "author": "XDownloaderz 指南",
        "guide_step": "用户指南：第5步"
    },
    "ar": {
        "title": "إدارة سجلك",
        "description": "يتم حفظ كل مقطع فيديو تقوم بتنزيله تلقائيًا في علامة التبويب 'السجل' على جهازك. يمكنك الوصول بسهولة إلى تنزيلاتك السابقة في أي وقت دون الحاجة إلى البحث عن الرابط مرة أخرى.",
        "feature": "ميزة: استخدم زر 'إعادة التنزيل' لمعالجة نفس الفيديو فورًا بخيارات جودة مختلفة.",
        "privacy": "ملاحظة الخصوصية: يتم تخزين سجلك محليًا على متصفحك. لا يمكن لأي شخص آخر رؤية سجل التنزيل الخاص بك.",
        "author": "دليل XDownloaderz",
        "guide_step": "دليل المستخدم: الخطوة 5"
    },
    "hi": {
        "title": "अपना इतिहास प्रबंधित करें",
        "description": "आपके द्वारा डाउनलोड किया गया प्रत्येक वीडियो स्वचालित रूप से आपके डिवाइस पर 'इतिहास' टैब में सहेजा जाता है। आप लिंक को फिर से खोजे बिना किसी भी समय अपने पिछले डाउनलोड तक आसानी से पहुंच सकते हैं।",
        "feature": "फ़ीचर: विभिन्न गुणवत्ता विकल्पों के साथ फिर से उसी वीडियो को संसाधित करने के लिए 'पुनः डाउनलोड करें' बटन का उपयोग करें।",
        "privacy": "गोपनीयता नोट: आपका इतिहास आपके ब्राउज़र पर स्थानीय रूप से संग्रहीत है। कोई और आपका डाउनलोड इतिहास नहीं देख सकता है।",
        "author": "XDownloaderz गाइड",
        "guide_step": "उपयोगकर्ता गाइड: चरण 5"
    },
    "ko": {
        "title": "기록 관리",
        "description": "다운로드한 모든 동영상은 기기의 '기록' 탭에 자동으로 저장됩니다. 링크를 다시 검색할 필요 없이 언제든지 지난 다운로드에 쉽게 액세스할 수 있습니다.",
        "feature": "기능: '다시 다운로드' 버튼을 사용하여 다른 품질 옵션으로 동일한 동영상을 즉시 다시 처리하세요.",
        "privacy": "개인 정보 보호 참고: 기록은 브라우저에 로컬로 저장됩니다. 다른 사람은 다운로드 기록을 볼 수 없습니다.",
        "author": "XDownloaderz 가이드",
        "guide_step": "사용자 가이드: 5단계"
    },
    "id": {
        "title": "Kelola Riwayat Anda",
        "description": "Setiap video yang Anda unduh secara otomatis disimpan ke tab 'Riwayat' di perangkat Anda. Anda dapat dengan mudah mengakses unduhan sebelumnya kapan saja tanpa perlu mencari tautan lagi.",
        "feature": "Fitur: Gunakan tombol 'Unduh ulang' untuk memproses video yang sama secara instan dengan opsi kualitas yang berbeda.",
        "privacy": "Catatan Privasi: Riwayat Anda disimpan secara lokal di browser Anda. Tidak ada orang lain yang dapat melihat riwayat unduhan Anda.",
        "author": "Panduan XDownloaderz",
        "guide_step": "Panduan Pengguna: Langkah 5"
    },
    "nl": {
        "title": "Beheer uw geschiedenis",
        "description": "Elke video die u downloadt, wordt automatisch opgeslagen op het tabblad 'Geschiedenis' op uw apparaat. U kunt uw eerdere downloads op elk moment eenvoudig openen zonder opnieuw naar de link te hoeven zoeken.",
        "feature": "Functie: Gebruik de knop 'Opnieuw downloaden' om dezelfde video direct opnieuw te verwerken met verschillende kwaliteitsopties.",
        "privacy": "Privacy-opmerking: Uw geschiedenis wordt lokaal in uw browser opgeslagen. Niemand anders kan uw downloadgeschiedenis zien.",
        "author": "XDownloaderz Gids",
        "guide_step": "Gebruikershandleiding: Stap 5"
    },
    "pl": {
        "title": "Zarządzaj swoją historią",
        "description": "Każdy pobrany film jest automatycznie zapisywany w zakładce „Historia” na Twoim urządzeniu. Możesz łatwo uzyskać dostęp do swoich poprzednich pobrań w dowolnym momencie, bez konieczności ponownego wyszukiwania linku.",
        "feature": "Funkcja: Użyj przycisku „Pobierz ponownie”, aby natychmiast przetworzyć ten sam film ponownie z różnymi opcjami jakości.",
        "privacy": "Uwaga dotycząca prywatności: Twoja historia jest przechowywana lokalnie w Twojej przeglądarce. Nikt inny nie może zobaczyć Twojej historii pobierania.",
        "author": "Przewodnik XDownloaderz",
        "guide_step": "Podręcznik użytkownika: Krok 5"
    },
    "vi": {
        "title": "Quản lý lịch sử của bạn",
        "description": "Mỗi video bạn tải xuống sẽ tự động được lưu vào tab 'Lịch sử' trên thiết bị của bạn. Bạn có thể dễ dàng truy cập các bản tải xuống trước đây của mình bất cứ lúc nào mà không cần tìm kiếm lại liên kết.",
        "feature": "Tính năng: Sử dụng nút 'Tải xuống lại' để xử lý ngay lập tức cùng một video với các tùy chọn chất lượng khác nhau.",
        "privacy": "Lưu ý về quyền riêng tư: Lịch sử của bạn được lưu trữ cục bộ trên trình duyệt của bạn. Không ai khác có thể xem lịch sử tải xuống của bạn.",
        "author": "Hướng dẫn XDownloaderz",
        "guide_step": "Hướng dẫn sử dụng: Bước 5"
    },
    "th": {
        "title": "จัดการประวัติของคุณ",
        "description": "วิดีโอทุกรายการที่คุณดาวน์โหลดจะถูกบันทึกโดยอัตโนมัติไปยังแท็บ 'ประวัติ' บนอุปกรณ์ของคุณ คุณสามารถเข้าถึงการดาวน์โหลดที่ผ่านมาของคุณได้ตลอดเวลาโดยไม่ต้องค้นหาลิงก์อีกครั้ง",
        "feature": "คุณสมบัติ: ใช้ปุ่ม 'ดาวน์โหลดซ้ำ' เพื่อประมวลผลวิดีโอเดิมทันทีด้วยตัวเลือกคุณภาพที่แตกต่างกัน",
        "privacy": "หมายเหตุความเป็นส่วนตัว: ประวัติของคุณจะถูกเก็บไว้ในเบราว์เซอร์ของคุณ ไม่มีใครสามารถดูประวัติการดาวน์โหลดของคุณได้",
        "author": "คู่มือ XDownloaderz",
        "guide_step": "คู่มือผู้ใช้: ขั้นตอนที่ 5"
    },
    "sv": {
        "title": "Hantera din historik",
        "description": "Varje video du laddar ner sparas automatiskt på fliken 'Historik' på din enhet. Du kan enkelt komma åt dina tidigare nedladdningar när som helst utan att behöva söka efter länken igen.",
        "feature": "Funktion: Använd knappen 'Ladda ner igen' för att omedelbart bearbeta samma video igen med olika kvalitetsalternativ.",
        "privacy": "Sekretessmeddelande: Din historik lagras lokalt i din webbläsare. Ingen annan kan se din nedladdningshistorik.",
        "author": "XDownloaderz Guide",
        "guide_step": "Användarhandbok: Steg 5"
    },
    "da": {
        "title": "Administrer din historik",
        "description": "Hver video, du downloader, gemmes automatisk på fanen 'Historik' på din enhed. Du kan nemt få adgang til dine tidligere downloads når som helst uden at skulle søge efter linket igen.",
        "feature": "Funktion: Brug knappen 'Download igen' til øjeblikkeligt at behandle den samme video igen med forskellige kvalitetsindstillinger.",
        "privacy": "Privatlivsbemærkning: Din historik gemmes lokalt i din browser. Ingen andre kan se din downloadhistorik.",
        "author": "XDownloaderz Guide",
        "guide_step": "Brugervejledning: Trin 5"
    },
    "fi": {
        "title": "Hallitse historiaasi",
        "description": "Jokainen lataamasi video tallennetaan automaattisesti laitteesi 'Historia'-välilehdelle. Pääset helposti käsiksi aiempiin latauksiisi milloin tahansa etsimättä linkkiä uudelleen.",
        "feature": "Ominaisuus: Käytä 'Lataa uudelleen' -painiketta käsitelläksesi saman videon välittömästi uudelleen eri laatuvaihtoehdoilla.",
        "privacy": "Tietosuojahuomautus: Historiasi tallennetaan paikallisesti selaimeesi. Kukaan muu ei näe lataushistoriaasi.",
        "author": "XDownloaderz Opas",
        "guide_step": "Käyttöopas: Vaihe 5"
    },
    "no": {
        "title": "Administrer historikken din",
        "description": "Hver video du laster ned lagres automatisk i 'Historikk'-fanen på enheten din. Du kan enkelt få tilgang til dine tidligere nedlastinger når som helst uten å måtte søke etter lenken på nytt.",
        "feature": "Funksjon: Bruk 'Last ned på nytt'-knappen for å umiddelbart behandle den samme videoen igjen med forskjellige kvalitetsalternativer.",
        "privacy": "Personvernmerknad: Historikken din lagres lokalt i nettleseren din. Ingen andre kan se nedlastingshistorikken din.",
        "author": "XDownloaderz Guide",
        "guide_step": "Brukerveiledning: Trinn 5"
    },
    "cs": {
        "title": "Spravujte svou historii",
        "description": "Každé video, které stáhnete, se automaticky uloží na kartu 'Historie' ve vašem zařízení. Ke svým dřívějším stahováním můžete kdykoli snadno přistupovat, aniž byste museli znovu hledat odkaz.",
        "feature": "Funkce: Pomocí tlačítka 'Stáhnout znovu' můžete stejné video okamžitě znovu zpracovat s různými možnostmi kvality.",
        "privacy": "Poznámka k ochraně osobních údajů: Vaše historie je uložena lokálně ve vašem prohlížeči. Nikdo jiný nevidí vaši historii stahování.",
        "author": "Průvodce XDownloaderz",
        "guide_step": "Uživatelská příručka: Krok 5"
    },
    "hu": {
        "title": "Kezelje előzményeit",
        "description": "Minden letöltött videó automatikusan mentésre kerül az eszköz 'Előzmények' lapjára. Bármikor könnyedén hozzáférhet korábbi letöltéseihez anélkül, hogy újra meg kellene keresnie a linket.",
        "feature": "Funkció: Használja az 'Újra letöltés' gombot ugyanazon videó azonnali újrafeldolgozásához különböző minőségi beállításokkal.",
        "privacy": "Adatvédelmi megjegyzés: Az előzmények helyileg a böngészőben tárolódnak. Senki más nem láthatja a letöltési előzményeket.",
        "author": "XDownloaderz Útmutató",
        "guide_step": "Felhasználói kézikönyv: 5. lépés"
    },
    "el": {
        "title": "Διαχείριση του ιστορικού σας",
        "description": "Κάθε βίντεο που κατεβάζετε αποθηκεύεται αυτόματα στην καρτέλα 'Ιστορικό' στη συσκευή σας. Μπορείτε να έχετε εύκολη πρόσβαση στις προηγούμενες λήψεις σας ανά πάσα στιγμή χωρίς να χρειάζεται να αναζητήσετε ξανά τον σύνδεσμο.",
        "feature": "Λειτουργία: Χρησιμοποιήστε το κουμπί 'Λήψη ξανά' για να επεξεργαστείτε αμέσως το ίδιο βίντεο ξανά με διαφορετικές επιλογές ποιότητας.",
        "privacy": "Σημείωση απορρήτου: Το ιστορικό σας αποθηκεύεται τοπικά στο πρόγραμμα περιήγησής σας. Κανείς άλλος δεν μπορεί να δει το ιστορικό λήψεών σας.",
        "author": "Οδηγός XDownloaderz",
        "guide_step": "Οδηγός χρήστη: Βήμα 5"
    },
    "ro": {
        "title": "Gestionați-vă istoricul",
        "description": "Fiecare videoclip pe care îl descărcați este salvat automat în fila 'Istoric' de pe dispozitivul dvs. Vă puteți accesa ușor descărcările anterioare oricând, fără a fi nevoie să căutați din nou linkul.",
        "feature": "Funcție: Utilizați butonul 'Descărcați din nou' pentru a procesa instantaneu același videoclip din nou cu diferite opțiuni de calitate.",
        "privacy": "Notă de confidențialitate: Istoricul dvs. este stocat local în browser. Nimeni altcineva nu vă poate vedea istoricul descărcărilor.",
        "author": "Ghid XDownloaderz",
        "guide_step": "Ghidul utilizatorului: Pasul 5"
    },
    "uk": {
        "title": "Керуйте своєю історією",
        "description": "Кожне завантажене вами відео автоматично зберігається на вкладці 'Історія' на вашому пристрої. Ви можете легко отримати доступ до своїх минулих завантажень у будь-який час, не шукаючи посилання знову.",
        "feature": "Функція: Використовуйте кнопку 'Завантажити ще раз', щоб миттєво обробити те саме відео з іншими параметрами якості.",
        "privacy": "Примітка про конфіденційність: Ваша історія зберігається локально у вашому браузері. Ніхто інший не може бачити вашу історію завантажень.",
        "author": "Гід XDownloaderz",
        "guide_step": "Посібник користувача: Крок 5"
    },
    "ms": {
        "title": "Urus Sejarah Anda",
        "description": "Setiap video yang anda muat turun disimpan secara automatik ke tab 'Sejarah' pada peranti anda. Anda boleh mengakses muat turun lalu anda dengan mudah pada bila-bila masa tanpa perlu mencari pautan itu lagi.",
        "feature": "Ciri: Gunakan butang 'Muat turun semula' untuk memproses semula video yang sama dengan serta-merta dengan pilihan kualiti yang berbeza.",
        "privacy": "Nota Privasi: Sejarah anda disimpan secara setempat pada penyemak imbas anda. Tiada orang lain boleh melihat sejarah muat turun anda.",
        "author": "Panduan XDownloaderz",
        "guide_step": "Panduan Pengguna: Langkah 5"
    },
    "he": {
        "title": "נהל את ההיסטוריה שלך",
        "description": "כל סרטון שאתה מוריד נשמר אוטומטית בכרטיסייה 'היסטוריה' במכשיר שלך. אתה יכול לגשת בקלות להורדות הקודמות שלך בכל עת מבלי שתצטרך לחפש את הקישור שוב.",
        "feature": "תכונה: השתמש בכפתור 'הורד מחדש' כדי לעבד באופן מיידי את אותו סרטון שוב עם אפשרויות איכות שונות.",
        "privacy": "הערת פרטיות: ההיסטוריה שלך מאוחסנת באופן מקומי בדפדפן שלך. אף אחד אחר לא יכול לראות את היסטוריית ההורדות שלך.",
        "author": "מדריך XDownloaderz",
        "guide_step": "מדריך למשתמש: שלב 5"
    },
    "fa": {
        "title": "تاریخچه خود را مدیریت کنید",
        "description": "هر ویدیویی که دانلود می‌کنید به طور خودکار در برگه 'تاریخچه' در دستگاه شما ذخیره می‌شود. شما می‌توانید به راحتی در هر زمان به دانلودهای گذشته خود دسترسی داشته باشید بدون اینکه نیازی به جستجوی مجدد لینک داشته باشید.",
        "feature": "ویژگی: از دکمه 'دانلود مجدد' استفاده کنید تا همان ویدیو را فوراً با گزینه‌های کیفیت مختلف دوباره پردازش کنید.",
        "privacy": "نکته حریم خصوصی: تاریخچه شما به صورت محلی در مرورگر شما ذخیره می‌شود. هیچ کس دیگری نمی‌تواند تاریخچه دانلود شما را ببیند.",
        "author": "راهنمای XDownloaderz",
        "guide_step": "راهنمای کاربر: مرحله 5"
    },
     "bg": {
        "title": "Управлявайте историята си",
        "description": "Всеки видеоклип, който изтегляте, автоматично се запазва в раздела 'История' на вашето устройство. Можете лесно да получите достъп до предишните си изтегляния по всяко време, без да е необходимо да търсите връзката отново.",
        "feature": "Функция: Използвайте бутона 'Изтегли отново', за да обработите незабавно същото видео отново с различни опции за качество.",
        "privacy": "Бележка за поверителност: Вашата история се съхранява локално във вашия браузър. Никой друг не може да вижда историята на изтеглянията ви.",
        "author": "Ръководство XDownloaderz",
        "guide_step": "Ръководство за потребителя: Стъпка 5"
    },
    "hr": {
        "title": "Upravljajte svojom poviješću",
        "description": "Svaki videozapis koji preuzmete automatski se sprema na karticu 'Povijest' na vašem uređaju. Svojim prošlim preuzimanjima možete jednostavno pristupiti bilo kada bez potrebe da ponovno tražite poveznicu.",
        "feature": "Značajka: Koristite gumb 'Ponovno preuzmi' za trenutačnu ponovnu obradu istog videozapisa s različitim opcijama kvalitete.",
        "privacy": "Napomena o privatnosti: Vaša se povijest pohranjuje lokalno u vašem pregledniku. Nitko drugi ne može vidjeti vašu povijest preuzimanja.",
        "author": "XDownloaderz Vodič",
        "guide_step": "Korisnički vodič: Korak 5"
    },
    "sr": {
        "title": "Управљајте својом историјом",
        "description": "Сваки видео који преузмете аутоматски се чува на картици 'Историја' на вашем уређају. Својim прошлим преузимањима можете лако приступити било када без потребе да поново тражите везу.",
        "feature": "Функција: Користите дугме 'Поново преузми' да бисте тренутно поново обрадили исти видео са различитим опцијама квалитета.",
        "privacy": "Напомена о приватности: Ваша историја се чува локално у вашем прегледачу. Нико други не може да види вашу историју преузимања.",
        "author": "XDownloaderz Водич",
        "guide_step": "Упутство за употребу: Корак 5"
    }
}

additional_translations = {
    "bn": { # Bengali
        "title": "আপনার ইতিহাস পরিচালনা করুন",
        "description": "আপনার ডাউনলোড করা প্রতিটি ভিডিও স্বয়ংক্রিয়ভাবে আপনার ডিভাইসের 'ইতিহাস' ট্যাবে সংরক্ষিত হয়। আপনি লিঙ্কটি আবার না খুঁজেই যে কোনও সময় সহজেই আপনার অতীতের ডাউনলোডগুলি অ্যাক্সেস করতে পারেন।",
        "feature": "বৈশিষ্ট্য: বিভিন্ন মানের বিকল্পগুলির সাথে একই ভিডিওটি অবিলম্বে প্রক্রিয়া করতে 'পুনরায় ডাউনলোড করুন' বোতামটি ব্যবহার করুন।",
        "privacy": "গোপনীয়তা নোট: আপনার ইতিহাস স্থানীয়ভাবে আপনার ব্রাউজারে সংরক্ষিত থাকে। অন্য কেউ আপনার ডাউনলোডের ইতিহাস দেখতে পাবে না।",
        "author": "XDownloaderz গাইড",
        "guide_step": "ব্যবহারকারী নির্দেশিকা: ধাপ 5"
    },
    "br": { # Portuguese (Brazil) - usually pt-BR, but keeping 'br' file naming convention if exists
         "title": "Gerencie seu Histórico",
        "description": "Cada vídeo que você baixa é salvo automaticamente na guia 'Histórico' do seu dispositivo. Você pode acessar facilmente seus downloads anteriores a qualquer momento, sem precisar procurar o link novamente.",
        "feature": "Recurso: Use o botão 'Baixar novamente' para processar instantaneamente o mesmo vídeo novamente com diferentes opções de qualidade.",
        "privacy": "Nota de Privacidade: Seu histórico é armazenado localmente no seu navegador. Ninguém mais pode ver seu histórico de downloads.",
        "author": "Guia XDownloaderz",
        "guide_step": "Guia do Usuário: Passo 5"
    },
    "tl": { # Tagalog
        "title": "Pamahalaan ang Iyong Kasaysayan",
        "description": "Ang bawat video na iyong dina-download ay awtomatikong nai-save sa tab na 'Kasaysayan' sa iyong device. Madali mong maa-access ang iyong mga nakaraang pag-download anumang oras nang hindi na kailangang hanapin muli ang link.",
        "feature": "Tampok: Gamitin ang button na 'I-download muli' upang agad na maproseso muli ang parehong video gamit ang iba't ibang opsyon sa kalidad.",
        "privacy": "Tala sa Privacy: Ang iyong kasaysayan ay lokal na nakaimbak sa iyong browser. Walang ibang makakakita ng iyong kasaysayan ng pag-download.",
        "author": "Gabay sa XDownloaderz",
        "guide_step": "Gabay sa Gumagamit: Hakbang 5"
    },
    "ne": { # Nepali
        "title": "आफ्नो इतिहास व्यवस्थापन गर्नुहोस्",
        "description": "तपाईंले डाउनलोड गर्नुभएको प्रत्येक भिडियो तपाईंको यन्त्रको 'इतिहास' ट्याबमा स्वचालित रूपमा बचत हुन्छ। लिङ्क फेरि नखोजिकनै तपाईं जुनसुकै बेला पनि आफ्ना विगतका डाउनलोडहरूमा सजिलै पहुँच गर्न सक्नुहुन्छ।",
        "feature": "सुविधा: विभिन्न गुणस्तर विकल्पहरूसँग उही भिडियोलाई तुरुन्तै प्रशोधन गर्न 'पुनः डाउनलोड' बटन प्रयोग गर्नुहोस्।",
        "privacy": "गोपनीयता नोट: तपाईंको इतिहास तपाईंको ब्राउजरमा स्थानीय रूपमा भण्डारण गरिएको छ। अरू कसैले तपाईंको डाउनलोड इतिहास देख्न सक्दैन।",
        "author": "XDownloaderz गाइड",
        "guide_step": "प्रयोगकर्ता गाइड: चरण ५"
    },
    "km": { # Khmer
        "title": "គ្រប់គ្រងប្រវត្តិរបស់អ្នក។",
        "description": "រាល់វីដេអូដែលអ្នកទាញយកត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិទៅកាន់ផ្ទាំង 'ប្រវត្តិ' នៅលើឧបករណ៍របស់អ្នក។ អ្នកអាចចូលប្រើការទាញយកកន្លងមករបស់អ្នកបានយ៉ាងងាយស្រួលគ្រប់ពេលវេលា ដោយមិនចាំបាច់ស្វែងរកតំណម្តងទៀត។",
        "feature": "លក្ខណៈពិសេស៖ ប្រើប៊ូតុង 'ទាញយកម្តងទៀត' ដើម្បីដំណើរការវីដេអូដដែលម្តងទៀតភ្លាមៗជាមួយនឹងជម្រើសគុណភាពផ្សេងៗគ្នា។",
        "privacy": "ចំណាំឯកជនភាព៖ ប្រវត្តិរបស់អ្នកត្រូវបានរក្សាទុកក្នុងមូលដ្ឋាននៅលើកម្មវិធីរុករករបស់អ្នក។ គ្មាននរណាម្នាក់ផ្សេងទៀតអាចឃើញប្រវត្តិនៃការទាញយករបស់អ្នកទេ។",
        "author": "ការណែនាំ XDownloaderz",
        "guide_step": "ការណែនាំអ្នកប្រើប្រាស់៖ ជំហានទី 5"
    },
    "ur": { # Urdu
        "title": "اپنی تاریخ کا انتظام کریں",
        "description": "آپ جو بھی ویڈیو ڈاؤن لوڈ کرتے ہیں وہ خود بخود آپ کے آلے پر 'تاریخ' کے ٹیب میں محفوظ ہو جاتی ہے۔ آپ لنک کو دوبارہ تلاش کیے بغیر کسی بھی وقت آسانی سے اپنے ماضی کے ڈاؤن لوڈز تک رسائی حاصل کر سکتے ہیں۔",
        "feature": "خصوصیت: ایک ہی ویڈیو کو مختلف معیار کے اختیارات کے ساتھ فوری طور پر دوبارہ پروسیس کرنے کے لیے 'دوبارہ ڈاؤن لوڈ کریں' بٹن کا استعمال کریں۔",
        "privacy": "رازداری کا نوٹ: آپ کی تاریخ آپ کے براؤزر پر مقامی طور پر محفوظ ہے۔ کوئی اور آپ کی ڈاؤن لوڈ کی تاریخ نہیں دیکھ سکتا۔",
        "author": "XDownloaderz گائیڈ",
        "guide_step": "صارف گائیڈ: مرحلہ 5"
    },
    "sw": { # Swahili
        "title": "Dhibiti Historia Yako",
        "description": "Kila video unayopakua huhifadhiwa kiotomatiki kwenye kichupo cha 'Historia' kwenye kifaa chako. Unaweza kufikia vipakuliwa vyako vya awali kwa urahisi wakati wowote bila kuhitaji kutafuta kiungo tena.",
        "feature": "Kipengele: Tumia kitufe cha 'Pakua tena' ili kuchakata video hiyo papo hapo tena na chaguo tofauti za ubora.",
        "privacy": "Dokezo la Faragha: Historia yako imehifadhiwa ndani ya kivinjari chako. Hakuna mtu mwingine anayeweza kuona historia yako ya upakuaji.",
        "author": "Mwongozo wa XDownloaderz",
        "guide_step": "Mwongozo wa Mtumiaji: Hatua ya 5"
    }
}

translations.update(additional_translations)

def update_dictionaries():
    dictionaries_dir = 'dictionaries'
    files = glob.glob(os.path.join(dictionaries_dir, '*.json'))

    print(f"Found {len(files)} files.")

    for file_path in files:
        filename = os.path.basename(file_path)
        lang_code = os.path.splitext(filename)[0]

        # Get translation or default to English
        t = translations.get(lang_code, translations['en'])
        
        # Construct content object
        new_post = {
            "id": "guide-step5",
            "authorName": t["author"],
            "content": f"📖 {t['guide_step']}\n\n5️⃣ {t['title']}\n\n{t['description']}\n\n🔄 {t['feature']}\n\n🔒 {t['privacy']}",
            "image": "history-management.avif",
            "imageAlt": f"📖 {t['guide_step']} - 5️⃣ {t['title']}"
        }

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Check if guide-step5 already exists
            static_posts = data.get('staticPosts', [])
            exists = False
            for i, post in enumerate(static_posts):
                if post.get('id') == 'guide-step5':
                    static_posts[i] = new_post # Update existing
                    exists = True
                    break
            
            if not exists:
                # Insert after guide-step4 if possible, otherwise append
                inserted = False
                for i, post in enumerate(static_posts):
                    if post.get('id') == 'guide-step4':
                        static_posts.insert(i + 1, new_post)
                        inserted = True
                        break
                
                if not inserted:
                    static_posts.append(new_post)

            data['staticPosts'] = static_posts

            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            
            print(f"Updated {filename}")

        except Exception as e:
            print(f"Error updating {filename}: {e}")

if __name__ == "__main__":
    update_dictionaries()
