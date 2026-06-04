const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/components/ui');

const map = {
  'X': 'XLg',
  'Check': 'Check',
  'ChevronDown': 'ChevronDown',
  'ChevronUp': 'ChevronUp',
  'ChevronLeft': 'ChevronLeft',
  'ChevronRight': 'ChevronRight',
  'Circle': 'Circle',
  'Minus': 'Dash',
  'Search': 'Search',
  'ArrowLeft': 'ArrowLeft',
  'ArrowRight': 'ArrowRight',
  'MoreHorizontal': 'ThreeDots',
  'GripVertical': 'GripVertical'
};

const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.jsx') || file.endsWith('.js')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('lucide-react')) {
      const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
      
      if (importMatch) {
        const importedIcons = importMatch[1].split(',').map(i => i.trim()).filter(Boolean);
        
        let newImports = importedIcons.map(icon => {
          let mapped = map[icon];
          if (!mapped) console.log('Missing map for ' + icon);
          
          // Replace usages in code
          const regex = new RegExp('<' + icon + '(\\s|>)', 'g');
          content = content.replace(regex, '<' + mapped + '$1');
          
          return mapped;
        });
        
        content = content.replace(importMatch[0], `import { ${newImports.join(', ')} } from "react-bootstrap-icons"`);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
});
