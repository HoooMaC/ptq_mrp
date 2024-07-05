import fetch from 'node-fetch';

const MRP_LINK = process.env.MRP_LINK;

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phone_number?: string;
  gender?: string;
  birth_date?: Date;
  role_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserDB {
  success: boolean;
  message: string;
  user?: User
}

export const GetUserById = async (id: string): Promise<UserDB> => {
  try {
    const response = await fetch(`${MRP_LINK}/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return {success: false, message: `User not found: ${response.status}`};
    }

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`
      };
    }

    const data = await response.json();
    // @ts-ignore
    return {success:true, message:"Fetching Success", user:data.data};
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {success: false, message: `Error fetching user by ID: , ${error}`};
  }
};

export const GetUserByEmail = async (email: string): Promise<UserDB> => {
  try {
    // const response = await fetch(`${MRP_LINK}/api/user/email/${email}`, {
    const response = await fetch(`http://localhost:8000/api/user/email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return {success: false, message: `User not found: ${response.status}`};
    }

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`
      };
    }

    const data = await response.json();
    // @ts-ignore
    return {success:true, message:"Fetching Success", user:data.data};
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {success: false, message: `Error fetching user by ID: , ${error}`};
  }
};