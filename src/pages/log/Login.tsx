import backgroundImage from '@/assets/bg.33ece377.jpg';
import logo from '../../assets/admin_login_logo.png';
import './Login.css'
import { App, Button, Form, Input } from 'antd';
import { LognApi } from '@/apis/LoginApi';
import { useNavigate } from 'react-router';
import useApi from '@/hook/useApi';
const Login = () => {
    const [form] = Form.useForm()
    const { message: messageApi } = App.useApp()
    const { getAdminInfoHook } = useApi();
    const navigate = useNavigate()
    const onFinish = (value: any) => {
        LognApi({ ...value }).then(res => {
            if (res.code == 200) {
                localStorage.userToken = res.data.token
                getAdminInfoHook()
                messageApi.success('登录成功')
            } else {
                messageApi.error(res.message)
            }
        })
    }


    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>

            <div className='mainLog'>
                <div className='mainLeft'></div>
                <div className='mainRigth'>
                    <img src={logo} />
                    <Form form={form} onFinish={onFinish} >
                        <Form.Item name="account" rules={[
                            {
                                required: true,
                                message: '账号不能为空'
                            }
                        ]}>
                            <Input placeholder='请输入账号' style={{ height: '40px', marginTop: '30px' }} allowClear></Input>
                        </Form.Item>
                        <Form.Item name="password" rules={[
                            {
                                required: true,
                                message: '密码不能为空'
                            }
                        ]}>
                            <Input.Password style={{ height: '40px' }} allowClear></Input.Password>
                        </Form.Item>

                        <Button type="primary" style={{ width: '320px', height: '40px' }} htmlType="submit">登录</Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login