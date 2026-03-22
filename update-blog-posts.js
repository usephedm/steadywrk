const fs = require('node:fs');
const tsFile = 'apps/web/src/lib/data/blog-posts.ts';
let tsContent = fs.readFileSync(tsFile, 'utf8');

const post1 = fs.readFileSync('STE-26-post-1.md', 'utf8');
const post2 = fs.readFileSync('STE-26-post-2.md', 'utf8');
const post3 = fs.readFileSync('STE-26-post-3.md', 'utf8');

function cleanContent(md) {
  // optionally remove frontmatter
  return md.replace(/^---[\s\S]*?---\n/, '');
}

const obj1 = {
  slug: 'guide-to-ai-careers-jordan-2026',
  title: 'The Complete Guide to AI Careers in Jordan 2026: Navigating the Future of Tech',
  date: '2026-03-22',
  category: 'AI Careers',
  readTime: '15 min read',
  featured: false,
  excerpt:
    'A comprehensive guide to the AI job market in Jordan for 2026. Explore in-demand roles, salary expectations, and how the National AI Strategy is shaping the future of tech employment.',
  content: cleanContent(post1),
};

const obj2 = {
  slug: 'how-steadywrk-hires',
  title: 'How STEADYWRK Hires: A Transparent 7-Stage Process',
  date: '2026-03-22',
  category: 'Behind the Build',
  readTime: '12 min read',
  featured: false,
  excerpt:
    'Discover STEADYWRK’s rigorous, comprehensive, and fundamentally fair 7-stage hiring process. Built to be transparent, respectful of your time, and highly predictive of on-the-job success.',
  content: cleanContent(post2),
};

const obj3 = {
  slug: 'jordans-ai-bpo-revolution',
  title: "Jordan's AI BPO Revolution: Why US Companies Are Hiring Jordanian Talent",
  date: '2026-03-22',
  category: 'AI Careers',
  readTime: '15 min read',
  featured: true,
  excerpt:
    'The outsourcing narrative has changed forever. Discover why forward-thinking US companies are turning to Jordan for high-value, AI-powered BPO solutions that deliver unprecedented quality.',
  content: cleanContent(post3),
};

const newPosts = [obj1, obj2, obj3]
  .map((obj) => {
    return `  {
    slug: ${JSON.stringify(obj.slug)},
    title: ${JSON.stringify(obj.title)},
    date: ${JSON.stringify(obj.date)},
    category: ${JSON.stringify(obj.category)} as BlogCategory,
    readTime: ${JSON.stringify(obj.readTime)},
    featured: ${JSON.stringify(obj.featured)},
    excerpt: ${JSON.stringify(obj.excerpt)},
    content: ${JSON.stringify(obj.content)},
  },`;
  })
  .join('\n');

// Insert before the last array bracket
tsContent = tsContent.replace(/\]\s*as\s*const;\s*$/, `${newPosts}\n] as const;\n`);

fs.writeFileSync(tsFile, tsContent);
console.log('Successfully updated blog-posts.ts');
