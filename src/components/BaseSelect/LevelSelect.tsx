import { getGradeApi } from "@/apis/UserApi"
import { Select } from "antd"
import { useEffect, useMemo, useState } from "react"


const LevelSelect = () => {
    const [userlabel, setuserlabel] = useState([])
    const getGradedata = () => {
        getGradeApi({}).then(res => {
            if (res.code == 200) {
                setuserlabel(res.data.rows)
                console.log(res);

            } else {
                console.log(res.message);

            }
        })
    }
    useEffect(() => {
        getGradedata()
    }, [])


    const options = useMemo(() => {
        return userlabel.map((item: any) => {
            return {
                _id: item._id,
                name: item.name
            }
        })
    }, [userlabel])
    return (
        <Select
            placeholder="请选择"
            options={options}
            style={{ width: "400px" }}
            fieldNames={{
                label: 'name',
                value: '_id'
            }} allowClear />
    )
}

export default LevelSelect