/**
 * Helper to get and set uploaded images in localStorage with fallback
 */
export function getSavedImage(key: string, defaultImage: string): string {
  try {
    const saved = localStorage.getItem(`custom_img_v2_${key}`);
    return saved || defaultImage;
  } catch {
    return defaultImage;
  }
}

export function saveImage(key: string, dataUrl: string): void {
  try {
    localStorage.setItem(`custom_img_v2_${key}`, dataUrl);
  } catch (e) {
    console.warn('Storage quota exceeded for image key:', key, e);
  }

  // Also broadcast to other components on the page
  try {
    window.dispatchEvent(
      new CustomEvent('custom_image_updated', {
        detail: { key, dataUrl }
      })
    );
  } catch {}

  // Also sync to backend server if available
  try {
    fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl, target: key })
    }).catch(() => {});
  } catch {}
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
