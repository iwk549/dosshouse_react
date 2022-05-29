describe("predictions maker", () => {
  beforeEach(() => {
    cy.visit("predictions");
    cy.contains(/start new submission/i).click();
  });

  describe("rendering", () => {
    it("should visit the page", () => {
      cy.contains(/name this submission/i);
    });
    it("should render the tabs", () => {
      cy.contains(/group/i);
      cy.contains(/bracket/i);
      cy.contains(/bonus/i);
      cy.contains(/information/i);
    });
  });

  describe("funtionality", () => {
    describe("group", () => {
      it("should allow the user to move a team down within the group", () => {
        cy.getByTestId("draggable-table-row")
          .eq(0)
          .invoke("text")
          .then((firstTeam) => {
            cy.getByTestId("move-down").eq(0).click();
            cy.getByTestId("draggable-table-row")
              .eq(1)
              .invoke("text")
              .then((secondTeam) => {
                expect(firstTeam).to.equal(secondTeam);
              });
          });
      });
      it("should allow the user to move a team up within the group", () => {
        cy.getByTestId("draggable-table-row")
          .eq(0)
          .invoke("text")
          .then((firstTeam) => {
            cy.getByTestId("move-up").eq(0).click();
            cy.getByTestId("draggable-table-row")
              .eq(1)
              .invoke("text")
              .then((secondTeam) => {
                expect(firstTeam).to.equal(secondTeam);
              });
          });
      });
      it("should open the matches table", () => {
        cy.contains(/see matches/i).click();
        cy.contains(/close/i).click();
      });
    });
    describe("bracket", () => {
      beforeEach(() => {
        cy.contains(/bracket/i).click();
      });
      it("should allow the user to select a winner from a bracket match", () => {
        // get the team name from the first group to click in the bracket
        cy.contains(/group/i).click();
        cy.getByTestId("draggable-table-row")
          .eq(0)
          .invoke("text")
          .then((text) => {
            cy.contains(/bracket/i).click();
            cy.contains("text", text).click();
            cy.get("text")
              .eq(12)
              .invoke("text")
              .then((nextRoundText) => {
                expect(nextRoundText).to.equal(text);
              });
          });
      });
      it("should allow the champion to be picked", () => {
        cy.get("text")
          .eq(21)
          .invoke("text")
          .then((text) => {
            cy.contains(text).click();
            cy.getByTestId("champion-box").should("contain", text);
          });
      });
      it("should show all matches", () => {
        cy.contains(/see all matches/i).click();
        cy.contains(/playoff matches/i);
      });
      it("should show a single match", () => {
        cy.get("text").eq(1).click();
        cy.contains(/match number/i);
      });
      it("should allow switching to portrait mode", () => {
        // test by finding the first team in the second round (13th text)
        // when switched to portrait the 13th text will now be part of the first round
        cy.get("text")
          .eq(12)
          .invoke("text")
          .then((landscapeText) => {
            cy.getByTestId("custom-switch").click();
            cy.get("text")
              .eq(12)
              .invoke("text")
              .then((portraitText) => {
                expect(landscapeText).not.to.equal(portraitText);
                expect(portraitText).not.to.contain(/winner/i);
              });
          });
      });
    });
  });
});
