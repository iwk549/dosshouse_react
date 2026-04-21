import {
  titleCase,
  splitName,
  translateRound,
  decideSortOrder,
  teamOrder,
  atOrVs,
  matchStartText,
} from "../../utils/allowables";

describe("titleCase", () => {
  it("capitalizes each word", () => {
    expect(titleCase("hello world")).toBe("Hello World");
  });

  it("lowercases the rest of each word", () => {
    expect(titleCase("hELLO wORLD")).toBe("Hello World");
  });

  it("handles a single word", () => {
    expect(titleCase("foo")).toBe("Foo");
  });

  it("returns empty string for falsy input", () => {
    expect(titleCase("")).toBe("");
    expect(titleCase(null)).toBe("");
    expect(titleCase(undefined)).toBe("");
  });
});

describe("splitName", () => {
  it("returns the first word of a full name", () => {
    expect(splitName("Ian Kendall")).toBe("Ian");
  });

  it("returns the whole string if one word", () => {
    expect(splitName("Ian")).toBe("Ian");
  });

  it("returns empty string for undefined", () => {
    expect(splitName(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(splitName(null)).toBe("");
  });
});

describe("translateRound", () => {
  it("returns Third Place for round 1001", () => {
    expect(translateRound(1001, 6)).toBe("Third Place");
  });

  it("returns Final when round equals finalRound", () => {
    expect(translateRound(6, 6)).toBe("Final");
  });

  it("returns Semi-Final one round before finalRound", () => {
    expect(translateRound(5, 6)).toBe("Semi-Final");
  });

  it("returns Quarter-Final two rounds before finalRound", () => {
    expect(translateRound(4, 6)).toBe("Quarter-Final");
  });

  it("returns Round of 16 three rounds before finalRound", () => {
    expect(translateRound(3, 6)).toBe("Round of 16");
  });
});

describe("decideSortOrder", () => {
  it("toggles order from asc to desc on same path", () => {
    const col = { path: "name", order: "asc" };
    expect(decideSortOrder(col, "name")).toEqual({
      path: "name",
      order: "desc",
    });
  });

  it("toggles order from desc to asc on same path", () => {
    const col = { path: "name", order: "desc" };
    expect(decideSortOrder(col, "name")).toEqual({
      path: "name",
      order: "asc",
    });
  });

  it("switches to new path with asc order for non-points path", () => {
    const col = { path: "name", order: "asc" };
    expect(decideSortOrder(col, "rank")).toEqual({
      path: "rank",
      order: "asc",
    });
  });

  it("switches to new path with desc order for points path", () => {
    const col = { path: "name", order: "asc" };
    expect(decideSortOrder(col, "totalPoints")).toEqual({
      path: "totalPoints",
      order: "desc",
    });
  });
});

describe("teamOrder", () => {
  it("returns home then away for soccer", () => {
    expect(teamOrder("soccer")).toEqual(["home", "away"]);
    expect(teamOrder("Soccer")).toEqual(["home", "away"]);
  });

  it("returns away then home for non-soccer sports", () => {
    expect(teamOrder("baseball")).toEqual(["away", "home"]);
    expect(teamOrder("football")).toEqual(["away", "home"]);
  });
});

describe("atOrVs", () => {
  it("returns vs for soccer", () => {
    expect(atOrVs("soccer")).toBe("vs");
    expect(atOrVs("SOCCER")).toBe("vs");
  });

  it("returns at for non-soccer sports", () => {
    expect(atOrVs("baseball")).toBe("at");
  });
});

describe("matchStartText", () => {
  it("returns Kick Off for soccer", () => {
    expect(matchStartText("soccer")).toBe("Kick Off");
  });

  it("returns Kick Off for football", () => {
    expect(matchStartText("football")).toBe("Kick Off");
  });

  it("returns First Pitch for other sports", () => {
    expect(matchStartText("baseball")).toBe("First Pitch");
  });
});
