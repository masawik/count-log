import * as React from 'react'

type SlotProps = React.PropsWithChildren<unknown>
type SlotComponent = React.ComponentType<SlotProps>

type DefaultSlot = { DefaultSlot: React.ReactNode[] | undefined }

type Simplify<T> = { [K in keyof T]: T[K] } & {}

type ElementWithChildren = React.ReactElement<{ children?: React.ReactNode }>

function getElementChildren(el: React.ReactElement): React.ReactNode | null {
  return (el as ElementWithChildren).props.children ?? null
}

function isFragment(el: React.ReactElement): el is React.ReactElement<{ children?: React.ReactNode }> {
  return el.type === React.Fragment
}

function flattenOneLevel(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = []

  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement(child) && isFragment(child)) {
      out.push(...React.Children.toArray(getElementChildren(child)))
    } else {
      out.push(child)
    }
  }

  return out
}

export function createSlots<const Names extends readonly string[]>(names: Names) {
  type SlotName = Names[number]

  const slotComponents = {} as Record<SlotName, SlotComponent>

  for (const name of names) {
    const Slot: SlotComponent = function SlotComponentImpl(_: SlotProps) {
      return null
    };

    (Slot as React.FunctionComponent).displayName = name

    slotComponents[name as SlotName] = Slot
  }

  const componentToName = new Map<SlotComponent, SlotName>()
  for (const name of names) {
    componentToName.set(slotComponents[name as SlotName], name)
  }

  type Picked = Simplify<
    { [K in SlotName]: React.ReactNode | null } & DefaultSlot
  >

  function pick(children: React.ReactNode): Picked {
     const out = {
      ...Object.fromEntries(names.map(name => [ name, null ])),
      DefaultSlot: [],
    } as Partial<Picked> & { DefaultSlot: React.ReactNode[] }

    const flat = flattenOneLevel(children)

    for (const child of flat) {
      if (!React.isValidElement(child)) {
        out.DefaultSlot.push(child)
        continue
      }

      // Пропускаем DOM элементы (их type - это строка)
      if (typeof child.type === 'string') {
        out.DefaultSlot.push(child)
        continue
      }

      const slotName = componentToName.get(child.type as SlotComponent)
      if (slotName) {
        (out as Record<SlotName, React.ReactNode | null>)[slotName] = getElementChildren(child)
      } else {
        out.DefaultSlot.push(child)
      }
    }

    if (!out.DefaultSlot?.length) {
      (out.DefaultSlot as DefaultSlot['DefaultSlot']) = undefined
    }

    return out as Picked
  }

  return {
    pick,
    ...slotComponents,
  }
}
