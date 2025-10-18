import { Router } from 'express';
import { rabbitMq } from './rabbitMq.routes';

const router = Router();

router.get('/', (req, res) => {
    return res.status(201).json({
        response: 'QueueLens online'
    })
})

router.use('/rabbitmq', rabbitMq);

export { router };