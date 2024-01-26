import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

interface Props {
  profile: {
    id: number;
    username: string;
  };
}

export function Register(props: Props) {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (props.profile.id) {
    location.route("/reader");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      window.location = "/reader";
      // handle successful login
    } catch (error) {
      console.log("LOGIN ERROR", error);
      // handle login error
    }
  };

  return (
    <div class="page ">
      <div class="block">
        <h2>Registration</h2>
        <p>
          We are not yet in a stable release, therefore your account and data
          can disappear. We expect the first stable release in March and
          continue with data and uptime guarantees.{" "}
        </p>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
