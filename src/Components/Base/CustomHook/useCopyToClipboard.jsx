import { useState } from 'react';

export function useCopyToClipboard() {
  const [isCopied, setCopied] = useState(false);

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // Avoid scrolling
    textArea.style.opacity = '0';       // Make it invisible
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
    return success;
  };

  const copy = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn('Clipboard API failed, falling back:', err);
          const success = fallbackCopy(text);
          setCopied(success);
          setTimeout(() => setCopied(false), 2000);
        });
    } else {
      console.warn('Clipboard API not supported, using fallback');
      const success = fallbackCopy(text);
      setCopied(success);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return [isCopied, copy];
}
