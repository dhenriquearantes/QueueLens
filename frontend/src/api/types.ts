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

export interface Server {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServerDTO {
  name: string;
  url: string;
  port: string;
  username: string;
  password: string;
}

export interface UpdateServerDTO {
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
}

export interface ServersResponse {
  data: Server[];
  count: number;
}

export interface ServerResponse {
  data: Server;
  message?: string;
}
