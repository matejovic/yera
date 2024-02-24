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
          <b>Y</b>usbera 
        </a>
       </div>
      <nav>
      </nav>
    </header>
  );
}
