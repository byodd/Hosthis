import { render } from "@testing-library/react";
import RootLayout from "@/app/layout";
import "@testing-library/jest-dom";

// Mock SessionWrapper
jest.mock("../../src/app/components/SessionWrapper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-wrapper">{children}</div>
  ),
}));

// Mock next/font
jest.mock("next/font/google", () => ({
  Outfit: () => ({
    className: "outfit-font",
    subsets: ["latin"],
  }),
}));

describe("RootLayout", () => {
  it("renders children within SessionWrapper", () => {
    const { getByTestId } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(getByTestId("session-wrapper")).toBeInTheDocument();
  });

  it("applies correct font class", () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const html = container.querySelector("html");
    expect(html).toHaveClass("outfit-font");
  });

  it("has correct language attribute", () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const html = container.querySelector("html");
    expect(html).toHaveAttribute("lang", "fr");
  });

  it("renders body with correct classes", () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const body = container.querySelector("body");
    expect(body).toHaveClass("text-[#023246]", "p-10", "h-screen", "w-screen");
  });
});
