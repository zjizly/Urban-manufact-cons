import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { OrderChargeRecordsStore, Item } from './order-charge-records-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { app } from '../../../utils';
import { UBack } from 'src/components/urban-back';

interface Iprops {
    orderChargeRecordsStore: OrderChargeRecordsStore
}

const cols = ( page: OrderChargeRecords ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        align: "center",
        dataIndex: 'index'
    },
    {
        title: '订单金额',
        align: "center",
        key: 'TotalOrderAmount',
        dataIndex: 'TotalOrderAmount',
    },
    {
        title: '客付运费',
        align: "center",
        dataIndex: 'TotalShippingFee'
    },
    {
        title: '已付金额',
        align: "center",
        key: 'HasPayFee',
        dataIndex: 'HasPayFee'
    },
    {
        title: '账号',
        align: "center",
        dataIndex: 'TransactionId',
    },
    {
        title: '支付方式',
        align: "center",
        render(_, row) {
            return <span>{row.PayType === '1' ? "支付宝" : (row.PayType === '2' ? "微信" : '')}</span>
        }
    },
    {
        title: '收款时间',
        align: "center",
        key: 'PaymentDate',
        render(_, row) {
            return app.getdays(row.PaymentDate);
        }
    }
];

@inject("orderChargeRecordsStore")
@observer
export default class OrderChargeRecords extends React.Component< Iprops, {} > {

    constructor(props: any) {
        super(props);
        const s = this.props.orderChargeRecordsStore;
        s.OrderNo = window.location.pathname.split("/")[2];
    }   

    componentWillMount() {
        const s = this.props.orderChargeRecordsStore;
        s.getData();
    }

    back=()=>{
        window.history.go(-1);
    }
    
    render() {
        const s = this.props.orderChargeRecordsStore;
        return (
            <div className="order-charge-records-page">
                <div style={{position: 'relative',paddingTop: '15px'}}>
                    <UBack back={this.back}/>
                </div>
                <Utable
                    columns={cols(this)}
                    data={s.tableData.map((it, idx) => ({ ...it, key: it.OrderNo, index: idx + 1 }))}
                    loading={s.loading}
                    paging={{ ...s.paging }}
                />

            </div>
        )
    }

}