import axios from 'axios';
// TODO FIX THIS
const MRP_LINK = process.env.MRP_LINK;

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  phone_number?: string;
  gender?: string;
  birth_date?: Date;
  role_id: number;
  emailVerified: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserDB {
  success: boolean;
  message: string;
  user?: User;
}

export const GetAllUsers = async (link: string | undefined) => {
  const url: string | undefined = link || process.env.MRP_LINK;

  // If the URL is still undefined, abort the fetching
  if (!url) {
    return {success: false, message: `error there is no server`};
  }
  try {
    const response = await axios.get(`${MRP_LINK}/api/users`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return {success: false, message: `User not found: ${response.status}`};
    }

    if (response.status !== 200) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const fetchedUser = response.data.all_user;
    // console.log({fetchedUser})
    return {success: true, message: 'Fetching Success', user: fetchedUser};
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {success: false, message: `Error fetching user by ID: ${error}`};
  }
}

export const GetUserById = async (id: string, link: string | undefined): Promise<UserDB> => {

  // Determine the URL to use
  const url: string | undefined = link || process.env.MRP_LINK;

  // If the URL is still undefined, abort the fetching
  if (!url) {
    return {success: false, message: `error there is no server`};
  }

  try {

    const response = await axios.get(`${url}/api/user/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return {success: false, message: `User not found: ${response.status}`};
    }

    if (response.status !== 200) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const data = response.data;
    // console.log({data})
    return {success: true, message: 'Fetching Success', user: data.data};
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {success: false, message: `Error fetching user by ID: ${error}`};
  }
};

export const GetUserByEmail = async (email: string, link: string | undefined): Promise<UserDB> => {
  try {
    // Determine the URL to use
    const url: string | undefined = link || process.env.MRP_LINK;

    // If the URL is still undefined, abort the fetching
    if (!url) {
      return {success: false, message: `error there is no server`};
    }
    const response = await axios.get(`${url}/api/user/email/${email}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return {success: false, message: `User not found: ${response.status}`};
    }

    if (response.status !== 200) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const data = response.data;
    // console.log({data})
    return {success: true, message: 'Fetching Success', user: data.data};
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return {success: false, message: `Error fetching user by email: ${error}`};
  }
};
