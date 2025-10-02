import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = cookies()
  const token = (await cookieStore).get('accessToken')

  if (token) {
    redirect('/dashboard')
  } else {
    redirect('/auth/login')
  }
}