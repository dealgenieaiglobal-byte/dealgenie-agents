// DealGenie AI Demo Router
// Supports nice URLs like /agent/bharat on static hosts.
// Works on Netlify (with _redirects) and GitHub Pages (with 404.html).
(function(){
  const path = window.location.pathname.replace(/\/+$/, '');
  // If we are already on /agent.html, do nothing.
  if (path === '/agent.html') return;

  // /agent/<slug> should render agent.html while keeping the pretty URL.
  const agentMatch = path.match(/^\/agent\/([^\/]+)$/i);
  if (agentMatch) {
    // Replace the document with agent template while keeping URL
    fetch('/agent.html', {cache: 'no-store'})
      .then(r => r.text())
      .then(html => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch(() => {
        // fallback: hard navigate
        window.location.href = '/agent.html';
      });
  }
})();
