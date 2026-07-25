const fs = require('fs');
const path = require('path');

const targetMode = process.argv[2] || 'dynamic'; // 'static' or 'dynamic'
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file === 'route.ts') {
      results.push(fullPath);
    }
  });
  return results;
}

const routeFiles = walk(apiDir);

routeFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');

  if (targetMode === 'static') {
    content = content.replace(/export const dynamic = .*/g, "export const dynamic = 'force-static';");
    if (file.includes('[id]') && !content.includes('generateStaticParams')) {
      content = "export function generateStaticParams() { return [{ id: 'stub' }]; }\n" + content;
    }
  } else {
    content = content.replace(/export const dynamic = .*/g, "export const dynamic = 'force-dynamic';");
    content = content.replace(/export function generateStaticParams\(\) \{ return \[\{ id: 'stub' \}\]; \}\n?/g, '');
  }

  fs.writeFileSync(file, content, 'utf8');
});

console.log(`Successfully toggled API routes to mode: [${targetMode}] (${routeFiles.length} files processed)`);
