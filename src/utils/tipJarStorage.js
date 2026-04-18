const DISMISSED_KEY = "tipJarDismissed";
const LAST_SHOWN_KEY = "tipJarLastShown";
const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

const shouldShowTipJar = () => {
  if (localStorage.getItem(DISMISSED_KEY)) return false;
  const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
  if (!lastShown) return true;
  return Date.now() - Number(lastShown) > DAYS_30;
};

const recordTipJarShown = () => {
  localStorage.setItem(LAST_SHOWN_KEY, Date.now());
};

const dismissTipJarPermanently = () => {
  localStorage.setItem(DISMISSED_KEY, "true");
};

export { shouldShowTipJar, recordTipJarShown, dismissTipJarPermanently };
