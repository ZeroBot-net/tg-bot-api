'use strict';

/* ------------------------------------------------------------------ *
 * tiny helpers
 * ------------------------------------------------------------------ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const REPO = 'https://github.com/ZeroBot-net/tg-bot-api';
const NPM = 'https://www.npmjs.com/package/@zero-bot.net/tg-bot-api';

/* ------------------------------------------------------------------ *
 * syntax highlighting (small, conservative)
 * ------------------------------------------------------------------ */

const JS_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|return|if|else|for|while|await|async|new|require|module|class|extends|try|catch|finally|of|in|typeof|null|undefined|true|false|this|export|default|switch|case|break|continue|throw|delete|void|import|from)\b)|(\b\d[\d_]*(?:\.\d+)?\b)/g;
const SH_RE = /(#[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|(\b(?:npm|npx|node|git|cd|export|curl|ssh|mkdir|rm)\b)/g;

function highlight(code, lang) {
  const isShell = lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'console';
  const re = isShell ? SH_RE : JS_RE;
  let out = '';
  let last = 0;
  let match;
  re.lastIndex = 0;
  while ((match = re.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, match.index));
    if (match[1]) out += `<span class="tok-comment">${escapeHtml(match[1])}</span>`;
    else if (match[2]) out += `<span class="tok-string">${escapeHtml(match[2])}</span>`;
    else if (match[3]) out += `<span class="tok-${isShell ? 'keyword' : 'keyword'}">${escapeHtml(match[3])}</span>`;
    else if (match[4]) out += `<span class="tok-number">${escapeHtml(match[4])}</span>`;
    last = re.lastIndex;
  }
  out += escapeHtml(code.slice(last));
  return out;
}

/* ------------------------------------------------------------------ *
 * components
 * ------------------------------------------------------------------ */

let codeSeq = 0;

function codeBlock(code, lang = 'js', label) {
  const id = `code-${codeSeq += 1}`;
  return `<div class="code-block">
    <div class="code-head">
      <span>${escapeHtml(label || lang || 'code')}</span>
      <span class="spacer"></span>
      <button class="copy-btn" type="button" data-copy="${id}" aria-label="Copy code">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span>Copy</span>
      </button>
    </div>
    <pre><code id="${id}" data-lang="${escapeHtml(lang)}">${highlight(code, lang)}</code></pre>
  </div>`;
}

function icon(path) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

/* ------------------------------------------------------------------ *
 * data
 * ------------------------------------------------------------------ */

const state = { meta: null, api: null, pages: null, examples: null };
let methodsByName = new Map();

async function loadData() {
  const load = (file) => fetch(`data/${file}`).then((r) => {
    if (!r.ok) throw new Error(`${file}: ${r.status}`);
    return r.json();
  });
  const [meta, api, pages, examples] = await Promise.all([
    load('meta.json'), load('api.json'), load('pages.json'), load('examples.json'),
  ]);
  Object.assign(state, { meta, api, pages, examples });
  methodsByName = new Map(api.methods.map((m) => [m.name.toLowerCase(), m]));
}

/* ------------------------------------------------------------------ *
 * pages
 * ------------------------------------------------------------------ */

function viewHome() {
  const { meta } = state;
  const install = 'npm i @zero-bot.net/tg-bot-api';
  return `
    <div class="content-inner">
      <section class="hero">
        <p class="eyebrow">Telegram Bot API 10.3 · Node.js</p>
        <h1>A small, fast client for the Telegram Bot API.</h1>
        <p class="lede">
          Full API coverage with a four-dependency footprint, native CommonJS
          (no build step), built-in webhooks and polling, and both update modes out of the box.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/guide">${icon('<path d="M5 12h14M13 6l6 6-6 6"/>')} Read the guide</a>
          <a class="btn" href="#/api">${icon('<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>')} API reference</a>
        </div>
        <div class="specs">
          <div class="spec"><dt>Methods</dt><dd>${meta.methodCount}</dd></div>
          <div class="spec"><dt>Bot API</dt><dd>10.3</dd></div>
          <div class="spec"><dt>Node</dt><dd>${escapeHtml(meta.node)}+</dd></div>
          <div class="spec"><dt>Dependencies</dt><dd>4</dd></div>
        </div>
      </section>

      <section class="section">
        <h2>Install</h2>
        ${codeBlock(install, 'bash', 'terminal')}
      </section>

      <section class="section">
        <h2>Quickstart</h2>
        <p>Create a bot with <a href="https://t.me/BotFather" target="_blank" rel="noopener">@BotFather</a>, then drop the token in and start polling.</p>
        ${codeBlock(`const TelegramBot = require('@zero-bot.net/tg-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\\/echo (.+)/, (msg, match) => {
  bot.sendMessage(msg.chat.id, match[1]);
});

bot.on('message', (msg) => {
  console.log(msg.chat.id, msg.text);
});`, 'js', 'index.js')}
      </section>

      <section class="section">
        <h2>What's included</h2>
        <div class="prose">
          <ul>
            <li><strong>Both update modes</strong> — long polling and webhooks, with a built-in HTTP(S) server and health endpoint.</li>
            <li><strong>File uploads from anywhere</strong> — a path, a stream, a Buffer, a URL, or a <code>file_id</code>, with file-type detection built in.</li>
            <li><strong>Every method</strong> — rich messages, ephemeral messages, business accounts, gifts and Stars, checklists, media polls, stories, and communities.</li>
            <li><strong>Typed</strong> — TypeScript definitions ship with the package.</li>
            <li><strong>Readable errors</strong> — API errors carry the raw response; transport failures keep their original cause.</li>
          </ul>
        </div>
      </section>

      <section class="section">
        <h2>Where to go next</h2>
        <div class="hero-actions">
          <a class="btn" href="#/guide">${icon('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>')} Guide</a>
          <a class="btn" href="#/api">${icon('<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>')} ${meta.methodCount} methods</a>
          <a class="btn" href="#/examples">${icon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/>')} Examples</a>
        </div>
      </section>
    </div>`;
}

function bulletPanel(title, items) {
  return `<h3>${title}</h3><div class="prose"><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`;
}

function viewGuide() {
  return `
    <div class="content-inner narrow">
      <h1 class="page-title">Guide</h1>

      <section class="section">
        <h2>Install</h2>
        ${codeBlock('npm i @zero-bot.net/tg-bot-api', 'bash', 'terminal')}
        <p>Requires Node.js ${escapeHtml(state.meta.node)} or newer. The package ships native CommonJS — there is no build step.</p>
      </section>

      <section class="section">
        <h2>Polling</h2>
        <p>Pass <code>{ polling: true }</code> and the bot starts long polling immediately.</p>
        ${codeBlock(`const TelegramBot = require('@zero-bot.net/tg-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: { interval: 50, params: { timeout: 30 } },
});

bot.on('text', (msg) => {
  if (!msg.text.startsWith('/')) bot.sendMessage(msg.chat.id, msg.text);
});

bot.on('polling_error', (err) => console.error(err.message));`, 'js')}
        <div class="callout tip">${icon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>')}<div>A higher <code>timeout</code> with a low <code>interval</code> delivers updates with less overhead than rapid short polls.</div></div>
      </section>

      <section class="section">
        <h2>Webhooks</h2>
        <p>The library can run the webhook server for you. Telegram only delivers webhooks over HTTPS, so terminate TLS in-process or put the server behind a reverse proxy.</p>
        ${codeBlock(`const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  webHook: { port: 8443, host: '0.0.0.0', healthEndpoint: '/healthz' },
});

bot.on('message', (msg) => bot.sendMessage(msg.chat.id, 'hi'));

await bot.setWebHook('https://example.com:8443');`, 'js')}
      </section>

      <section class="section">
        <h2>Sending files</h2>
        <p>Every file-sending method accepts a local path, a stream, a Buffer, a URL or a previously uploaded <code>file_id</code>. The type is detected from the bytes.</p>
        ${codeBlock(`await bot.sendPhoto(chatId, './cat.png');         // path
await bot.sendPhoto(chatId, buffer);              // Buffer
await bot.sendPhoto(chatId, 'https://x/y.png');   // URL
await bot.sendPhoto(chatId, fileId);              // already on Telegram`, 'js')}
        <div class="callout tip">${icon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>')}<div>Reusing a <code>file_id</code> skips the upload entirely — the fastest option for repeat sends.</div></div>
      </section>

      <section class="section">
        <h2>Errors</h2>
        <p>API errors are <code>TelegramError</code> (<code>ETELEGRAM</code>) and carry the raw server <code>response</code>. Transport failures are <code>FatalError</code> (<code>EFATAL</code>) with the original error preserved as <code>.cause</code>.</p>
        ${codeBlock(`const { TelegramError } = require('@zero-bot.net/tg-bot-api');

bot.on('polling_error', (err) => {
  if (err instanceof TelegramError) console.error(err.response.body);
  else console.error(err.message, err.cause);
});`, 'js')}
      </section>

      <section class="section">
        <h2>Latency</h2>
        <p>Cold connections pay DNS, TCP, TLS and Node's 250&nbsp;ms IPv6 fallback window on top of the round-trip. Warm keep-alive requests are 20–80&nbsp;ms.</p>
        ${codeBlock(`const bot = new TelegramBot(token, {
  ipv4First: true,   // prefer IPv4, shorten the fallback window
  prewarm: true,     // open DNS/TCP/TLS at startup
});

// Or apply the tuning process-wide, once:
// TelegramBot.applyNetworkTuning();`, 'js')}
        <div class="prose"><ul>
          <li><strong>Host near Telegram</strong> (EU/US) to cut round-trip time from ~200&nbsp;ms to ~10–30&nbsp;ms.</li>
          <li><strong>Self-hosted Bot API server</strong> for media — point <code>baseApiUrl</code> at it and files never leave your machine.</li>
          <li><strong>Fewer round-trips</strong> — batch with <code>sendMediaGroup</code>, <code>forwardMessages</code>, <code>copyMessages</code>.</li>
        </ul></div>
      </section>

      <section class="section">
        <h2>TypeScript</h2>
        <p>Types ship with the package; set the bot's type from the constructor and everything follows.</p>
        ${codeBlock(`import TelegramBot from '@zero-bot.net/tg-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, { polling: true });
const me = await bot.getMe();`, 'ts', 'index.ts')}
      </section>
    </div>`;
}

function viewExamples() {
  const tabs = state.examples.examples;
  return `
    <div class="content-inner">
      <h1 class="page-title">Examples</h1>
      <p class="lede" style="margin-bottom:var(--sp-7)">Runnable examples. Each reads the bot token from <code>TELEGRAM_TOKEN</code>.</p>
      ${tabs.map((ex) => `
        <section class="section">
          <h2>${escapeHtml(ex.title)}</h2>
          ${codeBlock(ex.code, 'js', `examples/${ex.file}`)}
        </section>`).join('')}
    </div>`;
}

function viewProse(title, html) {
  return `<div class="content-inner narrow"><h1 class="page-title">${escapeHtml(title)}</h1><div class="prose">${html}</div></div>`;
}

/* --------------------------- API --------------------------- */

let apiFilter = { query: '', category: 'All' };

function viewApi() {
  const { categories, methods } = state.api;
  const sorted = [...methods].sort((a, b) => a.name.localeCompare(b.name));
  const chips = ['All', ...categories].map((cat) => {
    const n = cat === 'All' ? methods.length : methods.filter((m) => m.category === cat).length;
    return `<button class="chip" type="button" data-category="${escapeHtml(cat)}" aria-pressed="${cat === apiFilter.category}">${escapeHtml(cat)} <span class="n">${n}</span></button>`;
  }).join('');

  const rows = sorted.map((m) => `
    <article class="method" id="method-${m.name}" data-name="${m.name.toLowerCase()}" data-category="${escapeHtml(m.category)}" data-search="${escapeHtml(`${m.name} ${m.description} ${m.category} ${m.params.map((p) => p.name).join(' ')}`.toLowerCase())}">
      <button class="method-head" type="button" aria-expanded="false" aria-controls="body-${m.name}">
        <span class="method-name">${escapeHtml(m.name)}</span>
        <span class="method-sig">(${escapeHtml(m.args)})</span>
        <span class="method-cat">${escapeHtml(m.category)}</span>
      </button>
      <div class="method-body" id="body-${m.name}" hidden>
        ${m.description ? `<p class="method-desc">${m.descriptionHtml}</p>` : ''}
        ${m.params.length ? `<table class="params">
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>${m.params.map((p) => `<tr>
            <td class="p-name">${escapeHtml(p.name)}</td>
            <td class="p-type">${escapeHtml(p.type)}${p.optional ? ' <span class="opt">optional</span>' : ''}</td>
            <td>${p.descriptionHtml}</td>
          </tr>`).join('')}</tbody>
        </table>` : ''}
        <div class="meta-row">
          ${m.returns ? `<span><span class="k">Returns</span> ${m.returnsHtml}</span>` : ''}
          ${m.see ? `<span><span class="k">Docs</span> <a href="${escapeHtml(m.see)}" target="_blank" rel="noopener">${escapeHtml(m.see.replace('https://core.telegram.org/bots/api#', 'api#'))}</a></span>` : ''}
          <span><span class="k">Source</span> <a href="${REPO}/blob/main/src/telegram.js" target="_blank" rel="noopener">telegram.js</a></span>
        </div>
      </div>
    </article>`).join('');

  return `
    <div class="content-inner">
      <div class="api-toolbar">
        <div class="search-field">
          ${icon('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>')}
          <input class="search-input" id="api-search" type="search" placeholder="Search ${methods.length} methods…" autocomplete="off" spellcheck="false">
          <kbd class="search-kbd">/</kbd>
        </div>
        <div class="chips" id="api-chips">${chips}</div>
        <div class="api-count" id="api-count" role="status"></div>
      </div>
      <div class="methods" id="api-list">${rows}</div>
      <div class="empty" id="api-empty" hidden><strong>No methods match</strong>Try a different search term or category.</div>
    </div>`;
}

function applyApiFilter() {
  const list = $('#api-list');
  if (!list) return;
  const query = apiFilter.query.trim().toLowerCase();
  const category = apiFilter.category;
  let visible = 0;
  $$('.method', list).forEach((el) => {
    const matchesQuery = !query || el.dataset.search.includes(query);
    const matchesCategory = category === 'All' || el.dataset.category === category;
    const show = matchesQuery && matchesCategory;
    el.hidden = !show;
    if (show) visible += 1;
  });
  const count = $('#api-count');
  if (count) count.textContent = `${visible} of ${state.api.methods.length} methods`;
  const empty = $('#api-empty');
  if (empty) empty.hidden = visible !== 0;
}

function openMethod(name, { scroll = true } = {}) {
  const canonical = methodsByName.get(String(name).toLowerCase());
  const el = $(`#method-${CSS.escape(canonical ? canonical.name : name)}`);
  if (!el) return;
  const head = $('.method-head', el);
  const body = $('.method-body', el);
  el.dataset.open = 'true';
  head.setAttribute('aria-expanded', 'true');
  body.hidden = false;
  if (scroll) el.scrollIntoView({ block: 'start', behavior: 'auto' });
}

function closeMethod(el) {
  const head = $('.method-head', el);
  const body = $('.method-body', el);
  el.dataset.open = 'false';
  head.setAttribute('aria-expanded', 'false');
  body.hidden = true;
}

/* ------------------------------------------------------------------ *
 * router
 * ------------------------------------------------------------------ */

const ROUTES = {
  '': { title: 'Home', render: viewHome },
  guide: { title: 'Guide', render: viewGuide },
  api: { title: 'API reference', render: viewApi, after: afterApi },
  examples: { title: 'Examples', render: viewExamples },
  usage: { title: 'Usage', render: () => viewProse('Usage', state.pages.usage) },
  faq: { title: 'FAQ', render: () => viewProse('FAQ', state.pages.faq) },
  changelog: { title: 'Changelog', render: () => viewProse('Changelog', state.pages.changelog) },
};

function afterApi(sub) {
  const search = $('#api-search');
  search.value = apiFilter.query;
  search.addEventListener('input', () => { apiFilter.query = search.value; applyApiFilter(); });
  $('#api-chips').addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    apiFilter.category = chip.dataset.category;
    $$('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    applyApiFilter();
  });
  const toolbar = $('.api-toolbar');
  const viewEl = $('#view');
  if (toolbar && viewEl) viewEl.style.setProperty('--api-toolbar-h', `${toolbar.offsetHeight}px`);
  $('#api-list').addEventListener('click', (event) => {
    const head = event.target.closest('.method-head');
    if (!head) return;
    const method = head.closest('.method');
    if (method.dataset.open === 'true') closeMethod(method);
    else openMethod(method.id.replace('method-', ''), { scroll: false });
  });
  applyApiFilter();
  if (sub) openMethod(sub, { scroll: true });
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [route, sub] = raw.split('/');
  return { route: route || '', sub: sub || '' };
}

function render() {
  const { route, sub } = parseHash();
  const definition = ROUTES[route] || ROUTES[''];
  const view = $('#view');

  view.innerHTML = definition.render();
  view.setAttribute('data-page', route || 'home');

  $$('.nav-link').forEach((link) => {
    const active = link.dataset.route === (ROUTES[route] ? (route || 'home') : 'home');
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const crumb = $('#crumb');
  crumb.innerHTML = `<strong>${escapeHtml(definition.title)}</strong>`
    + (sub ? `<span class="sep">/</span><span>${escapeHtml(sub)}</span>` : '');

  document.title = `${definition.title} · tg-bot-api`;

  if (definition.after) definition.after(sub);
  closeNav();
  if (!sub) window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ------------------------------------------------------------------ *
 * chrome: theme, nav, copy, shortcuts
 * ------------------------------------------------------------------ */

function currentTheme() {
  return document.documentElement.dataset.theme;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('tg-docs-theme', theme); } catch (e) { /* ignore */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0d10' : '#f7f8fa');
  const icon = $('#theme-icon');
  if (icon) {
    icon.innerHTML = theme === 'dark'
      ? '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>'
      : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  }
}

function toggleTheme() {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
}

function openNav() {
  $('#app').dataset.nav = 'open';
  $('#backdrop').hidden = false;
  $('#menu-btn').setAttribute('aria-expanded', 'true');
}
function closeNav() {
  delete $('#app').dataset.nav;
  $('#backdrop').hidden = true;
  $('#menu-btn').setAttribute('aria-expanded', 'false');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }
}

function bindGlobal() {
  $('#theme-btn').addEventListener('click', toggleTheme);
  $('#menu-btn').addEventListener('click', () => ($('#app').dataset.nav === 'open' ? closeNav() : openNav()));
  $('#backdrop').addEventListener('click', closeNav);

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.copy-btn');
    if (!button) return;
    const target = document.getElementById(button.dataset.copy);
    if (!target) return;
    const ok = await copyText(target.textContent);
    button.dataset.copied = String(ok);
    const label = $('span', button);
    const original = label ? label.textContent : 'Copy';
    if (label) label.textContent = ok ? 'Copied' : 'Failed';
    setTimeout(() => { button.dataset.copied = 'false'; if (label) label.textContent = original; }, 1400);
  });

  document.addEventListener('keydown', (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (event.key === '/' && !typing) {
      event.preventDefault();
      if (parseHash().route !== 'api') location.hash = '#/api';
      setTimeout(() => { const s = $('#api-search'); if (s) s.focus(); }, 0);
    }
    if (event.key === 'Escape') closeNav();
  });

  window.addEventListener('hashchange', render);
}

/* ------------------------------------------------------------------ *
 * boot
 * ------------------------------------------------------------------ */

(async function boot() {
  applyTheme(document.documentElement.dataset.theme || 'dark');
  bindGlobal();
  try {
    await loadData();
  } catch (err) {
    $('#view').innerHTML = `<div class="content-inner narrow"><div class="empty"><strong>Could not load documentation data</strong>${escapeHtml(err.message)}</div></div>`;
    return;
  }
  const meta = state.meta;
  $('#brand-meta').textContent = `v${meta.version} · ${meta.methodCount} methods`;
  $('#sidebar-version').innerHTML = `v${meta.version} · <a href="${NPM}" target="_blank" rel="noopener">npm</a> · <a href="${REPO}" target="_blank" rel="noopener">GitHub</a>`;
  $('#nav-api-count').textContent = meta.methodCount;
  render();
}());
