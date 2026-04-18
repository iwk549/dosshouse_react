import { clickByText, renderWithContext } from "../testHelpers";
import { screen } from "@testing-library/react";
import TipJarBanner from "../../components/tipJar/tipJarBanner";
import TipJarModal from "../../components/tipJar/tipJarModal";

const DISMISSED_KEY = "tipJarDismissed";

describe("TipJarBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the Leave a Tip link", () => {
    renderWithContext(TipJarBanner, {});
    expect(screen.getByText("Leave a Tip")).toBeInTheDocument();
  });

  it("sets the dismissed flag in localStorage when Leave a Tip is clicked", async () => {
    renderWithContext(TipJarBanner, {});
    await clickByText("Leave a Tip");
    expect(localStorage.getItem(DISMISSED_KEY)).toBe("true");
  });

  it("does not set the dismissed flag before the link is clicked", () => {
    renderWithContext(TipJarBanner, {});
    expect(localStorage.getItem(DISMISSED_KEY)).toBeNull();
  });
});

describe("TipJarModal", () => {
  const onClose = jest.fn();
  const onDismiss = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders the Leave a Tip link when open", () => {
    renderWithContext(TipJarModal, { isOpen: true, onClose, onDismiss });
    expect(screen.getByText("Leave a Tip")).toBeInTheDocument();
  });

  it("does not render content when closed", () => {
    renderWithContext(TipJarModal, { isOpen: false, onClose, onDismiss });
    expect(screen.queryByText("Leave a Tip")).not.toBeInTheDocument();
  });

  it("calls onDismiss when Leave a Tip is clicked", async () => {
    renderWithContext(TipJarModal, { isOpen: true, onClose, onDismiss });
    await clickByText("Leave a Tip");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when Don't show again is clicked", async () => {
    renderWithContext(TipJarModal, { isOpen: true, onClose, onDismiss });
    await clickByText("Don't show again");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", async () => {
    renderWithContext(TipJarModal, { isOpen: true, onClose, onDismiss });
    await clickByText("close_icon", 0, true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when Leave a Tip is clicked", async () => {
    renderWithContext(TipJarModal, { isOpen: true, onClose, onDismiss });
    await clickByText("Leave a Tip");
    expect(onClose).not.toHaveBeenCalled();
  });
});
