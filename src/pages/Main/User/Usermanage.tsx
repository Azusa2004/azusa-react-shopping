import { Button, Col, DatePicker, Drawer, Form, Image, Input, Row, Select, Space, Tabs, type TabsProps } from "antd";
import BaseCard from "../../../components/Card/BaseCard";
import ManySelect from "../../../components/ManySelect/ManySelect";
import { useEffect, useState } from "react";
import BaseTab from "../../../components/baseTable/BaseTable";
import { getuserApi } from "@/apis/UserApi";
import type { ExpandableConfig } from "antd/es/table/interface";
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import LevelSelect from "../../../components/BaseSelect/LevelSelect";
import { utils, writeFile } from "xlsx";


const Usermanage = () => {
    const [form] = Form.useForm()
    const [TabsKey, setTabsKey] = useState('')
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageData, setPagData] = useState({ currentPage: 1, pageSize: 6 })
    const onPageChange = (currentPage: number, pageSize: number) => {
        setPagData({
            currentPage, pageSize
        })
    }
    const [spade, setspade] = useState(false)


    const options = [
        {
            value: '',
            label: '全部'
        },
        {
            value: '_id',
            label: 'UID',
        },
        {
            value: 'phone',
            label: '手机号',
        },
        {
            value: 'nickname',
            label: '用户昵称'
        }
    ];


    const onChange = (key: string) => {
        setTabsKey(key)

    };

    const item: TabsProps['items'] = [
        {
            key: '1',
            label: '全部',
        },
        {
            key: '2',
            label: '微信公众号',
        },
        {
            key: '3',
            label: '微信小程序',
        },
        {
            key: '4',
            label: 'H5',
        },
        {
            key: '5',
            label: 'PC',
        },
        {
            key: '6',
            label: 'APP',
        },
    ];

    const columns = [
        {
            title: '用户ID',
            dataIndex: 'IDnumber',
            key: 'IDnumber'
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string) => <Image src={text} style={{ width: '40px', height: '40px' }}></Image>

        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '付费会员',
            dataIndex: 'isVip',
            key: 'isVip',
            render: (text: any) => <span>{text ? '是' : '否'}</span>
        },
        {
            title: '用户等级',
            dataIndex: 'levelId',
            key: 'levelId',
            render: (text: any) => {
                return <span>{text?.name || '无'}</span>
            }
        },
        {
            title: '分组',
            dataIndex: 'groupId',
            key: 'groupId',
            render: (text: any) => {
                return <span>{text?.name || '无'}</span>
            }
        },
        {
            title: '分销等级',
            dataIndex: '',
            key: ''
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: '用户类型',
            dataIndex: 'source',
            key: 'source'
        },
        {
            title: '余额',
            dataIndex: 'integral',
            key: 'integral'
        },
        {
            title: '操作',
            render: () => {
                return <Space>
                    <a>详情</a>
                    <a>更多</a>
                </Space>
            }
        }
    ]

    function exportExcel() {
        const excelData = [
            ["用户ID", "姓名", "昵称", "手机号"],
        ]
        // 1. 将数据填入到工作表中
        const sheet = utils.aoa_to_sheet(excelData);
        // 2. 创建一个excel文件
        const book = utils.book_new();
        // 3. 将工作表添加到excel文件中
        utils.book_append_sheet(book, sheet, 'Sheet1');
        // 4. 下载excel文件
        writeFile(book, '用户信息列表.xlsx');
    }

    const expandable: ExpandableConfig<any> = {
        expandedRowRender: (record) => (
            <div style={{ padding: '0 30px', background: '#fafafa' }}>
                <Row gutter={[24, 16]} justify="space-between" style={{ marginBottom: '12px' }}>
                    <Col span={5}>
                        <span>首次访问：</span>
                        <span>{record?.firstVisitTime}</span>
                    </Col>
                    <Col span={5}>
                        <span>近次访问：</span>
                        <span>{record?.lastVisitTime}</span>
                    </Col>
                    <Col span={5}>
                        <span>身份证号：</span>
                        <span>{record?.IDnumber}</span>
                    </Col>
                    <Col span={5}>
                        <span>真实姓名：</span>
                        <span>{record?.name}</span>
                    </Col>
                </Row>
                <Row gutter={[24, 16]} justify="space-between" style={{ marginBottom: '12px' }}>
                    <Col span={5}>
                        <span>标签：</span>
                        <span>{
                            record?.tagIds.length == 0 ? '无' : record?.tagIds.map((item: any) => item.name).join('、')
                        }</span>
                    </Col>
                    <Col span={5}>
                        <span>生日：</span>
                        <span>{record?.birthday}</span>
                    </Col>
                    <Col span={5}>
                        <span>推荐人：</span>
                        <span>无</span>
                    </Col>
                    <Col span={5}>
                        <span>地址：</span>
                        <span>{record?.address}</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span>备注：</span>
                        <span>{record?.remark}</span>
                    </Col>
                </Row>
            </div>
        ),
    };


    const [selectedKeys, setSelectedKeys] = useState([]);
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (key: any) => {
            setSelectedKeys(key)
            console.log(selectedKeys);
        },
        type: 'checkbox',
    };


    useEffect(() => {
        getuserData()

    }, [pageData])

    const getuserData = () => {
        getuserApi({ ...pageData }).then(res => {
            if (res.code == 200) {
                setData(res.data.rows)
                setTotal(res.data.total)
                console.log(res.data.rows);
            } else {
                console.log(res);

            }
        })
    }


    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <BaseCard>
                <Form form={form} layout="inline">
                    <div style={{ display: 'flex', height: spade ? 'auto' : 33, overflow: 'hidden' }}>
                        <Row gutter={[10, 10]} align="middle" style={{ width: '100%', marginBottom: 15 }}>
                            <Col>
                                <Form.Item label="用户搜索">
                                    <Space.Compact style={{ width: 250, height: 29 }}>
                                        <Select
                                            defaultValue="全部"
                                            options={options}
                                            style={{ width: 100 }}
                                        />
                                        <Input placeholder="请输入" allowClear />
                                    </Space.Compact>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="用户等级">
                                    <ManySelect placeholder={'请选择用户等级'} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="用户分组">
                                    <ManySelect
                                        placeholder={'请选择用户分组'}
                                        options={options} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="分销等级">
                                    <ManySelect placeholder="请选择分销等级"></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="用户标签">
                                    <ManySelect ></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="用户身份">
                                    <ManySelect ></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="付费会员">
                                    <ManySelect placeholder="请选择分销等级"></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="储值余额">
                                    <ManySelect ></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="积分剩余">
                                    <ManySelect ></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="上次消费">
                                    <ManySelect placeholder="请选择分销等级"></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="用户标签">
                                    <ManySelect ></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="用户身份">
                                    <ManySelect ></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="充值次数">
                                    <ManySelect placeholder="请选择分销等级"></ManySelect>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="访问情况">
                                    <ManySelect ></ManySelect>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <Button type="primary">搜索</Button>
                            <Button>重置</Button>
                            {
                                spade ? (<Button type="link" icon={<CaretUpOutlined />} iconPlacement="end" onClick={() => {
                                    setspade(false)
                                }}>收起</Button >)
                                    :
                                    (<Button type="link" icon={<CaretDownOutlined />} iconPlacement="end" onClick={() => {
                                        setspade(true)
                                    }}>展开</Button>)
                            }
                        </div>
                    </div>
                </Form>


            </BaseCard>
            <BaseCard>
                <Tabs defaultActiveKey="1" items={item} onChange={onChange} />
                <Row gutter={[15, 0]}>
                    <Col>
                        <Button type="primary" onClick={showDrawer}>添加用户</Button>
                    </Col>
                    <Col>
                        <Button >发送优惠券</Button>
                    </Col>
                    <Col style={{ display: TabsKey == '2' ? 'block' : 'none' }}>
                        <Button >发送图文消息</Button>
                    </Col>
                    <Col>
                        <Button >批量设置分组</Button>
                    </Col>
                    <Col>
                        <Button >批量设置标签</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => {
                            exportExcel()
                        }}>导出</Button>
                    </Col>
                </Row>
                <BaseTab
                    rowSelection={rowSelection}
                    columns={columns}
                    data={data}
                    total={total}
                    pageData={pageData}
                    expandable={expandable}
                    onChange={onPageChange}>

                </BaseTab>

                <Drawer
                    title="用户信息填写"
                    closable={{ placement: 'end' }}
                    onClose={onClose}
                    open={open}
                    size={643}>

                    <Form form={form}>
                        <div className="flex" style={{ paddingRight: '50px' }}>
                            <Row>
                                <Form.Item label="真实姓名" name="name" rules={[
                                    { required: true, message: '请输入姓名' }
                                ]}>
                                    <Input style={{ width: "400px" }}></Input>
                                </Form.Item>
                            </Row>
                            <Row>
                                <Form.Item label="手机号" name="phone" rules={[
                                    { required: true, message: '请输入手机号' }
                                ]}>
                                    <Input style={{ width: "400px" }}></Input>
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="生日" name="birthday">
                                    <DatePicker style={{ width: "400px" }} placeholder="请选择生日" />
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="身份证号" name="IDnumber">
                                    <Input style={{ width: "400px" }} placeholder="请输入身份证号"></Input>
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="用户地址" name="address">
                                    <Input style={{ width: "400px" }} placeholder="请输入用户地址"></Input>
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="用户备注" name="remark">
                                    <Input style={{ width: "400px" }} placeholder="请输入备注"></Input>
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="登录密码" name="password" rules={[
                                    { required: true, message: '请输入登录密码' }
                                ]}>
                                    <Input style={{ width: "400px" }} placeholder="请输入登录密码"></Input>
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="确认密码" name="password" rules={[
                                    { required: true, message: '请确认密码' }
                                ]}>
                                    <Input style={{ width: "400px" }} placeholder="请输入确认密码"></Input>
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="用户等级" name="levelId">
                                    <LevelSelect></LevelSelect>
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="用户分组" name="groupId">
                                    <Select
                                        placeholder="请选择"

                                        style={{ width: "400px" }} allowClear />
                                </Form.Item>
                            </Row>
                            <Row gutter={[0, 0]}>
                                <Form.Item label="用户标签" name="tagIds">
                                    <Select
                                        placeholder="请选择"

                                        style={{ width: "400px" }} allowClear />
                                </Form.Item>
                            </Row>
                        </div>

                    </Form>

                </Drawer>
            </BaseCard>
        </>


    )
}

export default Usermanage