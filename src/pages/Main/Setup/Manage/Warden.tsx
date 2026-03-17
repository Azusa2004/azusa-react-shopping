import { App, Button, Flex, Form, Input, Modal, Radio, Select, Space, Switch } from "antd";
import BaseCard from "../../../../components/Card/BaseCard";
import BaseTable from "../../../../components/baseTable/BaseTable";
import { useEffect, useState } from "react";
import { addWardenApi, deleteWardenApi, getRoleApi, getWardenApi, modifyWardenApi } from "@/apis/SetupApi";

const Warden = () => {
    const [form] = Form.useForm()
    const { message: messageApi } = App.useApp()
    const [datatotal, setDatatotal] = useState({ rows: [], total: 0 })
    const [pageData, setPagData] = useState({ currentPage: 1, pageSize: 8 })
    const onPageChange = (currentPage: number, pageSize: number) => {
        setPagData({
            currentPage, pageSize
        })
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [getRole, setgetRole] = useState([])

    useEffect(() => {
        getWarden()
    }, [pageData])

    useEffect(() => {
        if (isModalOpen) {
            getRoleApi({ creator: 'zym' }).then(res => {
                if (res.code == 200) {
                    setgetRole(res.data.rows)
                }
            })
        }
    }, [isModalOpen])

    const getWarden = () => {
        getWardenApi({ ...pageData }).then(res => {
            if (res.code == 200) {
                setDatatotal(res.data)
            }
        })
    }

    const handleOk = () => {
        form.submit();
    };

    const [isAdd, setisAdd] = useState()
    const showModal = (id: any) => {
        setisAdd(id)
        if (id == 'add') {
            form.resetFields()
        } else {
            form.setFieldsValue({ ...id, roleId: id.roleId._id })
        }
        setIsModalOpen(true);
    };

    const onFinish = (value: any) => {
        if (isAdd == 'add') {
            addWardenApi({ ...value }).then(res => {
                if (res.code == 200) {
                    messageApi.success('添加成功')

                } else {
                    messageApi.error(res.message)
                }
            })
        } else {
            modifyWardenApi({ ...value, _id: (isAdd as any)._id }).then(res => {
                if (res.code == 200) {
                    messageApi.success('修改成功')
                } else {
                    messageApi.error(res.message)
                }
            })
        }
        getWarden()
        console.log(value);
        setIsModalOpen(false);
    }

    //删除
    const deleteWarden = (id: any) => {
        deleteWardenApi({ _id: id }).then(res => {
            if (res.code == 200) {
                messageApi.success('删除成功')
                getWarden()
            } else {
                messageApi.error(res.message)
            }
        })
    }


    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '身份',
            dataIndex: 'roleId',
            key: 'roleId',
            render: (roleId: any) => {
                return <div>{roleId.name}</div>
            }
        },
        {
            title: '最后一次登录时间',
            dataIndex: 'permissionIds',
            key: 'permissionIds',
            render: () => <div style={{ color: '#909399' }}>暂无数据</div>
        },
        {
            title: '最后一次登录IP',
            dataIndex: 'IP',
            key: 'IP',
            render: () => <div style={{ color: '#909399' }}>暂无数据</div>
        },
        {
            title: '开启',
            dataIndex: 'enable',
            key: 'enable',
            render: (text: string) => {
                return <Switch checkedChildren="是" unCheckedChildren="否" checked={text ? true : false} />
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
                    }}>操作</a>
                    <a onClick={() => {
                        deleteWarden(record._id)
                    }}>删除</a>
                </Space>
            }
        }
    ]

    return (
        <div>
            <BaseCard>
                <Form form={form} layout="inline">
                    <Form.Item label="状态">
                        <Select placeholder="请选择" allowClear style={{ width: '250px' }} options={[
                            { label: '开启', value: '1' },
                            { label: '关闭', value: '0' }
                        ]}></Select>
                    </Form.Item>
                    <Form.Item label="搜索">
                        <Input placeholder="请输入姓名或账号" style={{ width: '250px' }} allowClear></Input>
                    </Form.Item>
                    <Button type="primary">查询</Button>
                </Form>
            </BaseCard>
            <BaseCard>
                <Button type="primary" onClick={() => showModal('add')}>添加管理员</Button>
                <BaseTable data={datatotal.rows} total={datatotal.total} pageData={pageData} onChange={onPageChange} columns={columns}></BaseTable>

                <Modal
                    title={isAdd == 'add' ? '添加管理员' : '修改管理员'}
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={() => setIsModalOpen(false)}>
                    <Form form={form} labelCol={{ style: { width: 90 } }} onFinish={onFinish} style={{ marginTop: '30px' }}>
                        <Form.Item label="管理员账号" name="account" hasFeedback rules={[
                            {
                                required: true,
                                message: '请输入账号',
                            }
                        ]}>
                            <Input placeholder="请输入管理员账号" allowClear></Input>
                        </Form.Item>
                        <Form.Item label="管理员密码" hasFeedback name="password" rules={[
                            {
                                required: true,
                                message: '请输入密码'
                            }
                        ]}>
                            <Input placeholder="请输入管理员密码" allowClear></Input>
                        </Form.Item>
                        <Form.Item label="确认密码" name="password2" dependencies={['password']} hasFeedback rules={[
                            {
                                required: true,
                                message: '请确认密码'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();  // 验证通过
                                    }
                                    return Promise.reject(new Error('两次密码不一致')); // 验证不通过
                                },
                            }),
                        ]}>
                            <Input.Password placeholder="请确认密码" allowClear></Input.Password>
                        </Form.Item>
                        <Form.Item label="管理员姓名" name="name" hasFeedback rules={[
                            {
                                required: true,
                                message: '管理员姓名不能为空'
                            }
                        ]}>
                            <Input placeholder="请输入管理员姓名" allowClear></Input>
                        </Form.Item>
                        <Form.Item label="管理员角色" name="roleId" hasFeedback rules={[
                            {
                                required: true,
                                message: '请选择管理员角色'
                            }
                        ]}>
                            <Select placeholder="请选择" allowClear options={getRole} fieldNames={{
                                label: 'name',
                                value: '_id'
                            }}></Select>
                        </Form.Item>
                        <Form.Item label="状态" name="enable">
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
                    </Form>
                </Modal>
            </BaseCard>
        </div >
    )
}

export default Warden