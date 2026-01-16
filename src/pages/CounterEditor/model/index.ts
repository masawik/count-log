import { attach, createEvent, sample, split } from 'effector'

import {
  type Counter,
  type CounterUpdate,
  type NewCounter,
} from '@/entities/counter'
import { updateCounterFx, createCounterFx } from '@/entities/counter'

import { navigateTo } from '@/shared/routing'

type FormSubmittedData = {
  update: NewCounter,
  counter?: Counter,
}

export const formSubmitted = createEvent<FormSubmittedData>()

const updateCounterByEditorFx = attach({ effect: updateCounterFx })
const createCounterByEditorFx = attach({ effect: createCounterFx })

const { updateCounter, createCounter } = split(formSubmitted, {
  updateCounter: ({ counter }) => !!counter,
  createCounter: ({ counter }) => !counter,
})

sample({
  clock: updateCounter,
  fn: ({ update, counter }): CounterUpdate => ({
    id: counter!.id,
    ...update,
  }),
  target: updateCounterByEditorFx,
})

sample({
  clock: createCounter,
  fn: ({ update }) => update,
  target: createCounterByEditorFx,
})

sample({
  clock: [ updateCounterByEditorFx.doneData, createCounterByEditorFx.doneData ],
  fn: ({ id }) => ({ to: `/counter/${id}` }),
  target: navigateTo,
})
