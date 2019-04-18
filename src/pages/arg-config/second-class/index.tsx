import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { SearchList } from '../../../components/search-list';
import { CreateBtn } from '../../../components/create-button';
import { Options } from '../../../components/options';
import { Input, Icon, Modal } from 'antd';
import { UInput } from '../../../components/urban-input';
import { Upload } from '../../../components/urban-upload';
import { UImgeS } from '../../../components/urban-ImageShows';
import { SecondClassStore, Item } from '../../../pages/arg-config/second-class/second-class-store';
import { UImg } from '../../../components/urban-img';
import { UBack } from '../../../components/urban-back';
import { app } from '../../../utils';

interface Iprops {
    secondClassStore: SecondClassStore
}

const cols = (page: SecondClass): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '品类',
        dataIndex: 'CategoryName',
        key: "CategoryName",
        align: "center",
    },
    {
        title: '分类图片',
        dataIndex: 'CategoryIcon',
        key: "CategoryIcon",
        align: "center",
        render: (t, val) => (
            <UImg path={t}/>
        )
    },
    {
        title: '排序',
        dataIndex: 'OrderTag',
        key: "OrderTag",
        align: "center",
    },
    {
        title: '编辑时间',
        key: "EditWhen",
        align: "center",
        render(_, val) {
            return app.getdays(val.EditWhen);
        }
    },
    {
        title: '编辑人',
        dataIndex: 'EditWho',
        key: "EditWho",
        align: "center",
    },
    {
        title: "操作",
        align: "center",
        render: (t, val) => (
            <span>
                <Options tips="确认删除此二级品类？" btns={[
                    { txt: '查看分类', click: page.viewClass.bind(SecondClass, val) },
                    { txt: '编辑', click: page.editUser.bind(SecondClass, val) },
                    { txt: '删除', click: page.delUser.bind(SecondClass, val) },
                ]} />
            </span>
            
        )
    }
];

@inject("secondClassStore")
@observer
export default class SecondClass extends React.Component< Iprops, {} > {

    constructor(props: any) {
        super(props);
        const path = window.location.pathname;
        const s = this.props.secondClassStore;
        s.CategoryId = path.split("/")[2];
        s.CategroyName = decodeURI(path.split('/')[3]);
    }

    componentWillMount() {
        const s = this.props.secondClassStore;
        s.key = '';
        s.getData();
    }

    viewClass = (it: Item) => {
        window.location.href = `../../param/${it.CategoryId}`;
    }

    editUser = (it: Item) => {
        const s = this.props.secondClassStore;
        it.CategoryIconArray = [it.CategoryIcon];
        it.ParentCategoryId = s.CategoryId;
        it.ParentCategoryName = s.CategroyName;
        s.currItem = it;
        s.mTitle = "编辑品类";
        s.eVisible = true;
    }

    // 新建
    addUser=()=>{
        const s = this.props.secondClassStore;
        s.currItem = new Item();
        s.currItem.ParentCategoryId = s.CategoryId;
        s.currItem.ParentCategoryName = s.CategroyName;
        s.mTitle = "新增品类";
        s.eVisible = true;
    }

    delUser = (it: Item) => {
        this.props.secondClassStore.delUserTri(it);
    }

    handleCancel = () => {
        this.props.secondClassStore.eVisible = false;
    }

    subEdit = () => {
        this.props.secondClassStore.editTri();
    }

    onChangeValue = (obj: any, index: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            obj[index] = e.target.value;
        }
    }

    loaded = (u: any, n: any, s: any) => {
        this.props.secondClassStore.currItem.CategoryIconArray[0] = u;
    }

    del = (s: any) => {
        this.props.secondClassStore.currItem.CategoryIconArray = s;
    }

    back = () => {
        window.history.go(-1);
    }

    render() {
        const s = this.props.secondClassStore;
        return (
            <div className="first-class-page">

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
                buttons = {
                    <CreateBtn click={this.addUser} />
                }
                search = {
                     <SearchList search={s.search}
                     other={
                        <div>
                            <UBack back={this.back}/>
                        </div>
                    }/>
                }
                />

                <Modal
                    title={(<span>{s.mTitle === "新增品类" ? <Icon type="file-add" /> : <Icon type="form" />}{s.mTitle}</span>)}
                    width={'60%'}
                    onCancel={this.handleCancel}
                    onOk={this.subEdit}
                    maskClosable={false}
                    visible={s.eVisible}
                >
                    <Input.Group>
                        <UInput Sn="行业分类" f="ParentCategoryName" d={s.currItem} dis={true}/>
                        <UInput Sn="商品分类" f="CategoryName" d={s.currItem} isTrue={true} />
                        <UInput Sn="排序" f="OrderTag" d={s.currItem} isTrue={true}/>
                        <Upload f={'CategoryIconArray'} d={s.currItem} Sn={'上传分类图片'} loaded={this.loaded} show={'图片'}/>
                        <UImgeS l={[...s.currItem.CategoryIconArray]} del={this.del}/>
                    </Input.Group>
                </Modal>

            </div>
        )
    }

}