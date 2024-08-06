import {auth} from "@/auth";
import {User} from "@/model/user";
import ZiyaadahByPage
  from "@/components/form/MemorizationRecords/ZiyaadahByPage";
import {GetAllReviewerList} from "@/model/ziyaadah";


const Page = async () => {
  const session = await auth();
  const user = session?.user;
  const fetchResult = await GetAllReviewerList();
  const {reviewers} = fetchResult;

  return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1>By Verse</h1>
        <div className='size-80  border'>
          <ZiyaadahByPage user={user as User} all_reviewers={reviewers as User[]}/>
        </div>
      </div>
  )
}
export default Page
