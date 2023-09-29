import { DragItem, PreviewItem } from '@/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState:DragItem = {
  dragItem: -1,
  dragOver: -1,
  draggingComponent: null
}

const dragSlice = createSlice({
  name: 'drag',
  initialState,
  reducers: {
    setDragItem(state, action:PayloadAction<number>){
      state.dragItem = action.payload
    },
    setDragOver(state, action:PayloadAction<number>){
      state.dragOver = action.payload
    },
    setDraggingComponent(state, action: PayloadAction<PreviewItem | null>){
      state.draggingComponent = action.payload
    }
  }
})

export const {setDragItem,
  setDragOver,
  setDraggingComponent,} = dragSlice.actions
export default dragSlice.reducer