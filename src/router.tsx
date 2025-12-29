import { createBrowserRouter } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import EditorPage from './pages/EditorPage'

export const router = createBrowserRouter([
  { path: '/', element: <CatalogPage /> },
  { path: '/template/:templateId', element: <EditorPage /> },
])
