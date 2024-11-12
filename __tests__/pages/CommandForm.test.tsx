import { render, screen, fireEvent } from "@testing-library/react";
import CommandForm from "@/app/components/project/CommandForm";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";

// Mock Next.js app router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: { 
      user: { 
        name: "Test User",
        email: "test@example.com" 
      },
      status: "authenticated"
    },
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockProject = {
  id: "1",
  name: "test-project",
  description: "Test project",
  html_url: "https://github.com/test/test-project",
};

const customRender = (ui: React.ReactElement) => {
  return render(
    <SessionProvider session={{
      user: { 
        id: "1",
        username: "testuser",
        name: "Test User",
        email: "test@example.com"
      },
      expires: "1"
    }}>
      {ui}
    </SessionProvider>
  );
};

describe("CommandForm", () => {
  it("renders all form inputs and button", () => {
    customRender(<CommandForm project={mockProject} />);

    expect(screen.getByPlaceholderText("npm install")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("npm run build")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("npm run start")).toBeInTheDocument();
    expect(screen.getByText("Créer le projet")).toBeInTheDocument();
  });

  it("updates input values when typing", () => {
    customRender(<CommandForm project={mockProject} />);

    const installInput = screen.getByPlaceholderText("npm install");
    fireEvent.change(installInput, { target: { value: "yarn install" } });
    expect(installInput).toHaveValue("yarn install");
  });

  it("disables submit button when inputs are empty", () => {
    customRender(<CommandForm project={mockProject} />);

    const submitButton = screen.getByText("Créer le projet");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when all inputs have values", () => {
    customRender(<CommandForm project={mockProject} />);

    const installInput = screen.getByPlaceholderText("npm install");
    const buildInput = screen.getByPlaceholderText("npm run build");
    const startInput = screen.getByPlaceholderText("npm run start");

    fireEvent.change(installInput, { target: { value: "yarn install" } });
    fireEvent.change(buildInput, { target: { value: "yarn build" } });
    fireEvent.change(startInput, { target: { value: "yarn start" } });

    const submitButton = screen.getByText("Créer le projet");
    expect(submitButton).not.toBeDisabled();
  });
});
