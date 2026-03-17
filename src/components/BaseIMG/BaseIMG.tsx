import { App, Upload } from "antd"
import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
import { useState } from "react";

const BaseIMG = (props: any) => {
    const { message: messageApi } = App.useApp()
    const [loading, setLoading] = useState(false);
    const { setImgUrl, ImgUrl } = props

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            messageApi.error('仅支持上传 JPG/PNG 格式!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            messageApi.error('图片大小不能超过2MB!');
        }
        return isJpgOrPng && isLt2M;
    };


    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImgUrl(url);
                const response = info.file.response;
                if (response && response.code === 200) {
                    const httpUrl = response.data; // 服务器返回的 HTTP URL
                    setImgUrl(httpUrl);
                    console.log(httpUrl);
                } else { }
            });
        }
        if (info.file.status === 'error') {
            setLoading(false);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PictureOutlined style={{ fontSize: 25 }} />}
        </button>
    );

    return (
        <Upload
            style={{ width: '60px', height: '60px' }}
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://nocat.life:3011/image/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}>
            {ImgUrl ? (
                <img draggable={false} src={ImgUrl} alt="avatar" style={{ width: '58px', height: '58px', borderRadius: '5px' }} />
            ) : (
                uploadButton
            )}
        </Upload>
    )
}

export default BaseIMG