import * as React from 'react';
import './style.css';
import { ArgConfigStore, Item } from '../../stores/arg-config-store';
import { Utable } from '../../components/universal-table';
import { ColumnProps } from 'antd/lib/table';
import { observer, inject } from 'mobx-react';
import { Options } from '../../components/options';
import { SearchList } from '../../components/search-list';
import { CreateBtn } from '../../components/create-button';
import { UImg } from '../../components/urban-img';
import { app } from '../../utils';
import { Modal, Icon } from 'antd';

interface Props {
    argConfigStore: ArgConfigStore
}

const cols = (page: ArgConfig): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'key',
        key: "key",
        align: "center",
    },
    {
        title: '行业分类',
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
        title: '上架状态',
        key: "OnSale",
        align: "center",
        render: (t, val) => (
            val.OnSale === '1' ? '上架' : '下架'
        )
    },
    {
        title: '编辑时间',
        key: "EditWhen",
        align: "center",
        render(_, val) {
            return app.getdays(val.EditWhen)
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
                <Options btns={[
                    { txt: '查看分类', click: page.viewClass.bind(ArgConfig, val) },
                    { txt: val.OnSale === '1' ? '下架' : '上架', click: page.online.bind(ArgConfig, val) },
                    { txt: '编辑', click: page.editCategory.bind(ArgConfig, val) },
                    { txt: '删除',  click: page.delCategory.bind(ArgConfig, val) },
                ]} />
            </span>
            
        )
    }
];

@inject("argConfigStore")
@observer
export default class ArgConfig extends React.Component<Props, {}> {
   
    componentWillMount() {
        const s = this.props.argConfigStore;
        s.secKey = '';
        this.props.argConfigStore.getData(1);
    }
    
    online = async (it: Item) => {
        const sale = it.OnSale;
        const s = this.props.argConfigStore;
        s.currItem  = it;
        await s.getGoodsnum();

        if(sale === '1') {
            if(s.goodsnum !== 0){
                s.downShow = true;
            }else {
                s.onlineChange();
            }
        }else {
            if(s.goodsnum === 0){
                s.upShow = true;
            }else {
                s.onlineChange();
            }
            
        }
    }

    viewClass = (it: Item) => {
        window.location.href = `./firstClass/${it.CategoryId}/${it.CategoryName}`
    }

    addCategory = () => {
        const s = this.props.argConfigStore;
        sessionStorage.setItem("item", JSON.stringify({mTitle: "新增分类", data: s.currItem}));
        window.location.href = `./argConfigEdit`
    }
 
    editCategory = (it: Item) => {
        sessionStorage.setItem("item", JSON.stringify({mTitle: "编辑分类", data: it}));
        window.location.href = `./argConfigEdit`
    }

    delCategory = (it: Item) => {
        this.props.argConfigStore.delCategorySec(it);
    }
    
    render() {
        const s = this.props.argConfigStore;
        return (
            <div className="arg-config-page">
                <Utable
                    columns={cols(this)}
                    data={s.seclist}
                    loading={s.loading}
                    paging={{...s.paging}}
                    buttons={
                        <CreateBtn click={this.addCategory} />
                    }
                    search={ 
                        <SearchList  search={s.search}/>
                    }
                />

                <Modal title={<span><Icon type="download" />下架</span>}
                    onCancel={s.close} visible={s.downShow} onOk={s.onlineChange}
                >
                   {`此行业分类下有${s.goodsnum}个商品已上线，
                    确认将此分类下架？`} 
                </Modal>

                <Modal title={<span><Icon type="upload" />上架</span>}
                    onCancel={s.close} visible={s.upShow} onOk={s.onlineChange}
                >
                    此品类下还未上架商品，是否确认上架？
                    （强制上架会造成订单号页面空白）
                </Modal>
            </div>
        )
    }

}