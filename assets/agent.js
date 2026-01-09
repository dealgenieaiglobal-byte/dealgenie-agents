// Agent page logic (reads slug, loads /data/agents.json, renders)
(async function(){
  const $ = (id) => document.getElementById(id);

  function getSlug(){
    const path = window.location.pathname.replace(/\/+$/, '');
    const m = path.match(/^\/agent\/([^\/]+)$/i);
    if (m) return decodeURIComponent(m[1]);
    const u = new URL(window.location.href);
    return u.searchParams.get('slug') || 'bharat';
  }

  const slug = getSlug();

  // Load data
  let agents = [];
  try{
    const res = await fetch('/data/agents.json', {cache: 'no-store'});
    agents = await res.json();
  }catch(e){
    console.error('Failed to load agents.json', e);
  }

  const agent = agents.find(a => (a.slug || '').toLowerCase() === slug.toLowerCase()) || agents[0];

  if(!agent){
    document.title = 'Agent not found • DealGenie AI';
    $('agentName').textContent = 'Agent not found';
    $('agentTagline').textContent = 'No agent data found. Add one in /data/agents.json';
    return;
  }

  document.title = `${agent.name} • DealGenie AI`;

  // Fill profile
  $('agentName').textContent = agent.name || 'Agent';
  $('agentCompany').textContent = agent.company || 'Real Estate';
  $('agentTagline').textContent = agent.tagline || 'Your local guide — fast answers, smart deals.';
  $('agentArea').textContent = agent.area || 'Your area';
  $('agentLang').textContent = agent.language || 'EN';
  $('agentSpecialty').textContent = agent.specialty || 'Buy/Sell';
  $('agentLicense').textContent = agent.license || '';

  const photo = $('agentPhoto');
  photo.src = agent.photo || '/assets/img/agent-placeholder.jpg';
  photo.alt = agent.name ? `${agent.name} photo` : 'Agent photo';

  // Contact buttons
  const phone = agent.phone || '';
  const email = agent.email || '';
  const website = agent.website || '';

  $('btnCall').href = phone ? `tel:${phone}` : '#';
  $('btnEmail').href = email ? `mailto:${email}` : '#';

  $('contactCall').textContent = phone || '—';
  $('contactCall').href = phone ? `tel:${phone}` : '#';

  $('contactEmail').textContent = email || '—';
  $('contactEmail').href = email ? `mailto:${email}` : '#';

  $('contactWeb').textContent = website ? website.replace(/^https?:\/\//,'') : '—';
  $('contactWeb').href = website || '#';

  // Listings
  const grid = $('listingGrid');
  grid.innerHTML = '';
  const listings = agent.listings || [];
  for(const item of listings){
    const el = document.createElement('article');
    el.className = 'listing';
    el.innerHTML = `
      <img class="listing__img" alt="Listing image" src="${item.image || '/assets/img/listing-placeholder.jpg'}" loading="lazy" />
      <div class="listing__body">
        <div class="listing__price">${item.price || ''}</div>
        <div style="margin-top:6px; font-weight:700">${item.title || ''}</div>
        <div class="listing__meta">
          ${(item.beds ? `<span class="pill2">${item.beds} bd</span>` : '')}
          ${(item.baths ? `<span class="pill2">${item.baths} ba</span>` : '')}
          ${(item.type ? `<span class="pill2">${item.type}</span>` : '')}
          ${(item.city ? `<span class="pill2">${item.city}</span>` : '')}
        </div>
      </div>
    `;
    grid.appendChild(el);
  }

  // Form
  const form = document.getElementById('leadForm');
  const status = document.getElementById('formStatus');

  function setStatus(msg){ status.textContent = msg || ''; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    const data = Object.fromEntries(new FormData(form).entries());
    data.agent_slug = agent.slug;
    data.agent_name = agent.name;
    data.timestamp = new Date().toISOString();

    // If no webhook URL set, just show demo success
    const url = (window.DG_FORM && window.DG_FORM.webhookUrl) ? window.DG_FORM.webhookUrl : '';
    if(!url){
      setStatus('Demo mode: form captured locally (no webhook configured).');
      form.reset();
      return;
    }

    try{
      const res = await fetch(url, {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Bad response');
      setStatus('Sent! We’ll get back to you shortly.');
      form.reset();
    }catch(err){
      console.error(err);
      setStatus('Could not send. Check webhook URL and CORS settings.');
    }
  });

  // Botpress embed (optional)
  try{
    const cfg = window.DG_BOTPRESS || {};
    if(cfg.enabled && cfg.inject && cfg.config){
      const s1 = document.createElement('script');
      s1.src = cfg.inject;
      s1.async = true;
      document.body.appendChild(s1);

      const s2 = document.createElement('script');
      s2.src = cfg.config;
      s2.async = true;
      document.body.appendChild(s2);
    }
  }catch(e){
    console.warn('Botpress embed failed', e);
  }
})();
