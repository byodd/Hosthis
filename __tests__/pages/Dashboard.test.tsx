import { render, screen } from "@testing-library/react";
import Dashboard from "@/app/dashboard/page";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || ""} />,
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        name: "Test User",
        image: "test.jpg",
        username: "testuser",
        email: "test@example.com",
      },
      status: "authenticated",
    },
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const customRender = (ui: React.ReactElement) => {
  return render(
    <SessionProvider
      session={
        {
          user: {
            name: "Test User",
            image: "test.jpg",
            username: "testuser",
            email: "test@example.com",
          },
          expires: "1",
        } as any
      } // <-- Added `as any` to bypass TypeScript issues
    >
      {ui}
    </SessionProvider>
  );
};

describe("Dashboard Page", () => {
  it("renders user info when authenticated", async () => {
    customRender(<Dashboard />);
    expect(await screen.findByText(/Bonjour/)).toBeInTheDocument(); 
    expect(await screen.findByText("Test User")).toBeInTheDocument();
  });

  it("shows no projects message when list is empty", async () => {
    customRender(<Dashboard />);
    expect(
      await screen.findByText("😞 Pas de projets publiques trouvés")
    ).toBeInTheDocument(); 
  });
});
