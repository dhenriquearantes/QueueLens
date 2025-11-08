import { Router } from 'express';
import { QueueBrowserRabbitMq } from '../../messaging/RabbitMQ';
import ListQueues from '../../../application/usecase/ListQueues';
import ListMessages from '../../../application/usecase/ListMessages';
import { JsonServerRepository } from '../../persistence/ServerRepository';
import GetActiveServer from '../../../application/usecase/server/GetActiveServer';
import GetServer from '../../../application/usecase/server/GetServer';
import { Server } from '../../../domain/server';

const rabbitMq = Router();

async function getRabbitMqBrowser(serverId?: string): Promise<QueueBrowserRabbitMq> {
  const serverRepository = new JsonServerRepository();

  const server: Server | null = serverId
    ? await new GetServer(serverRepository).execute(serverId)
    : await new GetActiveServer(serverRepository).execute();

  if (!server) {
    throw new Error('No server configured. Please configure a server first.');
  }

  const url = `${server.url}:${server.port}`;

  return new QueueBrowserRabbitMq(
    url,
    server.username,
    server.password
  );
}

rabbitMq.get('/queues', async (req, res) => {
  try {
    const serverId = req.query.serverId as string | undefined;
    const rabbitMqBrowser = await getRabbitMqBrowser(serverId);
    const listQueuesUseCase = new ListQueues(rabbitMqBrowser);

    const queues = await listQueuesUseCase.execute();

    return res.status(200).json({
      data: queues,
      count: queues.length
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
});

rabbitMq.get('/queues/:queueName/messages', async (req, res) => {
  try {
    const { queueName } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const serverId = req.query.serverId as string | undefined;

    const rabbitMqBrowser = await getRabbitMqBrowser(serverId);
    const listMessagesUseCase = new ListMessages(rabbitMqBrowser);

    const messages = await listMessagesUseCase.execute(queueName, limit);
    return res.status(200).json({
      data: messages,
      count: messages.length
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
});

export { rabbitMq };
