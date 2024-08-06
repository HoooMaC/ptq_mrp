import {auth} from "@/auth";
import {User} from "@/model/user";
import MemorizationByVerseForm
  from "@/components/form/MemorizationRecords/ZiyaadahByVerse";


const Page = async () => {
  const session = await auth();
  const user = session?.user;

  return (
      <div className="grid place-items-center h-screen">
        <h1>By Verse</h1>
        <div className='size-80  border'>
          <MemorizationByVerseForm
              user={user as User}></MemorizationByVerseForm>
        </div>
      </div>
  )
}
export default Page
