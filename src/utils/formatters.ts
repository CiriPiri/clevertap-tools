export const formatDate = (raw?: number): string => {
  if (!raw) return '—';
  const s = String(raw);
  if (s.length === 8) {
    const y = s.slice(0, 4), m = s.slice(4, 6), d = s.slice(6, 8);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }
  return String(raw);
};

export const getStatusText = (code: number): string => {
  const map: Record<number, string> = { 0: 'Pending', 1: 'Processing', 2: 'Completed', 3: 'Failed' };
  return map[code] || 'Unknown';
};