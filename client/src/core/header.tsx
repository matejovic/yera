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
        <a href="/" class={url == "/" && "active"}>
          <b>Y</b>era
        </a>
      </div>
      <nav>
        {!props.profile?.id && (
          <>
            <a href="/auth" class={url == "/auth" && "active"}>
              auth
            </a>
          </>
        )}
        {props.profile?.id && (
          <>
            <a href="/resources" class={url == "/resources" && "active"}>
              {/* In future will become Resources as we add more formats */}
                Tags
            </a>
            <a href="/blocks" class={url == "/blocks" && "active"}>
              {/* In future will become researcher as well as publisher */}
              Blocks
            </a>
            {/**
                <a href="/time" class={url === "/time" && "active"}>
                  Track
                </a>
              **/}   
            <a href="/profile">id:{props.profile.id}</a>
            <a href="/logout">out</a>
          </>
        )}
      </nav>
    </header>
  );
}
