import { httpGet } from "@/utils/AxiosConfig"

//获取订单数据
export const gethomeApi = () => {
    return httpGet('/home/order')
}