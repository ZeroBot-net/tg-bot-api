'use strict';

/**
 * Static documentation generator.
 *
 * Reads the library source + markdown docs and emits plain JSON under
 * `docs/data/`, which the static site in `docs/` consumes. No runtime
 * dependency and no framework — the output is committed and served by
 * GitHub Pages as-is.
 *
 *   node scripts/build-docs.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, contents) => {
  const target = path.join(DOCS, p);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
};

/* ------------------------------------------------------------------ *
 * Markdown → HTML (small, covers the constructs used in this repo)
 * ------------------------------------------------------------------ */

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function inline(text) {
  const codes = [];
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const external = /^https?:/.test(href);
    const attrs = external ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}"${attrs}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[Number(i)]}</code>`);
  return out;
}

function mdToHtml(markdown) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let i = 0;

  const isBlockStart = (line) => /^(#{1,6}\s|```|>\s?|\s*([-*+]|\d+\.)\s|\s*\|)/.test(line)
    || /^(-{3,}|\*{3,})\s*$/.test(line);

  while (i < lines.length) {
    const line = lines[i];

    const fence = /^\s*```(\w*)\s*$/.exec(line);
    if (fence) {
      const lang = fence[1] || '';
      i += 1;
      const buffer = [];
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre class="code-block"><code data-lang="${lang}">${escapeHtml(buffer.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].replace(/\s+#+\s*$/, '');
      out.push(`<h${level}>${inline(text)}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      out.push('<hr>');
      i += 1;
      continue;
    }

    // Table
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const cells = (row) => row.trim()
        .replace(/^\||\|$/g, '')
        .split(/(?<!\\)\|/)
        .map((c) => c.trim().replace(/\\\|/g, '|'));
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(cells(lines[i]));
        i += 1;
      }
      out.push('<div class="table-wrap"><table><thead><tr>'
        + head.map((c) => `<th>${inline(c)}</th>`).join('')
        + '</tr></thead><tbody>'
        + rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')
        + '</tbody></table></div>');
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const buffer = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buffer.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      out.push(`<blockquote>${mdToHtml(buffer.join('\n'))}</blockquote>`);
      continue;
    }

    // Lists
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      let current = null;
      const baseIndent = line.match(/^\s*/)[0].length;
      while (i < lines.length) {
        const itemMatch = /^(\s*)([-*+]|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (itemMatch) {
          const indent = itemMatch[1].length;
          if (indent > baseIndent && current) {
            current.nested.push(lines[i].slice(baseIndent + 2));
          } else if (indent === baseIndent) {
            current = { text: itemMatch[3], nested: [] };
            items.push(current);
          } else {
            break;
          }
          i += 1;
          continue;
        }
        // Continuation of the previous item (a wrapped line).
        if (/^\s*$/.test(lines[i])) break;
        const indent = lines[i].match(/^\s*/)[0].length;
        if (indent > baseIndent && current) {
          current.text = `${current.text} ${lines[i].trim()}`;
          i += 1;
          continue;
        }
        break;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((item) => {
        const nested = item.nested.length ? mdToHtml(item.nested.join('\n')) : '';
        return `<li>${inline(item.text)}${nested}</li>`;
      }).join('')}</${tag}>`);
      continue;
    }

    if (/^\s*$/.test(line)) {
      i += 1;
      continue;
    }

    // Paragraph
    const paragraph = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !(paragraph.length && isBlockStart(lines[i]))) {
      paragraph.push(lines[i]);
      i += 1;
    }
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }

  return out.join('\n');
}

/* ------------------------------------------------------------------ *
 * API extraction from JSDoc
 * ------------------------------------------------------------------ */

const CATEGORY_RULES = [
  ['Updates & webhooks', /^(getUpdates|setWebHook|setWebhook|deleteWebHook|deleteWebhook|getWebHookInfo|getWebhookInfo|startPolling|stopPolling|initPolling|isPolling|openWebHook|closeWebHook|hasOpenWebHook|preheat)$/],
  ['Events & listeners', /^(on|onText|onReplyToMessage|removeTextListener|removeReplyListener|clearTextListeners|clearReplyListeners|processUpdate)$/],
  ['Messages', /^send(Message|MessageDraft|RichMessage|RichMessageDraft|Checklist|Poll|Dice|Location|Venue|Contact|ChatAction|Game|Sticker)$/],
  ['Media', /^send(Photo|Document|Video|Animation|Audio|Voice|VideoNote|MediaGroup|LivePhoto|PaidMedia)$/],
  ['Editing', /^(edit|stop)[A-Z]/],
  ['Copy, forward & delete', /^(forward|copy|delete)[A-Z]/],
  ['Reactions & answers', /^(setMessageReaction|deleteMessageReaction|deleteAllMessageReactions|answer)[A-Z]/],
  ['Chat administration', /^(getChat|setChat|ban|unban|restrict|promote|pin|unpin|leaveChat|approve|decline|export|createChat|editChat|revoke|verifyChat|removeChat|setChatMember|setChatAdministrator)/],
  ['Forum topics', /ForumTopic/],
  ['Stickers & emoji', /(Sticker|Emoji)/],
  ['Inline & web apps', /(Inline|WebApp|Guest|Prepared|ManagedBot)/],
  ['Payments & Stars', /(Invoice|Star|Gift|PreCheckout|Shipping|Subscription)/],
  ['Business accounts', /Business/],
  ['Stories', /Story/],
  ['Bot profile & commands', /^(getMy|setMy|deleteMy|removeMy)/],
  ['Files', /^(getFile|downloadFile|getFileLink|getFileStream|uploadStickerFile)$/],
  ['Chat info & members', /^(getUser|getChat|getForumTopic|getCustomEmoji|getAvailableGifts)/],
];

function categorize(name) {
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(name)) return category;
  }
  return 'Other';
}

function parseJSDoc(block) {
  const lines = block.split('\n').map((line) => line
    .replace(/^\s*\/\*\*\s?/, '')
    .replace(/^\s*\*\/\s*$/, '')
    .replace(/^\s*\* ?/, '')
    .trimEnd());
  const description = [];
  const params = [];
  const sees = [];
  let returns = '';
  let current = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const param = /^@param\s+\{([^}]*)\}\s+(\[?[\w.]+\]?)\s*(.*)$/.exec(line);
    const ret = /^@returns?\s+\{([^}]*)\}\s*(.*)$/.exec(line);
    const seeMatch = /^@see\s+(\S+)/.exec(line);
    const otherTag = /^@(throws|private|class|constructor|example|deprecated)\b/.test(line);

    if (param) {
      const rawName = param[2];
      const optional = /^\[/.test(rawName);
      const name = rawName.replace(/^\[|\]$/g, '').replace(/\s*=\s*.*$/, '');
      current = { name, type: param[1], optional, description: param[3] || '' };
      params.push(current);
    } else if (ret) {
      returns = `${ret[1]}${ret[2] ? ` — ${ret[2]}` : ''}`;
      current = null;
    } else if (seeMatch) {
      sees.push(seeMatch[1]);
      current = null;
    } else if (otherTag) {
      current = null;
    } else if (current) {
      current.description = `${current.description} ${line.trim()}`.trim();
    } else if (line.trim()) {
      description.push(line.trim());
    }
  }

  return {
    description: description.join(' ').trim(),
    params,
    returns,
    // Prefer the canonical Bot API reference when a method links to several docs.
    see: sees.find((url) => url.startsWith('https://core.telegram.org/bots/api#')) || sees[sees.length - 1] || '',
  };
}

const RESERVED = new Set([
  'if', 'for', 'while', 'switch', 'catch', 'return', 'function', 'do', 'else',
  'try', 'finally', 'typeof', 'new', 'await', 'yield', 'with', 'case',
]);

function extractMethods(source) {
  const lines = source.split('\n');
  const methods = [];
  const methodRe = /^ {2}([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/;

  for (let i = 0; i < lines.length; i += 1) {
    const match = methodRe.exec(lines[i]);
    if (!match) continue;

    const name = match[1];
    if (name === 'constructor' || name.startsWith('_') || RESERVED.has(name)) continue;

    // Find the JSDoc block immediately above.
    let j = i - 1;
    let end = -1;
    while (j >= 0 && lines[j].trim() === '') j -= 1;
    if (j >= 0 && lines[j].trim() === '*/') {
      end = j;
      while (j >= 0 && !/^\s*\/\*\*/.test(lines[j])) j -= 1;
    }
    const doc = end >= 0 && j >= 0 ? parseJSDoc(lines.slice(j, end + 1).join('\n')) : {
      description: '', params: [], returns: '', see: '',
    };

    methods.push({
      name,
      signature: `${name}(${match[2].trim()})`,
      args: match[2].trim(),
      category: categorize(name),
      description: doc.description,
      descriptionHtml: inline(doc.description),
      params: doc.params.map((param) => ({ ...param, descriptionHtml: inline(param.description) })),
      returns: doc.returns,
      returnsHtml: inline(doc.returns),
      see: doc.see,
    });
  }

  return methods;
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

function build() {
  const pkg = JSON.parse(read('package.json'));
  const methods = extractMethods(read('src/telegram.js'));

  const categories = [...new Set(methods.map((m) => m.category))].sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  write('data/api.json', `${JSON.stringify({ methods, categories }, null, 2)}\n`);

  const examples = fs.readdirSync(path.join(ROOT, 'examples'))
    .filter((file) => file.endsWith('.js'))
    .sort()
    .map((file) => ({
      file,
      title: file.replace(/\.js$/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
      code: read(path.join('examples', file)),
    }));
  write('data/examples.json', `${JSON.stringify({ examples }, null, 2)}\n`);

  const changelog = mdToHtml(read('CHANGELOG.md'));
  const usage = mdToHtml(read('doc/usage.md'));
  const faq = mdToHtml(read('doc/help.md'));
  write('data/pages.json', `${JSON.stringify({ changelog, usage, faq }, null, 2)}\n`);

  write('data/meta.json', `${JSON.stringify({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    node: pkg.engines.node,
    methodCount: methods.length,
    categoryCount: categories.length,
  }, null, 2)}\n`);

  write('.nojekyll', '');

  // Report category distribution so it is easy to eyeball after a change.
  const distribution = {};
  for (const method of methods) distribution[method.category] = (distribution[method.category] || 0) + 1;
  console.log(`methods: ${methods.length}`);
  console.log(JSON.stringify(distribution, null, 2));
}

build();
