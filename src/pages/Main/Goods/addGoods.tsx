import { Button, Cascader, Form, Input, Modal, Radio, Segmented, Space, Tabs, Tag, type TabsProps } from "antd";
import BaseCard from "../../../components/Card/BaseCard";
import { LeftOutlined } from '@ant-design/icons';
import BaseIMG from "@/components/BaseIMG/BaseIMG";
import { useEffect, useState } from "react";
import { getGoodsTagApi, getGoodsType2Api, getGoodsTypeApi } from "@/apis/Goods";
import { useNavigate } from "react-router";

const addGoods = () => {
    const [ImgUrl, setImgUrl] = useState()
    const { SHOW_CHILD } = Cascader;
    const [GoodsType, setGoodsType] = useState([])
    const [GoodsType2, setGoodsType2] = useState([])
    const [GoodsTag, setGoodsTag] = useState([])
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        getGoodsTypeApi({}).then(res => {
            if (res.code == 200) {
                setGoodsType(res.data.rows)
            }
        })
        getGoodsTagApi({}).then(res => {
            if (res.code == 200) {
                setGoodsTag(res.data.rows.map((item: any) => item.name))
            }
        })
        getGoodsType2Api({}).then(res => {
            if (res.code == 200) {
                console.log(res);
                setGoodsType2(res.data.rows)
            }
        })
    }, [])

    const onChange = (key: string) => {
        setActiveTab(key)
    };

    const onChange2 = (value: any) => {
        console.log(value);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const setMultipleSelected = (value: any) => {
        console.log(value);

    }
    const onSegmented = (value: any) => {
        console.log(value);
    }

    const options = GoodsType
    const options2 = GoodsType2.map((item: any) => ({
        label: (
            <div style={{ padding: 4 }}>
                <h3>{item?.name}</h3>
                <div style={{ fontSize: '12px', color: '#999' }}>（{item.deliver}）</div>
            </div>
        ),
        value: item._id
    }))
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '基础信息',
            children: <Form labelCol={{ style: { width: 90 } }}>
                <Form.Item label="商品类型">
                    <Segmented
                        options={options2}
                        onChange={onSegmented}
                    />
                </Form.Item>
                <Form.Item label="商品名称" name="name" rules={[
                    { required: true, message: "请输入商品名称" }
                ]}>
                    <Input style={{ width: '460px' }} placeholder="请输入商品名称"></Input>
                </Form.Item>
                <Form.Item label="单位" name="unit" rules={[
                    { required: true, message: "请输入单位" }
                ]}>
                    <Input style={{ width: '460px' }} placeholder="请输入单位"></Input>
                </Form.Item>
                <Form.Item label="商品轮播图" name="image" rules={[
                    { required: true }
                ]}>
                    <BaseIMG setImgUrl={setImgUrl} ImgUrl={ImgUrl}></BaseIMG>
                </Form.Item>
                <Form.Item label="商品分类" name="classifyIds" rules={[
                    { required: true }
                ]}>
                    <Cascader
                        style={{ width: '460px' }}
                        options={options}
                        onChange={onChange2}
                        multiple
                        fieldNames={{
                            label: 'name',
                            value: '_id'
                        }}
                        maxTagCount="responsive"
                        showCheckedStrategy={SHOW_CHILD}
                    />
                </Form.Item>
                <Form.Item label="商品标签" name="tagIds">
                    <Button onClick={() => {
                        showModal()
                    }}>选择标签</Button>
                </Form.Item>
                <Form.Item label="商品状态" name="tagIds">
                    <Radio.Group
                        name="radiogroup"
                        options={[
                            { value: 1, label: '上架' },
                            { value: 0, label: '下架' }
                        ]}
                    />
                </Form.Item>

                <Button onClick={() => {
                    setActiveTab("2")
                }}>下一步</Button>
            </Form>
        },
        {
            key: '2',
            label: '规格库存',
            children: <Form labelCol={{ style: { width: 90 } }}>
                <Form.Item label="规格类型" name="tagIds2">
                    <Radio.Group
                        name="radiogroup"
                        options={[
                            { value: 1, label: '单规格' },
                            { value: 0, label: '多规格' }
                        ]}
                    />
                </Form.Item>
                <Form.Item label="图片" name="image">
                    <BaseIMG setImgUrl={setImgUrl} ImgUrl={ImgUrl}></BaseIMG>
                </Form.Item>
                <Form.Item label="售价" name="name">
                    <Input suffix="元" style={{ width: "156px" }} defaultValue="0.00" />
                </Form.Item>
                <Form.Item label="成本价" name="name2">
                    <Input suffix="元" style={{ width: "156px" }} defaultValue="0.00" />
                </Form.Item>
                <Form.Item label="划线价" name="name3">
                    <Input suffix="元" style={{ width: "156px" }} defaultValue="4323432.00" />
                </Form.Item>
                <Form.Item label="库存" name="name3">
                    <Input suffix="件" style={{ width: "156px" }} defaultValue="0" />
                </Form.Item>
                <Form.Item label="商品编码" name="name3">
                    <Input style={{ width: "156px" }} />
                </Form.Item>
                <Form.Item label="条形码" name="name3">
                    <Input style={{ width: "156px" }} />
                </Form.Item>
                <Form.Item label="重量" name="name3">
                    <Input suffix="kg" style={{ width: "156px" }} defaultValue="0" />
                </Form.Item>
                <Form.Item label="体积" name="name3">
                    <Input suffix="m³" style={{ width: "156px" }} defaultValue="0" />
                </Form.Item>
                <Space>
                    <Button onClick={() => {
                        setActiveTab("1")
                    }}>上一步</Button>
                    <Button onClick={() => {
                        setActiveTab("3")
                    }}>下一步</Button>
                </Space>
            </Form>
        },
        {
            key: '3',
            label: '商品详情',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '4',
            label: '物流设置',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '5',
            label: '会员价/佣金',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '6',
            label: '营销设置',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '7',
            label: '其他设置',
            children: 'Content of Tab Pane 3',
        }
    ];

    return (
        <>
            <BaseCard>
                <Space>
                    <span onClick={() => {
                        navigate(-1)
                    }}>
                        <LeftOutlined />
                        返回
                    </span>

                    <h3>添加商品</h3>
                </Space>

            </BaseCard>
            <BaseCard>
                <Tabs activeKey={activeTab} items={items} onChange={onChange} />
                <Modal
                    title="请选择商品标签"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}>
                    <Tag.CheckableTagGroup
                        multiple
                        options={GoodsTag}
                        onChange={(val) => setMultipleSelected(val)}
                    />
                </Modal>
            </BaseCard>
        </>


    )
}

export default addGoods