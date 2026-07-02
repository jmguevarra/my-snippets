// Run on each page — checks body only, skips header/footer
const body = document.querySelector('main') || document.body;
const header = document.querySelector('header');
const footer = document.querySelector('footer');

const links = [...body.querySelectorAll('a[href]')].filter(a => {
  if (header?.contains(a) || footer?.contains(a)) return false;
  const href = a.getAttribute('href');
  return href.startsWith('http') && !href.includes('phoenix-dx.');
});

const missing = links.filter(a => a.getAttribute('target') !== '_blank');
missing.forEach(a => console.log(a.getAttribute('href'), a.textContent.trim()));
console.log(`${missing.length} external links missing target="_blank"`);
