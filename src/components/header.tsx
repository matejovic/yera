import { useLocation } from "preact-iso";

interface Props {
  profile: {
    id: number;
  };
}

export function Header(props: Props) {
  const { url } = useLocation();
  return (
    <header>
      <div className="logo">
	 <a href="/stack" class={url == "/stack" && "active"}>
          <b>Y</b>era Feb
        </a>
       </div>
      <nav>
        {props.profile?.id && (
          <>
             <a href="/time" class={url === "/time" && "active"}>
                  Track
                </a>
            <a href="/profile" class={url === '/profile' && 'active'}>profile</a>
            <a href="/logout">out</a>
          </>
        )}
      </nav>
    </header>
  );
}
