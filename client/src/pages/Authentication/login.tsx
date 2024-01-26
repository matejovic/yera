import { useState, useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";

const API_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

interface Props {
  profile: {
    id: number;
    email: string;
  };
}

export function Login(props: Props) {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (props.profile?.id) {
    location.route("/reader");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.error) {
        console.log("LOGIN ERROR", data.error);
        setErrors([data.error]);
        return;
      }
      console.log("LOGIN RESPONSE", data);
      setErrors([]);
      // handle successful login
      // maybe check that token is part of the response
      // before redirecting
      window.location = "/reader";
    } catch (error) {
      console.log("LOGIN ERROR", error);
      setErrors([error]);
      // handle login error
    }
  };

  return (
    <div class="page">
      <div class="block">
        <h2>Login here</h2>

        <p>If you lost your password, there is nothing we can do. </p>

        {errors.length > 0 && (
          <div className="form-errors">
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </div>
        )}

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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
