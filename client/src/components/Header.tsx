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
					24 Demo of YERA
					{/* <img src="/logo.svg" alt="Web Reader" /> */}
				</a>
			</div>
			<nav>
			<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				
				<a href="/resources" class={url == '/resources' && 'active'}>
					Resources
				</a>
				
				<a href="/thesis" class={url == '/thesis' && 'active'}>
					Thesis
				</a>
				
				{props.profile.id && <a href="/profile">Profile {props.profile.id}</a>}
				{props.profile.id && <a href="/logout">Out</a>}
				{!props.profile.id && <a href="/login" class={url == '/login' && 'active'}>In</a>}
				{!props.profile.id && <a href="/register" class={url == '/register' && 'active'}>Join</a>}

			</nav>
		</header>
	);
}
