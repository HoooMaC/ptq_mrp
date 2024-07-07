import React from 'react'
import {Card} from "@/components/ui/card";

const Layout = ({children}: { children: React.ReactNode }) => {
  return (
      <div className="h-screen grid place-items-center">
        <Card className="w-1/2  p-12 mx-auto flex">
          {children}
        </Card>
      </div>
  )
}
export default Layout

