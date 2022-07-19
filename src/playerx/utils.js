export function populate(template, obj) {
  return template.replace(
    /\{\{\s*([\w-]+)([=?|])?([^\s}]+?)?\s*\}\}/g,
    function (match, key, mod, fallback) {
      let val = obj[key];
      val = val != null ? val : fallback;
      if (val != null) {
        return val;
      }
      return '';
    }
  );
}

const loadScriptCache = {};
export async function loadScript(src, globalName, readyFnName) {
  if (loadScriptCache[src]) return loadScriptCache[src];
  if (globalName && self[globalName]) {
    await delay(0);
    return self[globalName];
  }
  return (loadScriptCache[src] = new Promise(function (resolve, reject) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    const ready = () => resolve(self[globalName]);
    if (readyFnName) self[readyFnName] = ready;
    script.onload = () => !readyFnName && ready();
    script.onerror = reject;
    document.head.append(script);
  }));
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get or insert a CSS rule with a selector in an element containing <style> tags.
 * @param  {Element} styleParent
 * @param  {string} selectorText
 * @return {CSSStyleRule|{ style: { setProperty: () => {} } }}
 */
export function getOrInsertCSSRule(styleParent, selectorText) {
  let style;
  for (style of styleParent.querySelectorAll('style')) {
    for (let rule of style.sheet?.cssRules ?? [])
      if (rule.selectorText === selectorText) return rule;
  }
  // If there is no style sheet return an empty style rule.
  if (!style?.sheet) return { style: { setProperty: () => {} } };

  style.sheet.insertRule(`${selectorText}{}`, style.sheet.cssRules.length);
  return style.sheet.cssRules[style.sheet.cssRules.length - 1];
}
