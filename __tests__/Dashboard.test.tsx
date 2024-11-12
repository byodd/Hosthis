
import Dashboard from '@/app/dashboard/page';
import { fetchGitHubProjects } from '@/app/services/project.service';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({useSession: jest.fn()}));

jest.mock('../services/project.service', () => ({
    fetchGitHubProjects: jest.fn()
  }));
  jest.mock('next/link');
  jest.mock('next/image')
  jest.mock('../src/app/components/Header', () => () => <header />);
  jest.mock('../src/app/components/SignInButton', () => () => <button>Sign In</button>);


describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display sign in button when no session', () => {
    useSession.mockReturnValue({ data: null });
    render(<Dashboard />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should display user greeting and projects when session exists', () => {
    useSession.mockReturnValue({
      data: { session: { user: { name: 'John Doe', username: 'johndoe', image: 'url-to-image' } } }
    });
    fetchGitHubProjects.mockResolvedValue([
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' }
    ]);

    render(<Dashboard />);
    expect(screen.getByText('Bonjour John Doe, quel projet souhaite-tu héberger aujourd\'hui ?')).toBeInTheDocument();
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });
});

  