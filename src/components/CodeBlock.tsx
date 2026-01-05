import { useCallback, useState } from 'react'

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'fixed'
  el.style.top = '0'
  el.style.left = '0'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()

  const ok = document.execCommand('copy')
  document.body.removeChild(el)
  if (!ok) throw new Error('Copy failed')
}

export default function CodeBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      await copyToClipboard(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }, [value])

  return (
    <div className="code">
      <div className="code-header">
        <div className="code-title">DAX TO COPY</div>
        <button className="btn" onClick={onCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <textarea className="code-text" readOnly value={value} spellCheck={false} />
    </div>
  )
}
