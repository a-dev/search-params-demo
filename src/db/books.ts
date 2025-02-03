export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  cover?: string;
}
// credit: v0
export const books: Book[] = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    year: 1949,
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
  },
  {
    id: 5,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    year: 1951,
  },
  {
    id: 6,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
  },
  {
    id: 7,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    year: 1932,
  },
  {
    id: 8,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    year: 1954,
  },
  {
    id: 9,
    title: 'To the Lighthouse',
    author: 'Virginia Woolf',
    year: 1927,
  },
  {
    id: 10,
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    year: 2008,
  },
  {
    id: 11,
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    year: 2003,
  },
  {
    id: 12,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    year: 1988,
  },
];
