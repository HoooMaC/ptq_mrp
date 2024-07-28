import {GetAllUsers, User} from "@/model/user";

const Page = async () => {
  const response = await GetAllUsers();
  const {success, message, user} = response;

  // console.log({user})
  return (
      <div>
        <p>
          hello
        </p>
        {/*{JSON.stringify(user)}*/}
        {user.map(({
                     id,
                     name,
                     username,
                     email,
                     password,
                     phone_number,
                     gender,
                     birth_date,
                     role_id,
                     created_at,
                     updated_at
                   }:User) => {
          return (<div key={id} className="border">

            <p>{username}</p>
            <p>{name}</p>
            <p>{email}</p>
            <p>{password}</p>
            <p>{phone_number}</p>
            <p>{gender}</p>
            <p>{birth_date?.toString()}</p>
            <p>{role_id}</p>
            <p>{created_at.toString()}</p>
            <p>{updated_at.toString()}</p>
          </div>)
        })}
      </div>
  )
}
export default Page
