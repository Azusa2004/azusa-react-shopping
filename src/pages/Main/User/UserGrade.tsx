import { App, Button, Form, Image, Input, Space, Switch } from "antd";
import BaseCard from "../../../components/Card/BaseCard";
import BaseTable from "../../../components/baseTable/BaseTable";
import { useEffect, useState } from "react";
import { deteleGradeApi, getGradeApi, modifyGradeApi } from "@/apis/UserApi";
import UserGradeForm from "./UserGradeForm";
import { ExclamationCircleFilled } from '@ant-design/icons';
import BaseSelect from "../../../components/BaseSelect/BaseSelect";
const UserGrade = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '等级图标',
            dataIndex: 'icon',
            key: 'icon',
            render: (text: any) => {
                return <Image src={text} alt="" width={40} height={40}></Image>
            }
        },
        {
            title: '等级背景图',
            dataIndex: 'bgImage',
            key: 'bgImage',
            render: (text: any) => <Image src={text} width={40} height={40}></Image>

        },
        {
            title: '等级名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '等级',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '享受折扣',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: '经验值要求',
            dataIndex: 'exp',
            key: 'exp',
        },
        {
            title: '是否显示',
            dataIndex: 'enable',
            key: 'enable',
            render: (text: any, record: any) => {
                return <Switch checked={text ? true : false} onChange={(value) => {
                    onChange(value, record._id)
                }} />
            }
        },
        {
            title: '操作',
            key: '3',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <a onClick={() => {
                        modifyGrade(record)
                    }}>修改</a>
                    <a style={{ color: 'red' }} onClick={() => {
                        deleteGrade(record._id)
                    }}>删除</a>
                </Space>
            ),
            width: '200px'
        },
    ]


    const [data, setdata] = useState([])
    const [total, setTotal] = useState(0)
    const [pageData, setPagData] = useState({ currentPage: 1, pageSize: 6 })
    const onPageChange = (currentPage: number, pageSize: number) => {
        setPagData({
            currentPage, pageSize
        })
    }
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isadd, setisadd] = useState<object | null>(null)
    const { message: messageApi } = App.useApp()
    const [isenable, setisenable] = useState<string | null>()
    const [isName, setisName] = useState<string | null>()

    useEffect(() => {
        getGrade()
    }, [pageData, isenable, isName])

    const getGrade = () => {
        const params: any = { ...pageData };
        if (isenable) {
            params.enable = isenable
        }
        if (isName) {
            params.name = isName
        }
        getGradeApi(params).then(res => {
            if (res.code == 200) {
                setdata(res.data.rows)
                setTotal(res.data.total)
            } else {
                console.log(res);
            }
        })
    }
    //添加
    const addGrade = () => {
        setIsModalOpen(true);
        setisadd(null)
    }
    //修改
    const modifyGrade = (record: any) => {
        setIsModalOpen(true);
        setisadd(record)

    }
    //删除
    const { modal } = App.useApp();
    const deleteGrade = (id: string) => {
        modal.confirm({
            title: '确定要删除吗',
            icon: <ExclamationCircleFilled />,
            content: '此操作不可恢复',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deteleGradeApi({ _id: id }).then(res => {
                    if (res.code == 200) {
                        messageApi.success('删除成功')
                        getGrade()
                    } else {
                        messageApi.error(res.message)
                    }
                })
            },
            onCancel() { },
        });
    }

    const onChange = (checked: boolean, _id: string) => {
        modifyGradeApi({
            enable: Number(checked),
            _id
        }).then(res => {
            console.log(res);
            getGrade()

        })

    };

    const handleCancel = () => {
        setIsModalOpen(false);

    };
    const handleChange = (value: string) => {
        setisenable(value)
    };
    const handleName = () => {
        const nameValue = form.getFieldValue('name');
        setisName(nameValue)
    }





    return (
        <div>
            <BaseCard>
                <Form form={form} layout="inline">
                    <Form.Item label="等级状态" name="enable">
                        <BaseSelect placeholder={'请选择'} onChange={handleChange}></BaseSelect>
                    </Form.Item>
                    <Form.Item label="等级状态" name="name">
                        <Input placeholder="请输入等级名称" style={{ width: '250px', marginRight: '10px' }} allowClear />
                    </Form.Item>
                    <Button type="primary" onClick={handleName}>查询</Button>
                </Form>

            </BaseCard>
            <BaseCard >
                <Button type="primary" onClick={addGrade}>添加用户等级</Button>
                <BaseTable columns={columns} total={total} data={data} pageData={pageData} onChange={onPageChange}></BaseTable>
            </BaseCard>
            <UserGradeForm isModalOpen={isModalOpen} handleCancel={handleCancel} getGrade={getGrade} isadd={isadd}>
            </UserGradeForm>
        </div>
    )
}

export default UserGrade