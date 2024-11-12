import { SessionProvider } from "next-auth/react";
import CommandForm from '@/app/components/project/CommandForm';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Session } from 'next-auth';

const mockSession: Session = {
    expires: '1',
    user: {
      id: 'user@example.com',
      username: 'John Doe',
    },
  };
  const project = {
    id :"1",
    name: "Example Project",
    html_url: "http://example.com"
  };

describe('CommandForm', () => {
  it('renders correctly and allows input', () => {
    render(
        <SessionProvider session={mockSession}>
          <CommandForm project={project}/>
        </SessionProvider>
      );

    // Vérifie que le texte est rendu
    expect(screen.getByText(/tu veux héberger/i)).toBeInTheDocument();
    expect(screen.getByText("Example Project")).toBeInTheDocument();

    // Obtient les champs d'input et simule des entrées utilisateur
    const installInput = screen.getByPlaceholderText('npm install') as HTMLInputElement;
    const buildInput = screen.getByPlaceholderText('npm run build') as HTMLInputElement;
    const launchInput = screen.getByPlaceholderText('npm start') as HTMLInputElement ;

    // Simule l'écriture dans les champs d'input
    fireEvent.change(installInput, { target: { value: 'npm install' } });
    fireEvent.change(buildInput, { target: { value: 'npm run build' } });
    fireEvent.change(launchInput, { target: { value: 'npm start' } });

    expect(installInput.value).toBe('npm install');
    expect(buildInput.value).toBe('npm run build');
    expect(launchInput.value).toBe('npm start');
  });
});
