/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from '../Header';
import { BrowserRouter } from 'react-router-dom';

// Mock the ThemeToggle component as it's not relevant to this test
jest.mock('../ThemeToggle', () => () => <div data-testid="theme-toggle-mock">ThemeToggleMock</div>);

const mockUser = {
  id: 'user1',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@test.com',
  telefono: '123456789',
  direccion: 'Calle Test 123',
  fecha_registro: '2024-01-01',
  plan: 'premium' as const,
  limite_mascotas: 5
};

describe('Header Component', () => {
  it('renders without crashing', () => {
    const mockOnMenuClick = jest.fn();
    render(
      <BrowserRouter>
        <Header user={mockUser} onMenuClick={mockOnMenuClick} />
      </BrowserRouter>
    );
    expect(screen.getByTestId('theme-toggle-mock')).toBeInTheDocument();
  });

  it('renders with null user', () => {
    const mockOnMenuClick = jest.fn();
    render(
      <BrowserRouter>
        <Header user={null} onMenuClick={mockOnMenuClick} />
      </BrowserRouter>
    );
    expect(screen.getByTestId('theme-toggle-mock')).toBeInTheDocument();
  });
});
