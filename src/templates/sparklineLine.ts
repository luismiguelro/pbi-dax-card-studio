import type { TemplateDefinition } from './types'

export type SparklineLineProps = {
  accentColor: string
  textColor: string
  bgColor: string
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  strokeWidth: number
  showArea: boolean
  areaOpacity: number
  showDots: boolean
}

function shadowCss(p: SparklineLineProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const sparklineLineTemplate: TemplateDefinition<SparklineLineProps> = {
  id: 'sparkline-line',
  name: 'Sparkline (Line)',
  description: 'Mini trend line in SVG with optional area fill and markers.',
  tags: ['sparkline', 'svg', 'trend'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    strokeWidth: 2,
    showArea: true,
    areaOpacity: 20,
    showDots: false,
  },
  controls: [
    { id: 'accentColor', label: 'Accent Color', type: 'color' },
    { id: 'textColor', label: 'Text Color', type: 'color' },
    { id: 'bgColor', label: 'Background Color', type: 'color' },
    { id: 'shadowX', label: 'Shadow X', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowY', label: 'Shadow Y', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowBlur', label: 'Shadow Blur', type: 'range', min: 0, max: 50, step: 1 },
    { id: 'shadowOpacity', label: 'Shadow Opacity', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'strokeWidth', label: 'Line Width', type: 'range', min: 1, max: 5, step: 1 },
    { id: 'showArea', label: 'Fill Area', type: 'checkbox' },
    { id: 'areaOpacity', label: 'Area Opacity', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'showDots', label: 'Show Markers', type: 'checkbox' },
  ],
  renderPreviewHtml: (p) => {
    const width = 200
    const height = 80
    const dataPoints = [20, 45, 30, 60, 50, 80, 75, 90, 60, 85]
    const maxVal = Math.max(...dataPoints)
    const stepX = width / (dataPoints.length - 1)

    let pathD = `M 0 ${height - (dataPoints[0] / maxVal) * height}`
    let pointsHtml = ''

    dataPoints.forEach((val, i) => {
      const x = i * stepX
      const y = height - (val / maxVal) * height
      if (i > 0) pathD += ` L ${x} ${y}`
      if (p.showDots) {
        pointsHtml += `<circle cx="${x}" cy="${y}" r="3" fill="${p.accentColor}" stroke="${p.bgColor}" stroke-width="1" />`
      }
    })

    const areaOpacity = Math.max(0, Math.min(1, p.areaOpacity / 100))
    const areaPath = p.showArea
      ? `<path d="${pathD} L ${width} ${height} L 0 ${height} Z" fill="${p.accentColor}" fill-opacity="${areaOpacity}" stroke="none" />`
      : ''

    const shadow = shadowCss(p)

    return `<div style="background:${p.bgColor}; padding:20px; border-radius:12px; box-shadow:${shadow}; font-family:'Segoe UI'; min-width:320px;">
  <div style="font-size:12px; color:${p.textColor}; opacity:0.7; margin-bottom:10px;">SALES TREND</div>
  <div style="display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:10px;">
    <div style="font-size:28px; font-weight:bold; color:${p.textColor};">1.5M</div>
    <div style="font-size:12px; color:#4caf50; font-weight:600;">+12%</div>
  </div>
  <svg viewBox="0 0 ${width} ${height}" width="100%" height="80px" style="overflow:visible;">
    ${areaPath}
    <path d="${pathD}" fill="none" stroke="${p.accentColor}" stroke-width="${p.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
    ${pointsHtml}
  </svg>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    const areaOpacity = Math.max(0, Math.min(1, p.areaOpacity / 100))
    return `Sparkline - Value =
[KPI Value]

Sparkline - Date Column =
-- Replace with your date column (must be a real Date column)
-- Example: 'Date'[Date]

Sparkline - Value By Date =
-- Optional: if you need a special calc by date (otherwise reuse [KPI Value])
[KPI Value]

Sparkline - HTML =
VAR _DateCol = 'Date'[Date]
VAR _Table = ALLSELECTED(_DateCol)
VAR _HasDates = NOT ISEMPTY(_Table)

VAR _X_Min = MINX(_Table, _DateCol)
VAR _X_Max = MAXX(_Table, _DateCol)
VAR _X_Den = MAX(1, _X_Max - _X_Min)

VAR _Y_Min = 0
VAR _Y_Max = MAXX(_Table, CALCULATE([KPI Value]))
VAR _Y_Den = MAX(1e-9, _Y_Max - _Y_Min)

VAR _Width = 200
VAR _Height = 80
VAR _StrokeWidth = ${p.strokeWidth}
VAR _LineColor = "${p.accentColor}"
VAR _FillOpacity = ${areaOpacity}
VAR _ShowArea = ${p.showArea}

VAR _PathData =
    IF(
        NOT _HasDates,
        "",
        CONCATENATEX(
            _Table,
            VAR _Val = CALCULATE([KPI Value])
            VAR _Date = _DateCol
            VAR _X = INT(DIVIDE((_Date - _X_Min), _X_Den) * _Width)
            VAR _Y = INT(_Height - DIVIDE((_Val - _Y_Min), _Y_Den) * _Height)
            RETURN IF(NOT ISBLANK(_Val), "L " & _X & " " & _Y, ""),
            " ",
            _DateCol,
            ASC
        )
    )

VAR _CleanPath =
    IF(
        LEN(_PathData) >= 2,
        "M" & RIGHT(_PathData, LEN(_PathData) - 1),
        "M 0 " & _Height
    )

VAR _AreaPath =
    IF(
        _ShowArea,
        "<path d='" & _CleanPath & " L " & _Width & " " & _Height & " L 0 " & _Height & " Z' fill='" & _LineColor & "' fill-opacity='" & _FillOpacity & "' stroke='none' />",
        ""
    )

RETURN
"<div style='background-color:${p.bgColor}; padding:20px; border-radius:12px; box-shadow:${shadow}; font-family:Segoe UI;'>" &
"<div style='font-size:12px; color:${p.textColor}; opacity:0.7; margin-bottom:10px;'>TREND</div>" &
"<div style='font-size:28px; font-weight:bold; color:${p.textColor};'>" & FORMAT([KPI Value], "General Number") & "</div>" &
"<svg viewBox='0 0 " & _Width & " " & _Height & "' width='100%' height='80px' style='overflow:visible;'>" &
_AreaPath &
"<path d='" & _CleanPath & "' fill='none' stroke='" & _LineColor & "' stroke-width='" & _StrokeWidth & "' stroke-linecap='round' stroke-linejoin='round' />" &
"</svg></div>"`
  },
}
