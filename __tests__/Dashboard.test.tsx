// Importations nécessaires pour le test
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '@/app/dashboard/page';
import { fetchGitHubProjects } from '@/app/services/project.service';
import { useSession } from 'next-auth/react';
import { getUsernameFromEmail } from '@/app/services/users.service';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({ data: null })
}));

jest.mock('../src/app/services/project.service', () => ({
  fetchGitHubProjects: jest.fn().mockReturnValue({ data: null })
}));

jest.mock('../src/app/services/users.service', () => ({
  getUsernameFromEmail: jest.fn().mockReturnValue({ data: null })
}));

jest.mock('next/image')


describe('Dashboard', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should display loading initially', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null }); 
    render(<Dashboard />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('should display sign in button when no session', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Dashboard />);
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should display error message if there is an error', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { email: 'test@example.com' } } });
    (fetchGitHubProjects as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    render(<Dashboard />);
    expect(await screen.findByText('❌La récupération des projets GitHub a échoué')).toBeInTheDocument();
  });

  it('should display content when session exists and data is loaded', () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { email: 'user@example.com', name: 'Test User', image: 'test-image.jpg' } } });
    (fetchGitHubProjects as jest.Mock).mockResolvedValue([{ id: 1, name: 'Test Project' }]);
    (getUsernameFromEmail as jest.Mock).mockResolvedValue('testuser');
    render(<Dashboard />);
    expect(screen.getByText('Bonjour Test User, quel projet souhaite-tu héberger aujourd\'hui ?')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });
});
