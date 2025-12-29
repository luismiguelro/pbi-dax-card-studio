export type ThemeMode = 'dark' | 'light'

export type ControlType = 'color' | 'range' | 'text' | 'checkbox' | 'select'

export type TemplateControl =
  | {
      id: string
      label: string
      type: 'color'
    }
  | {
      id: string
      label: string
      type: 'range'
      min: number
      max: number
      step?: number
    }
  | {
      id: string
      label: string
      type: 'text'
      placeholder?: string
    }
  | {
      id: string
      label: string
      type: 'checkbox'
    }
  | {
      id: string
      label: string
      type: 'select'
      options: Array<{ value: string; label: string }>
    }

export type TemplateDefinition<TProps extends Record<string, unknown>> = {
  id: string
  name: string
  description: string
  tags: string[]
  defaultProps: TProps
  controls: TemplateControl[]
  renderPreviewHtml: (props: TProps) => string
  exportDax: (props: TProps) => string
}
