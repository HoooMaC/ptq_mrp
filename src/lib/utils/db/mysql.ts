import mysql from "mysql2/promise";

export async function query({query, values = []}:{query:string, values:any  }) {
  const dbconnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    // const [result] = await dbconnection.execute(query, values);
    const [result] = await dbconnection.query(query, values);
    dbconnection.end();
    return result;
  } catch (error) {
    console.log("Error here");
    throw Error(error.message);
    return {error};
  }
}

