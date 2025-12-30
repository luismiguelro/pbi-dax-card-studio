import type { TemplateDefinition } from './types'

export type KpiDriversProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  positiveColor: string
  negativeColor: string
  maxItems: number
}

function shadowCss(p: KpiDriversProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const kpiDriversTemplate: TemplateDefinition<KpiDriversProps> = {
  id: 'kpi-drivers',
  name: 'KPI Drivers (Top + / -)',
  description: 'Shows top positive/negative contributors (drivers) as a compact list.',
  tags: ['kpi', 'drivers', 'decomposition', 'topn'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    positiveColor: '#4caf50',
    negativeColor: '#ff4d4f',
    maxItems: 3,
  },
  controls: [
    { id: 'accentColor', label: 'Accent Color', type: 'color' },
    { id: 'textColor', label: 'Text Color', type: 'color' },
    { id: 'bgColor', label: 'Background Color', type: 'color' },
    { id: 'radius', label: 'Border Radius', type: 'range', min: 0, max: 24, step: 1 },
    { id: 'shadowX', label: 'Shadow X', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowY', label: 'Shadow Y', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowBlur', label: 'Shadow Blur', type: 'range', min: 0, max: 50, step: 1 },
    { id: 'shadowOpacity', label: 'Shadow Opacity', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'positiveColor', label: 'Positive Color', type: 'color' },
    { id: 'negativeColor', label: 'Negative Color', type: 'color' },
    { id: 'maxItems', label: 'Top items', type: 'range', min: 1, max: 5, step: 1 },
  ],
  renderPreviewHtml: (p) => {
    const shadow = shadowCss(p)

    const pos = [
      { name: 'Product A', value: 120000 },
      { name: 'Product C', value: 80000 },
      { name: 'Region East', value: 35000 },
    ].slice(0, Math.max(1, Math.min(5, p.maxItems)))

    const neg = [
      { name: 'Product B', value: -60000 },
      { name: 'Region West', value: -24000 },
      { name: 'Returns', value: -12000 },
    ].slice(0, Math.max(1, Math.min(5, p.maxItems)))

    const row = (name: string, v: number) => {
      const isPos = v >= 0
      const sign = isPos ? '+' : ''
      const color = isPos ? p.positiveColor : p.negativeColor
      return `<div style="display:flex; justify-content:space-between; gap:12px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
  <div style="color:${p.textColor}; opacity:0.9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">${name}</div>
  <div style="color:${color}; font-weight:800;">${sign}${(v / 1000).toFixed(0)}k</div>
</div>`
    }

    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:18px 20px; min-width:360px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px; margin-bottom:10px;">
    <div style="color:${p.textColor}; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;">KPI Drivers</div>
    <div style="color:${p.textColor}; font-weight:900;">Δ 156k</div>
  </div>

  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
    <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px;">
      <div style="color:${p.textColor}; opacity:0.75; font-size:11px; font-weight:800; margin-bottom:6px;">Top +</div>
      ${pos.map((x) => row(x.name, x.value)).join('')}
    </div>
    <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px;">
      <div style="color:${p.textColor}; opacity:0.75; font-size:11px; font-weight:800; margin-bottom:6px;">Top -</div>
      ${neg.map((x) => row(x.name, x.value)).join('')}
    </div>
  </div>

  <div style="margin-top:10px; color:${p.textColor}; opacity:0.6; font-size:11px;">Tip: base this on Δ vs previous period per category.</div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    const topN = Math.max(1, Math.min(5, Math.round(p.maxItems)))

    return `KPI Drivers Measure =
VAR _KpiDelta = [KPI Delta]

-- Configure these for your model
-- [KPI Delta By Category] should return the delta for the current filter context of the category
-- 'Dim Category'[Category] is the category column you want to rank

VAR _TopN = ${topN}

VAR _PosTable =
    TOPN(
        _TopN,
        FILTER(
            ALL('Dim Category'[Category]),
            CALCULATE([KPI Delta By Category]) > 0
        ),
        CALCULATE([KPI Delta By Category]),
        DESC
    )

VAR _NegTable =
    TOPN(
        _TopN,
        FILTER(
            ALL('Dim Category'[Category]),
            CALCULATE([KPI Delta By Category]) < 0
        ),
        CALCULATE([KPI Delta By Category]),
        ASC
    )

VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _Radius = "${p.radius}px"
VAR _PosColor = "${p.positiveColor}"
VAR _NegColor = "${p.negativeColor}"

VAR _PosHtml =
    CONCATENATEX(
        _PosTable,
        VAR _Name = SELECTEDVALUE('Dim Category'[Category])
        VAR _Val = CALCULATE([KPI Delta By Category])
        RETURN
            "<div style='display:flex; justify-content:space-between; gap:12px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.06);'>" &
            "<div style='color:" & _TextColor & "; opacity:0.9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;'>" & _Name & "</div>" &
            "<div style='color:" & _PosColor & "; font-weight:800;'>+" & FORMAT(_Val, "#,0") & "</div>" &
            "</div>",
        ""
    )

VAR _NegHtml =
    CONCATENATEX(
        _NegTable,
        VAR _Name = SELECTEDVALUE('Dim Category'[Category])
        VAR _Val = CALCULATE([KPI Delta By Category])
        RETURN
            "<div style='display:flex; justify-content:space-between; gap:12px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.06);'>" &
            "<div style='color:" & _TextColor & "; opacity:0.9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;'>" & _Name & "</div>" &
            "<div style='color:" & _NegColor & "; font-weight:800;'>" & FORMAT(_Val, "#,0") & "</div>" &
            "</div>",
        ""
    )

RETURN
"<div style='background:" & _BgColor & "; border-radius:" & _Radius & "; padding:18px 20px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1); min-width:360px;'>" &
"<div style='display:flex; justify-content:space-between; align-items:baseline; gap:12px; margin-bottom:10px;'>" &
"<div style='color:" & _TextColor & "; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;'>KPI Drivers</div>" &
"<div style='color:" & _TextColor & "; font-weight:900;'>Δ " & FORMAT(_KpiDelta, "#,0") & "</div>" &
"</div>" &
"<div style='display:grid; grid-template-columns: 1fr 1fr; gap:12px;'>" &
"<div style='background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px;'>" &
"<div style='color:" & _TextColor & "; opacity:0.75; font-size:11px; font-weight:800; margin-bottom:6px;'>Top +</div>" &
_PosHtml &
"</div>" &
"<div style='background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px;'>" &
"<div style='color:" & _TextColor & "; opacity:0.75; font-size:11px; font-weight:800; margin-bottom:6px;'>Top -</div>" &
_NegHtml &
"</div>" &
"</div>" &
"</div>"`
  },
}
