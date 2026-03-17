import Error from "@/pages/404/Error"
import Login from "@/pages/log/Login"
import Main from "@/pages/Main/Main"
import Usermanage from "@/pages/Main/User/Usermanage"
import UserStatistics from "@/pages/Main/User/UserStatistics"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import UserGroup from "@/pages/Main/User/UserGroup";
import UserGrade from "@/pages/Main/User/UserGrade"
import UserTag from "@/pages/Main/User/UserTag"
import OrderBack from "@/pages/Main/Order/OrderBack"
import OrderCashier from "@/pages/Main/Order/OrderCashier"
import OrderManage from "@/pages/Main/Order/OrderManage"
import OrderRecord from "@/pages/Main/Order/OrderRecord"
import Power from "@/pages/Main/Setup/Manage/Power"
import Role from "@/pages/Main/Setup/Manage/Role"
import Warden from "@/pages/Main/Setup/Manage/Warden"
import Header from "@/pages/Main/Header/Header"

import useApi from "@/hook/useApi";
import { lazy, Suspense, useEffect, useState } from "react"
import type { RootState } from "@/store"
import { useSelector } from "react-redux"
//所有路由路径配置对象
// const routes = [
//     {
//         path: '/Login',
//         Component: Login,
//     },
//     {
//         path: '/',
//         Component: Main,
//         children: [
//             {
//                 path: 'Header',
//                 Component: Header
//             },
//             {
//                 path: 'user/statistics',//用户统计
//                 Component: UserStatistics
//             },
//             {
//                 path: 'user/manage',//用户管理
//                 Component: Usermanage
//             },
//             {
//                 path: 'user/group',//用户分组
//                 Component: UserGroup
//             },
//             {
//                 path: 'User/grade',//用户等级
//                 Component: UserGrade
//             },
//             {
//                 path: 'User/tag',//用户标签
//                 Component: UserTag
//             },
//             {
//                 path: 'Order/Back',//售后订单
//                 Component: OrderBack
//             },
//             {
//                 path: 'Order/Cashier',//收银订单
//                 Component: OrderCashier
//             },
//             {
//                 path: 'Order/Manage',//订单管理
//                 Component: OrderManage
//             },
//             {
//                 path: 'Order/Record',//核销记录
//                 Component: OrderRecord
//             },
//             {
//                 path: 'manage/role',//角色管理
//                 Component: Role
//             },
//             {
//                 path: 'manage/power',//权限管理
//                 Component: Power
//             },
//             {
//                 path: 'manage/Warden',//管理员列表
//                 Component: Warden
//             }
//         ]
//     },
//     {
//         path: '/*',
//         Component: Error
//     }
// ]
//全局路由对象

function lazyLoad(componentPath: string) {
    const files = import.meta.glob('@/pages/*/**');
    const Component = lazy((files as any)[`/src/pages/Main${componentPath}.tsx`]);
    return (
        <Suspense fallback={<p>加载中...</p>}>
            <Component />
        </Suspense>
    )
}

function mapRoutes(permissions: any[] = []) {
    return permissions.reduce((prev, item) => {
        if (item.isRoute) {
            return [
                ...prev,
                {
                    path: item.path,
                    element: lazyLoad(item.componentPath)
                },
                ...mapRoutes(item.children)
            ]
        }
        return [
            ...prev,
            ...mapRoutes(item.children)
        ]
    }, [])
}


const Index = () => {
    const [routes, setroutes] = useState<any>([])
    const token = localStorage.getItem('userToken')
    const permissions = useSelector((state: RootState) => state.global.Power);
    const { getAdminInfoHook } = useApi();

    useEffect(() => {
        if (token) {
            getAdminInfoHook()
        } else {
            setroutes([
                {
                    path: '/Login',
                    element: <Login />
                },
                {
                    path: '/*',
                    element: <Navigate to="/Login" replace />
                }
            ])
        }
    }, [])

    useEffect(() => {
        if (permissions.length > 0) {
            setroutes([
                { path: '/Login', element: <Navigate to="/Header/Header" replace /> },
                {
                    path: '/', element: <Main />,
                    children: mapRoutes(permissions)
                },
                {
                    path: '/*',
                    Component: Error
                }
            ])
        }
    }, [permissions])

    if (routes.length == 0) {
        return null;
    }
    return (
        <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    )
}

export default Index