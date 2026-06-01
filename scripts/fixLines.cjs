const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    if (filePath.includes('SafeLine.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let needsSafeLineImport = false;
    
    const dreiImportRegex = /import\s+{([^}]*)}\s+from\s+['"]@react-three\/drei['"]/g;
    
    content = content.replace(dreiImportRegex, (match, imports) => {
      let parts = imports.split(',').map(s => s.trim()).filter(Boolean);
      let needsSafeLine = false;
      let newParts = [];
      
      parts.forEach(p => {
        // Match exact "Line", "Trail", or "Line as DreiLine"
        if (p === 'Line' || p === 'Trail' || /^Line\s+as\s+DreiLine$/.test(p)) {
          needsSafeLine = true;
        } else {
          newParts.push(p);
        }
      });
      
      if (needsSafeLine) {
        hasChanges = true;
        needsSafeLineImport = true;
        let newImportStmt = newParts.length > 0 ? `import { ${newParts.join(', ')} } from '@react-three/drei';` : '';
        return newImportStmt;
      }
      return match;
    });

    if (needsSafeLineImport) {
        let relPath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'src/components/SafeLine'));
        relPath = relPath.startsWith('.') ? relPath : './' + relPath;
        // avoid backslashes on windows
        relPath = relPath.split(path.sep).join('/');
        
        let prepend = `import { Line, Trail } from '${relPath}';\n`;
        // Insert after imports if possible, or at top
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLine = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLine + 1) + prepend + content.slice(endOfLine + 1);
        } else {
            content = prepend + content;
        }
        
        content = content.replace(/<DreiLine/g, '<Line');
        content = content.replace(/<\/DreiLine/g, '</Line');
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
