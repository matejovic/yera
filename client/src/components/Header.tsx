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
              Read
            </a>

            <a href="/research" class={url == "/research" && "active"}>
              Write
            </a>

            <a href="/time" class={url === "/time" && "active"}>
              Track
            </a>


            <a href="/profile">M40{props.profile.id}</a>
            <a href="/logout">out</a>
          </>
        )}
      </nav>
    </header>
  );
}
