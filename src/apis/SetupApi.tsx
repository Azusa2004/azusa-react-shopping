import { httpDelete, httpGet, httpPost, httpPut } from "@/utils/AxiosConfig"
//查询权限
export const getPowerApi = (data?: any) => {
    return httpPost('/permission/find', data)
}
//删除权限
export const deletePowerApi = (data?: any) => {
    return httpDelete('/permission/remove', data)
}
//增加权限
export const addPowerApi = (data?: any) => {
    return httpPost('/permission/add', data)
}
//修改权限
export const modifyPowerApi = (data?: any) => {
    return httpPut('/permission/update', data)
}
//查询角色
export const getRoleApi = (data?: any) => {
    return httpPost('/role/find', data)
}
//添加角色
export const addRoleApi = (data?: any) => {
    return httpPost('/role/add', data)
}
//修改角色
export const modifyRoleApi = (data?: any) => {
    return httpPut('/role/update', data)
}
//删除角色
export const deleteRoleApi = (data: any) => {
    return httpDelete('/role/remove', data)
}
//查询管理员
export const getWardenApi = (data?: any) => {
    return httpPost('/admin/find', data)
}
//添加管理员
export const addWardenApi = (data: any) => {
    return httpPost('/admin/add', data)
}
//修改管理员
export const modifyWardenApi = (data?: any) => {
    return httpPut('/admin/update', data)
}
//删除管理员
export const deleteWardenApi = (data: any) => {
    return httpDelete('/admin/remove', data)
}
//获取管理员信息
export const getAuthorizationApi = (data?: any) => {
    return httpGet('/admin/info', data)
}