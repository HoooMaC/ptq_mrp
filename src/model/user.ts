const MRP_LINK = process.env.MRP_LINK;

export const GetUserById = async (id:string) => {
  try {
    const response = await fetch(`${MRP_LINK}/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;  // Rethrow the error to be handled by the caller
  }
};

export const GetUserByEmail = async (email:string) => {
  try {
    // const response = await fetch(`${MRP_LINK}/api/user/email/${email}`, {
    const response = await fetch(`http://localhost:8000/api/user/email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;  // Rethrow the error to be handled by the caller
  }
};