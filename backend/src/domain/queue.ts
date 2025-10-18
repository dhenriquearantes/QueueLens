export interface QueueBrowserInterface {
    name: string;
    messages: number;
}

export interface QueueBrowserMessageInterface {
    id: string;
    timestamp: string;
    payload: any;
}

export interface QueueBrowser {
    listQueues(): Promise<QueueBrowserInterface[]>;
    listMessages(queueName: string): Promise<QueueBrowserMessageInterface[]>;
}