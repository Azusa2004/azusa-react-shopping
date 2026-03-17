import { ConfigProvider, Pagination, Table } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

type propType = {
    columns: any[],
    data: any[],
    total: number,
    pageData: IPageData,
    rowSelection?: any,
    expandable?: any,
    onChange: (currentPage: number, pageSize: number) => void
}

const baseTable = (props: propType) => {
    const { columns, data, total = 0, pageData, onChange, rowSelection, expandable } = props
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                components: {
                    Table: {
                        headerBg: '#eaf5ff'
                    }
                }
            }}>
            {
                data?.length != 0 ? (
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        style={{ margin: "30px 0 30px 0" }}
                        rowKey='_id'
                        rowSelection={rowSelection}
                        expandable={expandable} />
                ) : (
                    <Flex align="center" gap="middle" style={{ margin: "30px 0 30px 0", width: '100%', height: "300px", display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    </Flex>
                )
            }

            <Pagination
                showQuickJumper
                defaultCurrent={2}
                total={total}
                align={'end'}
                current={pageData.currentPage}
                pageSize={pageData.pageSize}
                onChange={onChange} />
        </ConfigProvider>
    )
}

export default baseTable