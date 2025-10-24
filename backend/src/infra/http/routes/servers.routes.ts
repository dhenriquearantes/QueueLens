import { Router } from 'express';
import { ServersRepository, RabbitServer } from '../../repository/ServersRepository';
import { QueueBrowserRabbitMq } from '../../messaging/RabbitMQ';

const servers = Router();
const repo = new ServersRepository();

servers.get('/', async (_req, res) => {
  const list = await repo.list();
  const activeId = await repo.getActiveId();
  return res.status(200).json({ data: list, activeId, count: list.length });
});

servers.post('/', async (req, res) => {
  const { id, name, baseUrl, username, password } = req.body as RabbitServer;
  if (!id || !name || !baseUrl || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  await repo.upsert({ id, name, baseUrl, username, password });
  return res.status(201).json({ message: 'Saved' });
});

servers.delete('/:id', async (req, res) => {
  await repo.remove(req.params.id);
  return res.status(204).send();
});

servers.post('/:id/activate', async (req, res) => {
  const { id } = req.params;
  const found = await repo.get(id);
  if (!found) return res.status(404).json({ message: 'Not found' });
  await repo.setActive(id);
  return res.status(200).json({ message: 'Activated' });
});

servers.post('/test', async (req, res) => {
  const { baseUrl, username, password } = req.body as Pick<RabbitServer, 'baseUrl' | 'username' | 'password'>;
  if (!baseUrl || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const browser = new QueueBrowserRabbitMq(baseUrl, username, password);
    const queues = await browser.listQueues();
    return res.status(200).json({ ok: true, count: queues.length });
  } catch (err: any) {
    return res.status(400).json({ ok: false, message: err?.message || 'Connection failed' });
  }
});

export { servers };
