import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { DesiginOnReviewStore, Item, Review } from '../../stores/desigin-on-review-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Modal, Icon, Row, Select, Col, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Options } from '../../components/options';
import { app } from '../../utils';

const Option = Select.Option;
interface Iprops {
    desiginOnReviewStore: DesiginOnReviewStore
}

const cols = ( page: DesiginOnReview ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '店铺名称',
        dataIndex: 'StoreName',
        align: 'center',
        key: "StoreName"
    },
    {
        title: '设计师',
        dataIndex: 'RealName',
        align: 'center',
        key: "RealName"
    },
    {
        title: '商品品类',
        dataIndex: 'CategoryName3',
        align: 'center',
        key: "CategoryName3"
    },
    {
        title: '设计编号',
        dataIndex: 'GoodsSeriesCode',
        align: 'center',
        key: "GoodsSeriesCode"
    },
    {
        title: '审核状态',
        align: 'center',
        key: "UserState ",
        render(_, val) {
            if(val.ConsoleAudit === '0') {
                return '待审核'
            } else if(val.ConsoleAudit === '-1') {
                return '审核失败'
            } else if(val.ConsoleAudit === '1') {
                return '审核成功'
            }
            return '';
        }
    },
    {
        title: '编辑时间',
        align: 'center',
        key: "EditWhen",
        render(_ ,val) {
            return app.getdays(val.EditWhen)
        }
    },
    {
        title: '商品详情',
        align: 'center',
        key: "opertaion",
        render(_, val) {
            if(val.ConsoleAudit === '0') {
                return <Options btns={
                    [
                        { txt: '详情', click: page.showDetails.bind(DesiginOnReview, val) },
                        { txt: '图片查看', click: page.showImages.bind(DesiginOnReview, val) },
                        { txt: '审核', click: page.review.bind(DesiginOnReview, val) },
                    ]} />
            }else if(val.ConsoleAudit === '-1') {
                return <Options btns={
                    [
                        { txt: '详情', click: page.showDetails.bind(DesiginOnReview, val) },
                        { txt: '图片查看', click: page.showImages.bind(DesiginOnReview, val) },
                        { txt: '失败原因', click: page.reviewReason.bind(DesiginOnReview, val) },
                    ]} />
            }
            return null;
        }
    },
];

@inject("desiginOnReviewStore")
@observer
export default class DesiginOnReview extends React.Component< Iprops, {} > {

    componentWillMount() {
        const s = this.props.desiginOnReviewStore;
        s.key = '';
        s.CategoryId1 = '';
        s.CategoryId2 = '';
        s.ConsoleAudit = '2';
        s.getCategoryA();

        const review = sessionStorage.getItem("reviewItem");
        if(review !== null) {
            s.reviewShow = true;
            s.review = JSON.parse(review);
            sessionStorage.removeItem("reviewItem");
        }
        // s.getCategoryB();
        // s.getData();
    }

    review = (it: Item) => {
        const s = this.props.desiginOnReviewStore;
        s.currItem = it;
        s.isFault = false;
        s.review = new Review();
        s.review.GoodsSeriesCode = it.GoodsSeriesCode;
        s.reviewShow = true;
    }

    reviewReason = (it: Item) => {
        const s = this.props.desiginOnReviewStore;
        s.currItem = it;
        s.isFault = true;
        s.review.AuditReason = it.AuditReason;
        s.review.ConsoleAudit = '-1';
        s.reviewShow = true;
    }

    showDetails = (it: Item) => {
        sessionStorage.setItem("designGood", JSON.stringify(it));
        window.location.pathname = './goodDetails';
    }

    showImages= (it: Item) => {
        window.location.pathname = `../showImages/${it.CategoryId1}/${it.CategoryId2}/${it.CategoryId3}`;
    }

    showImages1 = () => {
        const s = this.props.desiginOnReviewStore;
        const it = s.currItem;
        sessionStorage.setItem("reviewItem", JSON.stringify(s.review));
        window.location.pathname = `../showImages/${it.CategoryId1}/${it.CategoryId2}/${it.CategoryId3}`;
    }
   
    render() {
        const s = this.props.desiginOnReviewStore;

        return (
            <div className="desigin-on-review-page">

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
                     // 下拉选项数据格式
                       SelectList={[
                                       {
                                           Name: '审核状态',
                                           Data: [
                                               { label: '全部', value: '' },
                                               { label: '待审核', value: '0' },
                                               { label: '审核失败', value: '-1' },
                                           ],
                                           check: '',
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
                    />
                }
                />

                <Modal
                    title={(s.isFault? <span><Icon type="file-search" />失败原因</span>:<span><Icon type="audit" />审核</span>)} 
                    visible={s.reviewShow}
                    onOk={s.saveReview}
                    okButtonProps={{ disabled: s.isFault }}
                    onCancel={s.close}
                    footer={
                        s.isFault ? [
                            <Button key='back' type='primary' disabled={true} onClick={s.saveReview}>确认</Button>,
                            <Button key='back' onClick={s.close}>取消</Button>,
                        ]: s.review.ConsoleAudit === '-1' ? 
                        [
                        <Button key='back' type='primary' onClick={this.showImages1}>图片审核</Button>,
                        <Button key='back' type='primary' onClick={s.saveReview}>确认</Button>,
                        <Button key='back' onClick={s.close}>取消</Button>,
                    ]:  [
                        <Button key='back' type='primary' onClick={s.saveReview}>确认</Button>,
                        <Button key='back' onClick={s.close}>取消</Button>,
                    ]
                }
                    >
                    <Row>
                        <Col span={6}>
                            <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                { "审核："}
                            </div>
                        </Col>
                        <Col span={18}>
                            <Select value={s.review.ConsoleAudit} disabled={s.isFault}  style={{ width: '100%' }} onChange={s.changeStat}>
                                <Option value={'1'} key={1}>{'审核通过'}</Option>
                                <Option value={'-1'} key={-1}>{'审核失败'}</Option>
                            </Select>
                        </Col>
                        
                    </Row>
                    {
                        s.review.ConsoleAudit === '-1' ? <Row style={{marginTop: '10px'}}>
                        <Col span={6}>
                            <div style={{ textAlign: "right", lineHeight: "32px", marginTop: 10 }}>
                                { "失败原因："}
                            </div>
                        </Col>
                        <Col span={18}>
                            <TextArea disabled={s.isFault} rows={4} value={s.review.AuditReason} onChange={s.textChange}/>
                        </Col>
                        </Row> : null
                    }

                    {/* <Button onClick={this.showImages1}>图片审核</Button> */}
                </Modal>


            </div>
        )
    }

}