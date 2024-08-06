import {GetAllZiyaadahRecord} from "@/model/ziyaadah";

const Page = async () => {
  const ziyaadah = await GetAllZiyaadahRecord();
  return (
      <div>
        {JSON.stringify(ziyaadah)}
      </div>
  )
}
export default Page
