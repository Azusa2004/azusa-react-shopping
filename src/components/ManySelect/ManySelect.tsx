import { Select } from "antd"


const ManySelect = (props: any) => {
    return (
        <Select style={{ width: '250px', height: '29px' }} {...props} allowClear />
    )
}

export default ManySelect