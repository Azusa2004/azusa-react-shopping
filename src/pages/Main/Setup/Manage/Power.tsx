import { App, Button, Cascader, Drawer, Form, Input, Select, Space, Switch, Tag, type DrawerProps } from "antd";
import BaseCard from "../../../../components/Card/BaseCard";
import { useEffect, useState } from "react";
import BaseTable from "../../../../components/baseTable/BaseTable";
import { addPowerApi, deletePowerApi, getPowerApi, modifyPowerApi } from "@/apis/SetupApi";
import * as allIcons from '@ant-design/icons'
import { createElement } from "react"


const Power = () => {
    const [form] = Form.useForm()
    const [data, setData] = useState([])
    const [fatherData, setFatherData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageData, setPagData] = useState({ currentPage: 1, pageSize: 8 })
    const onPageChange = (currentPage: number, pageSize: number) => {
        setPagData({
            currentPage, pageSize
        })
    }
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState<DrawerProps['size']>();
    const { message: messageApi } = App.useApp()
    const [isaddID, setisaddID] = useState('')



    useEffect(() => {
        getPower()
    }, [pageData])

    const getPower = () => {
        getPowerApi({ ...pageData, creator: 'zym' }).then(res => {
            if (res.code == 200) {
                console.log(res);
                setData(res.data.rows)
                setTotal(res.data.total)
            }
        })
        getPowerApi({ creator: 'zym' }).then(res => {
            if (res.code == 200) {
                setFatherData(res.data.rows)
            }
        })
    }


    const columns = [
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            render(value: string) {
                const icon = (allIcons as any)[value];
                if (icon) {
                    return createElement(icon)
                }
                return value;
            }
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => {
                return text == "button" ?
                    (<Tag color="#87d068" variant="filled" >按钮</Tag>)
                    :
                    (<Tag color="#108ee9" variant="filled" >菜单</Tag>)
            }
        },
        {
            title: '路由路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '路由配置',
            dataIndex: 'isRoute',
            key: 'isRoute',
            render: (text: any, record: any) => {
                return <Switch checkedChildren="是" unCheckedChildren="否" checked={text ? true : false} onChange={(value) => {

                }} />
            }
        },
        {
            title: '组件路径',
            dataIndex: 'componentPath',
            key: 'componentPath',
        },
        {
            title: '顺序',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '显示',
            dataIndex: 'enable',
            key: 'enable',
            render: (text: any, record: any) => {
                return <Switch checkedChildren="是" unCheckedChildren="否" checked={text ? true : false} onChange={(value) => {
                }} />
            }
        },
        {
            title: '操作',
            key: '3',
            width: '200px',
            render: (record: any) => {
                return <Space>
                    <a onClick={() => {
                        {
                            Close2(record)
                        }
                    }}>编辑</a>
                    <a onClick={() => {
                        deletePower(record._id)
                    }}>删除</a>
                </Space>
            }
        }
    ]
    const Close = () => {
        setOpen(false);
    }
    const Close2 = (record: any) => {
        setisaddID(record)
        setOpen(true)
        if (record != 'add') {
            //修改回显
            form.setFieldsValue({ ...record })
        } else {
            form.resetFields()
        }
    }

    const onOK = () => {
        console.log(form.getFieldsValue());
        const data = form.getFieldsValue()
        if (isaddID == 'add') {
            //添加
            addPowerApi({
                ...data,
                parentId: data.parentId ? data.parentId.at(-1) : '0',
                isRoute: data.isRoute ? 1 : 0,
                creator: 'zym'
            }).then(res => {
                if (res.code == 200) {
                    messageApi.success('添加成功')
                    setOpen(false);
                    form.resetFields()
                } else {
                    messageApi.error(res.message)
                }
            })
        } else {
            //修改
            if (Array.isArray(data.parentId) && data.parentId.length > 0) {
                data.parentId = data.parentId.at(-1)
            } else if (!data.parentId) {
                data.parentId = '0'
            }
            modifyPowerApi({
                ...data,
                _id: (isaddID as any)._id,
                creator: 'zym'
            }).then(res => {
                if (res.code == 200) {
                    messageApi.success('修改成功')
                    setOpen(false);
                    getPower()
                } else {
                    messageApi.error(res.message)
                }
            })
        }


    };
    //删除权限
    const deletePower = (id: string) => {
        console.log(id);
        deletePowerApi({ creator: 'zym', _id: id }).then(res => {
            if (res.code == 200) {
                messageApi.success('删除成功')
                getPower()
            } else {
                messageApi.error(res.message)
            }
        })

    }


    return (
        <>
            <BaseCard>
                <Form>
                    <Form.Item label="按钮名称" style={{ margin: '0' }}>
                        <Input style={{ width: '250px', marginRight: '10px' }} placeholder="请输入按钮名称" allowClear></Input>
                        <Button type="primary">查询</Button>
                    </Form.Item>
                </Form>
            </BaseCard>

            <BaseCard>
                <Button type="primary" onClick={() => {
                    Close2('add')
                }} >添加权限</Button>
                <BaseTable data={data} columns={columns} total={total} pageData={pageData} onChange={onPageChange}></BaseTable>

                <Drawer
                    title={isaddID == 'add' ? '添加权限' : '修改权限'}
                    placement="right"
                    size={size}
                    onClose={Close}
                    open={open}
                    extra={
                        <Space>
                            <Button type="primary" onClick={onOK}>
                                保存
                            </Button>
                        </Space>
                    }>
                    <Form form={form}>
                        <Form.Item label="权限名称" name="title">
                            <Input placeholder="请输入权限名称"></Input>
                        </Form.Item>
                        <Form.Item label="父级权限" name="parentId">
                            <Cascader options={fatherData} placeholder="请选择父级权限" changeOnSelect={true} fieldNames={{
                                label: 'title',
                                value: '_id'
                            }}></Cascader>
                        </Form.Item>
                        <Form.Item label="权限类型" name="type">
                            <Select placeholder="请选择类型" options={[
                                { label: '菜单', value: 'menu' },
                                { label: '按钮', value: 'button' }
                            ]}></Select>
                        </Form.Item>
                        <Form.Item label="路由路径" name="path">
                            <Input placeholder="请输入路由路径"></Input>
                        </Form.Item>
                        <Form.Item label="路由配置" name="isRoute">
                            <Switch checkedChildren="是" unCheckedChildren="否" />
                        </Form.Item>
                        <Form.Item label="组件路径" name="componentPath">
                            <Input placeholder="请输入组件路径"></Input>
                        </Form.Item>
                        <Form.Item label="图标" name="icon">
                            <Input></Input>
                        </Form.Item>
                        <Form.Item label="排序" name="sort">
                            <Input></Input>
                        </Form.Item>
                    </Form>
                </Drawer>

            </BaseCard>
        </>
    )
}

export default Power