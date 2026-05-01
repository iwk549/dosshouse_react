import { act, fireEvent, screen } from "@testing-library/react";
import Navbar from "../../components/navigation/navbar";
import { renderWithContext } from "../testHelpers";

async function openDropdown() {
  await act(async () => {
    fireEvent.click(screen.getByLabelText("Navigation menu"));
  });
}

const baseUser = {
  _id: "u1",
  name: "Test User",
  email: "test@example.com",
};

describe("Navbar", () => {
  describe("when no user is logged in", () => {
    beforeEach(() => {
      renderWithContext(Navbar, {}, null);
    });

    it("shows the Login button", () => {
      expect(
        screen.getByRole("button", { name: /Login/i }),
      ).toBeInTheDocument();
    });

    it("shows the 'by Ultimate Scoreboard' tagline linking to the parent site", () => {
      const tagline = screen.getByText("by Ultimate Scoreboard");
      expect(tagline).toHaveAttribute("href", "https://ultimatescoreboard.com");
      expect(tagline).toHaveAttribute("target", "_blank");
    });

    describe("dropdown", () => {
      beforeEach(async () => {
        await openDropdown();
      });

      it("includes Competitions and Submissions", () => {
        expect(screen.getByText("Competitions")).toBeInTheDocument();
        expect(screen.getByText("Submissions")).toBeInTheDocument();
      });

      it("includes the Blog and Ultimate Scoreboard external links", () => {
        const blog = screen.getByText("Blog").closest("a");
        expect(blog).toHaveAttribute(
          "href",
          "https://blog.picker.ultimatescoreboard.com",
        );
        expect(blog).toHaveAttribute("target", "_blank");

        const usb = screen.getByText("Ultimate Scoreboard").closest("a");
        expect(usb).toHaveAttribute("href", "https://ultimatescoreboard.com");
        expect(usb).toHaveAttribute("target", "_blank");
      });

      it("does not include Account or Admin links", () => {
        expect(screen.queryByText("Account")).not.toBeInTheDocument();
        expect(screen.queryByText("Admin")).not.toBeInTheDocument();
      });
    });
  });

  describe("when a regular user is logged in", () => {
    beforeEach(async () => {
      renderWithContext(Navbar, {}, baseUser);
      await openDropdown();
    });

    it("does not show the Login button", () => {
      expect(
        screen.queryByRole("button", { name: /Login/i }),
      ).not.toBeInTheDocument();
    });

    it("includes the Account link in the dropdown", () => {
      expect(screen.getByText("Account")).toBeInTheDocument();
    });

    it("does not include the Admin link in the dropdown", () => {
      expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });
  });

  describe("when an admin user is logged in", () => {
    beforeEach(async () => {
      renderWithContext(Navbar, {}, { ...baseUser, role: "admin" });
      await openDropdown();
    });

    it("includes both Account and Admin links in the dropdown", () => {
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });
});
