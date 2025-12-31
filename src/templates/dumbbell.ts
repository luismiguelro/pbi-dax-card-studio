import type { TemplateDefinition } from './types'

export type DumbbellProps = {
  accentColor: string
  textColor: string
  prevColor: string
  isCardMode: boolean
  orientation: 'h' | 'v'
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  prevPct: number
  currPct: number
}

function clampPct(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function shadowCss(p: DumbbellProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const dumbbellTemplate: TemplateDefinition<DumbbellProps> = {
  id: 'dumbbell',
  name: 'Dumbbell (Change)',
  description: 'Previous vs current comparison, horizontal/vertical, optionally as a card.',
  tags: ['comparison', 'dumbbell'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    prevColor: '#777777',
    isCardMode: true,
    orientation: 'h',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    prevPct: 30,
    currPct: 85,
  },
  controls: [
    { id: 'accentColor', label: 'Current Color', type: 'color' },
    { id: 'prevColor', label: 'Previous Color', type: 'color' },
    { id: 'textColor', label: 'Text Color', type: 'color' },
    { id: 'isCardMode', label: 'Card Mode', type: 'checkbox' },
    {
      id: 'orientation',
      label: 'Orientation',
      type: 'select',
      options: [
        { value: 'h', label: 'Horizontal' },
        { value: 'v', label: 'Vertical' },
      ],
    },
    { id: 'bgColor', label: 'Background Color', type: 'color' },
    { id: 'radius', label: 'Border Radius', type: 'range', min: 0, max: 24, step: 1 },
    { id: 'shadowX', label: 'Shadow X', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowY', label: 'Shadow Y', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowBlur', label: 'Shadow Blur', type: 'range', min: 0, max: 50, step: 1 },
    { id: 'shadowOpacity', label: 'Shadow Opacity', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'prevPct', label: 'Previous (%)', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'currPct', label: 'Current (%)', type: 'range', min: 0, max: 100, step: 1 },
  ],
  renderPreviewHtml: (p) => {
    const prev = clampPct(p.prevPct)
    const curr = clampPct(p.currPct)
    const minP = Math.min(prev, curr)
    const widthP = Math.abs(curr - prev)

    const isVert = p.orientation === 'v'

    const bg = p.isCardMode ? p.bgColor : 'transparent'
    const radius = p.isCardMode ? `${p.radius}px` : '0'
    const padding = p.isCardMode ? '24px' : '0px'

    const shadow = p.isCardMode
      ? `box-shadow:${shadowCss(p)}; border:1px solid rgba(128,128,128,0.2);`
      : ''

    const boxStyle = isVert
      ? `width:${p.isCardMode ? '140px' : '40px'}; height:${p.isCardMode ? '220px' : '110px'};`
      : `width:${p.isCardMode ? '340px' : '100%'}; height:${p.isCardMode ? 'auto' : '30px'};`

    const graphAreaStyle = isVert
      ? `position:relative; width:100%; height:${p.isCardMode ? '150px' : '100px'};`
      : `position:relative; width:100%; height:24px;`

    const lineStyle = isVert
      ? `position:absolute; left:50%; width:2px; bottom:${minP}%; height:${widthP}%; background:${p.textColor}; opacity:0.4; transform:translateX(-50%);`
      : `position:absolute; top:50%; height:2px; left:${minP}%; width:${widthP}%; background:${p.textColor}; opacity:0.4; transform:translateY(-50%);`

    const dotCommon = `position:absolute; border-radius:50%; z-index:2;`
    const dotPrevStyle = isVert
      ? `${dotCommon} left:50%; bottom:${prev}%; width:10px; height:10px; background:${p.prevColor}; transform:translate(-50%, 50%);`
      : `${dotCommon} top:50%; left:${prev}%; width:10px; height:10px; background:${p.prevColor}; transform:translate(-50%, -50%);`

    const borderColor = p.isCardMode ? p.bgColor : 'rgba(255,255,255,0.5)'

    const dotCurrStyle = isVert
      ? `${dotCommon} left:50%; bottom:${curr}%; width:14px; height:14px; background:${p.accentColor}; border:2px solid ${borderColor}; transform:translate(-50%, 50%); z-index:3;`
      : `${dotCommon} top:50%; left:${curr}%; width:14px; height:14px; background:${p.accentColor}; border:2px solid ${borderColor}; transform:translate(-50%, -50%); z-index:3;`

    const title = p.isCardMode
      ? `<div style="margin-bottom:15px; text-align:center; color:${p.textColor}; font-weight:bold; font-size:12px;">COMPARISON</div>`
      : ''

    return `<div style="background:${bg}; border-radius:${radius}; padding:${padding}; ${boxStyle} ${shadow} font-family:'Segoe UI'; display:flex; flex-direction:column; align-items:center; justify-content:center;">
  ${title}
  <div style="${graphAreaStyle}">
    <div style="${lineStyle}"></div>
    <div style="${dotPrevStyle}"></div>
    <div style="${dotCurrStyle}"></div>
  </div>
  ${p.isCardMode ? `<div style=\"display:flex; justify-content:space-between; width:100%; font-size:10px; color:${p.textColor}; opacity:0.65; margin-top:10px;\"><span>Prev: ${prev}</span><span>Current: ${curr}</span></div>` : ''}
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    const isVert = p.orientation === 'v'
    const borderColor = p.isCardMode ? p.bgColor : 'rgba(255,255,255,0.7)'

    const daxVarOrientation = isVert
      ? `VAR _PosProp = "bottom" \nVAR _CrossProp = "left:50%; transform:translateX(-50%)"`
      : `VAR _PosProp = "left" \nVAR _CrossProp = "top:50%; transform:translateY(-50%)"`

    const daxLineDiv = isVert
      ? `"<div style='position:absolute; " & _CrossProp & "; width:2px; " & _PosProp & ":" & _Start & "; height:" & _Diff & "; background-color:" & _TextColor & "; opacity:0.4;'></div>"`
      : `"<div style='position:absolute; " & _CrossProp & "; height:2px; " & _PosProp & ":" & _Start & "; width:" & _Diff & "; background-color:" & _TextColor & "; opacity:0.4;'></div>"`

    const daxDotPrev = isVert
      ? `"<div style='position:absolute; " & _CrossProp & "; bottom:" & _PctPrev & "%" & "; width:10px; height:10px; background-color:" & _PrevColor & "; border-radius:50%; margin-bottom:-5px;'></div>"`
      : `"<div style='position:absolute; " & _CrossProp & "; left:" & _PctPrev & "%" & "; width:10px; height:10px; background-color:" & _PrevColor & "; border-radius:50%; margin-left:-5px;'></div>"`

    const daxDotCurr = isVert
      ? `"<div style='position:absolute; " & _CrossProp & "; bottom:" & _PctCurr & "%" & "; width:14px; height:14px; background-color:" & _CurrColor & "; border:2px solid " & _BorderColor & "; border-radius:50%; margin-bottom:-7px; z-index:3;'></div>"`
      : `"<div style='position:absolute; " & _CrossProp & "; left:" & _PctCurr & "%" & "; width:14px; height:14px; background-color:" & _CurrColor & "; border:2px solid " & _BorderColor & "; border-radius:50%; margin-left:-7px; z-index:3;'></div>"`

    const containerStart = p.isCardMode
      ? `"<div style='background-color:" & _BgColor & "; border-radius:" & _Radius & "; padding:24px; box-shadow:${shadow}; font-family:Segoe UI;'><div style='text-align:center; color:" & _TextColor & "; font-size:12px; margin-bottom:10px;'>COMPARISON</div><div style='position:relative; width:100%; height:150px;'>"`
      : `"<div style='position:relative; width:100%; height:100%; min-height:40px;'>"`

    return `Dumbbell - Prev =
[KPI Prev]

Dumbbell - Curr =
[KPI Curr]

Dumbbell - Max =
[KPI Max]

Dumbbell - HTML =
VAR _Prev = [KPI Prev]
VAR _Curr = [KPI Curr]
VAR _Max = [KPI Max]
VAR _PctPrev = DIVIDE(_Prev, _Max, 0) * 100
VAR _PctCurr = DIVIDE(_Curr, _Max, 0) * 100
VAR _Start = MIN(_PctPrev, _PctCurr) & "%"
VAR _Diff = ABS(_PctCurr - _PctPrev) & "%"
VAR _TextColor = "${p.textColor}"
VAR _PrevColor = "${p.prevColor}"
VAR _CurrColor = "${p.accentColor}"
VAR _BgColor = "${p.isCardMode ? p.bgColor : 'transparent'}"
VAR _Radius = "${p.isCardMode ? `${p.radius}px` : '0'}"
VAR _BorderColor = "${borderColor}"
${daxVarOrientation}
RETURN ${containerStart} & ${daxLineDiv} & ${daxDotPrev} & ${daxDotCurr} & "</div>" ${p.isCardMode ? '& "</div>"' : ''}`
  },
}
