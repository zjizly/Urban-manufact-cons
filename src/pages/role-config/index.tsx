import * as React from 'react';
import './style.css';
import { Button, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import { RoleConfigStore, Item } from '../../stores/role-config-store';
import { ColumnProps } from 'antd/lib/table';
import { SimpleSearchInput, SearchButton } from '../../components/search-tools';
import { Options } from '../../components/options';
import { EditModal } from '../../components/edit-modal';
import { EditPanel, Einput } from '../../components/forms';
import { app } from '../../utils';

interface Props {
    roleConfigStore: RoleConfigStore
}

const cols = (page: RoleConfig): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: "center",
    },
    {
        title: '角色名称',
        dataIndex: 'RoleName',
        align: "center",
    },
    {
        title: '编辑时间',
        align: "center",
        render: (_, v) => {
            return <span>{app.getdays(v.EditWhen)}</span>
        }
    },
    {
        title: '编辑人',
        dataIndex: 'EditWho',
        align: "center",
    },
    {
        title: '操作',
        key: 'operations',
        align: "center",
        render(_, row) {
            const s = page.props.roleConfigStore;
            return (
                <Options super={true} btns={[
                    { txt: '权限设置', click: page.edit(row.RoleId) },
                    { txt: '编辑', click: s.openAddModal(row) },
                    { txt: '删除', click: s.del(row.RoleId) }
                ]} />
            )
        }
    }
];

@inject("roleConfigStore")
@observer
export default class RoleConfig extends React.Component<Props, any> {

    componentWillMount() {
        const s = this.props.roleConfigStore;
        s.getData();
    }

    // 跳转到编辑
    edit = (role: string) => () => {
        const p: any = this.props;
        localStorage.setItem('NavigationHierarchy', '2');
        p.history.push("./permissionConfig/" + role);
    }

    render() {
        const s = this.props.roleConfigStore;
        return (
            <div className="role-config-page" >
                <div style={{ padding: '25px' }}>
                    {/* 搜索条 */}
                    <div className="btns">
                        <SimpleSearchInput keyword={s.searchCfg.searchKey} change={s.searchCfg.keyChange} pl="输入想要搜索的内容" />
                        <SearchButton click={s.searchCfg.search.bind(RoleConfig, s.searchCfg.searchKey)} />
                        <Button type="primary" onClick={s.openAddModal()} className="create">新增</Button>
                    </div>
                    {/* 页面主表 */}
                    <Table columns={cols(this)} pagination={{ ...s.paging }}
                        dataSource={s.tableData.map((it, idx) => ({ ...it, index: idx + 1, key: idx + 1, }))}
                    />
                    {/* 编辑模态框 */}
                    <EditModal title="新增角色" show={s.mEdit} cancel={s.close} ok={s.submit}>
                        <EditPanel>
                            <Einput label="角色名称" data={s.curRole} field="RoleName" style={{ textAlign: 'left' }} />
                        </EditPanel>
                    </EditModal>
                </div>
            </div>
        )
    }

}