import * as React from 'react';
import './style.css';
import { Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { OrderChargeStore, Item } from '../../stores/order-charge-store';
import { ColumnProps } from 'antd/lib/table';
import { Options } from '../../components/options';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { app } from '../../utils';

const Option = Select.Option;
interface Props {
    orderChargeStore: OrderChargeStore
}

const cols = (page: OrderCharge): (ColumnProps<Item>[]) => [

    {
        title: '序号',
        dataIndex: 'index',
        align: "center",
    },
    {
        title: '订单号',
        dataIndex: 'OrderNo',
        align: "center",
    },
    {
        title: '手机号',
        align: "center",
        dataIndex: 'MobileNumber'
    },
    {
        title: '订单金额',
        align: "center",
        dataIndex: 'TotalOrderAmount'
    },
    {
        title: '收款金额',
        align: "center",
        dataIndex: 'HasPayFee'
    },
    {
        title: '下单时间',
        align: "center",
        dataIndex: 'InDate',
        render(_, val) {
            return app.getdays(val.InDate);
        }
    },
    {
        title: '是否含税',
        align: "center",
        key: 'IsIncludeTax',
        render(_, row) {
            return row.IsIncludeTax === '0' ? '否' : '是'
        }
    },
    {
        title: '订单状态',
        align: "center",
        key: 'stat',
        render(_, row) {
            const s = page.props.orderChargeStore;
            const states = s.orderStates;
            return states[row.OrderState];
        }
    },
    {
        title: '操作',
        align: "center",
        key: 'operations',
        render(_, row) {
            if(row.OrderState !== '0') {
                return <Options btns={[
                    { txt: '收款记录', click: page.openRecords.bind(OrderCharge, row) },
                ]} />
            }else {
                return "____";
            }
           
        }
    },
];

@inject("orderChargeStore")
@observer
export default class OrderCharge extends React.Component<Props, any> {

    componentWillMount() {
        const s = this.props.orderChargeStore;
        const pageIndex = sessionStorage.getItem("pageIndex");
        if(pageIndex) {
            s.paging.current = Number(pageIndex);
            sessionStorage.removeItem("pageIndex");
        }
        s.key = '';
        s.state = '';
        s.CategoryId1 = '';
        s.CategoryId2 = '';
        s.getCategoryA();
    }

     // 打开收款记录
     openRecords = (it: Item) => {
        const s = this.props.orderChargeStore;
        sessionStorage.setItem("pageIndex", String(s.paging.current));
        window.location.href = "./orderChargeRecords/" + it.OrderNo;
    }
   
    render() {
        const s = this.props.orderChargeStore;
        return (
            <div className="order-charge-page">
                
                {/* 页面主表 */}
                <Utable
                    columns={cols(this)}
                    data={s.tableData.map((it, idx) => ({ ...it, key: it.OrderNo, index: idx + 1 }))}
                    loading={s.loading}
                    paging={{ ...s.paging }}
                    search={
                        <SearchList 
                        SelectList={[
                            {
                                Name: '订单状态',
                                Data: [
                                    { label: "全部", value: "" },
                                    { label: "待付款", value: "0" },
                                    { label: "待发货", value: "1" },
                                    { label: "待收货", value: "2" },
                                    { label: "已完成", value: "3" },
                                ],
                                check: ''
                            },
                            {
                                Name: '行业分类',
                                Data: s.CategoryAOptions,
                                check: '',
                            },
                        ]}
                        other={
                            <span>
                                <span style={{paddingRight: 5}}>一级品类</span>
                                <Select value={s.CategoryId2}  style={{ width: 120 }} onChange={s.handleChange}>
                                    {s.CategoryBOptions.map((it: any, idx: number) => <Option value={it.value} key={idx}>{it.label}</Option> )}
                                </Select>
                            </span>
                            }
                         search={s.search} />
                    }
                />
            </div>
        )
    }

}