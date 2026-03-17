import { httpPost } from "@/utils/AxiosConfig"

export const LognApi = (data: any) => {
    return httpPost('/admin/login', data)
}