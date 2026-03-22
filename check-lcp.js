const url = 'https://steadywrk.app';
const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;

async function checkLCP() {
  console.log(`Fetching PageSpeed Insights for ${url}...`);
  try {
    const res = await fetch(api);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const lcp = data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
    console.log(`Mobile LCP for ${url}: ${lcp}`);
  } catch (err) {
    console.error('Error fetching LCP:', err);
  }
}

checkLCP();