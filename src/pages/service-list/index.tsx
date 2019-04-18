import * as React from 'react';
import './style.css';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { ServiceListStore, Item } from '../../stores/service-list-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { CreateBtn } from '../../components/create-button';
import { app } from '../../utils';
import { Edit } from './edit';
import { UInput } from '../../components/urban-input';

interface Iprops {
    serviceListStore: ServiceListStore
}

const cols = (page: ServiceList): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '真实姓名',
        dataIndex: 'RealName',
        align: 'center',
        key: "RealName"
    },
    {
        title: '昵称',
        dataIndex: 'NickName',
        align: 'center',
        key: "NickName"
    },
    {
        title: '客服工号',
        dataIndex: 'ServiceID',
        align: 'center',
        key: "ServiceID"
    },
    {
        title: '手机号',
        dataIndex: 'MobileNumber',
        align: 'center',
        key: "MobileNumber"
    },
    {
        title: '用户状态',
        dataIndex: 'UserState',
        align: 'center',
        render: (_, val) => {
            return <span>{val.UserState === '0'
                ? '激活' : '冻结'}</span>
        }
    },
    {
        title: '编辑人',
        dataIndex: 'EditWho',
        align: 'center',
        key: "EditWho"
    },
    {
        title: '编辑时间',
        dataIndex: 'EditWhen',
        align: 'center',
        render: (_, val) => {
            return <span>{app.getdays(val.EditWhen)}</span>
        }
    },
    {
        title: '操作',
        dataIndex: 'opera',
        align: 'center',
        render: (_, val) => {
            return <Options btns={[
                { txt: '编辑', click: page.create(val) },
                { txt: '更改', click: page.edit(val) },
                { txt: val.UserState === '0' ? '冻结' : '激活', click: page.props.serviceListStore.freeze(val) },
            ]} />
        }
    },
];

@inject("serviceListStore")
@observer
export default class ServiceList extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.serviceListStore;
        s.key = '';
        s.UserState = '';
        s.ShowEdit = false;
        s.getData();
    }
    // 更改
    edit = (v: any) => () => {
        const s = this.props.serviceListStore;
        s.currItem = v;
        s.changeShow = true;
    }
    // 新建
    create = (v?: any) => () => {
        const s = this.props.serviceListStore;
        s.currItem = v ? v : new Item();
        s.ShowEdit = true;
    }
    render() {
        const s = this.props.serviceListStore;
        if (s.ShowEdit) {
            return <Edit store={s} />
        }
        return (
            <div className="service-list-page">
                < Modal
                    title={'更改'}
                    width={'45%'}
                    visible={s.changeShow}
                    onOk={s.editService}
                    onCancel={s.handleCancelDel}
                >
                    <UInput isTrue={true} f={'MobileNumber'} d={s.currItem} Sn={'手机号码'} lim='tel'
                        limN={11} limPle={`请输入11位手机号码`} />
                    <UInput isTrue={true} f={'PasswordChange'} d={s.currItem} Sn={'登录密码'} lim='ps'
                        limPle={`请设置登录密码 6-18位`} />
                </Modal >
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
                            SelectList={[
                                {
                                    Name: '用户状态',
                                    Data: [
                                        { label: '全部', value: '' },
                                        { label: '激活', value: '0' },
                                        { label: '冻结', value: '1' },
                                    ],
                                    check: '',
                                },
                            ]}
                        />
                    }
                />

            </div>
        )
    }

}