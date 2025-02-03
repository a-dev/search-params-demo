'use client';
import type { Route } from './+types/books';

import { books } from '@/db/books';
import { BooksPage } from '@/pages/books/books-page';

import { BooksFilterProvider } from '@/pages/books/use-filter-books';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Books with filter' },
		{ name: 'description', content: 'Welcome to search params demo' },
	];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	await new Promise((resolve) => setTimeout(resolve, 1));
	return books;
}

export default function Books({ loaderData }: Route.ComponentProps) {
	return (
		<BooksFilterProvider>
			<BooksPage books={loaderData} />
		</BooksFilterProvider>
	);
}
