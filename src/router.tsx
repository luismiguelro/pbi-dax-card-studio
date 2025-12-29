import { createHashRouter } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import EditorPage from './pages/EditorPage'

export const router = createHashRouter([
  { path: '/', element: <CatalogPage /> },
  { path: '/template/:templateId', element: <EditorPage /> },
])
