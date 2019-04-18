import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { SystemUsersStore, Item } from '../../stores/system-users-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from '../../components/options';
import { CreateBtn } from '../../components/create-button';
import { Edit } from './edit';
import { Utils } from '../../utils';

interface Iprops {
    systemUsersStore: SystemUsersStore
}

const cols = (page: SystemUsers): (ColumnProps<Item>[]) => [
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
        title: '手机号',
        dataIndex: 'MobileNumber',
        align: 'center',
        key: "MobileNumber"
    },
    {
        title: '品类',
        align: 'center',
        key: "BusinessShow",
        render: (_, val) => {
            return (
                <span title={val.BusinessShow}>{Utils.cut(val.BusinessShow, 10)}</span>
            )
        }
    },
    {
        title: '用户状态',
        align: 'center',
        key: "UserState",
        render: (_, val) => (
            <span>{val.UserState === 1 ? '冻结' : '激活'}</span>
        )
    },
    {
        title: '用户角色',
        dataIndex: 'RoleName',
        align: 'center',
        render: (_, val) => {
            const t = page.props.systemUsersStore.RoleList.filter(rs => rs.value === val.RoleId);
            const str = t.length ? t[0].label : '';
            return (
                <span title={str}>{Utils.cut(str, 10)}</span>
            )
        }
    },
    {
        title: '操作',
        align: 'center',
        key: "opera",
        render: (_, val) => (
            <Options btns={[
                { txt: '编辑', click: page.create(val) },
                {
                    txt: val.UserState === 0 ? '冻结' : '激活',
                    click: page.props.systemUsersStore.ChnageUserState(val)
                },
            ]} />
        )

    },

];

@inject("systemUsersStore")
@observer
export default class SystemUsers extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.systemUsersStore;
        s.key = '';
        s.UserState = '';
        s.RoleId = '';
        s.ShowEdit = false;
        s.getIndustry();
    }
    // 新建
    create = (v?: any) => () => {
        const s = this.props.systemUsersStore;
        s.currItem = v ? v : new Item();
        s.getRole();
    }
    render() {
        const s = this.props.systemUsersStore;
        if (s.ShowEdit) {
            return <Edit store={s} />
        }
        return (
            <div className="system-users-page">

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
                                {
                                    Name: '用户角色',
                                    Data: [...s.RoleList],
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