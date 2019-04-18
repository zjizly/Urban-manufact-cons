import * as React from 'react';
import './style.css';
import { Modal, Icon, Row, Col, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { OffOrderStore, Item } from '../../stores/off-order-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { app } from '../../utils';

interface Iprops {
    offOrderStore: OffOrderStore
}

const cols = (page: OffOrder): (ColumnProps<Item>[]) => [
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
        title: '手机号',
        align: "center",
        dataIndex: 'MobileNumber',
        key: "MobileNumber"
    },
    {
        title: '昵称',
        dataIndex: 'NickName',
        align: 'center',
        key: "NickName"
    },
    {
        title: '店铺名称',
        dataIndex: 'StoreName',
        align: 'center',
        key: "StoreName"
    },
    {
        title: '订单金额',
        dataIndex: 'TotalOrderAmount',
        align: 'center',
        key: "TotalOrderAmount"
    },
    {
        title: '商品数量',
        dataIndex: 'GoodsNumber',
        align: 'center',
        key: "GoodsNumber"
    },
    {
        title: '已付金额',
        dataIndex: 'HasPayFee',
        align: 'center',
        key: "HasPayFee"
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
        title: '订单状态',
        dataIndex: 'OrderState',
        align: 'center',
        key: "OrderState",
        render: (_, v) => {
            let str = '';
            switch (v.OrderState) {
                case '0': str = '待付款'; break;
                case '1': str = '待发货'; break;
                case '2': str = '已发货'; break;
                case '3': str = '已完成'; break;
            }
            return <span>{str}</span>
        }
    },
    {
        title: '操作',
        dataIndex: 'opera',
        align: 'center',
        key: "opera",
        render: (_, v) => {
            if(v.OrderState === '2' || v.OrderState === '3') {
                return <Options btns={[
                    { txt: '查看详情', click: page.showOrder(v) },
                    { txt: '发货详情', click: page.showShip(v) },
                ]} />
            }
            return <Options btns={[
                { txt: '查看详情', click: page.showOrder(v) },
            ]} />
        }
    },

];

@inject("offOrderStore")
@observer
export default class OffOrder extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.offOrderStore;
        s.key = '';
        s.CategoryIds = '';
        s.OrderState = '';
        s.CategoryId = '';
        s.getData();
        s.getCAData();
    }
    showOrder = (v: any) => () => {
        const s = this.props.offOrderStore;
        s.detailShow = true;
        s.currItem = v;
    }
    showShip = (v: any) => async () => {
        const s = this.props.offOrderStore;
        s.currItem = v;
        await s.getShipDetail();
        s.shipShow = true;
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
        const s = this.props.offOrderStore;
        return (
            <div className="off-order-page">
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

                <Modal title={(<span><Icon type="file-search" />发货详情</span>)}
                    visible={s.shipShow}
                    onCancel={s.close}
                    footer={[<Button onClick={s.close} type='primary' key="close">关闭</Button>]}>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>地址：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currShipItem.AddressItem ? `${s.currShipItem.AddressItem.Province}${s.currShipItem.AddressItem.City}${s.currShipItem.AddressItem.County}${s.currShipItem.AddressItem.District}${s.currShipItem.AddressItem.Address}`: null}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>收件人：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currShipItem.AddressItem && s.currShipItem.AddressItem.UserName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>收件人电话：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currShipItem.AddressItem && s.currShipItem.AddressItem.MobileNumber}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>商品数量：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currShipItem.GoodsNumber}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>运单号：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currShipItem.BillNo}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>快递公司：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currShipItem.ExpName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>发货时间：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currShipItem.DeliveryDate}</p></Col>
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
                            SelectList={
                                [
                                    {
                                        Name: '订单状态',
                                        Data: [
                                            { label: '全部', value: '' },
                                            { label: '待付款', value: '0' },
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
                                ]
                            }

                        />
                    }
                />

            </div>
        )
    }

}