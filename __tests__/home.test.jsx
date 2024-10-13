import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';
import '@testing-library/jest-dom';

describe('Home Page', () => {
  it('renders the logo and title correctly', () => {
    render(<Home />);
    
    const logo = screen.getByAltText('Web');
    expect(logo).toBeInTheDocument();

    const title = screen.getByText(/Host/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the call to action button with correct text', () => {
    render(<Home />);
    
    const button = screen.getByText(/S'inscrire\/se connecter/i);
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute('href', '/login'); // Ensure it points to the correct link
  });

  it('renders the main heading and description', () => {
    render(<Home />);
    
    const heading = screen.getByText(/Hébergez vos sites webs en un clic/i);
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(/Que vous souhaitiez lancer un blog/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the planet image correctly', () => {
    render(<Home />);
    
    const planetImage = screen.getByAltText('Planet');
    expect(planetImage).toBeInTheDocument();
  });
});
