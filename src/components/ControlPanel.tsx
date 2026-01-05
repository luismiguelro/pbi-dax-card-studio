import type { TemplateControl, TemplateDefinition } from '../templates/types'
import { getIconSuggestions } from '../templates/icons'

type Props<TProps extends Record<string, unknown>> = {
  template: TemplateDefinition<TProps>
  value: TProps
  onChange: (next: TProps) => void
}

function toNumber(v: unknown) {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

function setProp<TProps extends Record<string, unknown>>(
  obj: TProps,
  id: string,
  value: unknown,
) {
  return { ...obj, [id]: value } as TProps
}

function ControlRow<TProps extends Record<string, unknown>>({
  control,
  props,
  onChange,
  templateId,
}: {
  control: TemplateControl
  props: TProps
  onChange: (next: TProps) => void
  templateId: string
}) {
  const id = control.id
  const inputId = `${templateId}:${id}`
  const raw = (props as Record<string, unknown>)[id]

  if (control.type === 'color') {
    const v = typeof raw === 'string' ? raw : '#ffffff'
    return (
      <div className="cp-row">
        <label className="cp-label" htmlFor={inputId}>
          {control.label}
        </label>
        <input
          className="cp-input"
          type="color"
          id={inputId}
          name={id}
          aria-label={control.label}
          value={v}
          onChange={(e) => onChange(setProp(props, id, e.target.value))}
        />
      </div>
    )
  }

  if (control.type === 'range') {
    const v = toNumber(raw)
    return (
      <div className="cp-row">
        <label className="cp-label" htmlFor={inputId}>
          {control.label}
        </label>
        <div className="cp-range">
          <input
            className="cp-input"
            type="range"
            id={inputId}
            name={id}
            aria-label={control.label}
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={v}
            onChange={(e) => onChange(setProp(props, id, Number(e.target.value)))}
          />
          <div className="cp-range-value">{v}</div>
        </div>
      </div>
    )
  }

  if (control.type === 'text') {
    const v = typeof raw === 'string' ? raw : ''
    const isIconName = id === 'iconName'
    const suggestions = isIconName ? getIconSuggestions(templateId) : []
    const listId = isIconName ? `datalist-${templateId}-${id}` : undefined
    const googleQuery = isIconName
      ? encodeURIComponent(suggestions.length ? suggestions.join(' ') : v || 'icon')
      : ''
    return (
      <div className="cp-row">
        <label className="cp-label" htmlFor={inputId}>
          {control.label}
        </label>
        <input
          className="cp-input"
          type="text"
          id={inputId}
          name={id}
          aria-label={control.label}
          value={v}
          placeholder={control.placeholder}
          list={listId}
          onChange={(e) => onChange(setProp(props, id, e.target.value))}
        />

        {isIconName ? (
          <>
            {listId ? (
              <datalist id={listId}>
                {suggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            ) : null}
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <a
                className="link"
                href={`https://fonts.google.com/icons?icon.style=Outlined&icon.query=${googleQuery}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12 }}
              >
                Browse icons
              </a>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Tip: pick one from suggestions</span>
            </div>
          </>
        ) : null}
      </div>
    )
  }

  if (control.type === 'checkbox') {
    const v = Boolean(raw)
    return (
      <label className="cp-checkbox">
        <input
          type="checkbox"
          id={inputId}
          name={id}
          checked={v}
          onChange={(e) => onChange(setProp(props, id, e.target.checked))}
        />
        <span>{control.label}</span>
      </label>
    )
  }

  if (control.type === 'select') {
    const v = typeof raw === 'string' ? raw : control.options[0]?.value ?? ''
    return (
      <div className="cp-row">
        <label className="cp-label" htmlFor={inputId}>
          {control.label}
        </label>
        <select
          className="cp-input"
          id={inputId}
          name={id}
          aria-label={control.label}
          value={v}
          onChange={(e) => onChange(setProp(props, id, e.target.value))}
        >
          {control.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return null
}

export default function ControlPanel<TProps extends Record<string, unknown>>({
  template,
  value,
  onChange,
}: Props<TProps>) {
  return (
    <div className="cp">
      {template.controls.map((c) => (
        <ControlRow
          key={c.id}
          control={c}
          props={value}
          onChange={onChange}
          templateId={template.id}
        />
      ))}
    </div>
  )
}
