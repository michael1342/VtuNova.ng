const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/HomePC/SwiftTopup';

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Replacements
    content = content.replace(/SwiftTopup/g, 'VtuNova');
    content = content.replace(/swifttopup/g, 'vtunova');
    content = content.replace(/swiftTopup/g, 'vtuNova');
    content = content.replace(/SwiftTopUp/g, 'VtuNova');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
};

const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                walkSync(filePath);
            }
        } else {
            if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.html') || filePath.endsWith('.json') || filePath.endsWith('.md')) {
                // exclude package-lock.json to avoid messing it up unnecessarily, although we can replace in it, it's safer to npm install or just let it be, but wait, it might contain swifttopup as name.
                // It's okay to replace in package-lock.json too, but let's be careful.
                replaceInFile(filePath);
            }
        }
    }
};

walkSync(directory);
console.log('Done');
