export const formatDateSimple = (date: Date, locale?: string) => {
  if (!date || !(date instanceof Date)) {
    return;
  }
  const test = date.toLocaleDateString(locale ?? 'en', { day: '2-digit', month: 'long', year: 'numeric' });
  return test;
};
