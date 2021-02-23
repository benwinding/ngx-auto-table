export function ToString(s: any): string {
  if (typeof s == 'string') {
    return s
  }
  return (s || '').toString();
}