import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../src/app/login/page';
import '@testing-library/jest-dom';


// Mock de NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe('Login Component', () => {
  it('renders login button when user is not authenticated', () => {

    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({ data: null });

    render(<Login />);

    const loginButton = screen.getByText(/Se connecter avec GitHub/i);
    expect(loginButton).toBeInTheDocument();
  });

  it('renders user info and sign out button when user is authenticated', () => {
    const useSessionMock = require('next-auth/react').useSession;
    useSessionMock.mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          image: 'https://example.com/john.jpg',
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
    const signInMock = require('next-auth/react').signIn;
    const useSessionMock = require('next-auth/react').useSession;

    useSessionMock.mockReturnValue({ data: null });

    render(<Login />);

    const loginButton = screen.getByText(/Se connecter avec GitHub/i);
    fireEvent.click(loginButton);

    expect(signInMock).toHaveBeenCalledWith('github');
  });

  it('calls signOut when clicking "Se déconnecter"', () => {
    const signOutMock = require('next-auth/react').signOut;
    const useSessionMock = require('next-auth/react').useSession;

    useSessionMock.mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          image: 'https://example.com/john.jpg',
        },
      },
    });

    render(<Login />);

    const signOutButton = screen.getByText(/Se déconnecter/i);
    fireEvent.click(signOutButton);

    expect(signOutMock).toHaveBeenCalled();
  });
});
