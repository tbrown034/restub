'use server';

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(`${process.env.DATABASE_URL}`);

export async function deleteUser(formData: FormData) {
  const userId = formData.get('userId') as string;
  
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    await sql`DELETE FROM users WHERE id = ${userId}`;
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function getUsers() {
  try {
    const users = await sql`
      SELECT id, username, email, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}