import * as React from 'react';
import './style.css';
import { message } from 'antd';
import { inject, observer } from 'mobx-react';
import { BranchStore, Item } from './branch-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../../components/universal-table';
import { SearchList } from '../../../components/search-list';
import { Options } from 'src/components/options';
import { UImgListNoList } from 'src/components/urban-ImageShows';
import { app } from '../../../utils';
import { Utils } from '../../../utils/utils';
import { UBack } from '../../../components/urban-back';

interface Iprops {
    branchStore: BranchStore,
    match: any,
}

const cols = (page: Branch): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '品牌名称',
        dataIndex: 'BrandName',
        align: 'center',
        key: "BrandName"
    },
    {
        title: '品牌内涵',
        align: 'center',
        key: "BrandCulture",
        render(_, val) {
            return <span title={val.BrandCulture}>{Utils.cut(val.BrandCulture, 10)}</span>
        }
    },
    {
        title: '品牌图片',
        align: 'center',
        key: "index3",
        render(_, val) {
            return <Options btns={[
                { txt: '点击查看', disabled: val.ViewLists.length ? false : true, click: page.showImages(val) },
            ]} />
        }
    },
    {
        title: '编辑时间',
        align: 'center',
        key: "EditTime",
        render(_, val) {
            return <span>{app.getdays(val.EditTime)}</span>
        }
    },
];

@inject("branchStore")
@observer
export default class Branch extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.branchStore;
        s.code = this.props.match.params.code;
        s.getData();
    }
    showImages = (it: any) => () => {
        const s = this.props.branchStore;
        s.images = [];
        if (it.ViewLists.length) {
            it.ViewLists.map((data: any) => s.images.push(data.Url));
            s.imageShow = true;
        } else {
            message.warn('暂无图片！');
        }
    }
    Cancel = (e: any) => {
        this.props.branchStore.imageShow = e;
    }
    back = () => {
        history.go(-1);
    }
    render() {
        const s = this.props.branchStore;
        return (
            <div className="branch-page">

                <UImgListNoList Cancel={this.Cancel} show={s.imageShow} ls={[...s.images]} />
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
                    search={
                        <SearchList search={s.search} />
                    }
                    buttons={
                        <UBack back={this.back} />
                    }
                />

            </div>
        )
    }

}