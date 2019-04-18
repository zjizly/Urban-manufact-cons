import * as React from 'react';
import './style.css';
import { Button, Modal, Icon, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { FastReplyStore, Item, Type } from '../../stores/fast-reply-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { CreateBtn } from '../../components/create-button';
import { app, Utils } from '../../utils';
import { USelect } from '../../components/urban-select';
import { UInput, UText } from '../../components/urban-input';

interface Iprops {
    fastReplyStore: FastReplyStore
}

const cols = (page: FastReply): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '回复类型',
        dataIndex: 'ProblemType',
        align: 'center',
        key: "ProblemType"
    },
    {
        title: '回复内容',
        align: 'center',
        key: "Content",
        render: (_, v) => {
            return <span title={v.Content}>{Utils.cut(v.Content, 20)}</span>
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
                { txt: '删除', click: page.props.fastReplyStore.del(v) },
            ]} />
        }
    },
];

@inject("fastReplyStore")
@observer
export default class FastReply extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.fastReplyStore;
        s.key = '';
        s.getData();
    }
    // 新建
    create = (v?: any) => () => {
        const s = this.props.fastReplyStore;
        s.getTypeData();
        s.edit = true;
        s.currItem = v ? v : new Item();
    }
    typeShow = () => {
        const s = this.props.fastReplyStore;
        s.getTypeData();
        s.types = new Type();
        s.type = true;
    }
    render() {
        const s = this.props.fastReplyStore;
        return (
            <div className="fast-reply-page">
                <Modal
                    width={'55%'}
                    title={<span><Icon type="form" />回复类型</span>}
                    visible={s.type}
                    onCancel={s.close}
                    onOk={s.submit}>
                    <UInput f={'ReplayType'} d={s.types} Sn={'回复类型'} />
                    <Row style={{ textAlign: "center" }}>
                        {
                            s.typeList.map(ts => (
                                <Col span={8} key={ts.RefNo} style={{ margin: '14px 0' }}>
                                    <span style={{
                                        display: 'inline-block',
                                    }}>
                                        <div style={{
                                            backgroundColor: 'red',
                                            width: '14px',
                                            height: '14px',
                                            textAlign: 'center',
                                            color: 'white',
                                            borderRadius: '50%',
                                            lineHeight: '14px',
                                            float: "right",
                                            top: '-7px',
                                            right: '7px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                        }} onClick={s.DelType(ts.RefNo)}>X</div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            color: 'white',
                                            backgroundColor: '#CCC'
                                        }}>{ts.ReplayType}</span>
                                    </span>

                                </Col>
                            ))
                        }

                    </Row>
                </Modal>
                <Modal
                    width={'55%'}
                    title={
                        !s.currItem.RefNo ? (<span><Icon type="file-add" />新增快捷回复</span>) :
                            (<span><Icon type="form" />编辑快捷回复</span>)
                    }
                    visible={s.edit}
                    onCancel={s.close}
                    onOk={s.Save}>
                    <USelect f={'ProblemType'} d={s.currItem} Sn={'回复类型'} sl={[...s.typeLists]} />
                    <UText f={'Content'} d={s.currItem} Sn={'回复内容'} limN={50} />
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
                    // buttons={
                    //     <CreateBtn click={this.create()} />
                    // }
                    search={
                        <SearchList search={s.search}
                            other={
                                <span>
                                    <span style={{ marginRight: '25px' }}>
                                        <CreateBtn click={this.create()} />
                                    </span>
                                    <span>
                                        <Button type="primary"
                                            onClick={this.typeShow}> 回复类型</Button>
                                    </span>
                                </span>
                            }
                        />
                    }
                />

            </div>
        )
    }

}