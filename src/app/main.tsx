import './styles/index.css'

import ReactDOM from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { routes } from './routes'


const root = document.getElementById('root')
const router = createBrowserRouter(routes)

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />,
)
