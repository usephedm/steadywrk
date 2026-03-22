const targetUrl = process.env.TARGET_URL ?? 'https://steadywrk.app';
const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile`;

async function checkLCP() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error('API Error:', data.error.message);
      process.exit(1);
    }

    const lcpMetric = data.lighthouseResult?.audits?.['largest-contentful-paint'];
    if (!lcpMetric) {
      console.error('LCP metric was not returned by PageSpeed.');
      process.exit(1);
    }

    console.log(`LCP for ${targetUrl}:`);
    console.log(`Score: ${lcpMetric.score}`);
    console.log(`Display Value: ${lcpMetric.displayValue}`);
    console.log(`Numeric Value: ${lcpMetric.numericValue} ms`);
  } catch (error) {
    console.error('Error fetching LCP:', error);
    process.exit(1);
  }
}

checkLCP();
