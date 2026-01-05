export type RenderProp<P extends object | undefined = undefined> = (
  props?: P,
) => React.ReactNode

export const isRenderProp = <P extends object | undefined = undefined>(
  children: React.ReactNode | RenderProp<P>,
): children is RenderProp<P> => {
  return typeof children === 'function'
}

export const getRenderedProp = <P extends object | undefined = undefined>(
  prop: React.ReactNode | RenderProp<P>,
  props?: P,
) => {
  const shouldRenderProp = isRenderProp(prop)

  let renderedProp: React.ReactNode

  if (shouldRenderProp) {
    renderedProp = prop(props)
  } else {
    renderedProp = prop
  }

  return {
    renderedProp,
    isRenderProp: shouldRenderProp,
  }
}
