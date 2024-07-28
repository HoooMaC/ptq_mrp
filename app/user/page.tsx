import React from 'react'
import {auth} from "@/auth";

const UserPage = async () => {
  const session = await auth();
  const user = session?.user;

  return (
      <div>
        <h1>UserPage</h1>
        <p>{user?.name}</p>
        <p>{user?.username}</p>
        <p>{user?.password}</p>
        <p>{user?.role_id}</p>
      </div>
  )
}
export default UserPage
