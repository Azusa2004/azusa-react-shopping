import { Button, Space, Switch, Tabs } from "antd";
import BaseCard from "../../../components/Card/BaseCard";
import { useEffect, useState } from "react";
import { getGoodsApi, getGoodsconditionApi } from "@/apis/Goods";
import BaseTable from "../../../components/baseTable/BaseTable";
import { useNavigate } from "react-router";



const Goodsmanage = () => {
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageData, setPagData] = useState({ currentPage: 1, pageSize: 6 })
    const onPageChange = (currentPage: number, pageSize: number) => {
        setPagData({
            currentPage, pageSize
        })
    }
    const navgate = useNavigate()

    const [condition, setcondition] = useState([])
    useEffect(() => {
        getGoodscondition()
        getGoods()
    }, [])

    //获取商品状态
    function getGoodscondition() {
        getGoodsconditionApi().then(res => {
            if (res.code == 200) {
                console.log(res);
                setcondition(
                    res.data.map((item: any) => ({
                        key: item._id,
                        label: item.name + '(' + item.total + ')'
                    }))
                )
            }
        })
    }
    //获取商品
    function getGoods() {
        getGoodsApi({}).then(res => {
            if (res.code == 200) {
                setData(res.data.rows)
                setTotal(res.data.total)
                console.log(res);
            }
        })
    }


    const onChange = (key: string) => {
        console.log(key);

    };

    const columns = [
        {
            title: '商品ID',
            dataIndex: '_id',
            key: '_id',
            width: 80,
            render: (text: string) => {
                return text.slice(0, 4)
            }
        },
        {
            title: '商品图',
            dataIndex: 'image',
            key: 'image',
            width: 90,
            render: (text: string) => {
                return <img src={text} alt="" style={{ width: '40px', height: '40px' }} />
            }
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            width: 300
        },
        {
            title: '参与活动',
            dataIndex: 'tagIds',
            key: 'tagIds'
        },
        {
            title: '商品类型',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: '商品售价',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: '销量',
            dataIndex: 'sales',
            key: 'sales'
        },
        {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock'
        },
        {
            title: '排序',
            dataIndex: 'recycle',
            key: 'recycle'
        },
        {
            title: '状态',
            dataIndex: 'isPutAway',
            key: 'isPutAway',
            render: (text: any) => {
                return <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={text ? true : false} />
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            render: () => {
                return <Space>
                    <a>编辑</a>
                    <a>更多</a>
                </Space>
            }
        }
    ]

    return (
        <div>
            <BaseCard></BaseCard>

            <BaseCard>
                <Tabs defaultActiveKey="1" items={condition} onChange={onChange} />
                <Space>
                    <Button color="primary" variant="solid" onClick={() => {
                        navgate("/Goods/addGoods")
                    }}>
                        添加商品
                    </Button>
                    <Button color="primary" variant="solid" style={{ backgroundColor: '#19be6b' }}>
                        商品采集
                    </Button>
                </Space>

                <BaseTable data={data} total={total} pageData={pageData} onChange={onPageChange} columns={columns}></BaseTable>
            </BaseCard>
        </div>
    )
}

export default Goodsmanage