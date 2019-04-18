import * as React from "react";
import "./style.css";
import { inject, observer } from "mobx-react";
import { ColumnProps } from "antd/lib/table";
import { Options } from "../../components/options";
import { PresaleGoodsStore, Item } from "../../stores/presale-goods-store";
import { Utable } from "../../components/universal-table";
import { SearchList } from "../../components/search-list";
import { Select } from "antd";
import { Utils } from "../../utils";

const Option = Select.Option;
interface Props {
    presaleGoodsStore: PresaleGoodsStore;
}

const cols = (page: PresaleGoods): ColumnProps<Item>[] => [
    {
        title: "序号",
        align: 'center',
        dataIndex: "index"
    },
    {
        title: "商品名称",
        align: 'center',
        dataIndex: "GoodsSeriesTitle",
        render(_, val) {
            return <span title={val.GoodsSeriesTitle}>{Utils.cut(val.GoodsSeriesTitle, 10) }</span>
        }
    },
    {
        title: "店铺名称",
        align: 'center',
        dataIndex: "StoreName",
        render(_, val) {
            return <span title={val.StoreName}>{Utils.cut(val.StoreName, 10)}</span>
        }
    },
    {
        title: '合作工厂',
        align: 'center',
        key: 'CompanyName',
        dataIndex: "CompanyName",
        render(_, val) {
            return <span title={val.CompanyName}>{Utils.cut(val.CompanyName)}</span>
        }
    },
    {
        title: '众测数量',
        align: 'center',
        key: 'PresellNum',
        dataIndex: "PresellNum",
    },
    {
        title: '众测状态',
        align: 'center',
        key: 'PresellState',
        render(_, row) {
            if(row.PresellState === '-1') {
                return "众测失败"
            }else if(row.PresellState === '0') {
                return "众测中"
            }else if(row.PresellState === '1') {
                return "众测成功"
            }else {
                return "无状态"
            }
            
        }
    },
    {
        title: '截止时间',
        align: 'center',
        key: 'EndTime',
        dataIndex: "EndTime",
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
                { txt: '下架', click: page.down.bind(PresaleGoods, row) },
                { txt: "查看订单", click: page.link.bind(PresaleGoods, row) },]
                return <Options tips={'确认将此商品下架么？'} btns={btns} />
            }
            return <Options btns={[
                { txt: "详情", click: page.detail(row) },
                { txt: "查看订单", click: page.link.bind(PresaleGoods, row) },
            ]} />
        }
    }
];

@inject("presaleGoodsStore")
@observer
export default class PresaleGoods extends React.Component<Props, any> {

    componentWillMount() {
        const s = this.props.presaleGoodsStore;
        s.key = '';
        s.CategoryId1 = '';
        s.CategoryId2 = '';
        s.PresellState = '';
        s.GoodsState = '';
        s.getCategoryA();
     }
    
    link = (it: any) => {
        const p: any = this.props;
        p.history.push(`./presaleGoodsOrder/${it.GoodsSeriesCode}/${it.PresellState}`);
    }

    down = (it: any) => {
        const s = this.props.presaleGoodsStore;
        s.currItem = it;
        s.down();
    }

    detail = (row: Item) => () => {
        const p: any = this.props;
        localStorage.setItem('series', JSON.stringify(row));
        p.history.push(`./presaleAuditDetail/${row.GoodsSeriesCode}}`);
    }

    getMsg = (t: any, tar: any) => {
        this.props.presaleGoodsStore.currItem[tar] = t;
    }

    render() {
        const s = this.props.presaleGoodsStore;

        return (
            <div className="presale-goods-page">
               
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
                            Name: '众测状态',
                            Data: [
                                { label: '全部', value: '' },
                                { label: '众测中', value: '0' },
                                { label: '众测成功', value: '1' },
                                { label: '众测失败', value: '-1' },
                            ],
                            check: '',
                        },
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
