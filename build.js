const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'examples');
const PAGES = path.join(SRC, 'pages');

// Read layout template
const layout = fs.readFileSync(path.join(SRC, 'layout.html'), 'utf-8');

// Simple template engine
function render(template, vars) {
  let out = template;

  // Handle {{#if key}}...{{/if}}
  out = out.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, body) => {
    const val = key.split('.').reduce((o, k) => o && o[k], vars);
    return val ? body : '';
  });

  // Handle {{key}}
  out = out.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return vars[key] != null ? vars[key] : '';
  });

  return out;
}

// Ensure dist exists
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// Copy terminalx.css to dist
fs.copyFileSync(
  path.join(__dirname, 'terminalx.css'),
  path.join(DIST, 'terminalx.css')
);

// Process each page
const pageFiles = fs.readdirSync(PAGES).filter(f => f.endsWith('.html'));

for (const file of pageFiles) {
  const raw = fs.readFileSync(path.join(PAGES, file), 'utf-8');

  // Extract frontmatter between --- markers
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    console.error(`No frontmatter in ${file}, skipping`);
    continue;
  }

  const meta = {};
  fmMatch[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      const val = rest.join(':').trim();
      // Support nested keys like nav.docs
      if (key.trim().includes('.')) {
        const parts = key.trim().split('.');
        if (!meta[parts[0]]) meta[parts[0]] = {};
        meta[parts[0]][parts[1]] = val === 'true' ? true : val;
      } else {
        meta[key.trim()] = val === 'true' ? true : val;
      }
    }
  });

  meta.content = fmMatch[2];

  // Extract <style> block from content as pageStyle
  const styleMatch = meta.content.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    meta.pageStyle = styleMatch[1];
    meta.content = meta.content.replace(/<style>[\s\S]*?<\/style>\n?/, '');
  }

  const html = render(layout, meta);
  fs.writeFileSync(path.join(DIST, file), html);
  console.log(`Built ${file}`);
}

console.log(`\nDone! ${pageFiles.length} pages built to examples/`);
