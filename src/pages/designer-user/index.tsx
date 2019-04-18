import * as React from 'react';
import './style.css';
import { Button, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { DesignerUserStore, Item, Img, } from '../../stores/designer-user-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
// import { Options } from '../../components/options';
import { Options } from 'src/components/options';
import { Modal, Icon, Row, Col, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { UImgListNoList } from '../../components/urban-ImageShows';
import { UImg } from '../../components/urban-img';
import { Utils, app } from '../../utils';
import { UInput } from 'src/components/urban-input';

const Option = Select.Option;

interface Iprops {
    designerUserStore: DesignerUserStore
}

const cols = (page: DesignerUser): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '手机号码',
        dataIndex: 'MobileNumber',
        align: 'center',
        key: "MobileNumber"
    },
    {
        title: '姓名',
        dataIndex: 'RealName',
        align: 'center',
        key: "RealName"
    },
    {
        title: '注册时间',
        align: 'center',
        key: "CreateTime",
        render(_, val) {
            return <span >{app.getdays(val.CreateTime)}</span>
        }
    },
    {
        title: '自我介绍',
        align: 'center',
        key: "SelfDesc",
        render(_, val) {
            return <span title={val.SelfDesc}>{Utils.cut(val.SelfDesc, 10)}</span>
        }
    },
    {
        title: '设计作品',
        align: 'center',
        key: "index5",
        render(_, val) {
            return <Options btns={[
                { txt: '点击查看', disabled: JSON.parse(val.Work) && JSON.parse(val.Work).length ? false : true, click: page.showImages.bind(DesignerUser, val) },
            ]} />
        }
    },
    {
        title: '注册状态',
        align: 'center',
        key: "UserState",
        render(_, val) {
            if (val.UserState === '-1') {
                return '申请失败'
            } else if (val.UserState === '0') {
                return '申请中'
            } else if (val.UserState === '1') {
                return '申请成功'
            }
            return '待申请'
        }
    },
    {
        title: '开店状态',
        align: 'center',
        key: "IsStore",
        render(_, val) {
            return val.IsStore === '0' ? '未开店' : (val.IsStore === '1' ? '已开店' : '')
        }
    },
    {
        title: '操作',
        align: 'center',
        key: "options",
        render(_, val) {
            if (val.UserState === '-1') {
                return <Options btns={[
                    { txt: '失败原因', click: page.showReason.bind(DesignerUser, val) },
                ]} />
            } else if (val.UserState === '1') {
                if (val.IsStore === '1') {
                    return <Options btns={[
                        { txt: '店铺详情', click: page.showShopDetail.bind(DesignerUser, val) },
                        { txt: '品牌', click: page.showBrand.bind(DesignerUser, val) },
                        { txt: '排序', click: page.sorting(val) },
                    ]} />
                } else {
                    return <Options btns={[
                        { txt: '品牌', click: page.showBrand.bind(DesignerUser, val) },
                    ]} />
                }
            } else {
                return <Options btns={[
                    { txt: '审核', click: page.showReview.bind(DesignerUser, val) },
                ]} />
            }

        }
    },
];

@inject("designerUserStore")
@observer
export default class DesignerUser extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.designerUserStore;
        s.key = '';
        s.UserState = '';
        s.getData();
    }
    sorting = (v: any) => () => {
        const s = this.props.designerUserStore;
        s.currItems.DesignUserId = v.DesignUserId;
        s.currItems.OrderTag = v.OrderTag;
        s.sortShow = true;
    }
    showImages = (it: Item) => {
        const s = this.props.designerUserStore;
        s.images = [];
        if (JSON.parse(it.Work) && JSON.parse(it.Work).length) {
            JSON.parse(it.Work).map((data: Img) => s.images.push(data.Url));
            s.imageShow = true;
        } else {
            message.warn('暂无图片！');
        }
    }

    showReview = (it: Item) => {
        const s = this.props.designerUserStore;
        s.review.DesignUserId = it.DesignUserId;
        s.review.UserState = '1';
        s.review.AuditReason = '';
        s.isFault = false;
        s.reviewShow = true;
    }

    saveReview = () => {
        const s = this.props.designerUserStore;
        s.saveReview();
    }

    showBrand = (it: Item) => {
        window.location.pathname = `../branch/${it.DesignUserId}`;
    }

    showShopDetail = (it: Item) => {
        const s = this.props.designerUserStore;
        s.currItem = it;
        s.shopdetailsShow = true;
    }

    showReason = (it: Item) => {
        const s = this.props.designerUserStore;
        s.currItem = it;
        s.isFault = true;
        s.review.UserState = '-1';
        s.review.AuditReason = it.AuditReason;
        s.reviewShow = true;
    }
    Cancel = (e: any) => {
        this.props.designerUserStore.imageShow = e;
    }
    render() {
        const s = this.props.designerUserStore;
        return (
            <div className="designer-user-page">
                <Modal
                    title={(<span><Icon type="ordered-list" />排序</span>)}
                    visible={s.sortShow}
                    onCancel={s.close}
                    onOk={s.ordSub}
                >
                    <UInput f={'OrderTag'} d={s.currItems} Sn='排序' />
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
                            // 下拉选项数据格式
                            SelectList={[
                                {
                                    Name: '注册状态',
                                    Data: [
                                        { label: '全部', value: '' },
                                        { label: '申请中', value: '0' },
                                        { label: '申请成功', value: '1' },
                                        { label: '申请失败', value: '-1' },
                                    ],
                                    check: '',
                                },
                            ]}
                        />
                    }
                />

                <Modal
                    title={(<span><Icon type="file-search" />店铺详情</span>)}
                    visible={s.shopdetailsShow}
                    onCancel={s.close}
                    footer={[
                        <Button key="close" type="primary" onClick={s.close}>关闭</Button>
                    ]}
                >
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>申请类型：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.UserType === '0' ? '个人' : '公司'}</p></Col>
                    </Row>
                    {s.currItem.UserType === '1' ? <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>公司名称：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.CompanyName}</p></Col>
                    </Row> : null}
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>店铺名称：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.StoreName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>店铺logo：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}><UImg path={s.currItem.StoreLogo} /></p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>店铺描述：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.StoreDesc}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>店铺展示图：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}><UImg path={s.currItem.StoreView} /></p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>详细地址：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{`${s.currItem.Province}${s.currItem.City}${s.currItem.District}${s.currItem.Adress}`}</p></Col>
                    </Row>
                </Modal>

                <Modal
                    title={(s.isFault ? <span><Icon type="file-search" />失败原因</span> : <span><Icon type="audit" />审核</span>)}
                    visible={s.reviewShow}
                    // onOk={s.saveReview}
                    onCancel={s.close}
                    footer={[
                        <Button key={'close'} onClick={s.close}>取消</Button>,
                        <Button key={'save'} disabled={s.isFault} type="primary" onClick={s.saveReview}>确认</Button>
                    ]
                }
                >
                    <Row>
                        <Col span={6}>
                            <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                {"审核："}
                            </div>
                        </Col>
                        <Col span={18}>
                            <Select disabled={s.isFault} value={s.review.UserState} style={{ width: '100%' }} onChange={s.changeStat}>
                                <Option value={'1'} key={1}>{'审核通过'}</Option>
                                <Option value={'-1'} key={-1}>{'审核失败'}</Option>
                            </Select>
                        </Col>

                    </Row>
                    {
                        s.review.UserState === '-1' ? <Row style={{ marginTop: '10px' }}>
                            <Col span={6}>
                                <div style={{ textAlign: "right", lineHeight: "32px", marginTop: 10 }}>
                                    {"失败原因："}
                                </div>
                            </Col>
                            <Col span={18}>
                                <TextArea disabled={s.isFault} rows={4} value={s.review.AuditReason} onChange={s.textChange} />
                            </Col>
                        </Row> : null
                    }
                </Modal>

                <UImgListNoList Cancel={this.Cancel} show={s.imageShow} ls={[...s.images]} />


            </div>
        )
    }

}