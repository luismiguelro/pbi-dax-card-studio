export const iconSuggestionsByTemplateId: Record<string, string[]> = {
  'kpi-card-pro': ['monitoring', 'paid', 'analytics', 'shopping_cart', 'attach_money', 'trending_up'],
  'kpi-delta': ['trending_up', 'trending_down', 'show_chart', 'swap_vert', 'finance'],
  bullet: ['target', 'flag', 'check_circle', 'task_alt', 'fact_check'],
  donut: ['donut_small', 'pie_chart', 'track_changes', 'percent', 'speed'],
  dumbbell: ['compare_arrows', 'swap_horiz', 'swap_vert', 'insights', 'tune'],
  'sparkline-line': ['show_chart', 'ssid_chart', 'timeline', 'area_chart', 'query_stats'],
}

export function getIconSuggestions(templateId: string | undefined): string[] {
  if (!templateId) return []
  return iconSuggestionsByTemplateId[templateId] ?? []
}
