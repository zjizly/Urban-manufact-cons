import * as React from 'react';
import './style.css';
import { Modal, Icon, Row, Col, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { ProOrderStore, Item } from '../../stores/pro-order-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { app, Utils } from '../../utils';

interface Iprops {
    proOrderStore: ProOrderStore
}

const cols = (page: ProOrder): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '订单号',
        align: "center",
        dataIndex: 'OrderNo',
        key: "OrderNo"
    },
    {
        title: '设计师姓名',
        dataIndex: 'RealName',
        align: 'center',
        key: "RealName"
    },
    {
        title: '合作工厂',
        align: 'center',
        key: "CompanyName",
        render: (_, v) => {
            return <span title={v.CompanyName}>{Utils.cut(v.CompanyName, 15)}</span>
        }
    },
    {
        title: '店铺名称',
        align: 'center',
        key: "StoreName",
        render: (_, v) => {
            return <span title={v.StoreName}>{Utils.cut(v.StoreName, 15)}</span>
        }

    },
    {
        title: '订单金额',
        dataIndex: 'TotalOrderAmount',
        align: 'center',
        key: "TotalOrderAmount"
    },

    {
        title: '订单状态',
        dataIndex: 'OrderState',
        align: 'center',
        key: "OrderState",
        render: (_, v) => {
            let str = '';
            switch (v.OrderState) {
                case '1': str = '待发货'; break;
                case '2': str = '已发货'; break;
                case '3': str = '已完成'; break;
            }
            return <span>{str}</span>
        }
    },
    {
        title: '下单时间',
        align: 'center',
        key: "InDate",
        render: (_, v) => {
            return <span>{app.getdays(v.InDate)}</span>
        }
    },
    {
        title: '操作',
        dataIndex: 'opera',
        align: 'center',
        key: "opera",
        render: (_, v) => {
            return <Options btns={[
                { txt: '查看详情', click: page.showOrder(v) },
            ]} />
        }
    },
];

@inject("proOrderStore")
@observer
export default class ProOrder extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.proOrderStore;
        s.key = '';
        s.CategoryIds = '';
        s.CategoryId = '';
        s.OrderState = '';
        s.getData();
        s.getCAData();
    }
    showOrder = (v: any) => () => {
        const s = this.props.proOrderStore;
        s.detailShow = true;
        s.currItem = v;
    }
    renderAdress = (v: any, s: string) => {
        const str = v.Address && JSON.parse(v.Address) ? JSON.parse(v.Address) : [];
        let si = '';
        switch (s) {
            case 'd': si = str.City + str.County + str.Address; break;
            case 'n': si = str.UserName; break;
        }
        return si;
    }
    render() {
        const s = this.props.proOrderStore;
        return (
            <div className="pro-order-page">
                <Modal title={(<span><Icon type="file-search" />查看</span>)}
                    visible={s.detailShow}
                    onCancel={s.close}
                    footer={[<Button onClick={s.close} type='primary' key="close">关闭</Button>]}>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>订单号：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.OrderNo}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>商品名称：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.GoodsName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>参数：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.GoodsParamsExplain}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>单价：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.ProductPrice}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>数量：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.GoodsNumber}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>用户昵称：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.NickName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>姓名：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.RealName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>发货日期：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.DeliveryDate}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>发货地址：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{this.renderAdress(s.currItem, 'd')}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>联系人：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{this.renderAdress(s.currItem, 'n')}</p></Col>
                    </Row>

                </Modal>
                <Utable
                    columns={cols(this)}
                    data={s.list}
                    loading={s.loading}
                    paging={{
                        current: s.paging.current,
                        total: s.paging.total,
                        size: s.paging.size,
                        onChange: s.paging.onChange
                    }}
                    search={
                        <SearchList search={s.search}
                            SelectList={[
                                {
                                    Name: '订单状态',
                                    Data: [
                                        { label: '全部', value: '' },
                                        // { label: '待付款', value: '0' },
                                        { label: '待发货', value: '1' },
                                        { label: '已发货', value: '2' },
                                        { label: '已完成', value: '3' },
                                    ],
                                    check: '',
                                },
                                {
                                    Name: '行业分类',
                                    Data: [...s.CategoryIdList],
                                    check: '',
                                },
                                {
                                    Name: '一级分类',
                                    Data: [...s.CategoryIdsList],
                                    check: '',
                                },
                            ]}

                        />
                    }
                />

            </div>
        )
    }

}