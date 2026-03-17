import { configureStore } from '@reduxjs/toolkit'
import UserSliceSlice from "./UserSlice";

// 创建仓库
export const store = configureStore({
    reducer: {
        global: UserSliceSlice
    },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch