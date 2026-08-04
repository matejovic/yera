import { useLocation } from "preact-iso";

interface Props {
  profile: {
    id: number;
  };
}

export function Header() {
  const { url } = useLocation();

  return (
    <header>
      <div className="logo">
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-color)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "#ffffff",
              fontSize: "0.95rem",
              fontWeight: "bold",
            }}
          >
            Y
          </span>
          <span>Yera</span>
        </a>
      </div>
      <nav>
        <a href="/stack" class={url === "/stack" ? "active" : ""}>
          Stack
        </a>
        <a href="/time" class={url === "/time" ? "active" : ""}>
          Timer
        </a>
        <a href="/stream" class={url === "/stream" ? "active" : ""}>
          Stream
        </a>
        <a href="/profile" class={url === "/profile" ? "active" : ""}>
          Profile
        </a>
        <a href="/" class={url === "/" ? "active" : ""}>
          Config
        </a>
      </nav>
    </header>
  );
}
