describe("predictions home", () => {
  describe("logged out", () => {
    beforeEach(() => {
      cy.visit("predictions");
    });
    it("should load the active competitions", () => {
      cy.contains("World Cup 2022");
    });
    it("should require login to view submissions", () => {
      cy.contains("Submissions").click();
      cy.get("button").eq(1).click();
      cy.contains(/to View your Submissions/i);
    });
    it("should go to the leaderboard", () => {
      cy.contains("View Leaderboard").click();
      cy.contains(/Sitewide Leaderboard/i);
    });
  });

  describe("logged in", () => {
    beforeEach(() => {
      cy.withCookie("predictions?tab=submissions");
    });

    it("should allow you to view your submissions when logged in", () => {
      cy.getByTestId("prediction-info");
    });
    it("should allow you to delete a submission", () => {
      cy.getByTestId("delete-prediction-button").eq(0).click();
      cy.contains(/confirm delete submission/i);
    });
    it("should allow you to manage groups", () => {
      cy.getByTestId("manage-groups-button").eq(0).click();
      cy.contains(/manage groups for/i);
    });
  });
});
