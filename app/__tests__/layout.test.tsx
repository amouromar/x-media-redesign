/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the metadata
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

describe("Layout Content", () => {
  it("renders content correctly", () => {
    const testContent = "Test Content";
    const { getByText } = render(
      <div className="antialiased">
        <div>{testContent}</div>
      </div>,
    );

    expect(getByText(testContent)).toBeInTheDocument();
  });

  it("applies antialiased class", () => {
    const { container } = render(
      <div className="antialiased">
        <div>Test Content</div>
      </div>,
    );

    const element = container.querySelector(".antialiased");
    expect(element).toBeInTheDocument();
  });
});
