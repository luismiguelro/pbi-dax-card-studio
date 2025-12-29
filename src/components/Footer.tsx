import { appConfig } from '../config'

export default function Footer() {
  return (
    <footer className="appFooter">
      <div className="appFooter-inner">
        <div className="appFooter-left">
          <div className="appFooter-name">{appConfig.authorName}</div>
          <div className="appFooter-role">{appConfig.authorRole}</div>
        </div>
        <div className="appFooter-links">
          {appConfig.authorLinks.map((l) => (
            <a key={l.href} className="appFooter-link" href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
