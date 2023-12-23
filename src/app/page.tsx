export default function Login() {
  const users = [
    {
      id: 1,
      name: 'John Doe',
      image: null
    }
  ]
  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <a href={`/users/${user.id}`}>{user.name}</a>
          </li>
        ))}
      </ul>
    </>
  )
}
