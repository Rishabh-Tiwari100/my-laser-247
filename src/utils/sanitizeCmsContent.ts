const unsafeHrefPattern = /^\s*(javascript|data):/i;

export const sanitizeCmsContent = (content?: string) => {
  if (!content || typeof window === 'undefined') return '';

  const document = new DOMParser().parseFromString(content, 'text/html');
  const blockedElements = document.querySelectorAll(
    'script, iframe, object, embed, link, meta, base'
  );

  blockedElements.forEach((element) => element.remove());

  document.body.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;

      if (name.startsWith('on') || (name === 'href' && unsafeHrefPattern.test(value))) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
};
