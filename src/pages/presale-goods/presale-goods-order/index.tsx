import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { PresaleGoodsOrderStore, Item, RefundItem } from './presale-goods-order-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { SearchList } from '../../../components/search-list';
import { Modal, Row, Col, Icon } from 'antd';
import { Options } from '../../../components/options';
import { app } from '../../../utils';
import { UInput } from '../../../components/urban-input';
import { UBack } from '../../../components/urban-back';

interface Iprops {
    presaleGoodsOrderStore: PresaleGoodsOrderStore
}

const cols = ( page: PresaleGoodsOrder ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '订单号',
        dataIndex: 'OrderNo',
        align: 'center',
        key: "OrderNo"
    },
    {
        title: '手机号',
        dataIndex: 'MobileNumber',
        align: 'center',
        key: "MobileNumber"
    },
    {
        title: '订单金额',
        dataIndex: 'TotalOrderAmount',
        align: 'center',
        key: "TotalOrderAmount"
    },
    {
        title: '客付运费',
        dataIndex: 'TotalShippingFee',
        align: 'center',
        key: "TotalShippingFee"
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
        render(_, val) {
            return app.getdays(val.InDate);
        }
    },
    {
        title: '订单状态',
        align: 'center',
        key: "OrderState",
        render(_, val) {
            if(val.OrderState === '0') {
                return '待付款'
            }else if(val.OrderState === '1') {
                return '待发货'
            }else if(val.OrderState === '2') {
                return '待收货'
            }else {
                return '已完成'
            }
        }
    },
    {
        title: '操作',
        align: 'center',
        key: "operation",
        render(_, val) {
            return  <Options btns={[
                { txt: '查看详情', click: page.details.bind(PresaleGoodsOrder, val) },
            ]} />
        }
    },
];

const cols1 = ( page: PresaleGoodsOrder ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '订单号',
        dataIndex: 'OrderNo',
        align: 'center',
        key: "OrderNo"
    },
    {
        title: '手机号',
        dataIndex: 'MobileNumber',
        align: 'center',
        key: "MobileNumber"
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
        render(_, val) {
            return app.getdays(val.InDate);
        }
    },
    {
        title: '操作',
        align: 'center',
        key: "operation",
        render(_, val) {
            const s = page.props.presaleGoodsOrderStore
            if(s.PresellState === '-1') {
                if(val.RefundState === '2') {
                    return  <Options btns={[
                        { txt: '已退款', click: page.hasRefund.bind(PresaleGoodsOrder, val) },
                    ]} />
                }else if(val.RefundState === '1' || val.RefundState === '-1'){
                    return  <Options btns={[
                        { txt: '退款', click: page.showRefund.bind(PresaleGoodsOrder, val) },
                    ]} />
                }else{
                    return  <Options btns={[
                        { txt: '退款', click: page.showRefund.bind(PresaleGoodsOrder, val) },
                    ]} />
                }
               
            }
            return  <Options btns={[
                { txt: '查看详情', click: page.details.bind(PresaleGoodsOrder, val) },
            ]} />
        }
    },
];

@inject("presaleGoodsOrderStore")
@observer
export default class PresaleGoodsOrder extends React.Component< Iprops, {} > {

    constructor(props: any) {
        super(props);
        const s = this.props.presaleGoodsOrderStore;
        s.GoodsSeriesCode = window.location.pathname.split("/")[2];
        s.PresellState = window.location.pathname.split("/")[3];
    }

    componentWillMount() {
        const s = this.props.presaleGoodsOrderStore;
        s.getData();
    }

     // 退款
     showRefund = async(row: any) => {
        const s = this.props.presaleGoodsOrderStore;
        s.currItem = row;
        s.refundItems = row.RefundLog;
        s.refundShow = true;
    }

    hasRefund = async (it: Item) => {
        const s = this.props.presaleGoodsOrderStore;
        s.currItem = it;
        s.refundItems = it.RefundLog;
        s.hasRefundShow = true;
    }

    details = (it: Item) => {
        const s = this.props.presaleGoodsOrderStore;
        s.currItem = it;
        s.getDetail();
        s.detailShow = true;
    }

    back = () => {
        window.history.go(-1);
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
        const s = this.props.presaleGoodsOrderStore;
        return (
            <div className="presale-goods-order-page">

                <Utable 
                columns={ s.PresellState === '1' ? cols(this) : cols1(this)}
                data={ s.list }
                loading={ s.loading }
                paging={ {
                                current: s.paging.current,
                                total: s.paging.total,
                                size: s.paging.size,
                                onChange: s.paging.onChange
                            } }
                search = {
                     <SearchList search={s.search}
                     other={
                        <div>
                            <UBack back={this.back}/>
                        </div>
                    }
                     // 下拉选项数据格式
                     SelectList={
                        s.PresellState === '1' ? 
                        [
                            {
                                Name: '订单状态',
                                Data: [
                                    { label: '全部', value: '' },
                                    { label: '待付款', value: '0' },
                                    { label: '待发货', value: '1' },
                                    { label: '待收货', value: '2' },
                                    { label: '已完成', value: '3' },
                                ],
                                check: '',
                            },
                         ]:null}
                         
                     />
                }
                />

                <Modal title={<span><Icon type="file-text" />查看</span>} 
                onCancel={s.close} visible={s.detailShow}>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>订单号：</Col>
                        <Col span={18}>{s.detail.OrderNo}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>商品名称：</Col>
                        <Col span={18}>{s.detail.GoodsName}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>参数：</Col>
                        <Col span={18}>{s.detail.GoodsParamsExplain}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>单价：</Col>
                        <Col span={18}>{s.detail.ProductPrice}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>数量：</Col>
                        <Col span={18}>{s.detail.GoodsNumber}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>用户昵称：</Col>
                        <Col span={18}>{s.detail.NickName}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>姓名：</Col>
                        <Col span={18}>{s.detail.RealName}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>发货日期：</Col>
                        <Col span={18}>{s.detail.DeliveryDate}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>发货地址：</Col>
                        <Col span={18}>{this.renderAdress(s.detail, 'd')}</Col>
                    </Row>
                    <Row>
                        <Col span={6} style={{textAlign:"right"}}>联系人：</Col>
                        <Col span={18}>{this.renderAdress(s.detail, 'n')}</Col>
                    </Row>
                </Modal>

                <Modal title={<span><Icon type="money-collect" />退款</span>}
                 onCancel={s.close} visible={s.refundShow} onOk={s.saveRefund}  width={'60%'}>
                    {
                        s.refundItems && s.refundItems.map((it: RefundItem, idx: number) => {
                            it.PayTypeShow = it.PayType === '1' ? '支付宝' : '微信'
                            return <span key={idx}>
                            <UInput f={'TradeNo'} d={it} Sn={'交易号'}  dis={true}/>
                            <UInput f={'PayTypeShow'} d={it} Sn={'账户类型'}  dis={true}/>
                            <UInput f={'TotalAmount'} d={it} Sn={'退款金额'}  dis={true}/>
                        </span>
                        }
                            
                        )
                    }
                    
                </Modal>

                <Modal title={<span><Icon type="money-collect" />已退款</span>}
                 onCancel={s.close} visible={s.hasRefundShow} width={'60%'}>
                    {
                        s.refundItems && s.refundItems.map((it: RefundItem, idx: number) => 
                        {
                            it.PayTypeShow = it.PayType === '1' ? '支付宝' : '微信'
                            return <span key={idx}>
                            <UInput f={'TradeNo'} d={it} Sn={'交易号'} dis={true}/>
                            <UInput f={'PayTypeShow'} d={it} Sn={'账户类型'} dis={true} />
                            <UInput f={'TotalAmount'} d={it} Sn={'退款金额'}  dis={true}/>
                            <UInput f={'ReWho'} d={it} Sn={'操作人'}  dis={true}/>
                            <UInput f={'ReTime'} d={it} Sn={'操作时间'}  dis={true}/>
                        </span>
                        }
                            
                        )
                    }
                </Modal>

            </div>
        )
    }

}