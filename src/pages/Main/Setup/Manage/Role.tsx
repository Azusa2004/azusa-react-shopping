import { App, Button, Flex, Form, Input, Modal, Radio, Select, Space, Tree } from "antd";
import BaseCard from "../../../../components/Card/BaseCard";
import BaseTable from "../../../../components/baseTable/BaseTable";
import { useEffect, useState } from "react";
import { addRoleApi, deleteRoleApi, getPowerApi, getRoleApi, modifyRoleApi } from "@/apis/SetupApi";

const Role = () => {
    const [form] = Form.useForm()
    const { message: messageApi } = App.useApp()
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageData, setPagData] = useState({ currentPage: 1, pageSize: 8 })
    const onPageChange = (currentPage: number, pageSize: number) => {
        setPagData({
            currentPage, pageSize
        })
    }
    const [getPower, setgetPower] = useState([])
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getgetRole()
    }, [])

    useEffect(() => {
        getPowerApi({ creator: 'zym' }).then(res => {
            if (res.code == 200) {
                setgetPower(res.data.rows)
            }
        })
    }, [isModalOpen])

    const getgetRole = () => {
        getRoleApi({ ...pageData, creator: 'zym' }).then(res => {
            if (res.code == 200) {
                setData(res.data.rows)
                setTotal(res.data.total)
            } else {
                messageApi.error(res.message)
            }
        })
    }

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: '权限',
            dataIndex: 'permissionIds',
            key: 'permissionIds',
            render: (permissionIds: any) => {
                return permissionIds.map((item: any) => item.title).join('、')
            }
        },
        {
            title: '操作',
            key: '3',
            width: '200px',
            render: (record: any) => {
                return <Space>
                    <a onClick={() => {
                        showModal(record)
                    }}>编辑</a>
                    <a onClick={() => {
                        deleteRole(record._id)
                    }}>删除</a>
                </Space>
            }
        }
    ]

    const [isadd, setisadd] = useState({})
    const showModal = (data: any) => {
        setisadd(data)
        setIsModalOpen(true);

        if (data == 'add') {
            form.resetFields()
            setCheckedKeys([])
        } else {
            form.setFieldsValue({ ...data })
            setCheckedKeys(data.permissionIds.map((item: any) => item._id))
        }
    };

    const handleOk = () => {
        const Roledata = form.getFieldsValue()
        Roledata.permissionIds = checkedKeys
        if (isadd == 'add') {
            //添加
            addRoleApi({ ...Roledata, creator: 'zym' }).then(res => {
                if (res.code == 200) {
                    messageApi.success('添加成功')
                    setIsModalOpen(false);
                    getgetRole()
                } else {
                    messageApi.error(res.message)
                }
            })
        } else {
            //修改
            modifyRoleApi({ _id: (isadd as any)._id, ...Roledata }).then(res => {
                if (res.code == 200) {
                    messageApi.success('修改成功')
                    getgetRole()
                    setIsModalOpen(false);
                } else {
                    messageApi.error(res.message)
                }
            })
        }
    };

    const deleteRole = (id: string) => {
        deleteRoleApi({ _id: id }).then(res => {
            if (res.code == 200) {
                messageApi.success('删除成功')
                getgetRole()
            } else {
                messageApi.error(res.message)
            }
        })
    }

    const onTreeCheck: any = (keys: React.Key[]) => {
        setCheckedKeys(keys)
        console.log(keys);

    }

    return (
        <>
            <BaseCard>
                <Form layout="inline">
                    <Form.Item label="状态">
                        <Select placeholder="请选择" allowClear style={{ width: '250px' }} options={[
                            { label: '显示', value: '1' },
                            { label: '不显示', value: '0' }
                        ]}></Select>
                    </Form.Item>
                    <Form.Item label="身份昵称">
                        <Input placeholder="请输入身份昵称" style={{ width: '250px' }} allowClear></Input>
                    </Form.Item>
                    <Button type="primary">查询</Button>
                </Form>
            </BaseCard>
            <BaseCard>
                <Button type="primary" onClick={() => showModal('add')}>添加身份</Button>
                <BaseTable data={data} total={total} pageData={pageData} onChange={onPageChange} columns={columns}></BaseTable>

                <Modal
                    title={isadd == 'add' ? '添加角色' : '修改角色'}
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={() => {
                        setIsModalOpen(false);
                    }}>
                    <Form form={form} >
                        <Form.Item label="身份名称" name="name" rules={[
                            { required: true, message: '请输入身份名称' }]}>
                            <Input></Input>
                        </Form.Item>

                        <Form.Item label="是否开启" name="enable" rules={[
                            { required: true }]}>
                            <Radio.Group
                                options={[
                                    {
                                        value: 1,
                                        label: (
                                            <Flex gap="small" justify="center" align="center" vertical>
                                                开启
                                            </Flex>
                                        ),
                                    },
                                    {
                                        value: 0,
                                        label: (
                                            <Flex gap="small" justify="center" align="center" vertical>
                                                关闭
                                            </Flex>
                                        ),
                                    },
                                ]}>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="权限" name="permissionIds">
                            <Tree checkable treeData={getPower} onCheck={onTreeCheck} checkedKeys={checkedKeys} fieldNames={{
                                title: 'title',
                                key: '_id'
                            }}></Tree>
                        </Form.Item>
                    </Form>
                </Modal>
            </BaseCard>
        </>
    )
}

export default Role