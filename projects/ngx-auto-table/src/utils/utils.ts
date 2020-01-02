export function sortObjectArrayCase(fieldName, direction?: 'asc' | 'desc') {
  return (a, b) => {
    const val_a = (a[fieldName] + '').toLowerCase();
    const val_b = (b[fieldName] + '').toLowerCase();
    if (val_a < val_b) {
      return direction === 'desc' ? 1 : -1;
    }
    if (val_a > val_b) {
      return direction === 'desc' ? -1 : 1;
    }
    return 0;
  };
}

export function formatPretty(input: string) {
  let str = input;
  if (typeof str !== 'string') {
    str = '';
  }
  const spacedStr = str.replace(new RegExp('_', 'g'), ' ');
  return spacedStr.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}