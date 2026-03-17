import BaseCard from "../../../components/Card/BaseCard";
import { gethomeApi } from '@/apis/Header'
import ReactEcharts from 'echarts-for-react'
import { useEffect, useMemo, useState } from 'react'
const UserChart = () => {
    const [data, setData] = useState({ date: [], count: [] })
    const option = useMemo(() => {
        return {

            xAxis: {
                type: 'category',
                data: data.date
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: data.count,
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        color: 'blue'
                    }
                }
            ]
        }
    }, [data])
    useEffect(() => {
        getChartData();
    }, [])
    const getChartData = () => {
        gethomeApi()
            .then(res => {
                if (res.code == 200) {
                    setData(res.data);
                }
            })
    }
    return (
        <BaseCard>
            <ReactEcharts option={option} />
        </BaseCard>
    )
}
export default UserChart