import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import { useHttp } from "../../hooks/http.hook"


const heroesAdapter = createEntityAdapter()

const initialState = heroesAdapter.getInitialState({
   heroesLoadingStatus: 'idle'
})


export const heroesFetch = createAsyncThunk(
   'heroes/heroesFetch',
   () => {
      const { request } = useHttp()
      return request("http://localhost:3001/heroes")
   }
)

const heroesSlice = createSlice({
   name: 'heroes',
   initialState,
   reducers: {
      heroDeleted: (state, action) => {
         heroesAdapter.removeOne(state, action.payload)
      },
      heroCreated: (state, action) => {
         heroesAdapter.addOne(state, action.payload)
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(heroesFetch.pending, state => { state.heroesLoadingStatus = 'loading' })
         .addCase(heroesFetch.fulfilled, (state, action) => {
            state.heroesLoadingStatus = 'idle'
            heroesAdapter.setAll(state, action.payload)
         })
         .addCase(heroesFetch.rejected, state => { state.heroesLoadingStatus = 'error' })
         .addDefaultCase(() => { })
   }
})


const { actions, reducer } = heroesSlice

export default reducer

const { selectAll } = heroesAdapter.getSelectors((state) => state.heroes)

export const filteredHeroesSelector = createSelector([selectAll, state => state.filters.activeFilter],
   (heroes, activeFilter) => {
      if (activeFilter === 'all') {
         return heroes
      }

      return heroes.filter(({ element }) => element === activeFilter)
   })

export const {
   heroesFetching,
   heroesFetched,
   heroesFetchingError,
   heroDeleted,
   heroCreated
} = actions