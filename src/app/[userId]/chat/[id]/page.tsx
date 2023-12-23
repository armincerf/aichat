import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { Chat } from '@/components/chat'

export interface ChatPageProps {
  params: {
    id: string
  }
}

async function getChat(id: string) {
  return {
    id,
    title: 'Chat',
    messages: [
      {
        id: '1',
        text: 'Hello',
        createdAt: '2021-07-01T00:00:00.000Z',
        userId: '1'
      },
      {
        id: '2',
        text: 'Hi',
        createdAt: '2021-07-01T00:00:00.000Z',
        userId: '2'
      }
    ]
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const chat = await getChat(params.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = await getChat(params.id)

  if (!chat) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
