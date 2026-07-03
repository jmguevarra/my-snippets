const body = document.querySelector('main') || document.body;
const header = document.querySelector('header');
const footer = document.querySelector('footer');

const allAnchors = [...body.querySelectorAll('a')].filter(a => {
  if (header?.contains(a) || footer?.contains(a)) return false;
  return true;
});

// External links missing target="_blank"
const externalMissing = allAnchors.filter(a => {
  const href = a.getAttribute('href') || '';
  return href.startsWith('http') && !href.includes('phoenix-dx.');
}).filter(a => a.getAttribute('target') !== '_blank');

externalMissing.forEach(a => {
  const text = a.textContent.trim();
  const hasClick = a.onclick !== null || a.hasAttribute('onclick');
  console.log('[EXTERNAL]', a.getAttribute('href'), text || '[EMPTY ANCHOR]', hasClick ? '' : '[NO CLICK HANDLER]');
});

// Anchors with no or empty href
const emptyHref = allAnchors.filter(a => {
  const href = a.getAttribute('href');
  return href === null || href.trim() === '' || href === '#';
});

emptyHref.forEach(a => {
  const hasClick = a.onclick !== null || a.hasAttribute('onclick');
  console.log('[EMPTY HREF]', a.outerHTML, hasClick ? '' : '[NO CLICK HANDLER]');
});

console.log(`${externalMissing.length} external links missing target="_blank"`);
console.log(`${emptyHref.length} anchors with no/empty href`);
