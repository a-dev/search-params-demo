import { describe, expect, it } from 'vitest';

import { render } from 'vitest-browser-react';

import { BookCard } from './book-card';

import { books } from '@/db/books';

describe('book card', () => {
  it('should render the card with content from db', async () => {
    const screen = render(<BookCard book={books[0]} />);
    await expect
      .element(screen.getByRole('heading', { name: books[0].title }))
      .toBeVisible();
    await expect.element(screen.getByText(books[0].author)).toBeVisible();
    await expect.element(screen.getByText(String(books[0].year))).toBeVisible();
    await expect
      .element(screen.getByRole('img'))
      .toHaveAttribute('src', books[0].cover);
  });
});
