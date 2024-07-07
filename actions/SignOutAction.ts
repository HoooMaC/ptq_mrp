'use server';
import { signOut } from '@/auth';
import { NextRequest} from 'next/server';

export const SignOutAction = async (req: NextRequest) => {
  await signOut({ redirectTo: '/login' });
};
