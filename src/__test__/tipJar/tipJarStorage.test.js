import {
  shouldShowTipJar,
  recordTipJarShown,
  dismissTipJarPermanently,
} from "../../utils/tipJarStorage";

const DISMISSED_KEY = "tipJarDismissed";
const LAST_SHOWN_KEY = "tipJarLastShown";
const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

describe("tipJarStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(Date, "now").mockReturnValue(1000000000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("shouldShowTipJar", () => {
    it("returns true when localStorage is empty", () => {
      expect(shouldShowTipJar()).toBe(true);
    });

    it("returns false when permanently dismissed", () => {
      localStorage.setItem(DISMISSED_KEY, "true");
      expect(shouldShowTipJar()).toBe(false);
    });

    it("returns false when dismissed and last shown is also set", () => {
      localStorage.setItem(DISMISSED_KEY, "true");
      localStorage.setItem(LAST_SHOWN_KEY, Date.now() - DAYS_30 - 1);
      expect(shouldShowTipJar()).toBe(false);
    });

    it("returns false when shown less than 30 days ago", () => {
      localStorage.setItem(LAST_SHOWN_KEY, Date.now() - DAYS_30 + 1000);
      expect(shouldShowTipJar()).toBe(false);
    });

    it("returns false when last shown exactly 30 days ago", () => {
      localStorage.setItem(LAST_SHOWN_KEY, Date.now() - DAYS_30);
      expect(shouldShowTipJar()).toBe(false);
    });

    it("returns true when last shown more than 30 days ago", () => {
      localStorage.setItem(LAST_SHOWN_KEY, Date.now() - DAYS_30 - 1);
      expect(shouldShowTipJar()).toBe(true);
    });
  });

  describe("recordTipJarShown", () => {
    it("saves the current timestamp to localStorage", () => {
      recordTipJarShown();
      expect(localStorage.getItem(LAST_SHOWN_KEY)).toBe(String(Date.now()));
    });

    it("causes shouldShowTipJar to return false immediately after", () => {
      recordTipJarShown();
      expect(shouldShowTipJar()).toBe(false);
    });
  });

  describe("dismissTipJarPermanently", () => {
    it("sets the dismissed flag in localStorage", () => {
      dismissTipJarPermanently();
      expect(localStorage.getItem(DISMISSED_KEY)).toBe("true");
    });

    it("causes shouldShowTipJar to return false permanently", () => {
      dismissTipJarPermanently();
      expect(shouldShowTipJar()).toBe(false);
    });

    it("keeps returning false even after 30 days have passed", () => {
      dismissTipJarPermanently();
      Date.now.mockReturnValue(1000000000000 + DAYS_30 + 1);
      expect(shouldShowTipJar()).toBe(false);
    });
  });
});
