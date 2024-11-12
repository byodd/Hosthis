import Header from '@/app/components/Header';
import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));
jest.mock('next/link', () => ({ children }) => <a>{children}</a>);
jest.mock('next/image', () => () => <img alt="test"/>);

describe('Header', () => {
  it('should display the login button when there is no session and not loading', async () => {
    useSession.mockReturnValue({ data: null });
    render(<Header />);
    await waitFor(() => expect(screen.getByText("S'inscrire/se connecter")).toBeInTheDocument());
  });

  it('should display user information when there is a session and not loading', async () => {
    useSession.mockReturnValue({
      data: { user: { name: 'John Doe', image: 'test-image.jpg' } }
    });
    render(<Header />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByAltText('Mon compte')).toBeInTheDocument();
    });
  });

  it('should not display anything when still loading', async () => {
    useSession.mockReturnValue(undefined);
    const { container } = render(<Header />);
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
});
