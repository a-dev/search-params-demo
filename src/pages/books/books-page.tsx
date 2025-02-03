import { CircleChevronLeft, Eraser } from 'lucide-react';
import { NavLink } from 'react-router';

import { BookCard } from '@/components/ui/book-card';
import type { Book } from '@/db/books';

import { useGetBooksFilter, useUpdateBooksFilter } from './use-filter-books';

export function BooksPage({ books }: { books: Book[] }) {
  const { search = '', years, page } = useGetBooksFilter();
  const updateFilter = useUpdateBooksFilter();

  const filteredBooks = books?.filter((book) => {
    const matchesSearch =
      !search?.length ||
      book.title.toLowerCase().includes(search.toLowerCase());
    const matchesYear = !years?.length || years.includes(book.year.toString());
    return matchesSearch && matchesYear;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center gap-8 mb-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-amber-500 -ml-2"
        >
          <CircleChevronLeft />
          {'back'}
        </NavLink>
        <h1 className="text-4xl font-bold">Books</h1>
      </div>

      <div className="mb-8 space-x-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by title"
            className="bg-gray-800 text-white px-4 py-2 rounded-md w-64 placeholder:text-gray-600"
            value={search}
            onChange={(e) => updateFilter({ search: e.target.value })}
          />
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer disabled:opacity-20 disabled:pointer-events-none ml-auto"
            onClick={() =>
              updateFilter({ years: [], search: undefined, page: '1' })
            }
            disabled={!years?.length && !search}
          >
            <Eraser />
            Clear
          </button>
        </div>
        <div className="mt-4">
          {Array.from(new Set(books.map((book) => book.year)))
            .sort()
            .map((year) => (
              <label key={year} className="mr-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="year"
                  id={`year-${year}`}
                  value={year?.toString()}
                  checked={years?.includes(year?.toString()) ?? false}
                  className="hidden peer"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    const updatedYears = isChecked
                      ? [...(years ?? []), value]
                      : (years?.filter((y) => y !== value) ?? []);
                    updateFilter({
                      years: updatedYears,
                    });
                  }}
                />
                <span className="ml-1 p-1 pl-4 pr-4 rounded-lg bg-orange-900 peer-checked:bg-orange-600">
                  {year}
                </span>
              </label>
            ))}
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </ul>

      <ul className="flex justify-center mt-8 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-white cursor-pointer transition-all ${
                page === String(i + 1)
                  ? 'pointer-events-none bg-gray-800'
                  : 'bg-gray-700 hover:bg-gray-500'
              }`}
              onClick={() => updateFilter({ page: String(i + 1) })}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
