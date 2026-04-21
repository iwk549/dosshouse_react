import { sortAndFilterTable } from "../../utils/leaderboardUtil";

const makeEntry = (name, points, misc) => ({
  name,
  points: {
    group: { total: points },
  },
  ...(misc !== undefined && { misc }),
});

const entries = [
  makeEntry("Charlie", 10),
  makeEntry("Alice", 30),
  makeEntry("Bob", 20),
];

describe("sortAndFilterTable", () => {
  describe("filtering", () => {
    it("returns all entries when search is empty", () => {
      const result = sortAndFilterTable(entries, "", { path: "name", order: "asc" });
      expect(result).toHaveLength(3);
    });

    it("filters by name (case-insensitive)", () => {
      const result = sortAndFilterTable(entries, "ali", { path: "name", order: "asc" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Alice");
    });

    it("filters by userID.name when present", () => {
      const withUserId = [
        { name: "anon", userID: { name: "Alice" }, points: { group: { total: 10 } } },
        { name: "Bob", points: { group: { total: 5 } } },
      ];
      const result = sortAndFilterTable(withUserId, "alice", { path: "name", order: "asc" });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("anon");
    });

    it("returns empty array when no entries match search", () => {
      const result = sortAndFilterTable(entries, "zzz", { path: "name", order: "asc" });
      expect(result).toHaveLength(0);
    });
  });

  describe("sorting by simple path", () => {
    it("sorts by name ascending", () => {
      const result = sortAndFilterTable(entries, "", { path: "name", order: "asc" });
      expect(result.map((e) => e.name)).toEqual(["Alice", "Bob", "Charlie"]);
    });

    it("sorts by name descending", () => {
      const result = sortAndFilterTable(entries, "", { path: "name", order: "desc" });
      expect(result.map((e) => e.name)).toEqual(["Charlie", "Bob", "Alice"]);
    });
  });

  describe("sorting by nested points path", () => {
    it("sorts by points.group.total ascending", () => {
      const result = sortAndFilterTable(entries, "", {
        path: "points.group.total",
        order: "asc",
      });
      expect(result.map((e) => e.name)).toEqual(["Charlie", "Bob", "Alice"]);
    });

    it("sorts by points.group.total descending", () => {
      const result = sortAndFilterTable(entries, "", {
        path: "points.group.total",
        order: "desc",
      });
      expect(result.map((e) => e.name)).toEqual(["Alice", "Bob", "Charlie"]);
    });
  });

  describe("sorting by misc path", () => {
    it("skips sort (returns 0) when misc is missing on entries", () => {
      const result = sortAndFilterTable(entries, "", { path: "misc.rank", order: "asc" });
      expect(result).toHaveLength(3);
    });
  });

  it("does not mutate the original array", () => {
    const original = [...entries];
    sortAndFilterTable(entries, "", { path: "name", order: "desc" });
    expect(entries).toEqual(original);
  });
});
