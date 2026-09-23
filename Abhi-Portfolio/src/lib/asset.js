// Prefix public/ paths with the deploy sub-path (GitHub Pages project sites).
export const asset = (path) => (path ? `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}` : '');

/** True for "[bracketed]" placeholder text from the content file. */
export const isPlaceholder = (text) => typeof text === 'string' && /^\[.*\]$/.test(text.trim());
