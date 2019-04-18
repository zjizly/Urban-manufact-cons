import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { GoodsStore, Item } from '../../stores/goods-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Select } from 'antd';
import { Options } from '../../components/options';
import { Utils } from '../../utils'

const Option = Select.Option;
interface Iprops {
    goodsStore: GoodsStore
}

const cols = ( page: Goods ): ( ColumnProps< Item >[] ) => [
    {
        title: "序号",
        align: 'center',
        dataIndex: "index"
    },
    {
        title: "商品名称",
        align: 'center',
        render(_, val) {
            return <span title={val.GoodsSeriesTitle}>{Utils.cut(val.GoodsSeriesTitle, 8) }</span>
        }
    },
    {
        title: "商品简称",
        align: 'center',
        dataIndex: "GoodsSeriesName",
        render(_, val) {
            return <span title={val.GoodsSeriesName}>{Utils.cut(val.GoodsSeriesName, 8)}</span>
        }
    },
    {
        title: "店铺名称",
        align: 'center',
        dataIndex: "StoreName",
        render(_, val) {
            return <span title={val.StoreName}>{Utils.cut(val.StoreName, 8)}</span>
        }
    },
    {
        title: "库存",
        align: 'center',
        dataIndex: "YunNum",
        render(_, val) {
            return  val.YunNum === 0 ? '未添加':  val.YunNum
        }
    },
    {
        title: '合作工厂',
        align: 'center',
        key: 'CompanyName',
        dataIndex: "CompanyName",
    },
    {
        title: '编辑时间',
        align: 'center',
        key: 'EditWhen',
        dataIndex: "EditWhen",
    },
    {
        title: '上架状态',
        align: 'center',
        key: 'GoodsState',
        render(_, row) {
            if(row.GoodsState === '1') {
                return '上架'
            }else if(row.GoodsState === '0') {
                return '下架'
            }else if(row.GoodsState === '-1'){
                return '删除'
            }else {
                return '无状态'
            }
        }
    },
    {
        title: "操作",
        align: 'center',
        key: "ApplyState",
        render(_, row) {
            if(row.GoodsState === '1') {
                const btns = [{ txt: "详情", click: page.detail(row) },
                { txt: '下架', click: page.down.bind(Goods, row) },
                { txt: "查看订单", click: page.link.bind(Goods, row) },]
                return <Options tips={`确认将此商品下架么？`} btns={btns} />
            }
            return <Options tips={`确认将此商品上架么？`} btns={[
                { txt: "详情", click: page.detail(row) },
                { txt: '上架', click: page.up.bind(Goods, row) },
                { txt: "查看订单", click: page.link.bind(Goods, row) },
            ]} />
        }
    }
];

@inject("goodsStore")
@observer
export default class Goods extends React.Component< Iprops, {} > {

    componentWillMount() {
        const s = this.props.goodsStore;
        s.key = '';
        s.CategoryId1 = '';
        s.CategoryId2 = '';
        s.GoodsState = '';
        s.getCategoryA();
     }
    
    link = (it: any) => {
        const p: any = this.props;
        p.history.push(`./goodsOrder/${it.GoodsSeriesCode}`);
    }

    down = (it: any) => {
        const s = this.props.goodsStore;
        s.currItem = it;
        s.down();
    }

    up = (it: any) => {
        const s = this.props.goodsStore;
        s.currItem = it;
        s.up();
    }

    detail = (row: Item) => () => {
        const p: any = this.props;
        localStorage.setItem('series', JSON.stringify(row));
        p.history.push(`./presaleAuditDetail`);
    }

    getMsg = (t: any, tar: any) => {
        this.props.goodsStore.currItem[tar] = t;
    }

    render() {
        const s = this.props.goodsStore;

        return (
            <div className="goods-page">
               
                {/* 页面主表 */}
                <Utable
                    columns={cols(this)}
                    data={s.tableData.map((it, idx) => ({
                        ...it,
                        key: it.GoodsSeriesCode,
                        index: idx + 1
                    }))}
                    loading={s.loading}
                    paging={{...s.paging}}
                    search={<SearchList search={s.search} 
                    SelectList={[
                        {
                            Name: '上架状态',
                            Data: [
                                { label: '全部', value: '' },
                                { label: '上架', value: '1' },
                                { label: '下架', value: '0' },
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
                    />}
                />
            </div>
        );
    }

}