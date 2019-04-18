import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { FirstClassStore, Item } from './first-class-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { SearchList } from '../../../components/search-list';
import { CreateBtn } from '../../../components/create-button';
import { Options } from '../../../components/options';
import { Input, Modal, Icon } from 'antd';
import { UInput } from '../../../components/urban-input';
import { Upload } from '../../../components/urban-upload';
import { UImgeS } from '../../../components/urban-ImageShows';
import { UImg } from '../../../components/urban-img';
import { UBack } from '../../../components/urban-back';
import { app } from '../../../utils';

interface Iprops {
    firstClassStore: FirstClassStore
}

const cols = (page: FirstClass): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '商品分类',
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
                <Options tips="确认删除此一级品类？" btns={[
                    { txt: '查看分类', click: page.viewClass.bind(FirstClass, val) },
                    { txt: '编辑', click: page.editUser.bind(FirstClass, val) },
                    { txt: '删除', click: page.delUser.bind(FirstClass, val) },
                ]} />
            </span>
            
        )
    }
];

@inject("firstClassStore")
@observer
export default class FirstClass extends React.Component< Iprops, {} > {

    constructor(props: any) {
        super(props);
        const path = window.location.pathname;
        const s = this.props.firstClassStore;
        s.CategoryId = path.split("/")[2];
        s.CategoryName = decodeURI(path.split("/")[3]) ;
    }

    componentWillMount() {
        const s = this.props.firstClassStore;
        s.key = '';
        s.getData();
    }

    viewClass = (it: Item) => {
        window.location.href = `../../secondClass/${it.CategoryId}/${it.CategoryName}`        
    }

    editUser = (it: Item) => {
        const s = this.props.firstClassStore;
        it.CategoryIconArray = [it.CategoryIcon];
        it.ParentCategoryName = s.CategoryName;
        it.ParentCategoryId = s.CategoryId;
        s.currItem = it;
        s.mTitle = "编辑商品分类";
        s.eVisible = true;
    }

    // 新建
    create=()=>{
        const s = this.props.firstClassStore;
        s.currItem = new Item();
        s.currItem.ParentCategoryId = s.CategoryId;
        s.currItem.ParentCategoryName = s.CategoryName;
        s.mTitle = "新增商品分类";
        s.eVisible = true;
    }

    delUser = (it: Item) => {
        this.props.firstClassStore.delUserTri(it);
    }

    handleCancel = () => {
        this.props.firstClassStore.eVisible = false;
    }

    subEdit = () => {
        this.props.firstClassStore.editTri();
    }
    
    loaded = (u: any, n: any, s: any) => {
        this.props.firstClassStore.currItem.CategoryIconArray[0] = u;
    }

    del = (s: any) => {
        this.props.firstClassStore.currItem.CategoryIconArray = s;
    }

    back = () => {
        window.history.go(-1);
    }

    render() {
        const s = this.props.firstClassStore;
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
                    <span>
                        <CreateBtn click={this.create} />
                    </span>
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
                    title={(<span>{s.mTitle === "新增商品分类" ? <Icon type="file-add" /> : <Icon type="form" />}{s.mTitle}</span>)}
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
                        <Upload f={'CategoryIconArray'} d={s.currItem} Sn={'上传分类图片'} loaded={this.loaded} isTrue={true} show={'分类图片'} tip={"备注：图片建议宽512*高512px，大小限制为1M以内，格式支持JPG、PNG等"}/>
                        <UImgeS l={[...s.currItem.CategoryIconArray]} del={this.del}/>
                    </Input.Group>
                </Modal>

            </div>
        )
    }

}