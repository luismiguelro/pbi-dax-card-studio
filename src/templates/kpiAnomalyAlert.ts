import type { TemplateDefinition } from './types'

export type KpiAnomalyAlertProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  okColor: string
  alertColor: string
  warnColor: string
  thresholdPct: number
}

function shadowCss(p: KpiAnomalyAlertProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const kpiAnomalyAlertTemplate: TemplateDefinition<KpiAnomalyAlertProps> = {
  id: 'kpi-anomaly-alert',
  name: 'Anomaly / Alert Card',
  description: 'Flags anomalies vs a baseline (moving average) and shows a message + severity.',
  tags: ['alert', 'anomaly', 'kpi', 'monitoring'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    okColor: '#4caf50',
    warnColor: '#ffb020',
    alertColor: '#ff4d4f',
    thresholdPct: 15,
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
    { id: 'okColor', label: 'OK Color', type: 'color' },
    { id: 'warnColor', label: 'Warn Color', type: 'color' },
    { id: 'alertColor', label: 'Alert Color', type: 'color' },
    { id: 'thresholdPct', label: 'Threshold (%)', type: 'range', min: 1, max: 80, step: 1 },
  ],
  renderPreviewHtml: (p) => {
    const shadow = shadowCss(p)

    const current: number = 820
    const baseline: number = 1000
    const changePct = baseline === 0 ? 0 : (current - baseline) / baseline

    const th = Math.max(0.01, Math.min(0.8, p.thresholdPct / 100))
    const absChange = Math.abs(changePct)

    const severity = absChange >= th * 2 ? 'ALERT' : absChange >= th ? 'WARN' : 'OK'
    const sevColor =
      severity === 'ALERT' ? p.alertColor : severity === 'WARN' ? p.warnColor : p.okColor

    const arrow = changePct >= 0 ? '▲' : '▼'

    const msg =
      severity === 'OK'
        ? 'No unusual movement detected.'
        : severity === 'WARN'
          ? 'Movement outside threshold. Investigate drivers.'
          : 'Significant anomaly detected. Act now.'

    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:18px 20px; min-width:360px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
    <div>
      <div style="color:${p.textColor}; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;">Anomaly Monitor</div>
      <div style="margin-top:8px; color:${p.textColor}; font-size:30px; font-weight:900; line-height:1;">${current}</div>
      <div style="margin-top:6px; color:${p.textColor}; opacity:0.7; font-size:12px;">Baseline: ${baseline}</div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
      <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:${sevColor}; font-weight:900; font-size:12px;">${severity}</div>
      <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:${sevColor}; font-weight:900; font-size:12px;">${arrow} ${(Math.abs(changePct) * 100).toFixed(1)}%</div>
    </div>
  </div>

  <div style="margin-top:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px; color:${p.textColor}; opacity:0.85; font-size:12px;">
    ${msg}
  </div>

  <div style="margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:${p.textColor}; opacity:0.6;">
    <span>Threshold: ±${p.thresholdPct}%</span>
    <span>Suggested: open Drivers card</span>
  </div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    const th = Math.max(0.01, Math.min(0.8, p.thresholdPct / 100))

    return `Anomaly Alert Measure =
-- Suggested inputs:
-- [KPI Value] = current period value
-- [KPI Baseline] = baseline value (e.g., moving average)

VAR _Current = [KPI Value]
VAR _Baseline = [KPI Baseline]

VAR _ChangePct = DIVIDE(_Current - _Baseline, _Baseline, 0)
VAR _Abs = ABS(_ChangePct)

VAR _Th = ${th}

VAR _Severity =
    IF(
        _Abs >= _Th * 2,
        "ALERT",
        IF(_Abs >= _Th, "WARN", "OK")
    )

VAR _Color =
    SWITCH(
        _Severity,
        "ALERT", "${p.alertColor}",
        "WARN", "${p.warnColor}",
        "${p.okColor}"
    )

VAR _Arrow = IF(_ChangePct >= 0, "▲", "▼")

VAR _Msg =
    SWITCH(
        _Severity,
        "OK", "No unusual movement detected.",
        "WARN", "Movement outside threshold. Investigate drivers.",
        "Significant anomaly detected. Act now."
    )

VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _Radius = "${p.radius}px"

RETURN
"<div style='background:" & _BgColor & "; border-radius:" & _Radius & "; padding:18px 20px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1); min-width:360px;'>" &
"<div style='display:flex; justify-content:space-between; align-items:flex-start; gap:12px;'>" &
"<div>" &
"<div style='color:" & _TextColor & "; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;'>Anomaly Monitor</div>" &
"<div style='margin-top:8px; color:" & _TextColor & "; font-size:30px; font-weight:900; line-height:1;>' & FORMAT(_Current, "#,0.##") & '</div>' &
"<div style='margin-top:6px; color:" & _TextColor & "; opacity:0.7; font-size:12px;'>Baseline: " & FORMAT(_Baseline, "#,0.##") & "</div>" &
"</div>" &
"<div style='display:flex; flex-direction:column; align-items:flex-end; gap:8px;'>" &
"<div style='background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:" & _Color & "; font-weight:900; font-size:12px;>' & _Severity & '</div>' &
"<div style='background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:" & _Color & "; font-weight:900; font-size:12px;>' & _Arrow & ' ' & FORMAT(ABS(_ChangePct), "0.0%") & '</div>' &
"</div>" &
"</div>" &
"<div style='margin-top:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px; color:" & _TextColor & "; opacity:0.85; font-size:12px;>' & _Msg & '</div>' &
"<div style='margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:" & _TextColor & "; opacity:0.6;'><span>Threshold: ±${p.thresholdPct}%</span><span>Suggested: open Drivers card</span></div>" &
"</div>"`
  },
}
