import type { TemplateDefinition } from './types'

export type KpiForecastRunRateProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  goodColor: string
  badColor: string
}

function shadowCss(p: KpiForecastRunRateProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const kpiForecastRunRateTemplate: TemplateDefinition<KpiForecastRunRateProps> = {
  id: 'kpi-forecast-run-rate',
  name: 'Forecast / Run-rate Card',
  description: 'Projects end-of-period based on current pace and shows probability of hitting target.',
  tags: ['forecast', 'run-rate', 'target', 'kpi'],
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
    badColor: '#ff4d4f',
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
    { id: 'badColor', label: 'Bad Color', type: 'color' },
  ],
  renderPreviewHtml: (p) => {
    const shadow = shadowCss(p)

    const actualToDate: number = 420000
    const daysElapsed: number = 12
    const daysInPeriod: number = 30
    const target: number = 900000

    const pace = daysElapsed === 0 ? 0 : actualToDate / daysElapsed
    const forecast = pace * daysInPeriod
    const hitPct = target === 0 ? 0 : forecast / target

    const onTrack = hitPct >= 1
    const badgeColor = onTrack ? p.goodColor : p.badColor
    const badgeText = onTrack ? 'ON TRACK' : 'AT RISK'

    const progress = target === 0 ? 0 : actualToDate / target

    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:18px 20px; min-width:380px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
    <div>
      <div style="color:${p.textColor}; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;">Forecast / Run-rate</div>
      <div style="margin-top:8px; color:${p.textColor}; font-size:30px; font-weight:900; line-height:1;">$${(forecast / 1000).toFixed(0)}k</div>
      <div style="margin-top:6px; color:${p.textColor}; opacity:0.65; font-size:12px;">Target: $${(target / 1000).toFixed(0)}k • To-date: $${(actualToDate / 1000).toFixed(0)}k</div>
    </div>
    <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:${badgeColor}; font-weight:900; font-size:12px;">${badgeText}</div>
  </div>

  <div style="margin-top:14px; height:8px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; position:relative;">
    <div style="width:${Math.min(100, Math.max(0, progress * 100))}%; height:100%; background:${p.accentColor};"></div>
    <div style="position:absolute; top:-4px; bottom:-4px; width:2px; left:100%; background:${p.textColor}; opacity:0.35; transform:translateX(-50%);"></div>
  </div>

  <div style="margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:${p.textColor}; opacity:0.7;">
    <span>Pace: $${(pace / 1000).toFixed(1)}k/day</span>
    <span>Forecast vs Target: {(hitPct * 100).toFixed(0)}%</span>
  </div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)

    return `Forecast / Run-rate Measure =
-- Suggested inputs:
-- [Actual To Date] = KPI actual accumulated in current period
-- [Days Elapsed] = days elapsed in current period
-- [Days In Period] = total days in period
-- [Target] = target for the period

VAR _Actual = [Actual To Date]
VAR _DaysElapsed = [Days Elapsed]
VAR _DaysInPeriod = [Days In Period]
VAR _Target = [Target]

VAR _Pace = DIVIDE(_Actual, _DaysElapsed, 0)
VAR _Forecast = _Pace * _DaysInPeriod
VAR _HitPct = DIVIDE(_Forecast, _Target, 0)
VAR _Progress = DIVIDE(_Actual, _Target, 0)

VAR _BadgeText = IF(_HitPct >= 1, "ON TRACK", "AT RISK")
VAR _BadgeColor = IF(_HitPct >= 1, "${p.goodColor}", "${p.badColor}")

VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _AccentColor = "${p.accentColor}"
VAR _Radius = "${p.radius}px"

RETURN
"<div style='background:" & _BgColor & "; border-radius:" & _Radius & "; padding:18px 20px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1); min-width:380px;'>" &
"<div style='display:flex; justify-content:space-between; align-items:flex-start; gap:12px;'>" &
"<div>" &
"<div style='color:" & _TextColor & "; opacity:0.75; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4px;'>Forecast / Run-rate</div>" &
"<div style='margin-top:8px; color:" & _TextColor & "; font-size:30px; font-weight:900; line-height:1;>' & FORMAT(_Forecast, "#,0") & '</div>' &
"<div style='margin-top:6px; color:" & _TextColor & "; opacity:0.65; font-size:12px;'>Target: " & FORMAT(_Target, "#,0") & " • To-date: " & FORMAT(_Actual, "#,0") & "</div>" &
"</div>" &
"<div style='background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.10); padding:6px 10px; border-radius:999px; color:" & _BadgeColor & "; font-weight:900; font-size:12px;>' & _BadgeText & '</div>' &
"</div>" &
"<div style='margin-top:14px; height:8px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; position:relative;'>" &
"<div style='width:" & FORMAT(MIN(1, MAX(0, _Progress)), "0%") & "; height:100%; background:" & _AccentColor & ";'></div>" &
"<div style='position:absolute; top:-4px; bottom:-4px; width:2px; left:100%; background:" & _TextColor & "; opacity:0.35; transform:translateX(-50%);'></div>" &
"</div>" &
"<div style='margin-top:10px; display:flex; justify-content:space-between; font-size:11px; color:" & _TextColor & "; opacity:0.7;'><span>Pace: " & FORMAT(_Pace, "#,0.0") & "/day</span><span>Forecast vs Target: " & FORMAT(_HitPct, "0%") & "</span></div>" &
"</div>"`
  },
}
