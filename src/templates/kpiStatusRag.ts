import type { TemplateDefinition } from './types'

export type KpiStatusRagProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  goodColor: string
  warnColor: string
  badColor: string
  goodThresholdPct: number
  warnThresholdPct: number
}

function shadowCss(p: KpiStatusRagProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

function clampPct(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(200, n))
}

export const kpiStatusRagTemplate: TemplateDefinition<KpiStatusRagProps> = {
  id: 'kpi-status-rag',
  name: 'KPI Status (RAG + Target + Gap)',
  description: 'Status color (green/amber/red) based on KPI vs target, with gap and delta.',
  tags: ['kpi', 'status', 'target', 'rag', 'delta'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    goodColor: '#4caf50',
    warnColor: '#ffb020',
    badColor: '#ff4d4f',
    goodThresholdPct: 100,
    warnThresholdPct: 90,
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
    { id: 'goodColor', label: 'Good Color', type: 'color' },
    { id: 'warnColor', label: 'Warn Color', type: 'color' },
    { id: 'badColor', label: 'Bad Color', type: 'color' },
    { id: 'goodThresholdPct', label: 'Good Threshold (% of target)', type: 'range', min: 0, max: 200, step: 1 },
    { id: 'warnThresholdPct', label: 'Warn Threshold (% of target)', type: 'range', min: 0, max: 200, step: 1 },
  ],
  renderPreviewHtml: (p) => {
    const shadow = shadowCss(p)
    const kpi: number = 92
    const target: number = 100
    const prev: number = 88
    const pctOfTarget = target === 0 ? 0 : (kpi / target) * 100

    const good = clampPct(p.goodThresholdPct)
    const warn = clampPct(p.warnThresholdPct)

    const status = pctOfTarget >= good ? 'ON TRACK' : pctOfTarget >= warn ? 'AT RISK' : 'OFF TRACK'
    const statusColor = pctOfTarget >= good ? p.goodColor : pctOfTarget >= warn ? p.warnColor : p.badColor
    const delta = prev === 0 ? 0 : (kpi - prev) / Math.max(1, Math.abs(prev))
    const deltaArrow = delta >= 0 ? '▲' : '▼'
    const gap = kpi - target
    const gapSign = gap >= 0 ? '+' : ''

    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:20px 22px; min-width:340px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
    <div>
      <div style="color:${p.textColor}; opacity:0.75; font-size:12px; font-weight:700; letter-spacing:0.4px; text-transform:uppercase;">KPI Health</div>
      <div style="margin-top:6px; color:${p.textColor}; font-size:34px; font-weight:900; line-height:1;">${kpi}</div>
      <div style="margin-top:6px; color:${p.textColor}; opacity:0.70; font-size:12px;">Target: ${target} • Gap: ${gapSign}${gap}</div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
      <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:${statusColor}; font-weight:800; font-size:12px;">${status}</div>
      <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:${delta >= 0 ? p.goodColor : p.badColor}; font-weight:800; font-size:12px;">${deltaArrow} ${Math.abs(delta * 100).toFixed(1)}%</div>
    </div>
  </div>

  <div style="margin-top:14px; height:8px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; position:relative;">
    <div style="width:${Math.min(100, Math.max(0, pctOfTarget))}%; height:100%; background:${p.accentColor};"></div>
    <div style="position:absolute; top:-4px; bottom:-4px; width:2px; left:100%; background:${p.textColor}; opacity:0.35; transform:translateX(-50%);"></div>
  </div>

  <div style="margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:${p.textColor}; opacity:0.7;">
    <span>% of Target: ${pctOfTarget.toFixed(0)}%</span>
    <span>Prev: ${prev}</span>
  </div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)

    return `KPI Status RAG Measure =
VAR _KPI = [KPI Value]
VAR _Target = [KPI Target]
VAR _Prev = [KPI Prev]

VAR _PctOfTarget = DIVIDE(_KPI, _Target, 0)
VAR _Gap = _KPI - _Target
VAR _Delta = DIVIDE(_KPI - _Prev, ABS(_Prev), 0)

VAR _GoodTh = ${Math.max(0, Math.min(2, p.goodThresholdPct / 100))}
VAR _WarnTh = ${Math.max(0, Math.min(2, p.warnThresholdPct / 100))}

VAR _StatusLabel =
    IF(
        _PctOfTarget >= _GoodTh,
        "ON TRACK",
        IF(_PctOfTarget >= _WarnTh, "AT RISK", "OFF TRACK")
    )

VAR _StatusColor =
    IF(
        _PctOfTarget >= _GoodTh,
        "${p.goodColor}",
        IF(_PctOfTarget >= _WarnTh, "${p.warnColor}", "${p.badColor}")
    )

VAR _DeltaArrow = IF(_Delta >= 0, "▲", "▼")
VAR _DeltaColor = IF(_Delta >= 0, "${p.goodColor}", "${p.badColor}")

VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _AccentColor = "${p.accentColor}"
VAR _Radius = "${p.radius}px"

VAR _PctWidth = MIN(1, MAX(0, _PctOfTarget))

RETURN
"<div style='background:" & _BgColor & "; border-radius:" & _Radius & "; padding:20px 22px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1); min-width:340px;'>" &
"<div style='display:flex; justify-content:space-between; align-items:flex-start; gap:12px;'>" &
"<div>" &
"<div style='color:" & _TextColor & "; opacity:0.75; font-size:12px; font-weight:700; letter-spacing:0.4px; text-transform:uppercase;'>KPI</div>" &
"<div style='margin-top:6px; color:" & _TextColor & "; font-size:34px; font-weight:900; line-height:1;>' & FORMAT(_KPI, "#,0.##") & '</div>' &
"<div style='margin-top:6px; color:" & _TextColor & "; opacity:0.70; font-size:12px;'>Target: " & FORMAT(_Target, "#,0.##") & " • Gap: " & IF(_Gap>=0, "+", "") & FORMAT(_Gap, "#,0.##") & "</div>" &
"</div>" &
"<div style='display:flex; flex-direction:column; align-items:flex-end; gap:8px;'>" &
"<div style='background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:" & _StatusColor & "; font-weight:800; font-size:12px;>' & _StatusLabel & '</div>' &
"<div style='background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:" & _DeltaColor & "; font-weight:800; font-size:12px;>' & _DeltaArrow & ' ' & FORMAT(ABS(_Delta), "0.0%") & '</div>' &
"</div>" &
"</div>" &
"<div style='margin-top:14px; height:8px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; position:relative;'>" &
"<div style='width:" & FORMAT(_PctWidth, "0%") & "; height:100%; background:" & _AccentColor & ";'></div>" &
"<div style='position:absolute; top:-4px; bottom:-4px; width:2px; left:100%; background:" & _TextColor & "; opacity:0.35; transform:translateX(-50%);'></div>" &
"</div>" &
"<div style='margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:" & _TextColor & "; opacity:0.7;'><span>% of Target: " & FORMAT(_PctOfTarget, "0%") & "</span><span>Prev: " & FORMAT(_Prev, "#,0.##") & "</span></div>" &
"</div>"`
  },
}
