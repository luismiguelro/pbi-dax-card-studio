import type { TemplateDefinition } from './types'

export type BulletProps = {
  accentColor: string
  textColor: string
  bgColor: string
  radius: number
  shadowX: number
  shadowY: number
  shadowBlur: number
  shadowOpacity: number
  valuePct: number
  targetPct: number
  targetColor: string
  trackColor: string
}

function clampPct(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(100, n))
}

function shadowCss(p: BulletProps) {
  const op = Math.max(0, Math.min(1, p.shadowOpacity / 100))
  return `${p.shadowX}px ${p.shadowY}px ${p.shadowBlur}px rgba(0,0,0,${op})`
}

export const bulletTemplate: TemplateDefinition<BulletProps> = {
  id: 'bullet',
  name: 'Bullet (Actual vs Target)',
  description: 'Compact bullet bar: actual value with target marker.',
  tags: ['kpi', 'bullet', 'target'],
  defaultProps: {
    accentColor: '#60cdff',
    textColor: '#e1e1e1',
    bgColor: '#252526',
    radius: 12,
    shadowX: 0,
    shadowY: 4,
    shadowBlur: 12,
    shadowOpacity: 10,
    valuePct: 72,
    targetPct: 85,
    targetColor: '#ff4d4f',
    trackColor: '#2f3338',
  },
  controls: [
    { id: 'accentColor', label: 'Actual Color', type: 'color' },
    { id: 'textColor', label: 'Text Color', type: 'color' },
    { id: 'bgColor', label: 'Background Color', type: 'color' },
    { id: 'radius', label: 'Border Radius', type: 'range', min: 0, max: 24, step: 1 },
    { id: 'shadowX', label: 'Shadow X', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowY', label: 'Shadow Y', type: 'range', min: -20, max: 20, step: 1 },
    { id: 'shadowBlur', label: 'Shadow Blur', type: 'range', min: 0, max: 50, step: 1 },
    { id: 'shadowOpacity', label: 'Shadow Opacity', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'valuePct', label: 'Actual (%)', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'targetPct', label: 'Target (%)', type: 'range', min: 0, max: 100, step: 1 },
    { id: 'targetColor', label: 'Target Color', type: 'color' },
    { id: 'trackColor', label: 'Track Color', type: 'color' },
  ],
  renderPreviewHtml: (p) => {
    const value = clampPct(p.valuePct)
    const target = clampPct(p.targetPct)
    const shadow = shadowCss(p)
    return `<div style="background:${p.bgColor}; border-radius:${p.radius}px; padding:18px 20px; min-width:320px; box-shadow:${shadow}; font-family:'Segoe UI'; border:1px solid rgba(128,128,128,0.1);">
  <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px;">
    <div style="color:${p.textColor}; opacity:0.75; font-size:12px; font-weight:700; letter-spacing:0.4px; text-transform:uppercase;">Conversion</div>
    <div style="color:${p.textColor}; font-weight:800;">${value}%</div>
  </div>
  <div style="position:relative; height:10px; background:${p.trackColor}; border-radius:999px; overflow:hidden;">
    <div style="height:100%; width:${value}%; background:${p.accentColor};"></div>
    <div style="position:absolute; top:-4px; bottom:-4px; width:2px; left:${target}%; background:${p.targetColor}; transform:translateX(-50%);"></div>
  </div>
  <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:11px; color:${p.textColor}; opacity:0.7;">
    <span>Actual</span>
    <span>Target: ${target}%</span>
  </div>
</div>`
  },
  exportDax: (p) => {
    const shadow = shadowCss(p)
    return `Bullet Measure = \nVAR _Val = [ActualPct] \nVAR _Target = [TargetPct] \nVAR _Width = (_Val * 100) & "%"\nVAR _TargetPct = (_Target * 100) & "%"\nVAR _BgColor = "${p.bgColor}"\nVAR _TextColor = "${p.textColor}"\nVAR _ActualColor = "${p.accentColor}"\nVAR _TargetColor = "${p.targetColor}"\nRETURN \n"<div style='background-color:" & _BgColor & "; border-radius:${p.radius}px; padding:18px 20px; box-shadow:${shadow}; font-family:Segoe UI; border:1px solid rgba(128,128,128,0.1);'>" &\n"<div style='display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px;'>" &\n"<div style='color:" & _TextColor & "; opacity:0.75; font-size:12px; font-weight:700; letter-spacing:0.4px; text-transform:uppercase;'>Conversion</div>" &\n"<div style='color:" & _TextColor & "; font-weight:800;'>" & FORMAT(_Val, "0%") & "</div></div>" &\n"<div style='position:relative; height:10px; background:${p.trackColor}; border-radius:999px; overflow:hidden;'><div style='height:100%; width:" & _Width & "; background-color:" & _ActualColor & ";'></div><div style='position:absolute; top:-4px; bottom:-4px; width:2px; left:" & _TargetPct & "; background-color:" & _TargetColor & "; transform:translateX(-50%);'></div></div></div>"`
  },
}
