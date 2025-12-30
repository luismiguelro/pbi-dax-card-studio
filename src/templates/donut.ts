import type { TemplateDefinition } from './types'

export type DonutProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  valuePct: number
  ringBgColor: string
  size: number
}

function clampPct(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function shadowCss(p: DonutProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const donutTemplate: TemplateDefinition<DonutProps> = {
  id: 'donut',
  name: 'Donut (Progress)',
  description: 'SVG donut with centered percentage label.',
  tags: ['kpi', 'donut', 'svg'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    valuePct: 68,
    ringBgColor: 'rgba(255,255,255,0.10)',
    size: 120,
  },
  controls: [
    { id: 'accentColor', label: 'Progress Color', type: 'color' },
    { id: 'textColor', label: 'Text Color', type: 'color' },
    { id: 'bgColor', label: 'Background Color', type: 'color' },
    { id: 'radius', label: 'Border Radius', type: 'range', min: 0, max: 24, step: 1 },
    { id: 'shadowX', label: 'Shadow X', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowY', label: 'Shadow Y', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowBlur', label: 'Shadow Blur', type: 'range', min: 0, max: 50, step: 1 },
    { id: 'shadowOpacity', label: 'Shadow Opacity', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'valuePct', label: 'Progress (%)', type: 'range', min: 0, max: 100, step: 1 },
    {
      id: 'ringBgColor',
      label: 'Ring Background Color',
      type: 'select',
      options: [
        { value: 'rgba(255,255,255,0.10)', label: 'White 10% (default)' },
        { value: 'rgba(255,255,255,0.20)', label: 'White 20%' },
        { value: 'rgba(255,255,255,0.06)', label: 'White 6%' },
        { value: 'rgba(0,0,0,0.20)', label: 'Black 20%' },
        { value: 'rgba(0,0,0,0.35)', label: 'Black 35%' },
        { value: 'transparent', label: 'Transparent' },
      ],
    },
    { id: 'size', label: 'Size', type: 'range', min: 80, max: 200, step: 1 },
  ],
  renderPreviewHtml: (p) => {
    const value = clampPct(p.valuePct)
    const size = Math.max(80, Math.min(220, p.size))
    const stroke = Math.max(8, Math.round(size * 0.12))
    const r = (size - stroke) / 2
    const c = 2 * Math.PI * r
    const dash = (value / 100) * c
    const shadow = shadowCss(p)

    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:18px 20px; min-width:320px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1); display:flex; align-items:center; justify-content:space-between; gap:16px;">
  <div>
    <div style="color:${p.textColor}; opacity:0.75; font-size:12px; font-weight:700; letter-spacing:0.4px; text-transform:uppercase; margin-bottom:8px;">SLA</div>
    <div style="color:${p.textColor}; font-size:28px; font-weight:900;">${value}%</div>
    <div style="color:${p.textColor}; opacity:0.65; font-size:12px; margin-top:6px;">Last 30 days</div>
  </div>
  <div style="width:${size}px; height:${size}px; position:relative;">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${p.ringBgColor}" stroke-width="${stroke}" fill="none" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${p.accentColor}" stroke-width="${stroke}" fill="none" stroke-linecap="round" stroke-dasharray="${dash} ${c - dash}" transform="rotate(-90 ${size / 2} ${size / 2})" />
    </svg>
    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:${p.textColor}; font-weight:900;">${value}%</div>
  </div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    return `Donut - Pct =
[KPI Pct]

Donut - HTML =
VAR _PctRaw = [KPI Pct]
VAR _Pct = MIN(1, MAX(0, _PctRaw))

VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _Color = "${p.accentColor}"
VAR _Size = ${Math.max(80, Math.min(220, p.size))}
VAR _Stroke = ROUND(_Size * 0.12, 0)
VAR _R = (_Size - _Stroke) / 2
VAR _C = 2 * PI() * _R
VAR _Dash = _Pct * _C

RETURN
"<div style='background-color:" & _BgColor & "; border-radius:${p.radius}px; padding:18px 20px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1); display:flex; align-items:center; justify-content:space-between; gap:16px;'>" &
"<div><div style='color:" & _TextColor & "; opacity:0.75; font-size:12px; font-weight:700; letter-spacing:0.4px; text-transform:uppercase; margin-bottom:8px;'>SLA</div>" &
"<div style='color:" & _TextColor & "; font-size:28px; font-weight:900;'>" & FORMAT(_Pct, "0%") & "</div></div>" &
"<svg width='" & _Size & "' height='" & _Size & "' viewBox='0 0 " & _Size & " " & _Size & "'>" &
"<circle cx='" & (_Size/2) & "' cy='" & (_Size/2) & "' r='" & _R & "' stroke='${p.ringBgColor}' stroke-width='" & _Stroke & "' fill='none'/>" &
"<circle cx='" & (_Size/2) & "' cy='" & (_Size/2) & "' r='" & _R & "' stroke='" & _Color & "' stroke-width='" & _Stroke & "' fill='none' stroke-linecap='round' stroke-dasharray='" & _Dash & " " & (_C - _Dash) & "' transform='rotate(-90 " & (_Size/2) & " " & (_Size/2) & ")'/>" &
"</svg></div>"`
  },
}
