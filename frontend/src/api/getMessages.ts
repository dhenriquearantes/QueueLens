import { api } from '@/lib/axios'
import { Message, MessagesResponse } from './types'

export async function getMessages(queueName: string, limit = 20): Promise<Message[]> {
  try {
    const response = await api.get<MessagesResponse>(`/api/rabbitmq/queues/${queueName}/messages?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
}