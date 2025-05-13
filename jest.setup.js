// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
    style: { fontFamily: "Geist" },
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
    style: { fontFamily: "Geist Mono" },
  }),
}));
