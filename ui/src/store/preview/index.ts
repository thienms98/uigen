import { PreviewItem } from '@/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState:PreviewItem[] = JSON.parse(localStorage?.getItem('preview') || '[]')

const store = (preview:PreviewItem[]) => localStorage.setItem('preview', JSON.stringify(preview))

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    addItem (state, action: PayloadAction<PreviewItem>){
      state.push(action.payload)
      store(state)
    },
    moveItem (state, action: PayloadAction<{lastPosition: number, nextPosition: number}>){
      const item = state.splice(action.payload.lastPosition, 1);
      state.splice(action.payload.nextPosition, 0, ...item)
      store(state)
    },
    deleteItem (state, action: PayloadAction<{position: number}>){
      state.splice(action.payload.position, 1)
      store(state)
    },
    clearPreview (state){
      localStorage.removeItem('preview')
      return []
    },
    addComponentToPosition (state, action:PayloadAction<{component: PreviewItem, position: number}>){
      const {position, component} = action.payload
      state.splice(position, 0, component)   
      store(state)
    }
  }
})

export const { addItem, moveItem, deleteItem, clearPreview, addComponentToPosition } = previewSlice.actions
export default previewSlice.reducer