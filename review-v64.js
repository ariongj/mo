'use strict';
(() => {
  const origin = 'https://kobags-october-review.ariongj.chatgpt.site';
  const frame = document.getElementById('review');
  const loading = document.getElementById('loading');
  const fallback = document.getElementById('fallback');
  const publicPath = /^\/(?:sq(?:\/|$))?(?:design|quote|products(?:\/[a-z0-9-]+)?|manufacturing|sustainability|partners|contact|privacy|cookies|terms|bags-kosovo|blog(?:\/[a-z0-9-]+)?)?\/?$/;
  let currentPath = '/';
  let timer;
  function navigate() {
    const candidate = location.hash.slice(1) || '/';
    const path = publicPath.test(candidate) ? candidate : '/';
    if (frame.getAttribute('src') && path === currentPath) return;
    currentPath = path;
    loading.hidden = false;
    fallback.hidden = true;
    frame.inert = true;
    for (const id of ['direct-link', 'fallback-link']) document.getElementById(id).href = origin + path;
    clearTimeout(timer);
    timer = setTimeout(() => { fallback.hidden = false; }, 15000);
    frame.src = origin + path;
  }
  window.addEventListener('message', event => {
    if (event.origin !== origin || event.source !== frame.contentWindow || event.data?.type !== 'kobags-v64-ready') return;
    if (typeof event.data.path !== 'string' || !publicPath.test(event.data.path)) return;
    currentPath = event.data.path;
    history.replaceState(null, '', location.pathname + location.search + (currentPath === '/' ? '' : '#' + currentPath));
    document.title = typeof event.data.title === 'string' ? event.data.title : 'KOBAGS — Version 64 review';
    clearTimeout(timer);
    loading.hidden = true;
    fallback.hidden = true;
    frame.inert = false;
  });
  window.addEventListener('hashchange', navigate);
  navigate();
})();
