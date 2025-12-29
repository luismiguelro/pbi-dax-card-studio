import { useCallback, useState } from 'react'

export default function CodeBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
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
