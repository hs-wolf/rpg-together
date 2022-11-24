export const formatDateSimple = (date: Date, locale?: string) => {
  if (!date || !(date instanceof Date)) {
    return;
  }
  const test = date.toLocaleDateString(locale ?? 'en', { day: '2-digit', month: 'long', year: 'numeric' });
  return test;
};

export const firebaseTimestampToDate = (timestamp?: any) => {
  if (!timestamp) {
    return;
  }
  const newDate = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  return formatDateSimple(newDate);
};
