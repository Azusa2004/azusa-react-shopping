import { Modal, Form, Input, Radio, App } from "antd";
import { useEffect, useState } from "react";
import { addGradeApi, modifyGradeApi } from "@/apis/UserApi";
import BaseIMG from "../../../components/BaseIMG/BaseIMG";
const UserGradeForm = (props: any) => {
    const { isModalOpen, handleCancel, getGrade, isadd } = props
    const [form] = Form.useForm()
    const { message: messageApi } = App.useApp()
    //图标
    const [imageUrl, setImageUrl] = useState<string | null>();
    //背景图
    const [backimageUrl, setbackImageUrl] = useState<string | null>();

    useEffect(() => {
        if (!isModalOpen) return;

        if (isadd) {
            form.setFieldsValue({ ...isadd })
            setImageUrl(isadd.icon)
            setbackImageUrl(isadd.bgImage)
        } else {
            form.resetFields()
            setImageUrl(null)
            setbackImageUrl(null)
        }
    }, [isadd])

    const handleOk = () => {
        if (!isadd) {
            const data = form.getFieldsValue()
            addGradeApi({ ...data, icon: imageUrl, bgImage: backimageUrl }).then(res => {
                if (res.code == 200) {
                    getGrade()
                    messageApi.success('添加成功')
                    handleCancel()
                    form.resetFields()
                    setImageUrl(null)
                    setbackImageUrl(null)
                } else {
                    messageApi.error(res.message)
                }
            })

        } else {
            const data = form.getFieldsValue()
            modifyGradeApi({
                _id: isadd._id,
                ...data,
                icon: imageUrl,
                bgImage: backimageUrl
            }).then(res => {
                if (res.code == 200) {
                    messageApi.success('修改成功')
                    getGrade()
                    handleCancel()
                    form.resetFields()
                    setImageUrl(null)
                    setbackImageUrl(null)
                } else {
                    messageApi.error(res.message)
                }
            })

        }
    }


    return (
        <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            title={isadd ? '修改用户等级' : '添加用户等级'}>
            <Form form={form} labelCol={{ style: { width: 100 } }}>
                <Form.Item label="等级名称" name="name" rules={[
                    { required: true, message: '请输入等级名称' }
                ]}>
                    <Input placeholder="请输入等级名称"></Input>
                </Form.Item>
                <Form.Item label="等级" name="value" rules={[
                    { required: true, message: "请输入等级" }
                ]}>
                    <Input placeholder="请输入等级"></Input>
                </Form.Item>
                <Form.Item label="享受折扣" name="discount" rules={[
                    { required: true, message: '请输入享受折扣' }
                ]}>
                    <Input placeholder="输入折扣数100，代表原价，输入90代表9折"></Input>
                </Form.Item>
                <Form.Item label="解锁经验值" name="exp" rules={[
                    { required: true, message: '请输入解锁经验值' }
                ]}>
                    <Input placeholder="请输入解锁经验值"></Input>
                </Form.Item>
                <Form.Item label="图标" >
                    <BaseIMG ImgUrl={imageUrl} setImgUrl={setImageUrl}></BaseIMG>
                </Form.Item>
                <Form.Item label="用户等级背景">
                    <BaseIMG setImgUrl={setbackImageUrl} ImgUrl={backimageUrl}></BaseIMG>
                </Form.Item>
                <Form.Item label="是否显示" name='enable'>
                    <Radio.Group options={[
                        { label: '显示', value: 1 },
                        { label: '隐藏', value: 0 }
                    ]}>
                    </Radio.Group>
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default UserGradeForm