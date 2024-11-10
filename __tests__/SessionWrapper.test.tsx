import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import SessionWrapper from '../src/app/components/SessionWrapper'; 

jest.mock("next-auth/react", () => ({
  SessionProvider: ({children}: {children: React.ReactNode}) => <div data-testid="mock-session-provider">{children}</div>
}));

describe('SessionWrapper Component', () => {
  it('should wrap children with SessionProvider', () => {
    const { getByTestId } = render(
      <SessionWrapper>
        <div>test content</div>
      </SessionWrapper>
    );
    const sessionProvider = getByTestId('mock-session-provider');
    expect(sessionProvider).toHaveTextContent('test content');
  });
});
