import {auth} from '@/auth'
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
if(session){
  if (session?.user.role !== 'seller') {

    return <h1>This page is for sellers only</h1>
  }}
  else{
    return <h1>sign in</h1>
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  )
}