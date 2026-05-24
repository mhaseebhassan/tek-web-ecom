export const getApiOrigin = () => {
  if (process.env.NEXT_PUBLIC_API_ORIGIN) {
    return process.env.NEXT_PUBLIC_API_ORIGIN.replace(/\/$/, '');
  }
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  return base.replace(/\/api\/v1\/?$/, '');
};

export const toAbsoluteUploadUrl = (path) => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) {
    return `${getApiOrigin()}${path}`;
  }
  return path;
};
