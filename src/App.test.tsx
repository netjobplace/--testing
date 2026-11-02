import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('saves the time input using the current timestamp as the key', () => {
  const now = jest.spyOn(Date, 'now').mockReturnValue(123456);
  render(<App />);

  fireEvent.change(screen.getByLabelText(/time to save/i), {
    target: { value: 'Meeting notes' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save time/i }));

  expect(JSON.parse(localStorage.getItem('times') ?? '{}')).toEqual({
    '123456': 'Meeting notes',
  });
  expect(screen.getByText('123456: Meeting notes')).toBeInTheDocument();
  now.mockRestore();
});
