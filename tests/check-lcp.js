const url = 'https://steadywrk.app';
const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;

async function checkLCP() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error('API Error:', data.error.message);
      process.exit(1);
    }

    const lcpMetric = data.lighthouseResult.audits['largest-contentful-paint'];
    console.log(`LCP for ${url}:`);
    console.log(`Score: ${lcpMetric.score}`);
    console.log(`Display Value: ${lcpMetric.displayValue}`);
    console.log(`Numeric Value: ${lcpMetric.numericValue} ms`);
  } catch (error) {
    console.error('Error fetching LCP:', error);
    process.exit(1);
  }
}

checkLCP();
