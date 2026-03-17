import { Select } from "antd"

const BaseSelect = (props: any) => {
    return (
        <Select
            style={{ width: '250px', marginRight: '20px' }}
            allowClear
            options={[
                { value: '1', label: '显示' },
                { value: '0', label: '不显示' },
            ]} {...props} />
    )
}

export default BaseSelect