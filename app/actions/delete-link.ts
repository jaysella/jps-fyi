'use server'

import faunadb from "faunadb"
import { revalidatePath } from "next/cache"

export async function deleteLink(id: string) {
  if (!process.env.FAUNA_GUEST_SECRET) {
    return { success: false, error: 'Missing database credentials' }
  }

  const q = faunadb.query
  const client = new faunadb.Client({
    secret: process.env.FAUNA_GUEST_SECRET,
  })

  try {
    await client.query(
      q.Delete(
        q.Ref(q.Collection('Mini'), id)
      )
    )

    revalidatePath('/links')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete URL:', error)
    return { success: false, error: 'Failed to delete URL' }
  }
}
