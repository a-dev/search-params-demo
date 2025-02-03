import { page } from '@vitest/browser/context';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { BooksFilterProvider } from '@/pages/books/use-filter-books';
import { BooksPage } from './books-page';

import { books } from '@/db/books';

describe('books page', () => {
  beforeEach(() => {
    render(
      <BooksFilterProvider>
        <BooksPage books={books} />
      </BooksFilterProvider>,
      {
        wrapper: ({ children }) => {
          return (
            <MemoryRouter initialEntries={['/books']}>{children}</MemoryRouter>
          );
        },
      },
    );
  });

  it('should render the page with all books on it', async () => {
    await expect
      .element(page.getByRole('heading', { name: 'Books' }))
      .toBeVisible();
    expect(page.getByRole('listitem').all()).toHaveLength(books.length);
  });

  it('should filter books by year', async () => {
    const bookIdx = 3;
    const yearCheckbox = page.getByRole('checkbox', {
      name: String(books[bookIdx].year),
    });
    await yearCheckbox.click();

    expect(page.getByRole('listitem').all()).toHaveLength(
      books.filter((book) => book.year === books[bookIdx].year).length,
    );

    await expect
      .element(page.getByRole('checkbox', { name: String(books[0].year) }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Clear' }).click();
    expect(page.getByRole('listitem').all()).toHaveLength(books.length);
  });

  it('should filter books by title', async () => {
    const searchInput = page.getByPlaceholder('Search by title');

    await searchInput.fill('hobbit');
    expect(page.getByRole('listitem').all()).toHaveLength(1);
    await expect
      .element(page.getByRole('heading', { name: 'The Hobbit' }))
      .toBeVisible();

    await page.getByRole('button', { name: 'Clear' }).click();
    expect(page.getByRole('listitem').all()).toHaveLength(books.length);
    await expect.element(searchInput).toHaveValue('');
  });
});
