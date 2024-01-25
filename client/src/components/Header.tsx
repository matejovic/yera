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
				infra
					{/* <img src="/logo.svg" alt="Web Reader" /> */}
				</a>
			</div>
			<nav>
			<a href="/" class={url == '/' && 'active'}>
					a
				</a>
					
				<a href="/thesis" class={url == '/thesis' && 'active'}>
					text
				</a>

				<a href="/resources" class={url == '/resources' && 'active'}>
					http
				</a>
							
				{props.profile?.id && <a href="/profile">id: {props.profile.id}</a>}
				{props.profile?.id && <a href="/logout">out</a>}
				{!props.profile?.id && <a href="/auth" class={url == '/auth' && 'active'}>auth</a>}

			</nav>
		</header>
	);
}
