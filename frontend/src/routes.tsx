import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import QueueMessages from './pages/QueueMessages'
import Queues from './pages/Queues'
import Servers from './pages/Servers'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/queues',
    element: <Queues />
  },
  {
    path: '/queues/:queueId/messages',
    element: <QueueMessages />
  },
  {
    path: '/servers',
    element: <Servers />
  }
])
