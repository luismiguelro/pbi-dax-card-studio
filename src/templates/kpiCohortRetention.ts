import type { TemplateDefinition } from './types'

export type KpiCohortRetentionProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  lowColor: string
  highColor: string
  weeksToShow: number
}

function shadowCss(p: KpiCohortRetentionProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min
  return Math.max(min, Math.min(max, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim()
  if (h.length !== 6) return { r: 128, g: 128, b: 128 }
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (x: number) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function gradientHex(fromHex: string, toHex: string, t: number) {
  const a = hexToRgb(fromHex)
  const b = hexToRgb(toHex)
  return rgbToHex(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t))
}

export const kpiCohortRetentionTemplate: TemplateDefinition<KpiCohortRetentionProps> = {
  id: 'kpi-cohort-retention',
  name: 'Cohort Retention (Mini Heatmap)',
  description: 'Small cohort retention heatmap (e.g., week 0..N) with a headline retention KPI.',
  tags: ['cohort', 'retention', 'heatmap', 'product'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    lowColor: '#2f3338',
    highColor: '#4caf50',
    weeksToShow: 8,
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
    { id: 'lowColor', label: 'Low Color', type: 'color' },
    { id: 'highColor', label: 'High Color', type: 'color' },
    { id: 'weeksToShow', label: 'Weeks to show', type: 'range', min: 4, max: 12, step: 1 },
  ],
  renderPreviewHtml: (p) => {
    const shadow = shadowCss(p)
    const weeks = clamp(p.weeksToShow, 4, 12)
    const retention = [1, 0.78, 0.64, 0.58, 0.52, 0.48, 0.45, 0.42, 0.40, 0.39, 0.38, 0.37].slice(0, weeks)

    const cells = retention
      .map((r, i) => {
        const t = clamp(r, 0, 1)
        const color = gradientHex(p.lowColor, p.highColor, t)
        return `<div title="W${i}: ${(r * 100).toFixed(0)}%" style="height:16px; border-radius:4px; background:${color}; border:1px solid rgba(255,255,255,0.06);"></div>`
      })
      .join('')

    const w4 = retention[Math.min(3, retention.length - 1)] ?? 0

    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:18px 20px; min-width:380px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
    <div>
      <div style="color:${p.textColor}; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;">Cohort Retention</div>
      <div style="margin-top:8px; color:${p.textColor}; font-size:30px; font-weight:900; line-height:1;">W4: ${(w4 * 100).toFixed(0)}%</div>
      <div style="margin-top:6px; color:${p.textColor}; opacity:0.65; font-size:12px;">Last cohort • Weeks 0..${weeks - 1}</div>
    </div>
    <div style="width:10px; height:10px; background:${p.accentColor}; border-radius:3px; margin-top:4px;"></div>
  </div>

  <div style="margin-top:14px; display:grid; grid-template-columns: repeat(${weeks}, 1fr); gap:6px;">
    ${cells}
  </div>

  <div style="margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:${p.textColor}; opacity:0.6;">
    <span>W0</span>
    <span>W${weeks - 1}</span>
  </div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    const weeks = clamp(p.weeksToShow, 4, 12)

    return `Cohort Retention - Value =
[KPI Value]

Cohort Retention - Date Column =
-- Replace with your date column
-- Example: 'Date'[Date]

Cohort Retention - HTML =
VAR _DateCol = 'Date'[Date]
VAR _WeeksToShow = ${weeks}

VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _Radius = "${p.radius}px"

VAR _LowColor = "${p.lowColor}"
VAR _HighColor = "${p.highColor}"

-- Define "Week 0" as the most recent 7 days in the current filter context.
-- Week 1 is the 7 days before that, etc.
-- If you need ISO-week boundaries, adjust _Start/_End logic accordingly.

VAR _End0 = MAX(_DateCol)
VAR _Start0 = _End0 - 6
VAR _Base0 = CALCULATE([KPI Value], DATESBETWEEN(_DateCol, _Start0, _End0))

VAR _Weeks = GENERATESERIES(0, _WeeksToShow - 1, 1)

VAR _CellsHtml =
    CONCATENATEX(
        _Weeks,
        VAR _W = [Value]
        VAR _EndW = _End0 - (7 * _W)
        VAR _StartW = _EndW - 6
        VAR _ValW = CALCULATE([KPI Value], DATESBETWEEN(_DateCol, _StartW, _EndW))
        VAR _Ret = DIVIDE(_ValW, _Base0)
        VAR _Color =
            SWITCH(
                TRUE(),
                _Ret >= 0.8, _HighColor,
                _Ret >= 0.6, "#3a5f46",
                _Ret >= 0.4, "#36424a",
                _LowColor
            )
        RETURN
            "<div title='W" & _W & ": " & FORMAT(_Ret, "0%") & "' style='height:16px; border-radius:4px; background:" & _Color & "; border:1px solid rgba(255,255,255,0.06);'></div>",
        "",
        [Value],
        ASC
    )

VAR _W4 =
    VAR _End4 = _End0 - 28
    VAR _Start4 = _End4 - 6
    VAR _Val4 = CALCULATE([KPI Value], DATESBETWEEN(_DateCol, _Start4, _End4))
    RETURN DIVIDE(_Val4, _Base0)

RETURN
"<div style='background:" & _BgColor & "; border-radius:" & _Radius & "; padding:18px 20px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1); min-width:380px;'>" &
"<div style='display:flex; justify-content:space-between; align-items:flex-start; gap:12px;'>" &
"<div>" &
"<div style='color:" & _TextColor & "; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;'>Cohort Retention</div>" &
"<div style='margin-top:8px; color:" & _TextColor & "; font-size:30px; font-weight:900; line-height:1;'>W4: " & FORMAT(_W4, "0%") & "</div>" &
"<div style='margin-top:6px; color:" & _TextColor & "; opacity:0.65; font-size:12px;'>Base: last 7 days • Weeks 0.." & (_WeeksToShow - 1) & "</div>" &
"</div>" &
"</div>" &
"<div style='margin-top:14px; display:grid; grid-template-columns: repeat(${weeks}, 1fr); gap:6px;'>" &
_CellsHtml &
"</div>" &
"<div style='margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:" & _TextColor & "; opacity:0.6;'><span>W0</span><span>W" & (_WeeksToShow - 1) & "</span></div>" &
"</div>"`
  },
}
