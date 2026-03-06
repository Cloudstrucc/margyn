// ── Type picker ───────────────────────────────────────────
const typeSections = ['scraper','rest','graphql','soap'];
document.querySelectorAll('.type-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.type-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    const type = opt.dataset.type;
    opt.querySelector('input').checked = true;
    typeSections.forEach(t => {
      document.getElementById('section-'+t).style.display = t===type ? '' : 'none';
    });
    const needsAuth = ['rest','graphql','soap'].includes(type);
    document.getElementById('section-auth').style.display = needsAuth ? '' : 'none';
    document.getElementById('section-mapping').style.display = needsAuth ? '' : 'none';
  });
});

// ── Auth type switcher ────────────────────────────────────
document.getElementById('authTypeSelect')?.addEventListener('change', function() {
  document.querySelectorAll('.auth-fields').forEach(el => el.style.display='none');
  if (this.value !== 'none') {
    document.getElementById('auth-'+this.value).style.display = '';
  }
});

// ── Run Now buttons ───────────────────────────────────────
document.querySelectorAll('.run-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
    try {
      const res = await fetch('/sources/'+id+'/run', { method:'POST' });
      const json = await res.json();
      if (json.ok) showProgress(id, 5, 'Job queued…');
    } catch(e) {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-play-fill"></i>';
    }
  });
});

// ── Run All ───────────────────────────────────────────────
document.getElementById('runAllBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('runAllBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Running…';
  try {
    await fetch('/sources/run-all', { method:'POST' });
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-play-fill me-1"></i>Run All Now';
    }, 3000);
  } catch(e) { btn.disabled=false; }
});

// ── Progress helpers ──────────────────────────────────────
function showProgress(id, pct, label) {
  const wrap = document.getElementById('progress-'+id);
  const fill = document.getElementById('fill-'+id);
  const lbl  = document.getElementById('label-'+id);
  if (wrap) wrap.style.display = '';
  if (fill) fill.style.width = Math.min(pct,100) + '%';
  if (lbl)  lbl.textContent = label;
}

// ── SSE live progress ─────────────────────────────────────
const evtSource = new EventSource('/sources/events');

evtSource.onmessage = (e) => {
  try {
    const { sourceId, type, payload } = JSON.parse(e.data);
    if (type === 'start') {
      showProgress(sourceId, 5, 'Connecting to source…');
    }
    if (type === 'progress') {
      const pct = payload.page
        ? Math.round((payload.page / (payload.total || 1)) * 75) + 10
        : 25;
      const stepLabel = [
        payload.step || 'Running',
        payload.page ? `· page ${payload.page}/${payload.total}` : '',
        payload.itemsFound ? `· ${payload.itemsFound} items` : ''
      ].filter(Boolean).join(' ');
      showProgress(sourceId, pct, stepLabel);
    }
    if (type === 'complete') {
      showProgress(sourceId, 100, `✓ Complete — ${payload.totalFound} products · ${(payload.durationMs/1000).toFixed(1)}s`);
      setTimeout(() => {
        const wrap = document.getElementById('progress-'+sourceId);
        if (wrap) wrap.style.display = 'none';
        const btn = document.querySelector(`.run-btn[data-id="${sourceId}"]`);
        if (btn) { btn.disabled=false; btn.innerHTML='<i class="bi bi-play-fill"></i>'; }
      }, 5000);
    }
    if (type === 'error') {
      showProgress(sourceId, 100, '✗ Error: ' + payload.error);
      setTimeout(() => {
        const btn = document.querySelector(`.run-btn[data-id="${sourceId}"]`);
        if (btn) { btn.disabled=false; btn.innerHTML='<i class="bi bi-play-fill"></i>'; }
      }, 5000);
    }
  } catch (err) { /* ignore malformed events */ }
};

evtSource.onerror = () => {
  // SSE reconnects automatically; silently ignore
};

// ── Config modal ──────────────────────────────────────────
document.querySelectorAll('[data-bs-target="#configModal"]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.sourceId;
    const el = document.getElementById('configJson');
    if (!el) return;
    el.textContent = 'Loading…';
    try {
      const resp = await fetch('/sources/'+id+'/detail');
      const data = await resp.json();
      el.textContent = JSON.stringify(data, null, 2);
    } catch(e) {
      el.textContent = 'Failed to load config: ' + e.message;
    }
  });
});

// ── Refresh logs ──────────────────────────────────────────
document.getElementById('refreshLogs')?.addEventListener('click', async () => {
  const tbody = document.getElementById('jobLogBody');
  if (!tbody) return;
  try {
    const resp = await fetch('/sources/logs');
    const logs = await resp.json();
    tbody.innerHTML = logs.map(l => {
      const statusCls = l.status==='success' ? 'bg-success' : l.status==='partial' ? 'bg-warning text-dark' : 'bg-danger';
      const durSec    = l.durationMs ? (l.durationMs/1000).toFixed(1)+'s' : '—';
      const timeStr   = l.startedAt  ? new Date(l.startedAt).toLocaleTimeString() : '';
      return `<tr>
        <td><span class="fw-semibold small">${l.sourceId}</span></td>
        <td><span class="margin-badge ${statusCls}">${l.status}</span></td>
        <td class="mono">${l.productsFound}</td>
        <td class="mono ${l.errors>0?'text-warning':''}">${l.errors}</td>
        <td class="mono">${durSec}</td>
        <td class="small text-muted">${timeStr}</td>
        <td>${l.simulated?'<span class="badge bg-secondary">sim</span>':''}</td>
      </tr>`;
    }).join('');
  } catch(e) { console.error('Failed to refresh logs', e); }
});
