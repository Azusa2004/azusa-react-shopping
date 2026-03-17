import { App, Button, Input, message, Modal, Space, type TableProps } from "antd"
import BaseCard from "../../../components/Card/BaseCard";
import BaseTable from "../../../components/baseTable/BaseTable";
import { useEffect, useState } from "react";
import { adduserGroupApi, deleteGroupApi, getuserGroup, modifyGroupApi } from "@/apis/UserApi";
import { ExclamationCircleFilled } from '@ant-design/icons';

const UserStatistics = () => {
    interface DataType {
        key: string;
        _id: string;
        name: string;
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            width: '200px'
        },
        {
            title: '分组',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: '3',
            render: (record) => (
                <Space size="middle">
                    <a onClick={() => {
                        showModal(record._id, record.name)
                    }}>修改</a>
                    <a style={{ color: 'red' }} onClick={() => {
                        showDeleteConfirm(record._id)
                    }}>删除</a>
                </Space>
            ),
            width: '200px'
        },
    ];

    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageData, setPagData] = useState({ currentPage: 1, pageSize: 10 })
    const [inputData, setinputData] = useState<string>()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isadd, setisadd] = useState<string | null>(null)

    useEffect(() => {
        getGroup()
    }, [pageData])

    const getGroup = () => {
        getuserGroup({ ...pageData }).then(res => {
            if (res.code == 200) {
                setData(res.data.rows)
                setTotal(res.data.total)
            }
        })
    }

    const onPageChange = (currentPage: number, pageSize: number) => {
        setPagData({
            currentPage, pageSize
        })
    }
    //添加
    const addshowModal = () => {
        setIsModalOpen(true);
        setisadd(null)
        setinputData('');
    };
    //编辑
    const showModal = (id: string, name: string) => {
        setIsModalOpen(true);
        setisadd(id)
        setinputData(name);
    };
    const handleOk = () => {
        if (inputData) {
            if (!isadd) {
                adduserGroupApi({ name: inputData }).then(res => {
                    if (res.code == 200) {
                        success()
                        getGroup()
                        setIsModalOpen(false);
                    } else {
                        console.log(res.message);
                    }
                })
            } else {
                modifyGroupApi({ _id: isadd, name: inputData }).then(res => {
                    if (res.code == 200) {
                        success()
                        setIsModalOpen(false);
                    } else {
                        console.log(res.message);
                    }
                })
            }

        } else {
            error()
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setinputData('');
    };

    const { modal } = App.useApp();
    const showDeleteConfirm = (id: string) => {
        modal.confirm({
            title: '确定要删除吗',
            icon: <ExclamationCircleFilled />,
            content: '此操作不可恢复',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteGroupApi({ _id: id }).then(res => {
                    if (res.code == 200) {
                        success()
                        getGroup()
                    } else {
                        console.log(res);
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: '操作成功',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: '不能为空',
        });
    };
    return (
        <div>
            {contextHolder}
            <BaseCard>
                <Button type="primary" onClick={addshowModal}>添加分组</Button>
                <BaseTable columns={columns} data={data} total={total} pageData={pageData} onChange={onPageChange}></BaseTable>
                <Modal
                    title={isadd ? '编辑分组' : '添加分组'}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}>
                    <div style={{ display: 'flex', alignContent: 'center', margin: '40px 0 50px 0', }}>
                        <div>分组名称：</div>
                        <Input
                            placeholder="请输入分组名称"
                            style={{ width: '360px' }}
                            value={inputData}
                            onChange={(e) => setinputData(e.target.value)}
                            allowClear />
                    </div>
                </Modal>
            </BaseCard>
        </div>
    )
}

export default UserStatistics