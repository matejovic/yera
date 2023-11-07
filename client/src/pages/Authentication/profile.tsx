

interface Props {
  profile: {
    id: number;
    email: string;
  }
}

export function Profile (props: Props) {

  const { id, email } = props.profile; 

  return (
    <div class="page">
      {id ? <h2>Welcome {id} {email}</h2> : <h2>You are not logged in</h2>}
    </div>
  )
}