'use server'

import { createFaunaClient } from "@/lib/fauna"
import faunadb from "faunadb"
import { revalidatePath } from "next/cache"

export async function deleteLink(id: string) {
  if (!process.env.FAUNA_GUEST_SECRET) {
    return { success: false, error: 'Missing database credentials' }
  }

  const q = faunadb.query
  const client = createFaunaClient()

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
