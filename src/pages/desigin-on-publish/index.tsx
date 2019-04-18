import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { DesiginOnPublishStore, Item } from '../../stores/desigin-on-publish-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { app } from '../../utils';
import { Select } from 'antd';

const Option = Select.Option;
interface Iprops {
    desiginOnPublishStore: DesiginOnPublishStore
}

const cols = ( page: DesiginOnPublish ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '店铺名称',
        dataIndex: 'StoreName',
        align: 'center',
        key: "StoreName"
    },
    {
        title: '设计师',
        dataIndex: 'RealName',
        align: 'center',
        key: "RealName"
    },
    {
        title: '商品品类',
        dataIndex: 'CategoryName3',
        align: 'center',
        key: "CategoryName3"
    },
    {
        title: '设计编号',
        dataIndex: 'GoodsSeriesCode',
        align: 'center',
        key: "GoodsSeriesCode"
    },
    {
        title: '编辑时间',
        align: 'center',
        key: "EditWhen",
        render(_ ,val) {
            return app.getdays(val.EditWhen)
        }
    },
    {
        title: '商品详情',
        align: 'center',
        key: "opertaion",
        render(_, val) {
            return <Options btns={
                [
                    { txt: '详情', click: page.showDetails.bind(DesiginOnPublish, val) },
                    { txt: '方案', click: page.showPropsal.bind(DesiginOnPublish, val) },
                ]} />
        }
    },
];

@inject("desiginOnPublishStore")
@observer
export default class DesiginOnPublish extends React.Component< Iprops, {} > {

    componentWillMount() {
        const s = this.props.desiginOnPublishStore;
        s.key = '';
        s.CategoryId1 = '';
        s.CategoryId2 = '';
        s.getCategoryA();
        // s.getData();
    }

    showDetails = (it: Item) => {
        sessionStorage.setItem("designGood", JSON.stringify(it));
        window.location.href = './goodDetails';
    }

    showPropsal = (it: Item) => {
        window.location.href = './goodPropsal/'+it.GoodsSeriesCode+'/0';
    }
   
    render() {
        const s = this.props.desiginOnPublishStore;
        return (
            <div className="desigin-on-publish-page">

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
                search = {
                     <SearchList search={s.search}
                     // 下拉选项数据格式
                       SelectList={[
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
                    />
                }
                />

            </div>
        )
    }

}