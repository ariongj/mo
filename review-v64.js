'use strict';
(() => {
  const origin = 'https://kobags-october-review.ariongj.chatgpt.site';
  const frame = document.getElementById('review');
  const loading = document.getElementById('loading');
  const fallback = document.getElementById('fallback');
  const publicPath = /^\/(?:sq(?:\/|$))?(?:design|quote|products(?:\/[a-z0-9-]+)?|industries(?:\/retail)?|manufacturing|sustainability|partners(?:\/apply)?|contact|privacy|cookies|terms|certifications|resources|samples|bags-kosovo|blog(?:\/[a-z0-9-]+)?)?\/?$/;
  function validPath(candidate) {
    try {
      const u=new URL(candidate,origin);
      if(u.origin!==origin||!publicPath.test(u.pathname))return null;
      const params=new URLSearchParams();
      for(const key of ['example','collection']) {const value=u.searchParams.get(key);if(value&&/^[a-z0-9-]{1,64}$/.test(value))params.set(key,value);}
      return u.pathname+(params.size?'?'+params.toString():'');
    } catch {return null;}
  }
  let currentPath = '/';
  let timer;
  function navigate() {
    const candidate = location.hash.slice(1) || '/';
    const path = validPath(candidate) || '/';
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
    if (typeof event.data.path !== 'string' || validPath(event.data.path)!==event.data.path) return;
    currentPath = event.data.path;
    history.replaceState(null, '', location.pathname + location.search + (currentPath === '/' ? '' : '#' + currentPath));
    document.title = typeof event.data.title === 'string' ? event.data.title : 'KOBAGS — Website review';
    clearTimeout(timer);
    loading.hidden = true;
    fallback.hidden = true;
    frame.inert = false;
  });
  window.addEventListener('hashchange', navigate);
  navigate();
})();
