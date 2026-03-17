import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const UserSliceSlice = createSlice({
    name: 'counter',
    initialState: {
        userdata: null as any,
        Power: [] as any[]
    },
    reducers: {
        UserSliceAmount: (state, action: PayloadAction<any>) => {
            console.log('仓库内部接收外部传递的数据', action.payload);
            state.userdata = action.payload
            state.Power = action.payload?.roleId?.permissionIds;
        },
    },
})

export const { UserSliceAmount } = UserSliceSlice.actions
export default UserSliceSlice.reducer