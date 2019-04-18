import * as React from 'react';
import './style.css';
import { Modal, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import { AdverCenterStore, Item } from '../../stores/adver-center-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { CreateBtn } from '../../components/create-button';
import { app, Utils } from '../../utils';
import { UImg } from 'src/components/urban-img';
import { USelect } from '../../components/urban-select';
import { UInput } from '../../components/urban-input';
import { Upload } from 'src/components/urban-upload';
import { UImgeS } from 'src/components/urban-ImageShows';

interface Iprops {
    adverCenterStore: AdverCenterStore
}

const cols = (page: AdverCenter): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '产品类别',
        align: 'center',
        key: "ProductType",
        render: (_, v) => {
            return <span>{v.ProductType === '0' ? '商城APP' : (
                v.ProductType === '1' ? '工厂管理系统' : (
                    v.ProductType === '2' ? '设计师管理系统' : '其他'
                )
            )}</span>
        }
    },
    {
        title: '预览图片',
        align: 'center',
        key: "ADUrl",
        render(_, row) {
            return (
                <UImg path={row.ADUrl} />
            )
        },
    },
    {
        title: '广告状态',
        align: 'center',
        key: "ADState",
        render: (_, v) => {
            return <span>{v.ADState === '0' ? '下架' : '上架'}</span>
        }
    },
    {
        title: '排序',
        dataIndex: 'ADOrder',
        align: 'center',
        key: "ADOrder"
    },
    {
        title: '安卓链接地址',
        align: 'center',
        key: "ADSkipLinkAndroid",
        render: (_, v) => {
            return <span title={v.ADSkipLinkAndroid}>{Utils.cut(v.ADSkipLinkAndroid, 15)}</span>
        }
    },
    {
        title: 'IOS链接地址',
        align: 'center',
        key: "ADSkipLinkIos",
        render: (_, v) => {
            return <span title={v.ADSkipLinkIos}>{Utils.cut(v.ADSkipLinkIos, 15)}</span>
        }
    },
    {
        title: '链接地址',
        align: 'center',
        key: "ADSkipLink",
        render: (_, v) => {
            return <span title={v.ADSkipLink}>{Utils.cut(v.ADSkipLink, 15)}</span>
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
        dataIndex: 'opera',
        align: 'center',
        key: "opera",
        render: (_, v) => {
            return <Options btns={[
                { txt: '编辑', click: page.create(v) },
                { txt: '删除', click: page.props.adverCenterStore.del(v) },
            ]} />
        }
    },

];

@inject("adverCenterStore")
@observer
export default class AdverCenter extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.adverCenterStore;
        s.key = '';
        s.getData();
    }
    // 新建
    create = (v?: any) => () => {
        const s = this.props.adverCenterStore;
        s.edit = true;
        s.currItem = v ? v : new Item();
    }
    Files = (u: any) => {
        const store = this.props.adverCenterStore;
        store.currItem.ADUrl = u;
    }
    delFiles = (s: any) => {
        this.props.adverCenterStore.currItem.ADUrl = '';
    }
    render() {
        const s = this.props.adverCenterStore;
        return (
            <div className="adver-center-page">
                <Modal
                    width={'60%'}
                    title={
                        !s.currItem.ADId ? (<span><Icon type="file-add" />新增广告图</span>) :
                            (<span><Icon type="form" />编辑广告图</span>)
                    }
                    visible={s.edit}
                    onCancel={s.close}
                    onOk={s.Save}>
                    <USelect isTrue={true} f={'ProductType'} d={s.currItem} Sn={'产品类别'} sl={[
                        { value: '0', label: '商城APP' },
                        { value: '1', label: '工厂端' },
                        { value: '2', label: '设计师端' },
                    ]} />
                    <USelect isTrue={true} f={'ADState'} d={s.currItem} Sn={'上架状态'} sl={[
                        { value: '1', label: '上架' },
                        { value: '0', label: '下架' },
                    ]} />
                    <Upload isTrue={true} f={'Certificate'} d={s.currItem} Sn={'上传图片'}
                        loaded={this.Files} show={'文件'} />
                    <UImgeS l={!s.currItem.ADUrl ? [] : [...[s.currItem.ADUrl]]} del={this.delFiles} />
                    <UInput isTrue={true} f={'ADOrder'} d={s.currItem} Sn={'显示顺序'} />
                    {
                        s.currItem.ProductType === '0' ? <span>
                            <UInput isTrue={true} f={'ADSkipLinkAndroid'} d={s.currItem} Sn={'安卓链接地址'} />
                            <UInput isTrue={true} f={'ADSkipLinkIos'} d={s.currItem} Sn={'IOS链接地址'} />
                        </span>:
                            <UInput isTrue={true} f={'ADSkipLink'} d={s.currItem} Sn={'链接地址'} />

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