import type { TemplateDefinition } from './types'
import { kpiCardProTemplate } from './kpiCardPro'
import { sparklineLineTemplate } from './sparklineLine'
import { dumbbellTemplate } from './dumbbell'
import { kpiDeltaTemplate } from './kpiDelta'
import { bulletTemplate } from './bullet'
import { donutTemplate } from './donut'
import { kpiStatusRagTemplate } from './kpiStatusRag'
import { kpiDriversTemplate } from './kpiDrivers'
import { kpiAnomalyAlertTemplate } from './kpiAnomalyAlert'
import { kpiCohortRetentionTemplate } from './kpiCohortRetention'
import { kpiForecastRunRateTemplate } from './kpiForecastRunRate'

export const templates = [
  kpiCardProTemplate,
  sparklineLineTemplate,
  dumbbellTemplate,
  kpiDeltaTemplate,
  bulletTemplate,
  donutTemplate,
  kpiStatusRagTemplate,
  kpiDriversTemplate,
  kpiAnomalyAlertTemplate,
  kpiCohortRetentionTemplate,
  kpiForecastRunRateTemplate,
] as const

export type AnyTemplate = (typeof templates)[number]

export function getTemplateById(id: string | undefined) {
  return templates.find((t) => t.id === id)
}

export function getTemplateIds() {
  return templates.map((t) => t.id)
}

export function getTemplateNameMap() {
  return templates.reduce<Record<string, string>>((acc, t) => {
    acc[t.id] = t.name
    return acc
  }, {})
}

export function isTemplateDefinition(x: unknown): x is TemplateDefinition<Record<string, unknown>> {
  if (!x || typeof x !== 'object') return false
  const t = x as { id?: unknown; name?: unknown; defaultProps?: unknown }
  return typeof t.id === 'string' && typeof t.name === 'string' && typeof t.defaultProps === 'object'
}
