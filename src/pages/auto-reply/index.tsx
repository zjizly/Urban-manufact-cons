import * as React from 'react';
import './style.css';
import { Modal, Icon, Row, Col, TimePicker } from 'antd';
import { inject, observer } from 'mobx-react';
import { AutoReplyStore, Item } from '../../stores/auto-reply-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { CreateBtn } from '../../components/create-button';
import { app, Utils } from '../../utils';
import { USelect } from '../../components/urban-select';
import { UText } from '../../components/urban-input';
import * as moment from 'moment';

const format = 'HH:mm';

interface Iprops {
    autoReplyStore: AutoReplyStore
}

const cols = (page: AutoReply): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '回复类型',
        dataIndex: 'ReplyType',
        align: 'center',
        key: "ReplyType"
    },
    {
        title: '回复内容',
        align: 'center',
        key: "ReplyContent",
        render: (_, v) => {
            return <span title={v.ReplyContent}>{Utils.cut(v.ReplyContent, 20)}</span>
        }
    },
    {
        title: '状态',
        align: 'center',
        key: "ReplyState",
        render: (_, v) => {
            return <span>{v.ReplyState === '1' ? '开启' : '关闭'}</span>
        }
    },
    {
        title: '编辑时间',
        align: 'center',
        key: "EditWhen",
        render: (_, v) => {
            return <span>{app.getdays(v.EditWhen)}</span>
        }
    },
    {
        title: '编辑人',
        dataIndex: 'EditWho',
        align: 'center',
        key: "EditWho"
    },
    {
        title: '操作',
        align: 'center',
        key: "opera",
        render: (_, v) => {
            return <Options btns={[
                { txt: '编辑', click: page.create(v) },
                { txt: '删除', click: page.props.autoReplyStore.del(v) },
                { txt: v.ReplyState === '1' ? '关闭' : '开启', click: page.props.autoReplyStore.ChangeState(v) },
            ]} />
        }
    },
];

@inject("autoReplyStore")
@observer
export default class AutoReply extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.autoReplyStore;
        s.key = '';
        s.getData();
    }
    // 新建
    create = (v?: any) => () => {
        const s = this.props.autoReplyStore;
        s.edit = true;
        s.currItem = v ? v : new Item();
    }
    start = (t: any, tr: any) => {
        const s = this.props.autoReplyStore;
        console.log(t, tr);
        if (t === null) {
            s.currItem.HourStart = '00';
            s.currItem.MinStart = '00';
        } else {
            const ti = tr.split(':');
            s.currItem.HourStart = ti[0];
            s.currItem.MinStart = ti[1];
        }
    }
    end = (t: any, tr: any) => {
        const s = this.props.autoReplyStore;
        if (t === null) {
            s.currItem.HourEnd = '00';
            s.currItem.MinEnd = '00';
        } else {
            const ti = tr.split(':');
            s.currItem.HourEnd = ti[0];
            s.currItem.MinEnd = ti[1];
        }

    }
    render() {
        const s = this.props.autoReplyStore;
        return (
            <div className="auto-reply-page">
                <Modal
                    width={'55%'}
                    title={
                        !s.currItem.EditWhen ? (<span><Icon type="file-add" />新增自动回复</span>) :
                            (<span><Icon type="form" />编辑自动回复</span>)
                    }
                    visible={s.edit}
                    onCancel={s.close}
                    onOk={s.Save}>
                    <USelect isTrue={true} f={'ReplyType'} d={s.currItem} Sn={'回复类型'} sl={[
                        { label: '夜间', value: '夜间' },
                        { label: '首次', value: '首次' }]} />
                    <UText f={'ReplyContent'} d={s.currItem} Sn={'回复内容'} limN={50} tip={
                        !s.currItem.EditWhen && s.tableData.filter(ts => ts.ReplyType === s.currItem.ReplyType).length ?
                            '此回复类型已有，不可重复新建！' : ''
                    } />
                    {
                        s.currItem.ReplyType === '夜间' ? (
                            <div style={{ margin: '14px 0' }}>
                                <Row>
                                    <Col span={6} />
                                    <Col span={12}>
                                        <Row>
                                            <Col span={7}>
                                                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                                    {"开始时间："}
                                                </div>
                                            </Col>
                                            <Col span={17}>
                                                <TimePicker
                                                    value={moment(s.currItem.HourStart + ':' + s.currItem.MinStart, format)}
                                                    format={format} onChange={this.start} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={6} />
                                </Row>
                            </div>
                        ) : null
                    }
                    {
                        s.currItem.ReplyType === '夜间' ? (
                            <div style={{ margin: '14px 0' }}>
                                <Row>
                                    <Col span={6} />
                                    <Col span={12}>
                                        <Row>
                                            <Col span={7}>
                                                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                                    {"结束时间："}
                                                </div>
                                            </Col>
                                            <Col span={17}>
                                                <TimePicker
                                                    value={moment(s.currItem.HourEnd + ':' + s.currItem.MinEnd, format)}
                                                    format={format} onChange={this.end} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={6} />
                                </Row>
                            </div>
                        ) : null
                    }
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
                    buttons={
                        <CreateBtn click={this.create()} />
                    }
                    search={
                        <SearchList search={s.search}
                        />
                    }
                />

            </div>
        )
    }

}