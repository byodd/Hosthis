import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../src/app/components/Header';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

describe('Header Component', () => {
  it('renders the logo and the signup/login link when user is not authenticated', () => {
    useSession.mockReturnValue({ data: null }); 

    render(<Header />);

    const logoImage = screen.getByAltText('Web');
    expect(logoImage).toBeInTheDocument();

    const loginLink = screen.getByText(/S'inscrire\/se connecter/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('renders user, dashboard and logout links when user is authenticated', () => {
    useSession.mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          image: 'https://example.com/john.jpg',
        },
      },
    });

    render(<Header />);

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();

    const userImage = screen.getByAltText('Mon compte');
    expect(userImage).toBeInTheDocument();
  });
});
