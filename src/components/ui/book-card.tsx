import type { Book } from '@/db/books';

export function BookCard({ book }: { book: Book }) {
  return (
    <li className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <img
        src={book.cover || '/placeholder.svg'}
        alt={book.title}
        width={300}
        height={400}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
        <p className="text-gray-400 mb-2">{book.author}</p>
        <p className="text-gray-500">{book.year}</p>
      </div>
    </li>
  );
}
