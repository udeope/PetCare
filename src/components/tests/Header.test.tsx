import { render, screen } from '@testing-library/react';
import Header from '../Header'; // Adjust the import path if necessary
import { BrowserRouter } from 'react-router-dom';

// Mock the ThemeToggle component as it's not relevant to this test
jest.mock('../ThemeToggle', () => () => <div data-testid="theme-toggle-mock">ThemeToggleMock</div>);

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    // Check if some element that is expected to be in the Header is rendered
    // For example, if your Header has a title or a specific text element:
    // expect(screen.getByText(/your header text/i)).toBeInTheDocument();
    // For now, let's just check if the mock is there or a known element
    expect(screen.getByTestId('theme-toggle-mock')).toBeInTheDocument();
  });
});
