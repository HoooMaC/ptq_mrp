import {auth} from "@/auth";
import {User} from "@/model/user";
import ZiyaadahByVerse
  from "@/components/form/MemorizationRecords/ZiyaadahByVerse";


const Page = async () => {
  const session = await auth();
  const user = session?.user;

  return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1>By Verse</h1>
        <div className='size-80  border'>
          <ZiyaadahByVerse user={user as User} />
        </div>
      </div>
  )
}
export default Page
