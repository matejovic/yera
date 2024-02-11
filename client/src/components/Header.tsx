import { useLocation } from "preact-iso";

interface Props {
  profile: {
    id: number;
    username: string;
  };
}

export function Header(props: Props) {
  const { url } = useLocation();
  return (
    <header>
      <div className="logo">
        <a href="/" class={url == "/" && "active"}>
          <b>Y</b>era
          {/* <img src="/logo.svg" alt="Web Reader" /> */}
        </a>
      </div>
      <nav>
        {/* <a href="/" class={url == "/" && "active"}>
          re
        </a> */}

        <a href="/resources" class={url == "/resources" && "active"}>
          Resources
        </a>

        <a href="/research" class={url == "/research" && "active"}>
          Research
        </a>

        <a href="/time" class={url === "/time" && "active"}>
          Rest
        </a>

        {!props.profile?.id && (
          <>
            <a href="/login" class={url == "/login" && "active"}>
              Join Us
            </a>
          </>
        )}
        {props.profile?.id && <a href="/profile">id: {props.profile.id}</a>}
        {props.profile?.id && <a href="/logout">out</a>}
      </nav>
    </header>
  );
}
