import dbMysql from '@/lib/utils/db/mysql'
import {NextRequest, NextResponse} from "next/server";

export async function GET(req:NextRequest, res:NextResponse) {
  try {
    // Run a simple query to check the connection
    const users = await dbMysql.query(`SELECT * FROM users`, (err, rows)  => {NextResponse.json(rows);});

    // If the query is successful, return a success response
    return NextResponse.json({ succes: 'Database is connected', data: users }, { status: 200 });
    // return res.status(200).json({ success: true, message: 'Database is connected.' });
  } catch (error) {

    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
