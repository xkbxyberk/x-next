const fs = require('fs');
const path = require('path');

const dictionariesDir = path.join(__dirname, '../dictionaries');
const enPath = path.join(dictionariesDir, 'en.json');
const enDict = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Helper function to recursively find missing keys and add them
function syncKeys(sourceRep, targetRep) {
    let modified = false;
    for (const key in sourceRep) {
        if (targetRep[key] === undefined) {
            targetRep[key] = sourceRep[key];
            modified = true;
        } else if (typeof sourceRep[key] === 'object' && sourceRep[key] !== null && typeof targetRep[key] === 'object' && targetRep[key] !== null) {
            if (syncKeys(sourceRep[key], targetRep[key])) {
                modified = true;
            }
        }
    }
    return modified;
}

fs.readdirSync(dictionariesDir).forEach(file => {
    if (file === 'en.json' || !file.endsWith('.json')) return;

    const filePath = path.join(dictionariesDir, file);
    let targetDict;
    try {
        targetDict = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Error parsing ${file}:`, e);
        return;
    }

    if (syncKeys(enDict, targetDict)) {
        fs.writeFileSync(filePath, JSON.stringify(targetDict, null, 4), 'utf8');
        console.log(`Updated ${file}`);
    }
});
