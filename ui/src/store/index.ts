import { configureStore } from "@reduxjs/toolkit";

import previewReducer from "./preview";

const store = configureStore({
  reducer: {
    preview: previewReducer
  }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store