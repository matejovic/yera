import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<div className="logo">
				<a href="/">
					WebReader
					{/* <img src="/logo.svg" alt="Web Reader" /> */}
				</a>
			</div>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				<a href="/404" class={url == '/404' && 'active'}>
					404
				</a>
			</nav>
		</header>
	);
}
