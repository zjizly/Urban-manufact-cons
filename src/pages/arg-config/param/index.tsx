import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { ParamStore, Item } from './param-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { SearchList } from '../../../components/search-list';
import { Options } from '../../../components/options';
import { UBack } from '../../../components/urban-back';
import { app } from '../../../utils';

interface Iprops {
    paramStore: ParamStore
}

const cols = ( page: Param ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '店铺名称',
        dataIndex: 'StoreName',
        key: "StoreName",
        align: "center",
    },
    {
        title: '参数名称',
        dataIndex: 'ParamName',
        key: "ParamName",
        align: "center",
    },
    {
        title: '商品简称',
        dataIndex: 'GoodsSeriesName',
        key: "GoodsSeriesName",
        align: "center",
    },
    {
        title: '上传时间',
        key: "EditWhen",
        align: "center",
        render(_, val) {
            return app.getdays(val.EditWhen)
        }
    },
    {
        title: "操作",
        align: "center",
        render: (t, val) => (
            <Options btns={[
                { txt: '查看分类', click: page.viewClass.bind(Param, val) },
            ]} />
        )
    }
];

@inject("paramStore")
@observer
export default class Param extends React.Component< Iprops, {} > {

    constructor(props: any) {
        super(props);
        const path = window.location.pathname;
        const s = this.props.paramStore;
        s.CategoryId = path.split("/")[2];
    }

    componentWillMount() {
        const s = this.props.paramStore;
        s.key = '';
        s.getData();
    }

    viewClass = (item: Item) => {
        window.location.href = `../paramValue/${item.ParamId}`;
    }

    back = () => {
        window.history.go(-1);
    }
   
    render() {
        const s = this.props.paramStore;
        return (
            <div className="param-page">
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
                    other={
                        <div>
                            <UBack back={this.back}/>
                        </div>
                    }/>
                }
                />
            </div>
        )
    }

}