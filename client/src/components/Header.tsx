import { useLocation } from 'preact-iso';

interface Props {
	profile: {
		id: number;
		username: string;
	}
}

export function Header(props: Props) {
	const { url } = useLocation();
	console.log('HEADER', props.profile)

	return (
		<header>
			<div className="logo">
				<a href="/">
					Oh My Reads
					{/* <img src="/logo.svg" alt="Web Reader" /> */}
				</a>
			</div>
			<nav>
			<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				<a href="/reader" class={url == '/reader' && 'active'}>
					Reader
				</a>


				{props.profile.id && <a href="/profile">Profile {props.profile.id}</a>}
				{props.profile.id && <a href="/logout">Log out</a>}
				{!props.profile.id && <a href="/login" class={url == '/login' && 'active'}>Log in</a>}
				{!props.profile.id && <a href="/register" class={url == '/register' && 'active'}>Register</a>}

			</nav>
		</header>
	);
}
