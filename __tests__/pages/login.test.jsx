import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../src/app/login/page";
import "@testing-library/jest-dom";
import { useSession, signIn, signOut } from "next-auth/react";

// Mock de NextAuth
jest.mock("next-auth/react");

describe("Login Component", () => {
  it("renders login button when user is not authenticated", () => {
    useSession.mockReturnValue({ data: null });

    render(<Login />);

    const loginButton = screen.getByText(/Se connecter avec GitHub/i);
    expect(loginButton).toBeInTheDocument();
  });

  it("renders user info and sign out button when user is authenticated", () => {
    useSession.mockReturnValue({
      data: {
        user: {
          name: "John Doe",
          email: "john@example.com",
          image: "https://example.com/john.jpg",
        },
      },
    });

    render(<Login />);

    const welcomeMessage = screen.getByText(/Bienvenue/i);
    expect(welcomeMessage).toBeInTheDocument();

    const userEmail = screen.getByText(/john@example.com/i);
    expect(userEmail).toBeInTheDocument();

    const signOutButton = screen.getByText(/Se déconnecter/i);
    expect(signOutButton).toBeInTheDocument();
  });

  it('calls signIn when clicking "Se connecter avec GitHub"', () => {
    useSession.mockReturnValue({ data: null });

    render(<Login />);

    const loginButton = screen.getByText(/Se connecter avec GitHub/i);
    fireEvent.click(loginButton);

    expect(signIn).toHaveBeenCalledWith("github");
  });

  it('calls signOut when clicking "Se déconnecter"', () => {
    useSession.mockReturnValue({
      data: {
        user: {
          name: "John Doe",
          email: "john@example.com",
          image: "https://example.com/john.jpg",
        },
      },
    });

    render(<Login />);

    const signOutButton = screen.getByText(/Se déconnecter/i);
    fireEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalled();
  });
});
