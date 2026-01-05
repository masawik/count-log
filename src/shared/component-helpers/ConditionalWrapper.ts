export function ConditionalWrapper<C extends React.ReactNode>({
  condition,
  wrapper,
  children,
}: {
  condition: boolean,
  wrapper: (children: C) => React.ReactNode,
  children: C,
}) {
  return condition ? wrapper(children) : children
}
