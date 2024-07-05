import React from 'react'
import LoginForm from "@/components/form/LoginForm";

const LoginPage = () => {
  const salt :string = process.env.AUTH_SECRET || '';
  return (
      <div>
        {salt&&<LoginForm salt={salt} />}
      </div>
  )
}
export default LoginPage
