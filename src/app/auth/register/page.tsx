import React from 'react'
import RegisterForm from "@/components/form/RegisterForm";

const RegsiterPage = () => {
  const salt = process.env.AUTH_SECRET;

    return (
        <div>
          {salt ?
            <RegisterForm salt={salt}/>
              :
              "invalid with salt"
          }
        </div>
    )
}
export default RegsiterPage
