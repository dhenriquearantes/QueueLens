import { Router } from 'express';
import { rabbitMq } from './rabbitMq.routes';
import { servers } from './servers.routes';

const router = Router();

router.get('/', (req, res) => {
    return res.status(201).json({
        response: 'QueueLens online'
    })
})

router.use('/rabbitmq', rabbitMq);
router.use('/servers', servers);

export { router };