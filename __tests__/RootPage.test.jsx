import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img alt={props.alt || ""} {...props} />,
}));

jest.mock("../src/app/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));

describe("Home Page", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("renders all required components and text", () => {
    // Check header and image
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByAltText("Planet")).toBeInTheDocument();

    // Check all text content
    const texts = [
      /Hébergez vos sites webs en un clic/i,
      /\(ou presque\)/i,
      /Que vous souhaitiez lancer un blog/i,
    ];
    texts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    // Check responsive classes
    expect(
      document.querySelector(".flex.flex-col-reverse.md\\:flex-row")
    ).toBeInTheDocument();
  });
});
