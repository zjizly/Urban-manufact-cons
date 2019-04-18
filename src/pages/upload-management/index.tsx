import * as React from 'react';
import './style.css';
import { Modal, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import { UploadManagementStore, Item } from '../../stores/upload-management-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { CreateBtn } from '../../components/create-button';
import { app } from '../../utils';
import { USelect } from '../../components/urban-select';
import { UInput } from '../../components/urban-input';
import { Upload } from 'src/components/urban-upload';
import { UNames } from 'src/components/urban-ImageShows';

interface Iprops {
    uploadManagementStore: UploadManagementStore
}

const cols = (page: UploadManagement): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '手册/视频名称',
        dataIndex: 'FileName',
        align: 'center',
        key: "FileName"
    },
    {
        title: '文件/url',
        dataIndex: 'Files',
        align: 'center',
        key: "Files"
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
                { txt: '编辑', click: page.create(v) }
            ]} />
        }
    }
];

@inject("uploadManagementStore")
@observer
export default class UploadManagement extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.uploadManagementStore;
        s.getData();
    }
    // 新建
    create = (v?: any) => () => {
        const s = this.props.uploadManagementStore;
        s.edit = true;
        if (v && !v.Files) {
            v.Files = {
                name: '', url: ''
            };
        }
        s.currItem = v ? v : new Item();
    }
    Files = (u: any, n: any, s: any) => {
        const store = this.props.uploadManagementStore;
        store.currItem.Files = { "name": n, 'url': u };
    }
    delFiles = (s: any) => {
        this.props.uploadManagementStore.currItem.Files = {
            name: '', url: ''
        };
    }
    render() {
        const s = this.props.uploadManagementStore;
        return (
            <div className="upload-management-page">
                <Modal
                    title={
                        !s.currItem.UploadId ? (<span><Icon type="file-add" />新增</span>) :
                            (<span><Icon type="file-search" />编辑</span>)
                    }
                    visible={s.edit}
                    onCancel={s.close}
                    onOk={s.Save}>
                    <USelect f={'FileType'} d={s.currItem} Sn={'类别'} sl={[
                        { value: '文档', label: '文档' },
                        { value: '视频', label: '视频' },
                        { value: '音频', label: '音频' },
                    ]} />
                    <UInput f={'FileName'} d={s.currItem} Sn={'名称'} />
                    <Upload f={'Certificate'} d={s.currItem} Sn={'文件'}
                        loaded={this.Files} show={'文件'} />
                    <UNames l={!s.currItem.Files.name ? [] : [...[s.currItem.Files]]} del={this.delFiles} />
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