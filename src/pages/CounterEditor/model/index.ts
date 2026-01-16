import { attach, createEvent, sample, split } from 'effector'

import {
  type Counter,
  type CounterUpdate,
  type NewCounter,
} from '@/entities/counter'
import {
  updateCounterFx,
  createCounterFx,
} from '@/entities/counter/model/crudEffects'
import { $counters } from '@/entities/counter/model/store'

import { navigateTo } from '@/shared/routing'

export const counterUpdated = createEvent<Counter>()

sample({
  clock: counterUpdated,
  source: $counters,
  fn: (counters, updatedCounter) =>
    counters.map((c) => (c.id === updatedCounter.id ? updatedCounter : c)),
  target: $counters,
})

type FormSubmittedData = {
  update: NewCounter,
  counter?: Counter,
}

export const formSubmitted = createEvent<FormSubmittedData>()

const updateCounterByEditorFx = attach({ effect: updateCounterFx })
const createCounterByEditorFx = attach({ effect: createCounterFx })

const updateCounter = createEvent<FormSubmittedData>()
const createCounter = createEvent<FormSubmittedData>()

split({
  source: formSubmitted,
  match: ({ counter }) => (counter ? 'update' : 'create'),
  cases: {
    update: updateCounter,
    create: createCounter,
  },
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

sample({
  clock: createCounterByEditorFx.doneData,
  source: $counters,
  fn: (counters, newCounter) => [ ...counters, newCounter ],
  target: $counters,
})
