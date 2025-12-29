import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import TemplateThumbnail from '../components/TemplateThumbnail'
import ThemeToggle from '../components/ThemeToggle'
import { templates } from '../templates/registry'

export default function CatalogPage() {
  return (
    <div className="appShell appShell-fixed">
      <ThemeToggle />
      <div className="appShell-main">
        <div className="screen">
          <header className="top">
            <div>
              <div className="title">pbi-dax-card-studio</div>
              <div className="subtitle">Card template catalog to generate DAX (embedded HTML/CSS)</div>
            </div>
            <a
              className="link"
              href="https://fonts.google.com/icons?icon.style=Outlined"
              target="_blank"
              rel="noreferrer"
            >
              Icons (Google)
            </a>
          </header>

          <div className="grid">
            {templates.map((t) => (
              <Link key={t.id} to={`/template/${t.id}`} className="tile">
                <div className="thumbWrap">
                  <TemplateThumbnail html={t.renderPreviewHtml(t.defaultProps as never)} />
                </div>
                <div className="tile-name">{t.name}</div>
                <div className="tile-desc">{t.description}</div>
                <div className="tile-tags">
                  {t.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
