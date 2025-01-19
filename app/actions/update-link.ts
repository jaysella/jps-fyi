'use server'

import faunadb from "faunadb"
import { revalidatePath } from "next/cache"

export async function updateLink(id: string, slug: string, originalUrl: string) {
  if (!process.env.FAUNA_GUEST_SECRET) {
    return { success: false, error: 'Missing database credentials' }
  }

  const q = faunadb.query
  const client = new faunadb.Client({
    secret: process.env.FAUNA_GUEST_SECRET,
  })

  try {
    await client.query(
      q.Update(
        q.Ref(q.Collection('Mini'), id),
        {
          data: {
            mini: slug,
            destination: originalUrl,
          }
        }
      )
    )

    revalidatePath('/links')
    return { success: true }
  } catch (error) {
    console.error('Failed to update URL:', error)
    return { success: false, error: 'Failed to update URL' }
  }
}
