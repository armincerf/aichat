'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    return [] as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = null as Chat | null

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()
  const allowed = false

  if (!allowed) {
    return {
      error: 'Unauthorized'
    }
  }
  //del chat

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = []
  if (!chats.length) {
    return redirect('/')
  }
  // del chats
  revalidatePath('/')
  return redirect('/')
}
