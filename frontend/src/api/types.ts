export interface Queue {
  name: string;
  messages: number;
}

export interface Message {
  id: string;
  timestamp: string;
  payload: any;
}

export interface QueuesResponse {
  data: Queue[];
  count: number;
}

export interface MessagesResponse {
  data: Message[];
  count: number;
}
