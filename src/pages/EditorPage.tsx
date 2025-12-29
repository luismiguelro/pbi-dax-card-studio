import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ControlPanel from '../components/ControlPanel'
import PreviewFrame from '../components/PreviewFrame'
import CodeBlock from '../components/CodeBlock'
import ThemeToggle from '../components/ThemeToggle'
import { getTemplateById } from '../templates/registry'
import { readJson, writeJson } from '../lib/storage'

type PresetState = {
  templateId: string
  props: Record<string, unknown>
}

function presetKey(id: string) {
  return `pbi-kit:preset:${id}`
}

export default function EditorPage() {
  const { templateId } = useParams()
  const template = useMemo(() => getTemplateById(templateId), [templateId])

  const [value, setValue] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (!template) return
    const saved = readJson<PresetState>(presetKey(template.id))
    if (saved && saved.templateId === template.id && saved.props) {
      setValue({ ...template.defaultProps, ...saved.props })
      return
    }
    setValue({ ...template.defaultProps })
  }, [template])

  useEffect(() => {
    if (!template) return
    writeJson(presetKey(template.id), { templateId: template.id, props: value } satisfies PresetState)
  }, [template, value])

  const previewHtml = useMemo(() => {
    if (!template) return ''
    return template.renderPreviewHtml(value as never)
  }, [template, value])

  const dax = useMemo(() => {
    if (!template) return ''
    return template.exportDax(value as never)
  }, [template, value])

  if (!template) {
    return (
      <div className="appShell">
        <div className="appShell-main">
          <div className="screen">
            <header className="top">
              <div>
                <div className="title">Template not found</div>
                <div className="subtitle">Go back to the catalog</div>
              </div>
              <Link className="btn" to="/">
                Back
              </Link>
            </header>
          </div>
        </div>
      </div>
    )
  }

  const onExportJson = () => {
    const payload = JSON.stringify({ templateId: template.id, props: value }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.id}.preset.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onImportJson = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    const parsed = JSON.parse(text) as PresetState
    if (!parsed || parsed.templateId !== template.id) return
    setValue({ ...template.defaultProps, ...(parsed.props ?? {}) })
  }

  return (
    <div className="appShell appShell-fixed">
      <ThemeToggle />
      <div className="appShell-main">
        <div className="editor">
          <aside className="sidebar">
            <div className="sidebar-top">
              <Link to="/" className="btn ghost">
                ← Catalog
              </Link>
              <div>
                <div className="sidebar-title">{template.name}</div>
                <div className="sidebar-sub">Configure and generate DAX</div>
              </div>
            </div>

            <div className="sidebar-actions">
              <button className="btn" onClick={onExportJson}>
                Export JSON
              </button>
              <label className="btn ghost">
                Import JSON
                <input
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                  onChange={(e) => void onImportJson(e.target.files?.[0] ?? null)}
                />
              </label>
              <button className="btn ghost" onClick={() => setValue({ ...template.defaultProps })}>
                Reset
              </button>
            </div>

            <ControlPanel template={template as never} value={value} onChange={setValue} />
          </aside>

          <main className="main">
            <div className="previewWrap">
              <PreviewFrame html={previewHtml} />
            </div>
            <CodeBlock value={dax} />
          </main>
        </div>
      </div>
    </div>
  )
}
