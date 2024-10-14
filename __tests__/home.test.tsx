import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SessionProvider } from 'next-auth/react';
import Home from '../src/app/page';
import { Session } from 'next-auth';

// Typage du mockSession
const mockSession: Session = {
  expires: '1',
  user: {
    email: 'user@example.com',
    name: 'John Doe',
    image: 'https://example.com/john.jpg',
  },
};

describe('Home Page', () => {
  it('renders the main heading and description', () => {
    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>
    );

    const heading = screen.getByText(/Hébergez vos sites webs en un clic/i);
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(/Que vous souhaitiez lancer un blog, une portfolio ou une application révolutionnaire/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the planet image correctly', () => {
    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>
    );

    const planetImage = screen.getByAltText('Planet');
    expect(planetImage).toBeInTheDocument();
  });
});
