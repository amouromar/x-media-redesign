import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    const mainElement = screen.getByText("X VOICES");
    expect(mainElement).toBeInTheDocument();
  });

  it("renders the footer with author name", () => {
    render(<Home />);
    const footerText = screen.getByText("Made by Amour Omar");
    expect(footerText).toBeInTheDocument();
  });

  it("has the correct layout structure", () => {
    render(<Home />);
    const mainContent = screen.getByRole("main");
    expect(mainContent).toHaveClass(
      "flex",
      "flex-col",
      "gap-[32px]",
      "row-start-2",
    );
  });
});
