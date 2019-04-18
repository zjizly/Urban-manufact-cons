import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { Item, PresaleOrderStore, RefundItem } from '../../stores/presale-order-store';
import { ColumnProps } from 'antd/lib/table';
import { Options } from '../../components/options';
import { Utable } from 'src/components/universal-table';
import { SearchList } from 'src/components/search-list';
import { Input, message, Modal, Icon, Row, Col, Button } from 'antd';
import { UInput } from 'src/components/urban-input';
import { app } from '../../utils';

interface Iprops {
    presaleOrderStore: PresaleOrderStore
}

const cols = (page: GoodsOrder): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '订单号',
        align: "center",
        key: 'OrderNo',
        dataIndex: 'OrderNo',
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
        title: '商品数量',
        dataIndex: 'GoodsNumber',
        align: 'center',
        key: "GoodsNumber"
    },
    {
        title: '已付金额',
        align: "center",
        dataIndex: 'HasPayFee'
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
        title: '商品众测状态',
        align: "center",
        key: 'OrderStateS',
        render: (t, val) => {
            if (val.PresellState === '0') {
                return <span> 众测中</span>
            } else if (val.PresellState === '1') {
                return <span> 众测成功</span>
            } else if (val.PresellState === '-1') {
                return <span> 众测失败</span>
            } else {
                return <span> 无状态</span>
            }
        }
    },
    {
        title: '操作',
        align: "center",
        key: 'options',
        render: (_, row) => {
            const btns = [
                { txt: '查看详情', click: page.showOrder(row) },
            ];
            if (row.PresellState === '-1') {
                if (row.RefundState === '2') {
                    btns.push({ txt: '已退款', click: page.showHasRefund(row) })
                } else if (row.RefundState === '1' || row.RefundState === '-1' ) {
                    btns.push({ txt: '退款', click: page.showRefund(row) });
                }
            }
            return <Options btns={btns} />
        }
    },

];

@inject("presaleOrderStore")
@observer
export default class GoodsOrder extends React.Component<Iprops, {}> {
    MailAdressStr: Input;
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
        const s = this.props.presaleOrderStore;
        s.key = '';
        s.presellState = '';
        s.CategoryIds = '';
        s.CategoryId = '';
        s.getData();
        s.getCAData();
    }

    // 退款
    showRefund = (row: any) => async () => {
        const s = this.props.presaleOrderStore;
        s.currItem = row;
        await s.getOrderPay(s.currItem.OrderNo);
        if (s.refundItems.length === 0) {
            message.error("未获取到用户支付信息");
        } else {
            s.refundShow = true;
        }
    }

    // 已退款
    showHasRefund = (row: any) => async () => {
        const s = this.props.presaleOrderStore;
        s.currItem = row;
        await s.getOrderPay(s.currItem.OrderNo);
        if (s.refundItems.length === 0) {
            message.error("未获取到用户支付信息");
        } else {
            s.hasRefundShow = true;
        }
    }

    // 
    showOrder = (row: Item) => () => {
        const s = this.props.presaleOrderStore;
        s.currItem = row;
        s.detailShow = true;
    }

    back() {
        window.history.go(-1)
    }

    render() {
        const s = this.props.presaleOrderStore;
        return (
            <div className="presale-order-page">
                {/* 页面主表 */}
                <Utable
                    columns={cols(this)}
                    data={s.list}
                    loading={s.loading}
                    paging={{ ...s.paging }}
                    search={
                        <SearchList
                            SelectList={[
                                {
                                    Name: '众测状态',
                                    Data: [
                                        { label: "全部", value: "" },
                                        { label: "众测中", value: "0" },
                                        { label: "众测失败", value: "-1" },
                                    ],
                                    check: ''
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
                            ]} search={s.search} />
                    }
                />


                <Modal width={'60%'} title="退款" onCancel={s.close} visible={s.refundShow} onOk={s.Refund} okText="退款">
                    {
                        s.refundItems && s.refundItems.map((item: RefundItem, idx: number) => {
                            return <span key={idx}>
                                <UInput Sn="交易号" d={item} f="TransactionId" isTrue={false} dis={true} />
                                <UInput Sn="账户类型" d={item} f="PaymentTypeName" isTrue={false} dis={true} />
                                <UInput Sn="退款金额" d={item} f="PaymentAmount" isTrue={true} dis={true} />
                            </span>
                        })
                    }
                </Modal>

                <Modal width={'60%'} title="已退款" onCancel={s.close} visible={s.hasRefundShow}
                    footer={[
                        <Button key="back" onClick={s.close} type='primary'>关闭</Button>,
                    ]}>
                    {
                        s.refundItems && s.refundItems.map((item: RefundItem, idx: number) => {
                            return <span key={idx}>
                                <UInput Sn="交易号" d={item} f="TransactionId" isTrue={false} dis={true}/>
                                <UInput Sn="账户类型" d={item} f="PaymentTypeName" isTrue={false} dis={true}/>
                                <UInput Sn="退款金额" d={item} f="PaymentAmount" isTrue={false} dis={true}/>
                                <UInput Sn="操作人" d={item} f="ReWho" isTrue={false} dis={true}/>
                                <UInput Sn="操作时间" d={item} f="ReTime" isTrue={false} dis={true}/>
                            </span>
                        })
                    }
                </Modal>

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
                </Modal>
            </div>
        )
    }

}
