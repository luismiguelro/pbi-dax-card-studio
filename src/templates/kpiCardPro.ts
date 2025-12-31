import type { TemplateDefinition } from './types'

export type KpiCardProProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  iconName: string
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  footerType: 'none' | 'progress' | 'dumbbell'
  progressValuePct: number
  progressBgColor: string
  targetLabel: string
  targetPct: number
  targetMarkerType: 'line' | 'arrow' | 'circle' | 'none'
  targetMarkerColor: string
  dumbPrevColor: string
  dumbPrevPct: number
  dumbCurrPct: number
}

const styleImport =
  "<style>@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'); .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; }</style>"

function clampPct(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function shadowCss(p: KpiCardProProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

function footerHtml(p: KpiCardProProps) {
  if (p.footerType === 'progress') {
    const prog = clampPct(p.progressValuePct)
    const targetPct = clampPct(p.targetPct)

    let marker = ''
    if (p.targetMarkerType === 'line') {
      marker = `<div style="position:absolute; top:-2px; bottom:-2px; width:2px; left:${targetPct}%; background:${p.targetMarkerColor}; transform:translateX(-50%); z-index:2;"></div>`
    } else if (p.targetMarkerType === 'arrow') {
      marker = `<div style="position:absolute; top:-10px; left:${targetPct}%; transform:translateX(-50%); color:${p.targetMarkerColor}; font-size:10px;">▼</div>`
    } else if (p.targetMarkerType === 'circle') {
      marker = `<div style="position:absolute; top:50%; left:${targetPct}%; width:8px; height:8px; background:${p.targetMarkerColor}; border-radius:50%; transform:translate(-50%,-50%); border:1px solid ${p.bgColor};"></div>`
    }

    const metaLegend =
      p.targetMarkerType !== 'none'
        ? `<div style="font-size:10px; opacity:0.8; display:flex; align-items:center; gap:4px;"><span style="width:2px; height:8px; background:${p.targetMarkerColor}; display:block;"></span> ${p.targetLabel}: ${targetPct}%</div>`
        : ''

    return `<div style="margin-top:20px; border-top:1px solid rgba(128,128,128,0.1); padding-top:10px;"><div style="display:flex; justify-content:space-between; margin-bottom:4px; color:${p.textColor};"><div style="font-size:10px; opacity:0.8;">Progress: ${prog}%</div>${metaLegend}</div><div style="height:6px; background:${p.progressBgColor}; border-radius:3px; width:100%; position:relative;"><div style="height:100%; width:${prog}%; background:${p.accentColor}; border-radius:3px;"></div>${marker}</div></div>`
  }

  if (p.footerType === 'dumbbell') {
    const prev = clampPct(p.dumbPrevPct)
    const curr = clampPct(p.dumbCurrPct)
    const minP = Math.min(prev, curr)
    const widthP = Math.abs(curr - prev)

    return `<div style="margin-top:20px; border-top:1px solid rgba(128,128,128,0.1); padding-top:10px;"><div style="position:relative; width:100%; height:12px; display:flex; align-items:center;"><div style="position:absolute; left:${minP}%; width:${widthP}%; height:2px; background:${p.textColor}; opacity:0.3;"></div><div style="position:absolute; left:${prev}%; width:8px; height:8px; background:${p.dumbPrevColor}; border-radius:50%; transform:translateX(-50%);"></div><div style="position:absolute; left:${curr}%; width:12px; height:12px; background:${p.accentColor}; border-radius:50%; transform:translateX(-50%); border:2px solid ${p.bgColor};"></div></div><div style="display:flex; justify-content:space-between; font-size:10px; color:${p.textColor}; opacity:0.6; margin-top:4px;"><span>Prev: ${prev}</span><span>Current: ${curr}</span></div></div>`
  }

  return ''
}

export const kpiCardProTemplate: TemplateDefinition<KpiCardProProps> = {
  id: 'kpi-card-pro',
  name: 'KPI Card Pro',
  description: 'Icon + value + optional footer (progress/target or dumbbell).',
  tags: ['kpi', 'card', 'progress', 'dumbbell'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    iconName: 'monitoring',
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    footerType: 'progress',
    progressValuePct: 70,
    progressBgColor: '#3e3e42',
    targetLabel: 'Target',
    targetPct: 85,
    targetMarkerType: 'line',
    targetMarkerColor: '#ff4d4f',
    dumbPrevColor: '#777777',
    dumbPrevPct: 40,
    dumbCurrPct: 80,
  },
  controls: [
    { id: 'accentColor', label: 'Accent Color', type: 'color' },
    { id: 'textColor', label: 'Text Color', type: 'color' },
    { id: 'bgColor', label: 'Background Color', type: 'color' },
    { id: 'radius', label: 'Border Radius', type: 'range', min: 0, max: 24, step: 1 },
    {
      id: 'iconName',
      label: 'Icon Name',
      type: 'select',
      options: [
        { value: 'monitoring', label: '📊 monitoring' },
        { value: 'trending_up', label: '📈 trending_up' },
        { value: 'analytics', label: '📉 analytics' },
        { value: 'shopping_cart', label: '🛒 shopping_cart' },
        { value: 'attach_money', label: '💰 attach_money' },
        { value: 'paid', label: '💸 paid' },
        { value: 'savings', label: '🏦 savings' },
        { value: 'receipt_long', label: '🧾 receipt_long' },
        { value: 'inventory', label: '📦 inventory' },
        { value: 'store', label: '🏪 store' },
        { value: 'payments', label: '💳 payments' },
        { value: 'account_balance', label: '💼 account_balance' },
        { value: 'credit_score', label: '📊 credit_score' },
        { value: 'wallet', label: '👛 wallet' },
        { value: 'sell', label: '💵 sell' },
        { value: 'local_shipping', label: '🚚 local_shipping' },
        { value: 'speed', label: '⚡ speed' },
        { value: 'rocket_launch', label: '🚀 rocket_launch' },
        { value: 'emoji_events', label: '🏆 emoji_events' },
        { value: 'military_tech', label: '🏅 military_tech' },
      ],
    },
    { id: 'shadowX', label: 'Shadow X', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowY', label: 'Shadow Y', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowBlur', label: 'Shadow Blur', type: 'range', min: 0, max: 50, step: 1 },
    { id: 'shadowOpacity', label: 'Shadow Opacity', type: 'range', min: 0, max: 100, step: 1 },
    {
      id: 'footerType',
      label: 'Footer',
      type: 'select',
      options: [
        { value: 'none', label: 'None' },
        { value: 'progress', label: 'Progress Bar' },
        { value: 'dumbbell', label: 'Dumbbell' },
      ],
    },
    { id: 'progressValuePct', label: 'Progress (%)', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'progressBgColor', label: 'Progress Track Color', type: 'color' },
    { id: 'targetLabel', label: 'Target Label', type: 'text', placeholder: 'Target' },
    { id: 'targetPct', label: 'Target (%)', type: 'range', min: 0, max: 100, step: 1 },
    {
      id: 'targetMarkerType',
      label: 'Target Marker',
      type: 'select',
      options: [
        { value: 'line', label: 'Line' },
        { value: 'arrow', label: 'Arrow' },
        { value: 'circle', label: 'Circle' },
        { value: 'none', label: 'None' },
      ],
    },
    { id: 'targetMarkerColor', label: 'Marker Color', type: 'color' },
    { id: 'dumbPrevColor', label: 'Previous Color', type: 'color' },
    { id: 'dumbPrevPct', label: 'Previous (%)', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'dumbCurrPct', label: 'Current (%)', type: 'range', min: 0, max: 100, step: 1 },
  ],
  renderPreviewHtml: (p) => {
    const footer = footerHtml(p)
    const shadow = shadowCss(p)
    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:24px; min-width:300px; box-shadow:${shadow}; display:flex; flex-direction:column; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; align-items:center; gap:16px;">
    <span class="material-symbols-outlined" style="font-size:40px; color:${p.accentColor};">${p.iconName}</span>
    <div>
      <div style="color:${p.textColor}; opacity:0.7; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Total Sales</div>
      <div style="color:${p.textColor}; font-size:32px; font-weight:bold; line-height:1;">1.5Mi</div>
    </div>
  </div>
  ${footer}
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)

    let daxFooter = 'VAR _FtHtml = ""'

    if (p.footerType === 'progress') {
      const markerType = p.targetMarkerType
      const targetMarkerColor = p.targetMarkerColor
      const targetLabel = p.targetLabel

      const markerLogic =
        markerType === 'line'
          ? `"<div style='position:absolute; top:-2px; bottom:-2px; width:2px; left:" & _FtTargetPct & "; background:${targetMarkerColor}; transform:translateX(-50%); z-index:2;'></div>"`
          : markerType === 'arrow'
            ? `"<div style='position:absolute; top:-10px; left:" & _FtTargetPct & "; transform:translateX(-50%); color:${targetMarkerColor}; font-size:10px;'>▼</div>"`
            : markerType === 'circle'
              ? `"<div style='position:absolute; top:50%; left:" & _FtTargetPct & "; width:8px; height:8px; background:${targetMarkerColor}; border-radius:50%; transform:translate(-50%,-50%); border:1px solid " & _BgColor & ";'></div>"`
              : `""`

      const metaLegendLogic =
        markerType === 'none'
          ? `""`
          : `"<div style='font-size:10px; opacity:0.8; display:flex; align-items:center; gap:4px;'><span style='width:2px; height:8px; background:${targetMarkerColor}; display:block;'></span> ${targetLabel}: " & FORMAT(_FtTarget, "0%") & "</div>"`

      daxFooter = `VAR _FtVal = [KPI Progress]\nVAR _FtTarget = [KPI Target]\nVAR _FtWidth = FORMAT(MIN(1, MAX(0, _FtVal)), "0%")\nVAR _FtTargetPct = FORMAT(MIN(1, MAX(0, _FtTarget)), "0%")\nVAR _FtMarkerHtml = ${markerLogic}\nVAR _FtHtml = "<div style='margin-top:20px; border-top:1px solid rgba(128,128,128,0.1); padding-top:10px;'><div style='display:flex; justify-content:space-between; margin-bottom:4px; color:" & _TextColor & ";'><div style='font-size:10px; opacity:0.8;'>Progress: " & FORMAT(_FtVal, "0%") & "</div>" & ${metaLegendLogic} & "</div><div style='height:6px; background-color:${p.progressBgColor}; border-radius:3px; width:100%; position:relative;'><div style='height:100%; width:" & _FtWidth & "; background-color:" & _AccentColor & "; border-radius:3px;'></div>" & _FtMarkerHtml & "</div></div>"`
    } else if (p.footerType === 'dumbbell') {
      daxFooter = `VAR _DValPrev = [KPI Prev]\nVAR _DValCurr = [KPI Curr]\nVAR _DMax = [KPI Max]\nVAR _DPctPrev = DIVIDE(_DValPrev, _DMax, 0) * 100\nVAR _DPctCurr = DIVIDE(_DValCurr, _DMax, 0) * 100\nVAR _DStart = MIN(_DPctPrev, _DPctCurr) & "%"\nVAR _DWidth = ABS(_DPctCurr - _DPctPrev) & "%"\nVAR _DPrevColor = "${p.dumbPrevColor}"\nVAR _FtHtml = "<div style='margin-top:20px; border-top:1px solid rgba(128,128,128,0.1); padding-top:10px;'><div style='position:relative; width:100%; height:12px; display:flex; align-items:center;'><div style='position:absolute; left:" & _DStart & "; width:" & _DWidth & "; height:2px; background-color:" & _TextColor & "; opacity:0.3;'></div><div style='position:absolute; left:" & _DPctPrev & "%" & "; width:8px; height:8px; background-color:" & _DPrevColor & "; border-radius:50%; transform:translateX(-50%);'></div><div style='position:absolute; left:" & _DPctCurr & "%" & "; width:12px; height:12px; background-color:" & _AccentColor & "; border-radius:50%; transform:translateX(-50%); border:2px solid " & _BgColor & ";'></div></div><div style='display:flex; justify-content:space-between; font-size:10px; color:" & _TextColor & "; opacity:0.6; margin-top:4px;'><span>Prev: " & FORMAT(_DValPrev, "#,0") & "</span><span>Current: " & FORMAT(_DValCurr, "#,0") & "</span></div></div>"`
    }

    return `KPI Card Pro - Value =
[YourMeasure]

-- Example: [Total Sales]
-- This is your main KPI value (current period)

KPI Card Pro - Progress =
[KPI Progress]

-- Example: Progress = DIVIDE([Total Sales], [Sales Target])
-- Returns 0..1 (percentage) representing progress toward a target
-- Ensure [Sales Target] is not BLANK; otherwise return 0
-- VAR _Progress = DIVIDE([Total Sales], [Sales Target], 0)

KPI Card Pro - Target =
[KPI Target]

-- Example: [Sales Target]
-- This can be a static number, a measure, or a slicer selection
-- If you use a slicer, you might need SELECTEDVALUE
-- VAR _Target = SELECTEDVALUE('Targets'[TargetValue], 0)

KPI Card Pro - Prev =
[KPI Prev]

-- Example: [Total Sales Prev Period]
-- Usually calculated with SAMEPERIODLASTYEAR or DATEADD
-- VAR _Prev = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
-- VAR _Prev = CALCULATE([Total Sales], DATEADD('Date'[Date], -1, MONTH))

KPI Card Pro - Curr =
[KPI Curr]

-- Example: [Total Sales Current Period]
-- Often the same as [YourMeasure] but can be filtered differently
-- VAR _Curr = CALCULATE([Total Sales], DATESBETWEEN('Date'[Date], [Start], [End]))

KPI Card Pro - Max =
[KPI Max]

-- Example: [Maximum Sales Ever] or a fixed denominator for dumbbell
-- VAR _Max = MAXX(ALL('Date'), [Total Sales])
-- VAR _Max = 1000000  -- fixed 1M as denominator

KPI Card Pro - HTML =
VAR _Value = FORMAT([YourMeasure], "#,##0")
VAR _Title = "Total Sales"
VAR _BgColor = "${p.bgColor}"
VAR _TextColor = "${p.textColor}"
VAR _AccentColor = "${p.accentColor}"
VAR _Radius = "${p.radius}px"
VAR _IconName = "${p.iconName}"
${daxFooter}

RETURN
"${styleImport}" &
"<div style='background-color: " & _BgColor & "; border-radius: " & _Radius & "; padding: 24px; box-shadow: ${shadow}; font-family: Segoe UI, sans-serif; color: " & _TextColor & ";'>\n    <div style='display: flex; align-items: center; gap: 16px;'>\n        <span class='material-symbols-outlined' style='font-size: 40px; color: " & _AccentColor & ";'>" & _IconName & "</span>\n        <div>\n            <div style='opacity:0.7; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;'>" & _Title & "</div>\n            <div style='font-size: 32px; font-weight: bold; line-height: 1;'>" & _Value & "</div>\n        </div>\n    </div>" & _FtHtml & "\n</div>"`
  },
}
