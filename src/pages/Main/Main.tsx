import React, { createElement, useMemo, useState } from 'react';
import '../../styles/App.css'
import logo from '../../assets/admin_logo_big.png';
import { Outlet, useLocation, useNavigate } from "react-router"
import * as allIcons from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import type { RootState } from "@/store"
import { useSelector } from "react-redux"

const { Header, Content, Footer, Sider } = Layout;


const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    backgroundColor: 'rgb(40, 44, 52)'
};

function isicon(iconName: any) {
    if (!iconName) {
        return null
    }
    const icon = (allIcons as any)[iconName]
    if (!icon) {
        return null
    }
    return createElement(icon)
}


function mapMenus(permissions2: any[]) {
    return permissions2.reduce((prev, item) => {
        if (item.type == 'button') {
            return prev
        }
        if (item.children) {
            const children = mapMenus(item.children);
            if (children.length > 0) {
                return [
                    ...prev,
                    {
                        key: item.path,
                        icon: isicon(item.icon),
                        label: item.title,
                        children: mapMenus(item.children)
                    }
                ]
            }
        }
        return [
            ...prev,
            {
                key: item.path,
                icon: isicon(item.icon),
                label: item.title
            }
        ]
    }, [])
}

const Main: React.FC = () => {
    const [selectedKeys, setSelectedKeys] = useState(['/Header/Header']);
    const navigate = useNavigate();
    const handleMenuClick = (e: any) => {
        const key = e.key;
        navigate(key);
        setSelectedKeys(key)
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const permissions = useSelector((state: RootState) => state.global.userdata);
    const permissions2 = useSelector((state: RootState) => state.global.Power);
    const { pathname } = useLocation();
    const items = useMemo(() => {
        return mapMenus(permissions2)
    }, [permissions2])

    function getBreadcrumb(pathname: string, permissions2: any) {
        for (let item of permissions2) {
            if (item.path == pathname) {
                return [{ title: item.title }]
            }
            if (item.children) {
                const getBread: any[] = getBreadcrumb(pathname, item.children)
                if (getBread.length > 0) {
                    return [{ title: item.title }, ...getBread]
                }
            }
        }
        return []
    }

    return (
        <Layout hasSider>
            <Sider style={siderStyle}>
                <div className="demo-logo-vertical" style={{ display: 'flex', justifyContent: 'center' }}><img src={logo} alt="" style={{ width: '210px', height: '60px' }} /></div>
                <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} items={items} style={{ backgroundColor: 'rgb(40, 44, 52)' }} onClick={handleMenuClick} />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    position: "sticky",
                    top: '0',
                    zIndex: '100',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    height: '84px'
                }}>

                    <div style={{
                        height: '50px',
                        borderBottom: '1px solid #ebeef5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        padding: '0 40px'
                    }}>
                        <Breadcrumb items={getBreadcrumb(pathname, permissions2)} />

                        {'管理员：' + permissions?.name}
                    </div>
                    <div></div>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>

                    <Outlet></Outlet>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Main;