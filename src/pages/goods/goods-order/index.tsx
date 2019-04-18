import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { GoodsOrderStore, Item } from './goods-order-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { SearchList } from '../../../components/search-list';
import { Options } from '../../../components/options';
import { Modal, Row, Col, Icon, Button } from 'antd';
import { app } from '../../../utils';
import { UBack } from '../../../components/urban-back';
// import { UBack } from 'src/components/urban-back';

interface Iprops {
    goodsOrderStore: GoodsOrderStore
}

const cols = ( page: GoodsOrder ): ( ColumnProps< Item >[] ) => [
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
                { txt: '查看详情', click: page.details.bind(GoodsOrder, val) },
            ]} />
        }
    },
];

@inject("goodsOrderStore")
@observer
export default class GoodsOrder extends React.Component< Iprops, {} > {

    constructor(props: any) {
        super(props);
        const s = this.props.goodsOrderStore;
        s.GoodsSeriesCode = window.location.pathname.split("/")[2];
    }

    componentWillMount() {
        const s = this.props.goodsOrderStore;
        s.getData();
    }

    back = () => {
        window.history.go(-1);
    }

    details = (it: Item) => {
        const s = this.props.goodsOrderStore;
        s.currItem = it;
        s.getDetail();
        s.detailShow = true;
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
        const s = this.props.goodsOrderStore;
        return (
            <div className="goods-order-page">

                <Utable 
                columns={ cols(this) }
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
                       SelectList={[
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
                       ]}
                     />
                }
                />

                <Modal title={<span><Icon type="file-text" />查看</span>} 
                visible={s.detailShow}
                onCancel={s.close}
                footer={[<Button key='close' type='primary' onClick={s.close}>关闭</Button>]}
                >
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

            </div>
        )
    }

}