import type { Route } from './+types/home';

import { NavLink } from 'react-router';
import { BackgroundPaths } from '../../components/ui/background-paths';
export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Search params demo' },
		{ name: 'description', content: 'Welcome to search params demo' },
	];
}

export default function Home() {
	return (
		<BackgroundPaths>
			<NavLink
				to="/books"
				type="button"
				className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100
                            text-black dark:text-white transition-all duration-300
                            group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
			>
				<span className="opacity-90 group-hover:opacity-100 transition-opacity">
					Go to demo
				</span>
				<span
					className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5
                                transition-all duration-300"
				>
					→
				</span>
			</NavLink>
		</BackgroundPaths>
	);
}
