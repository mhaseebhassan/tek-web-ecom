import { toAbsoluteUploadUrl } from '@/lib/media';

const FALLBACK_IMAGE = '/grid.svg';

const BLOCKED_HOSTS = new Set([
  'via.placeholder.com',
  'placehold.co',
  'placehold.it',
  'dummyimage.com',
]);

export function resolveImageSrc(src) {
  if (!src || typeof src !== 'string') return FALLBACK_IMAGE;

  const trimmed = src.trim();
  if (!trimmed) return FALLBACK_IMAGE;

  if (trimmed.startsWith('/uploads/')) {
    return toAbsoluteUploadUrl(trimmed);
  }

  if (trimmed.startsWith('/')) return trimmed;

  try {
    const url = new URL(trimmed);
    if (BLOCKED_HOSTS.has(url.hostname)) return FALLBACK_IMAGE;
    return trimmed;
  } catch {
    return trimmed.startsWith('public/')
      ? `/${trimmed.replace(/^public\//, '')}`
      : FALLBACK_IMAGE;
  }
}

export { FALLBACK_IMAGE };
