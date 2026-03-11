import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const data = await blueprintsService.getAll() 
  const authors = [...new Set(data.map((bp) => bp.author))]
  return authors
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const data = await blueprintsService.getByAuthor(author)
  return { author, items: data }
})

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    const data = await blueprintsService.getByAuthorAndName(author, name)
    return data
  },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  const data = await blueprintsService.create(payload)
  return data
})

export const deleteBlueprint = createAsyncThunk(
  'blueprints/deleteBlueprint',
  async ({ author, name }, { dispatch, rejectWithValue, getState }) => {
    const snapshot = getState().blueprints.byAuthor[author]?.find(bp => bp.name === name)
    dispatch(removeBlueprintOptimistic({ author, name }))
    try {
      await blueprintsService.remove(author, name)
      return { author, name }
    } catch (err) {
      dispatch(fetchByAuthor(author))
      return rejectWithValue(err.message)
    }
  }
)

export const updateBlueprint = createAsyncThunk(
  'blueprints/updateBlueprint',
  async ({ author, name, points }, { rejectWithValue }) => {
    try {
      await blueprintsService.update(author, name, { author, name, points })
      return { author, name, points }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    removeBlueprintOptimistic(state, action) {
      const { author, name } = action.payload
      if (state.byAuthor[author]) {
        state.byAuthor[author] = state.byAuthor[author].filter(bp => bp.name !== name)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fechAuthor
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      // fechByAuthor
      .addCase(fetchByAuthor.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items  
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
        // fetchBlueprint
      .addCase(fetchBlueprint.pending, (s) => { s.status = 'loading' })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.current = a.payload   
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
      .addCase(deleteBlueprint.fulfilled, (s, a) => {
        const { name } = a.payload
        if (s.current?.name === name) s.current = null
      })
      .addCase(deleteBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload
      })
      .addCase(updateBlueprint.fulfilled, (s, a) => {
        const { author, name, points } = a.payload
        if (s.current?.name === name) {
          s.current = { ...s.current, points }
        }
        if (s.byAuthor[author]) {
          const idx = s.byAuthor[author].findIndex(bp => bp.name === name)
          if (idx !== -1) s.byAuthor[author][idx] = { ...s.byAuthor[author][idx], points }
        }
      })
      .addCase(updateBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload
      })
  },
})

export const { removeBlueprintOptimistic } = slice.actions
export default slice.reducer


import { createSelector } from '@reduxjs/toolkit'

export const selectTop5 = createSelector(
  (state) => state.blueprints.byAuthor,
  (_, author) => author,
  (byAuthor, author) => {
    const list = byAuthor[author] ?? []
    return [...list]
      .sort((a, b) => (b.points?.length ?? 0) - (a.points?.length ?? 0))
      .slice(0, 5)
  }
)