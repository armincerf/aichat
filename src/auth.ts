import { Session } from 'next-auth'

export function auth() {
  const isServer = typeof window === 'undefined'
  if (isServer) {
    return null
  }
  const user = localStorage.getItem('user')
  if (!user) {
    return null
  }
  const parsedUser = JSON.parse(user) as Session['user']
  return parsedUser
}
