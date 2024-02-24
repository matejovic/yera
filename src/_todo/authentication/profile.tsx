import { useEffect, useState } from "preact/hooks";
import { apiUrl } from "../core/globals";

interface Props {
  profile: {
    id: number;
  };
}

export function Profile(props: Props) {
  const [id, setId] = useState(0);
  const [email, setEmail] = useState("");
 
  useEffect(() => {
    fetch(API_URL + "/auth/profile", {
      credentials: "include",
    }).then((response) => response.json())
    .then((data) => { setId(data.id); setEmail(data.email) })
    .catch((error) => console.log(error));
  })

  return (
    <div class="page">
      <div class="block">
          <h2>Metabox</h2>
          <p>id: {id}</p>
          <p>email: {email}</p>
      </div>
    </div>
  );
}
