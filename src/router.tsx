import { createHashRouter } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import DocsPage from './pages/DocsPage'
import EditorPage from './pages/EditorPage'

export const router = createHashRouter([
  { path: '/', element: <CatalogPage /> },
  { path: '/docs', element: <DocsPage /> },
  { path: '/template/:templateId', element: <EditorPage /> },
])
