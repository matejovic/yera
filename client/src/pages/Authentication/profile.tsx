import { useState } from 'preact/hooks';

interface Props {
  profile: {
    id: number;
    email: string;
  }
}

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api';

export function Profile (props: Props) {

  const { id, email } = props.profile; 

  // TODO: set bio on load from database
  // a: use useEffect hook
  // establish pattern for the project
  const [bio, setBio] = useState('');

  

  // update bio at /auth/profile based on the textarea
  // use the id to identify the user
  async function updateBio() {
	const response = await fetch(API_URL + '/auth/profile', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({bio: bio})
  	});
  }

  return (
    <div class="page">
      {id ? <h2>id: {id}</h2> : <h2>You are not logged in</h2>}

	<p>Whatever you will write in the box will be saved in the database</p>
	<textarea onInput={(e) => setBio(e.target.value)} value={bio}/><br/>
	<button onClick={updateBio}>Save</button>
    </div>
  )
}
