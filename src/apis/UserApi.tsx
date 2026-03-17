import { httpDelete, httpPost, httpPut } from "@/utils/AxiosConfig"
//获取用户分组
export const getuserGroup = (data?: any) => {
    return httpPost('/userGroup/find', data)
}
//添加用户分组
export const adduserGroupApi = (data?: any) => {
    return httpPost('/userGroup/add', data)
}
//删除用户分组
export const deleteGroupApi = (data?: any) => {
    return httpDelete('/userGroup/remove', data)
}
//修改用户分组
export const modifyGroupApi = (data?: any) => {
    return httpPut('/userGroup/update', data)
}
//查询用户等级
export const getGradeApi = (data?: any) => {
    return httpPost('/userLevel/find', data)
}
//添加用户等级
export const addGradeApi = (data?: object) => {
    return httpPost('/userLevel/add', data)
}
//修改用户等级
export const modifyGradeApi = (data?: object) => {
    return httpPut('/userLevel/update', data)
}
//删除用户等级
export const deteleGradeApi = (data?: any) => {
    return httpDelete('/userLevel/remove', data)
}
//查询用户
export const getuserApi = (data?: object) => {
    return httpPost('/user/find', data)
}