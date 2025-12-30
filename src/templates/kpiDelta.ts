import type { TemplateDefinition } from './types'

export type KpiDeltaProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  deltaIsPositive: boolean
  positiveColor: string
  negativeColor: string
}

function shadowCss(p: KpiDeltaProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const kpiDeltaTemplate: TemplateDefinition<KpiDeltaProps> = {
  id: 'kpi-delta',
  name: 'KPI + Delta',
  description: 'KPI card with delta change and automatic positive/negative color.',
  tags: ['kpi', 'delta', 'card'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    deltaIsPositive: true,
    positiveColor: '#4caf50',
    negativeColor: '#ff4d4f',
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
    { id: 'deltaIsPositive', label: 'Delta Positive', type: 'checkbox' },
    { id: 'positiveColor', label: 'Positive Color', type: 'color' },
    { id: 'negativeColor', label: 'Negative Color', type: 'color' },
  ],
  renderPreviewHtml: (p) => {
    const shadow = shadowCss(p)
    const deltaColor = p.deltaIsPositive ? p.positiveColor : p.negativeColor
    const deltaArrow = p.deltaIsPositive ? '▲' : '▼'
    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:20px 22px; min-width:300px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
    <div>
      <div style="color:${p.textColor}; opacity:0.7; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">Revenue</div>
      <div style="color:${p.textColor}; font-size:34px; font-weight:800; line-height:1.1;">2.4M</div>
    </div>
    <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:${deltaColor}; font-weight:700; font-size:12px;">${deltaArrow} 12.3%</div>
  </div>
  <div style="margin-top:14px; height:6px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden;">
    <div style="width:65%; height:100%; background:${p.accentColor};"></div>
  </div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    return `KPI Delta - Value =
[KPI Value]

KPI Delta - Prev =
[KPI Prev]

KPI Delta - HTML =
VAR _Value = [KPI Value]
VAR _Prev = [KPI Prev]

VAR _Delta = DIVIDE(_Value - _Prev, _Prev)

VAR _DeltaArrow = IF(_Delta >= 0, "▲", "▼")
VAR _DeltaColor = IF(_Delta >= 0, "${p.positiveColor}", "${p.negativeColor}")

VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _BarColor = "${p.accentColor}"
VAR _Radius = "${p.radius}px"

RETURN
"<div style='background-color:" & _BgColor & "; border-radius:" & _Radius & "; padding:20px 22px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1);'>" &
"<div style='display:flex; justify-content:space-between; align-items:flex-start; gap:12px;'>" &
"<div>" &
"<div style='color:" & _TextColor & "; opacity:0.7; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;'>Revenue</div>" &
"<div style='color:" & _TextColor & "; font-size:34px; font-weight:800; line-height:1.1;'>" & FORMAT(_Value, "#,##0") & "</div>" &
"</div>" &
"<div style='background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:" & _DeltaColor & "; font-weight:700; font-size:12px;'>" &
_DeltaArrow & " " & FORMAT(ABS(_Delta), "0.0%") & "</div>" &
"</div>" &
"<div style='margin-top:14px; height:6px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden;'>" &
"<div style='width:65%; height:100%; background-color:" & _BarColor & ";'></div>" &
"</div>" &
"</div>"`
  },
}
