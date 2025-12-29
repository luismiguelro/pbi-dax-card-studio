export default function PreviewFrame({ html }: { html: string }) {
  return (
    <div className="preview" role="region" aria-label="preview">
      <div className="preview-inner" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
