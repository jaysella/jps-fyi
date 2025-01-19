'use server'

import { revalidatePath } from "next/cache"

export async function refreshLinks() {
  revalidatePath('/links')
  return { success: true }
}
