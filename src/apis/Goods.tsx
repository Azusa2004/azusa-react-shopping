import { httpGet, httpPost } from "@/utils/AxiosConfig"

//获取商品状态
export const getGoodsconditionApi = () => {
    return httpGet('/productState/find')
}
//查询商品
export const getGoodsApi = (data?: any) => {
    return httpPost('/product/find', data)
}
//查询商品分类
export const getGoodsTypeApi = (data?: any) => {
    return httpPost('/productClassify/find', data)
}
//查询商品标签
export const getGoodsTagApi = (data?: any) => {
    return httpPost("/productTag/find", data)
}
//查询商品类型
export const getGoodsType2Api = (data?: any) => {
    return httpPost('/productType/find', data)
}