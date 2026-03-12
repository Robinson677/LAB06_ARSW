import { describe, it, expect } from 'vitest'
import reducer from '../src/features/blueprints/blueprintsSlice.js'

describe('blueprints slice', () => {
  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.authors).toEqual([])
  })
})

it('fetchByAuthor.fulfilled guarda items en byAuthor', () => {
  const items = [{ author: 'john', name: 'house', points: [] }]
  const action = { type: 'blueprints/fetchByAuthor/fulfilled', payload: { author: 'john', items } }
  const state = reducer(undefined, action)
  expect(state.byAuthor['john']).toEqual(items)
})

it('fetchByAuthor.pending pone status en loading', () => {
  const state = reducer(undefined, { type: 'blueprints/fetchByAuthor/pending' })
  expect(state.status).toBe('loading')
})

it('fetchByAuthor.rejected guarda el error', () => {
  const state = reducer(undefined, { type: 'blueprints/fetchByAuthor/rejected', error: { message: 'fallo' } })
  expect(state.status).toBe('failed')
  expect(state.error).toBe('fallo')
})

it('removeBlueprintOptimistic elimina del byAuthor', () => {
  const initial = {
    authors: [],
    byAuthor: { john: [{ author: 'john', name: 'house', points: [] }] },
    current: null,
    status: 'idle',
    error: null,
  }
  const state = reducer(initial,
    { type: 'blueprints/removeBlueprintOptimistic', payload: { author: 'john', name: 'house' } })
  expect(state.byAuthor['john']).toHaveLength(0)
})