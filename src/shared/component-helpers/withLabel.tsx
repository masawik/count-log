import InputLabel from '../ui/InputLabel'

import type { InputLabelProps } from '../ui/InputLabel'

export interface withLabelProps {
  label?: string,
  inputLabelProps?: InputLabelProps,
}

export const withLabel = <Props extends object>(
  Component: React.ComponentType<Props>,
) => {
  return function WithLabelWrapper({
    label,
    inputLabelProps,
    ...props
  }: Props & withLabelProps) {
    if (!label) return <Component {...(props as Props)} />

    return (
      <InputLabel text={label} {...inputLabelProps}>
        <Component {...(props as Props)} />
      </InputLabel>
    )
  }
}
