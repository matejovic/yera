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
					YR 24
					{/* <img src="/logo.svg" alt="Web Reader" /> */}
				</a>
			</div>
			<nav>
			<a href="/" class={url == '/' && 'active'}>
					Hi
				</a>
				
				<a href="/write" class={url == '/write' && 'active'}>
					Thesis
				</a>
				
				<a href="/resources" class={url == '/resources' && 'active'}>
					Resources
				</a>
				
				{/* <a href="/data" class={url == '/data' && 'active'}>Data</a> */}
				{/* <a href="/stream" class={url == '/stream' && 'active'}>Stream</a> */}
				{/* <a href="/advent" class={url == '/advent' && 'active'}>Time</a> */}
				
				{props.profile.id && <a href="/profile">Profile {props.profile.id}</a>}
				{props.profile.id && <a href="/logout">Log out</a>}
				{!props.profile.id && <a href="/login" class={url == '/login' && 'active'}>Log in</a>}
				{!props.profile.id && <a href="/register" class={url == '/register' && 'active'}>Register</a>}

			</nav>
		</header>
	);
}
