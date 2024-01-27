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
        <a href="/">
          Yera
          {/* <img src="/logo.svg" alt="Web Reader" /> */}
        </a>
      </div>
      <nav>
        <a href="/" class={url == "/" && "active"}>
          Overview
        </a>

        {props.profile?.id && <a href="/thesis" class={url == "/thesis" && "active"}>
          Research
        </a>}

        {props.profile?.id && <a href="/resources" class={url == "/resources" && "active"}>
          Resources
        </a>}

        {!props.profile?.id && (
          <a href="/auth" class={url == "/auth" && "active"}>
            Join
          </a>
        )}
        {props.profile?.id && <a href="/profile">id: {props.profile.id}</a>}
        {props.profile?.id && <a href="/logout">out</a>}
      </nav>
    </header>
  );
}
