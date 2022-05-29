describe("predictions maker", () => {
  beforeEach(() => {
    cy.visit("predictions");
    cy.contains(/start new submission/i).click();
  });

  describe("rendering", () => {
    it("should visit the page", () => {
      cy.contains(/name this submission/i);
    });
  });
});
