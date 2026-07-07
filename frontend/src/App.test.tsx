import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders movie game title', () => {
  render(<App />);
  const linkElement = screen.getByText(/movie game/i);
  expect(linkElement).toBeInTheDocument();
});
