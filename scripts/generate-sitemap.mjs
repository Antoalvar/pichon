/**
 * Generates public/sitemap.xml by fetching all published posts from the API.
 * Run with: npm run generate-sitemap
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://revistapichon.es';
const API_URL = 'https://pichon-back.onrender.com/posts';
const OUTPUT_PATH = join(__dirname, '..', 'public', 'sitemap.xml');

const STATIC_PAGES = [
  { loc: '/',       changefreq: 'weekly',  priority: '1.0' },
  { loc: '/blog',   changefreq: 'daily',   priority: '0.9' },
  { loc: '/guias',  changefreq: 'weekly',  priority: '0.8' },
  { loc: '/about',  changefreq: 'monthly', priority: '0.5' },
];

function toW3CDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
}

function buildUrl({ loc, changefreq, priority, lastmod }) {
  const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>${lastmodLine}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  console.log('Fetching posts from API…');
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const { data: posts } = await res.json();
  console.log(`Found ${posts.length} posts.`);

  const staticEntries = STATIC_PAGES.map(buildUrl);

  const postEntries = posts.map((post) => {
    const encodedPath = `/post/${encodeURIComponent(post.id)}/${encodeURIComponent(post.slug)}`;
    return buildUrl({
      loc: encodedPath,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: toW3CDate(post.published_at),
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('\n')}
</urlset>
`;

  writeFileSync(OUTPUT_PATH, xml, 'utf-8');
  console.log(`Sitemap written to ${OUTPUT_PATH} (${staticEntries.length} static + ${postEntries.length} posts)`);
}

generate().catch((err) => {
  console.error('Failed to generate sitemap:', err.message);
  process.exit(1);
});
