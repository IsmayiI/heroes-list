import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit"
import { useHttp } from "../../hooks/http.hook"


const filtersAdapter = createEntityAdapter({
   selectId: (entity) => entity.name,
})

const initialState = filtersAdapter.getInitialState({
   filtersLoadingStatus: 'idle',
   activeFilter: 'all'
})

export const filtersFetch = createAsyncThunk(
   'filters/filtersFetch',
   () => {
      const { request } = useHttp()
      return request("http://localhost:3001/filters")
   }
)


const filtersSlice = createSlice({
   name: 'filters',
   initialState,
   reducers: {
      changeActiveFilter: (state, action) => {
         state.activeFilter = action.payload
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(filtersFetch.pending, state => { state.filtersLoadingStatus = 'loading' })
         .addCase(filtersFetch.fulfilled, (state, action) => {
            filtersAdapter.setAll(state, action.payload)
            state.filtersLoadingStatus = 'idle'
         })
         .addCase(filtersFetch.rejected, state => { state.filtersLoadingStatus = 'error' })
         .addDefaultCase(() => { })
   }
})


const { actions, reducer } = filtersSlice

export default reducer

export const { selectAll } = filtersAdapter.getSelectors(state => state.filters);


export const {
   filtersFetching,
   filtersFetched,
   filtersFetchingError,
   changeActiveFilter
} = actions