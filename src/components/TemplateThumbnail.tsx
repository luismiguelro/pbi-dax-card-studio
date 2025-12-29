import { useMemo } from 'react'

export default function TemplateThumbnail({ html }: { html: string }) {
  const doc = useMemo(() => {
    const fonts =
      "<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0' />"
    const extra =
      "<style>html,body{margin:0;padding:0;height:100%;background:transparent;font-family:Segoe UI,system-ui,-apple-system,Roboto,sans-serif;}body{display:flex;align-items:center;justify-content:center;padding:6px;}*{box-sizing:border-box;}#wrap{transform:scale(0.62);transform-origin:center center;}</style>"
    return `<!doctype html><html><head><meta charset='utf-8'/>${fonts}${extra}</head><body><div id='wrap'>${html}</div></body></html>`
  }, [html])

  return <iframe title="thumb" className="thumb" sandbox="allow-same-origin" srcDoc={doc} />
}
