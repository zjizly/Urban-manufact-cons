import * as React from 'react';
import './style.css';
// import { Button, Icon } from 'antd';
import { inject, observer } from 'mobx-react';
import { ParamValueStore, Item } from './param-value-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { SearchList } from '../../../components/search-list';
import { UBack } from '../../../components/urban-back';
import { app } from '../../../utils';

interface Iprops {
    paramValueStore: ParamValueStore
}

const cols = ( page: ParamValue ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '参数名称',
        dataIndex: 'ParamName',
        key: "ParamName",
        align: "center",
    },
    {
        title: '参数值',
        dataIndex: 'ParamOptionalName',
        key: "ParamOptionalName",
        align: "center",
    },
    {
        title: '上传时间',
        key: "AddWhen",
        align: "center",
        render(_, val) {
            return app.getdays(val.AddWhen);
        }
    },
   
];

@inject("paramValueStore")
@observer
export default class ParamValue extends React.Component< Iprops, {} > {

    constructor(prop: any) {
        super(prop);
        const path = window.location.pathname;
        const s = this.props.paramValueStore;
        s.ParamId = path.split("/")[2];
    }

    componentWillMount() {
        const s = this.props.paramValueStore;
        s.key = '';
        s.getData();
    }

    // 新建
    back = () => {
        window.history.go(-1);
    }

    render() {
        const s = this.props.paramValueStore;
        return (
            <div className="param-value-page">

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