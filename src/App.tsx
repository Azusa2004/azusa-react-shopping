import { ConfigProvider, App as AntdApp } from "antd";
import Index from "./router/Index"

const App = () => {
  return (
    <ConfigProvider>
      <AntdApp>
        <Index></Index>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App