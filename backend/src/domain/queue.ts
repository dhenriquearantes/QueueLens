export interface QueueBrowserInterface {
    name: string;
    messages: number;
}

export interface QueueBrowser {
    listQueues(): Promise<QueueBrowserInterface[]>;
}