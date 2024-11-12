import CommandForm from '@/app/components/project/CommandForm';
import { createProject } from '@/app/services/project.service';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {userEvent} from '@testing-library/user-event'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('../../services/project.service', () => ({
  createProject: jest.fn()
}));

describe('CommandForm', () => {
  const mockProject = {
    id:"1",
    name: "Test Project",
    html_url: "http://github.com/test/project"
  };

  beforeEach(() => {
    useSession.mockReturnValue({ data: { user: { email: 'test@example.com' } } });
    useRouter.mockReturnValue({ push: jest.fn() });
    createProject.mockResolvedValue();
  });

  it('renders the form with empty fields', () => {
    render(<CommandForm project={mockProject} />);
    expect(screen.getByPlaceholderText('npm install')).toHaveValue('');
    expect(screen.getByPlaceholderText('npm run build')).toHaveValue('');
    expect(screen.getByPlaceholderText('npm run start')).toHaveValue('');
  });

  it('allows input and submits the form', () => {
    render(<CommandForm project={mockProject} />);

    userEvent.type(screen.getByPlaceholderText('npm install'), 'npm install');
    userEvent.type(screen.getByPlaceholderText('npm run build'), 'npm run build');
    userEvent.type(screen.getByPlaceholderText('npm run start'), 'npm start');
    fireEvent.click(screen.getByText('Créer le projet'));

    expect(createProject).toHaveBeenCalledWith(
      mockProject.html_url,
      'npm install',
      'npm run build',
      'npm start',
      'test@example.com'
    );
  });
});

