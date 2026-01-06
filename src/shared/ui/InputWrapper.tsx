import { get } from 'lodash-es'
import { useId } from 'react'
import {
  useFormContext,
  type UseFormRegisterReturn,
  type FieldErrors,
} from 'react-hook-form'

import {
  createSlots,
  getRenderedProp,
  type RenderProp,
} from '../component-helpers'
import { cn } from '../lib'

import type React from 'react'

export type InputWrapperProps = Partial<UseFormRegisterReturn> & {
  label?: React.ReactNode,
  children: React.ReactNode | RenderProp<ChildrenRenderProps>,
  containerProps?: React.HtmlHTMLAttributes<HTMLDivElement>,
  inputClassName?: string,
  className?: string,
}

interface ChildrenRenderProps extends Partial<UseFormRegisterReturn> {
  id: IdType,
  'data-invalid': true | undefined,
}

const getErrorMessage = (error: FieldErrors[string]) => {
  if (!error) return

  for (const message of [ error.message, error.type ]) {
    if (!message) continue
    if (typeof message === 'string') return message

    return getErrorMessage(message)
  }
}

const { LabelSlot, pick: pickSlots } = createSlots([ 'LabelSlot' ])

function InputWrapper({
  label,
  children: childrenRaw,
  containerProps,
  className,
  inputClassName,
  ...props
}: InputWrapperProps) {
  const inputId = useId()
  const formContext = useFormContext()

  const error = props?.name
    ? get(formContext, `formState.errors.${props.name}`)
    : undefined

  const errorMessage = error && getErrorMessage(error)

  const { isRenderProp, renderedProp: children } = getRenderedProp(
    childrenRaw,
    {
      id: inputId,
      'data-invalid': !!error || undefined,
      className: inputClassName,
      ...props,
    },
  )

  const labelHtmlFor = isRenderProp ? inputId : undefined

  return (
    <div className={cn('flex flex-col gap-1', className)} {...containerProps}>
      {!!label && <label htmlFor={labelHtmlFor}>{label}</label>}

      {children}

      {!!errorMessage && (
        <span className="text-redA-11 text-1">{errorMessage}</span>
      )}
    </div>
  )
}

export default Object.assign(InputWrapper, {
  Label: LabelSlot,
})

export const withInputWrapper = <Props extends object>(
  Component: React.ComponentType<Props>,
) => {
  return function WithInputWrapper({
    children,
    ...props
  }: React.PropsWithChildren<Props & Omit<InputWrapperProps, 'children'>>) {
    const { LabelSlot, DefaultSlot } = pickSlots(children)

    return (
      <InputWrapper {...props} label={LabelSlot || props.label}>
        {(props) => <Component {...(props as Props)}>{DefaultSlot}</Component>}
      </InputWrapper>
    )
  }
}

type IdType = ReturnType<typeof useId>
