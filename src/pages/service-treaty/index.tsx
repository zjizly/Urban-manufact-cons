import * as React from 'react';
import './style.css';
import { Modal, Icon, Form } from 'antd';
import { inject, observer } from 'mobx-react';
import { ServiceTreatyStore, Item } from '../../stores/service-treaty-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { CreateBtn } from '../../components/create-button';
import { USelect } from '../../components/urban-select';
import { UInput } from '../../components/urban-input';
import { Editor } from '../../components/ckeditor';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};

interface Iprops {
    serviceTreatyStore: ServiceTreatyStore
}

const cols = (page: ServiceTreaty): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '协议类型',
        align: 'center',
        key: "ArticleClass",
        render(_, val) {
            return val.ArticleClass === '0' ? '商城APP': val.ArticleClass === '1' ? '工厂管理系统' : '设计师管理系统'
        }
    },
    {
        title: '标题',
        dataIndex: 'Title',
        align: 'center',
        key: "Title"
    },
    {
        title: '排序',
        dataIndex: 'Sequence',
        align: 'center',
        key: "Sequence"
    },
    {
        title: '是否显示',
        align: 'center',
        key: "Display",
        render: (_, v) => {
            return <span>{v.Display === '0' ? '不显示' : '显示'}</span>
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
            ]} />
        }
    },
];

@inject("serviceTreatyStore")
@observer
export default class ServiceTreaty extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.serviceTreatyStore;
        s.key = '';
        s.getData();
    }
    // 新建
    create = (v?: any) => () => {
        const s = this.props.serviceTreatyStore;
        s.edit = true;
        s.isEdit = v ? true : false;
        s.currItem = v ? v : new Item();
    }

    render() {
        const s = this.props.serviceTreatyStore;
        return (
            <div className="service-treaty-page">
                <Modal
                    width={'55%'}
                    title={
                        !s.currItem.ArticleID ? (<span><Icon type="file-add" />新增</span>) :
                            (<span><Icon type="form" />编辑</span>)
                    }
                    visible={s.edit}
                    onCancel={s.close}
                    onOk={s.Save}>
                    {/* <UInput f={'ArticleClass'} d={s.currItem} Sn={'协议类型'} /> */}
                    <USelect dis={s.edit} f={'ArticleClass'} d={s.currItem} Sn={'协议类型'} sl={[
                        { value: '0', label: '商城APP' },
                        { value: '1', label: '工厂管理系统' },
                        { value: '2', label: '设计师管理系统' },
                    ]} />
                    <UInput f={'Title'} d={s.currItem} Sn={'标题'} />
                    <USelect f={'Display'} d={s.currItem} Sn={'是否显示'} sl={[
                        { value: '1', label: '显示' },
                        { value: '0', label: '不显示' },
                    ]} />
                    <UInput f={'Sequence'} d={s.currItem} Sn={'排序'} />
                    <Form.Item {...formItemLayout} label="条约内容"  >
                        {
                            s.currItem ? <Editor
                                content={s.currItem.Content}
                                onChange={s.editTreaty}
                            />
                                : ''
                        }
                    </Form.Item>
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
                        // <Options btns={[
                        //                { txt: '新建', click: this.create }
                        //            ]} />
                    }
                    search={
                        <SearchList search={s.search} />
                    }
                />

            </div>
        )
    }

}