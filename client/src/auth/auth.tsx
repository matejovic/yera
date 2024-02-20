import { useLocation } from "preact-iso";
import { useState } from "preact/hooks";
import { api_post } from "../core/globals.tsx";

interface Props {
  profile: {
    id: number;
    email: string;
  };
}

export function Auth(props: Props) {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (props.profile?.id) {
    location.route("/resources");
  }

  return (
    <div class="page">
      <div class="block">
        <h2>Authenticate here</h2>

        <p>
          We expect the next release in March and explore the options for uptime
          guarantees from there.{" "}
        </p>

        <p>The form below can log you in, or register.</p>

        {errors.length > 0 && (
          <div className="form-errors">
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const response = api_post("/auth/token", { email, password })
              .then((response) => response.json)
              .then((data) => {
                // todo: validate data.token
                setErrors([]);
                window.location = "/resources"; // maybe profile page is better...
              })
              .catch((error) => {
                console.log("errors are here:", error);
                setErrors([error]);
              });
          }}
        >
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Auth</button>
        </form>

        <div>
          <a href="#">No password</a>
        </div>
      </div>
    </div>
  );
}
