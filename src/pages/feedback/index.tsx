import * as React from 'react';
import './style.css';
import { Button, Modal, Input, Icon, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { FeedbackStore, Item } from '../../stores/feedback-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { Utils } from 'src/utils';

interface Iprops {
    feedbackStore: FeedbackStore
}

const cols = (page: Feedback): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: "center",
    },
    {
        title: '反馈人姓名',
        dataIndex: 'RealName',
        align: "center",
    },
    {
        title: '反馈人联系方式',
        dataIndex: 'MobileNumber',
        align: "center",
    },
    {
        title: '反馈时间',
        dataIndex: 'AddWhen',
        align: "center",
    },
    {
        title: '反馈意见内容',
        dataIndex: 'Content',
        align: "center",
        render(_, val) {
            return <span title={val.Content}>{Utils.cut(val.Content, 10)}</span>
        }
    },
    {
        title: '操作',
        key: 'options',
        align: "center",
        render: (_, row) => {
            return <Button type="primary" onClick={page.showDetail(row)}> 查看详情 </Button>
        }
        // render: (_, val) => (
        //     <Options btns={[
        //         { txt: '查看详情', click: page.showDetail(val) }
        //     ]} />
        // )
    }
];

@inject("feedbackStore")
@observer
export default class Feedback extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.feedbackStore;
        s.getData();
    }

    showDetail = (it: Item) => () => {
        const s = this.props.feedbackStore;
        s.currItem = it;
        s.mDetail = true;
    }

    render() {
        const s = this.props.feedbackStore;
        return (
            <div className="feedback-page">

                {/* 页面主表 */}
                <Utable
                    scroll={false}
                    columns={cols(this)}
                    data={s.list}
                    loading={s.loading}
                    paging={s.paging}
                    search={
                        <div className='searchbar'>
                            <Input placeholder='请输入想搜索的字段' onChange={s.searchChange} />
                            <Button type='primary' onClick={s.searchHandle}><Icon type='search' />查询</Button>
                        </div>
                    }
                />

                <Modal width="680px" title="查看详情"
                    visible={s.mDetail}
                    onCancel={s.close}
                    footer={false}
                >
                    <div>
                        <Row>
                            <Col span={8}><p style={{ textAlign: 'right' }}>反馈人姓名：</p></Col>
                            <Col span={16}><p style={{ textAlign: 'center' }}>{`${s.currItem.RealName}`}</p></Col>
                        </Row>
                        <Row>
                            <Col span={8}><p style={{ textAlign: 'right' }}>联系方式：</p></Col>
                            <Col span={16}><p style={{ textAlign: 'center' }}>{`${s.currItem.MobileNumber}`}</p></Col>
                        </Row>
                        <Row>
                            <Col span={8}><p style={{ textAlign: 'right' }}>反馈内容：</p></Col>
                            <Col span={16}><p style={{ textAlign: 'center' }}>{`${s.currItem.Content}`}</p></Col>
                        </Row>
                        <Row>
                            <Col span={8}><p style={{ textAlign: 'right' }}>反馈图片：</p></Col>
                            <Col span={16}><p style={{ textAlign: 'center' }}><div>
                                {
                                    s.currItem.Photos && s.currItem.Photos.map(it => <img src={it} key={it}
                                        style={{ width: '200px' }}
                                    />)
                                }
                            </div></p></Col>
                        </Row>
       
                    </div>
                </Modal>

            </div>
        )
    }

}