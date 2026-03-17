import { getAuthorizationApi } from "@/apis/SetupApi"
import { UserSliceAmount } from "@/store/UserSlice"
import { useDispatch } from "react-redux"
const useApi = () => {
    const dispatch = useDispatch();

    const getAdminInfoHook = async () => {
        const res = await getAuthorizationApi({});
        if (res.code == 200) {
            dispatch(UserSliceAmount(res.data))
            console.log(res);
        }

    }
    return {
        getAdminInfoHook
    }
}

export default useApi