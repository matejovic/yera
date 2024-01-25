import { useLocation } from 'preact-iso';

interface Props {
	profile: {
		id: number;
		username: string;
	}
}

export function Header(props: Props) {
	const { url } = useLocation();
	return (
		<header>
			<div className="logo">
				<a href="/">
					Intranet
					{/* <img src="/logo.svg" alt="Web Reader" /> */}
				</a>
			</div>
			<nav>
			<a href="/" class={url == '/' && 'active'}>
					a
				</a>
				
				<a href="/resources" class={url == '/resources' && 'active'}>
					http
				</a>
				
				<a href="/thesis" class={url == '/thesis' && 'active'}>
					text
				</a>
				
				{props.profile.id && <a href="/profile">id: {props.profile.id}</a>}
				{props.profile.id && <a href="/logout">out</a>}
				{!props.profile.id && <a href="/register" class={url == '/register' && 'active'}>join</a>}

				{!props.profile.id && <a href="/login" class={url == '/login' && 'active'}>us</a>}
			</nav>
		</header>
	);
}
