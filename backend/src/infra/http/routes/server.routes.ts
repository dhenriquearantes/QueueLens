import { Router } from 'express';
import { JsonServerRepository } from '../../persistence/ServerRepository';
import CreateServer from '../../../application/usecase/server/CreateServer';
import ListServers from '../../../application/usecase/server/ListServers';
import GetServer from '../../../application/usecase/server/GetServer';
import UpdateServer from '../../../application/usecase/server/UpdateServer';
import DeleteServer from '../../../application/usecase/server/DeleteServer';
import SetActiveServer from '../../../application/usecase/server/SetActiveServer';
import GetActiveServer from '../../../application/usecase/server/GetActiveServer';

const serverRouter = Router();

const serverRepository = new JsonServerRepository();
const createServerUseCase = new CreateServer(serverRepository);
const listServersUseCase = new ListServers(serverRepository);
const getServerUseCase = new GetServer(serverRepository);
const updateServerUseCase = new UpdateServer(serverRepository);
const deleteServerUseCase = new DeleteServer(serverRepository);
const setActiveServerUseCase = new SetActiveServer(serverRepository);
const getActiveServerUseCase = new GetActiveServer(serverRepository);

serverRouter.post('/', async (req, res) => {
  try {
    const { name, url, port, username, password } = req.body;

    const server = await createServerUseCase.execute({
      name,
      url,
      port,
      username,
      password
    });

    return res.status(201).json({
      message: 'Server created successfully',
      data: server
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
});

serverRouter.get('/', async (req, res) => {
  try {
    const servers = await listServersUseCase.execute();

    return res.status(200).json({
      data: servers,
      count: servers.length
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
});

serverRouter.get('/active', async (req, res) => {
  try {
    const server = await getActiveServerUseCase.execute();

    if (!server) {
      return res.status(404).json({
        message: 'No active server found'
      });
    }

    return res.status(200).json({
      data: server
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
});

serverRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const server = await getServerUseCase.execute(id);

    return res.status(200).json({
      data: server
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message
    });
  }
});

serverRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, username, password, isActive } = req.body;

    const server = await updateServerUseCase.execute(id, {
      name,
      url,
      username,
      password,
      isActive
    });

    return res.status(200).json({
      message: 'Server updated successfully',
      data: server
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
});

serverRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteServerUseCase.execute(id);

    return res.status(200).json({
      message: 'Server deleted successfully'
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
});

serverRouter.patch('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    const server = await setActiveServerUseCase.execute(id);

    return res.status(200).json({
      message: 'Server activated successfully',
      data: server
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    });
  }
});

export { serverRouter };
