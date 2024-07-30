import MemorizationForm from "@/components/form/MemorizationForm";
import {auth} from "@/auth";
import {User} from "@/model/user";


const Page = async() => {
  const session = await auth();
  const user = session?.user;

  return (
      <div className="grid place-items-center h-screen">
        <div className='size-80  border'>
          <MemorizationForm user={user as User}></MemorizationForm>
        </div>
      </div>
  )
}
export default Page
