const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content');
const articlesDir = path.join(root, 'articles');

if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir, { recursive: true });

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function slugFromFileName(fileName) {
  return slugify(fileName.replace(/^artikel\s*/i, '').replace(/\.txt$/i, ''));
}

function extractTitle(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim().startsWith('# '));
  return firstLine ? firstLine.replace(/^#\s*/, '').trim() : 'Artikel';
}

function renderTextToHtml(text) {
  const lines = text.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${paragraph.join(' ').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${item}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    if (/^#{1,3}\s+/.test(line)) {
      flushParagraph(); flushList();
      const level = line.match(/^#+/)[0].length;
      const content = line.replace(/^#{1,3}\s*/, '');
      html.push(`<h${level}>${content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</h${level}>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) { flushParagraph(); list.push(line.replace(/^[-*]\s+/, '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')); continue; }
    if (/^\d+\.\s+/.test(line)) { flushParagraph(); list.push(line.replace(/^\d+\.\s+/, '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')); continue; }
    paragraph.push(line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'));
  }

  flushParagraph();
  flushList();
  return html.join('');
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatSections(text) {
  const lines = text.split(/\r?\n/);
  let html = '';
  let currentList = [];

  const flushList = () => {
    if (currentList.length) {
      html += '<ul>' + currentList.map((item) => `<li>${item}</li>`).join('') + '</ul>';
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      html += `<h3>${escapeHtml(line.replace(/^###\s*/, ''))}</h3>`;
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      html += `<h2>${escapeHtml(line.replace(/^##\s*/, ''))}</h2>`;
      continue;
    }

    if (line.startsWith('# ')) {
      flushList();
      html += `<h1>${escapeHtml(line.replace(/^#\s*/, ''))}</h1>`;
      continue;
    }

    if (line.startsWith('- ')) {
      currentList.push(escapeHtml(line.replace(/^-\s*/, '')));
      continue;
    }

    flushList();
    html += `<p>${escapeHtml(line).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>`;
  }
  flushList();
  return html;
}

const files = fs.readdirSync(contentDir).filter((f) => f.toLowerCase().endsWith('.txt')).sort();
const manifest = []

for (const file of files) {
  const source = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const title = extractTitle(source);
  const slug = slugFromFileName(file);
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { --bg:#06070b; --panel:rgba(15,20,30,0.9); --text:#eff3ff; --muted:#d5def1; --accent:#8b7dff; --line:rgba(255,255,255,0.12); }
    *{box-sizing:border-box} body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--text);background:radial-gradient(circle at top,rgba(139,125,255,0.18),transparent 30%),linear-gradient(160deg,#06070b 0%,#0d1324 42%,#06070b 100%);line-height:1.7} a{text-decoration:none;color:inherit} .page-shell{max-width:1100px;margin:0 auto;padding:0 20px 80px} header{position:sticky;top:0;z-index:10;backdrop-filter:blur(18px);background:rgba(6,7,11,0.78);border-bottom:1px solid var(--line)} .nav{display:flex;justify-content:space-between;align-items:center;padding:14px 0;gap:12px} .brand{text-transform:uppercase;letter-spacing:.35em;font-size:.82rem;color:#fff} .nav-links{display:flex;gap:16px;flex-wrap:wrap} .nav-links a{color:var(--muted);font-size:.95rem} .nav-links a:hover{color:#fff} .hero{padding:56px 0 18px;display:grid;gap:10px} .eyebrow{color:#8be8ff;text-transform:uppercase;letter-spacing:.35em;font-size:.78rem} h1{font-size:clamp(2.4rem,8vw,4rem);line-height:1.02;margin:0} .lede{color:var(--muted);max-width:820px;font-size:1.03rem} main{display:grid;gap:18px} article{background:var(--panel);border:1px solid var(--line);border-radius:28px;padding:26px;box-shadow:0 18px 40px rgba(0,0,0,.28)} h2{font-size:1.32rem;margin-top:0;color:#fff} h3{font-size:1.05rem;color:#fff;margin-bottom:6px} p,li{color:var(--muted)} strong{color:#fff} ul{padding-left:18px} footer{color:var(--muted);text-align:center;padding:28px 0 10px;font-size:.95rem} @media (max-width:720px){.nav{align-items:flex-start;flex-direction:column}.hero{padding-top:34px}article{padding:20px;border-radius:22px}h1{font-size:clamp(2rem,12vw,2.7rem)}}
  </style>
</head>
<body>
  <header>
    <div class="page-shell nav">
      <a class="brand" href="../index.html">Wake Up Humanity</a>
      <nav class="nav-links"><a href="../index.html#articles">Artikel</a><a href="../index.html">Start</a></nav>
    </div>
  </header>
  <div class="page-shell">
    <section class="hero">
      <div class="eyebrow">Artikel</div>
      <h1>${escapeHtml(title)}</h1>
      <p class="lede">Vollständiger Artikeltext aus dem Content-Ordner – ohne Kürzung.</p>
    </section>
    <main>
      <article>${renderTextToHtml(source)}</article>
    </main>
    <footer>WAKE UP HUMANITY · responsive Blog-Architektur</footer>
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(articlesDir, `${slug}.html`), html, 'utf8');
  manifest.push({ title, slug, href: `articles/${slug}.html`, summary: source.split(/\r?\n/).find((line) => line.trim() && !/^#/.test(line.trim())) || 'Vollständiger Artikeltext aus dem Content-Ordner.' });
}

fs.writeFileSync(path.join(articlesDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Generated ${manifest.length} article page(s) in ${articlesDir}`);
