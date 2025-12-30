import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import ThemeToggle from '../components/ThemeToggle'

export default function DocsPage() {
  return (
    <div className="appShell appShell-fixed">
      <ThemeToggle />
      <div className="appShell-main">
        <div className="screen">
          <header className="top">
            <div>
              <div className="title">Documentation</div>
              <div className="subtitle">How to use pbi-dax-card-studio in Power BI</div>
            </div>
            <Link className="btn ghost" to="/">
              ← Catalog
            </Link>
          </header>

          <div className="docs">
            <section className="docs-section">
              <h2 className="docs-h2">What this app does</h2>
              <p className="docs-p">
                This Studio generates <b>DAX measures</b> that return <b>HTML/CSS</b>. You paste the DAX into Power BI and
                render it using an HTML-rendering custom visual.
              </p>
            </section>

            <section className="docs-section">
              <h2 className="docs-h2">Power BI setup (end-user)</h2>
              <ol className="docs-ol">
                <li>
                  Pick a template in the catalog and copy the <b>DAX TO COPY</b> output.
                </li>
                <li>
                  In Power BI Desktop:
                  <div className="docs-code">Modeling → New measure → paste</div>
                </li>
                <li>
                  Replace placeholders like:
                  <div className="docs-code">[YourMeasure] · [KPI Value] · [KPI Target] · [KPI Prev]</div>
                </li>
                <li>
                  Add an HTML rendering visual (example: <b>HTML Content</b>) and put the measure in Values.
                </li>
              </ol>
            </section>

            <section className="docs-section">
              <h2 className="docs-h2">Recommended modeling patterns</h2>
              <div className="docs-grid">
                <div className="docs-card">
                  <div className="docs-card-title">Time intelligence</div>
                  <div className="docs-p">Use a proper Date table and measures for current/previous period.</div>
                  <pre className="docs-pre"><code>{`[KPI Value] = [Sales]
[KPI Prev] = CALCULATE([Sales], DATEADD('Date'[Date], -1, MONTH))`}</code></pre>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Targets</div>
                  <div className="docs-p">Store targets in a table (by product/region/month) and expose a measure.</div>
                  <pre className="docs-pre"><code>{`[KPI Target] =
VAR _t = SELECTEDVALUE(Targets[TargetValue])
RETURN _t`}</code></pre>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Driver analysis</div>
                  <div className="docs-p">Create a delta-by-category measure used by the Drivers template.</div>
                  <pre className="docs-pre"><code>{`[KPI Delta] = [KPI Value] - [KPI Prev]
[KPI Delta By Category] = [KPI Delta]`}</code></pre>
                </div>
              </div>
            </section>

            <section className="docs-section">
              <h2 className="docs-h2">Template examples (what to replace)</h2>
              <div className="docs-card">
                <div className="docs-card-title">KPI Status (RAG + Target + Gap)</div>
                <div className="docs-p">Required measures:</div>
                <div className="docs-code">[KPI Value] · [KPI Target] · [KPI Prev]</div>
              </div>
              <div className="docs-card">
                <div className="docs-card-title">KPI Drivers (Top +/-)</div>
                <div className="docs-p">Required objects:</div>
                <div className="docs-code">'Dim Category'[Category] · [KPI Delta] · [KPI Delta By Category]</div>
              </div>
              <div className="docs-card">
                <div className="docs-card-title">Forecast / Run-rate</div>
                <div className="docs-p">Required measures (you can derive these from your Date table):</div>
                <div className="docs-code">[Actual To Date] · [Days Elapsed] · [Days In Period] · [Target]</div>
              </div>
            </section>

            <section className="docs-section">
              <h2 className="docs-h2">Troubleshooting</h2>
              <ul className="docs-ul">
                <li>
                  <b>Raw HTML shows as text</b>: you are not using an HTML-rendering visual.
                </li>
                <li>
                  <b>Blank visual</b>: one of the referenced measures returns BLANK() in the current filter context.
                </li>
                <li>
                  <b>Icons do not appear</b>: tenant may block external fonts. Replace icons with text or use a different
                  approach.
                </li>
                <li>
                  <b>Slow report</b>: HTML + complex DAX can be expensive. Reduce string operations, keep visuals small, and
                  avoid iterating large tables.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
