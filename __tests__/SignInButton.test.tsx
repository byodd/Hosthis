import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signIn } from 'next-auth/react';
import SignInButton from '@/app/components/SignInButton';

// Mock de la fonction signIn
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SignInButton Component', () => {
  test('calls signIn with "github" when clicked', () => {
    render(<SignInButton
     />);
    const button = screen.getByRole('button', { name: /se connecter avec GitHub/i });
    fireEvent.click(button);
    expect(signIn).toHaveBeenCalledWith('github');
  });
});
