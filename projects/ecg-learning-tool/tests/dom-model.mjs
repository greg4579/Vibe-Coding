// A deliberately small DOM model for state/interaction regressions.
// It supports the selectors and element APIs this app uses; it does not render CSS.
export class Element {
  constructor(tag = 'div', attributes = {}) {
    this.tagName = tag;
    this.attributes = { ...attributes };
    this.children = [];
    this.text = '';
    this.events = {};
    this.style = {};
    this.disabled = 'disabled' in attributes;
    this.hidden = 'hidden' in attributes;
    this.value = '';
    this.dataset = new Proxy({}, {
      get: (_, key) => this.attributes['data-' + String(key).replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())],
      set: (_, key, value) => { this.attributes['data-' + String(key).replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())] = String(value); return true; },
    });
    this.classList = {
      toggle: (name, enabled) => {
        const classes = new Set((this.attributes.class || '').split(' ').filter(Boolean));
        if (enabled) classes.add(name); else classes.delete(name);
        this.attributes.class = [...classes].join(' ');
      },
      contains: name => (this.attributes.class || '').split(' ').includes(name),
    };
  }
  set textContent(value) { this.text = String(value); this.children = []; }
  get textContent() { return this.text + this.children.map(node => node.textContent).join(''); }
  get id() { return this.attributes.id || ''; }
  set id(value) { this.attributes.id = value; }
  get className() { return this.attributes.class || ''; }
  set className(value) { this.attributes.class = value; }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  getAttribute(key) { return this.attributes[key] ?? null; }
  removeAttribute(key) { delete this.attributes[key]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.text = ''; this.children = nodes; }
  addEventListener(name, handler) { (this.events[name] ??= []).push(handler); }
  click() {
    if (!this.disabled && !this.hidden) {
      for (const handler of this.events.click || []) handler({ target: this, preventDefault() {} });
    }
  }
  change(value) { this.value = String(value); for (const handler of this.events.change || []) handler({ target: this }); }
  focus() { this.focused = true; }
  get firstElementChild() { return this.children.find(node => node.tagName !== '#text'); }
  matches(selector) {
    if (selector.startsWith('#')) return this.id === selector.slice(1);
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    const attribute = selector.match(/^(\w+)?\[([\w-]+)(?:="([^"]*)")?\]$/);
    if (attribute) return (!attribute[1] || this.tagName === attribute[1]) && (attribute[3] === undefined ? attribute[2] in this.attributes : this.attributes[attribute[2]] === attribute[3]);
    return this.tagName === selector;
  }
  querySelectorAll(selector) {
    if (selector.includes(' ')) {
      const [ancestor, descendant] = selector.split(' ');
      return this.querySelectorAll(ancestor).flatMap(node => node.querySelectorAll(descendant));
    }
    const matches = [];
    const visit = node => {
      for (const child of node.children) {
        if (child.matches(selector)) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  cloneNode(deep) {
    const node = new Element(this.tagName, this.attributes);
    node.text = this.text;
    if (deep) node.children = this.children.map(child => child.cloneNode(true));
    return node;
  }
}

function decode(text) {
  return text.replace(/&(?:amp|lt|gt|quot|apos|#39);/g, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'" })[entity]);
}

export function createDocument(html) {
  const root = new Element('#document');
  const stack = [root];
  const voidTags = new Set(['meta', 'link', 'br', 'hr', 'img', 'input']);
  for (const token of html.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]*>|[^<]+/g) || []) {
    if (token.startsWith('<!')) continue;
    if (token.startsWith('</')) { stack.pop(); continue; }
    if (token.startsWith('<')) {
      const match = token.match(/^<([\w:-]+)([\s\S]*?)\/?\s*>$/);
      if (!match) continue;
      const attributes = {};
      for (const attribute of match[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
        attributes[attribute[1]] = decode(attribute[2] ?? attribute[3] ?? attribute[4] ?? '');
      }
      const node = new Element(match[1], attributes);
      stack.at(-1).append(node);
      if (!voidTags.has(match[1]) && !token.endsWith('/>')) stack.push(node);
    } else stack.at(-1).text += decode(token);
  }
  return {
    root,
    getElementById: id => root.querySelector('#' + id),
    createElement: tag => new Element(tag),
    createElementNS: (_namespace, tag) => new Element(tag),
    createTextNode: text => { const node = new Element('#text'); node.textContent = text; return node; },
  };
}
