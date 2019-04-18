import * as React from 'react';
import './style.css';
import { Button, Icon, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import { SystemMenusStore, MenuBtn, MenuA } from '../../stores/system-menus-store';
import { SimpleSearchInput, SearchButton, SelectSearch } from '../../components/search-tools';
import { Options } from '../../components/options';
import { EditModal } from '../../components/edit-modal';
import { EditPanel, Einput, Eselect } from '../../components/forms';
import { ColumnProps } from 'antd/lib/table';
import { SelfText } from '../../components/self-text';

interface Props {
    systemMenusStore: SystemMenusStore
}

const cols = (store: SystemMenusStore): ColumnProps<MenuBtn>[] => [
    {
        title: '按钮名称',
        dataIndex: 'ButtonName'
    },
    {
        title: '请求路径',
        dataIndex: 'RequestUrl'
    },
    {
        title: '请求方法',
        dataIndex: 'RequestMethod'
    },
    {
        title: '操作',
        key: 'operations',
        render(_, row) {
            return (
                <Options super={true} btns={[
                    { txt: '删除', click: store.delBtn(row.ButtonId) }
                ]} />
            )
        }
    }
];
const coles = (store: SystemMenusStore): ColumnProps<MenuA>[] => [
    {
        title: '菜单名称',
        dataIndex: 'menuContent',
        align: 'center',
    },
    {
        title: '操作',
        key: 'operations',
        align: 'center',
        render(_, row) {
            // console.log(row.key);
            return (
                <Options super={true} btns={[
                    { txt: '删除', click: store.delMenu(row.key) }
                ]} />
            )
        }
    }
];

@inject("systemMenusStore")
@observer
export default class SystemMenus extends React.Component<Props, any> {

    componentWillMount() {
        this.props.systemMenusStore.getmenus();
    }
    Change = (r: any, o: any) => {
        const s = this.props.systemMenusStore;
        s.curMenuC[o] = r;
    }
    render() {
        const s = this.props.systemMenusStore;
        return (
            <div className="system-menus-page">
                <div style={{ padding: '25px' }}>
                    <div className="operations">
                        <SimpleSearchInput keyword={s.keyword} change={s.changeKeyword} pl="菜单名称" />
                        <SelectSearch label="一级菜单" val={s.curMenuA.key} change={s.switchMenuA}
                            options={s.menus.map(m => ({ label: m.menuContent, val: m.key }))}
                        />
                        <SearchButton click={s.search} />
                        <Button type="primary" loading={s.loading} onClick={s.openModal} style={{ float: 'right' }}>新建二级菜单</Button>
                        <Button type="primary" loading={s.loading} onClick={s.openModalOne} style={{ float: 'right', marginRight: "10px" }}>新建一级菜单</Button>
                        <Button type="primary" loading={s.loading} onClick={s.openModals} style={{ float: 'right', marginRight: "10px" }}>删除一级菜单</Button>
                    </div>
                    <div style={{ border: '1px solid #ccc' }}>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th>序号</th>
                                    <th>二级菜单</th>
                                    <th>三级菜单名称</th>
                                    <th>图标</th>
                                    <th>路径</th>
                                    {/* <th>按钮名称</th> */}
                                    <th>操作</th>
                                </tr>
                            </tbody>
                            {
                                s.curMenuA.items.map((ele) => {
                                    return (
                                        <tbody key={ele.key}>
                                            <tr>
                                                <td rowSpan={ele.items.length + 1}>{ele.OrderTag}</td>
                                                <td>{ele.menuContent}</td>
                                                <td />
                                                <td><Icon type={ele.icon} /></td>
                                                <td />
                                                {/* <td/> */}
                                                <td>
                                                    <Options super={true} btns={[
                                                        { txt: '新建子菜单', click: s.openModalC(ele) },
                                                        { txt: '编辑', click: s.openEdit(ele) },
                                                        { txt: '删除此项', click: s.delMenu(ele.key) }
                                                    ]} />
                                                </td>
                                            </tr>
                                            {
                                                ele.items.map((c: any) => {
                                                    return (
                                                        <tr key={c.key}>
                                                            <td />
                                                            <td>{c.menuContent}</td>
                                                            <td />
                                                            <td>{c.path}</td>
                                                            {/* <td>{c.ButtonIds}</td> */}
                                                            <td>
                                                                <Options super={true} btns={[
                                                                    { txt: '编辑', click: s.editC(c) },
                                                                    { txt: '删除', click: s.delMenu(c.key) },
                                                                    { txt: '配置按钮', click: s.showBtnEdit(c) }
                                                                ]} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    )
                                })
                            }
                        </table>
                    </div>


                    {/* 删除一级菜单 */}
                    <EditModal title={"删除一级菜单"}
                        show={s.oEdits}
                        cancel={s.close}
                        ok={s.close}
                    >
                        <Table columns={coles(this.props.systemMenusStore)} dataSource={[...s.menus]} />
                    </EditModal>

                    {/* 一级菜单 */}
                    <EditModal title={"新增一级菜单"}
                        show={s.oEdit}
                        cancel={s.close}
                        ok={s.SaveO()}
                    >
                        <EditPanel>
                            <Einput label="菜单名称" data={s.curMenuO}
                                field="menuContent"
                                style={{ textAlign: 'left' }}
                            />
                        </EditPanel>
                        <EditPanel>
                            <Einput label="菜单排序" data={s.curMenuO}
                                field="OrderTag"
                                style={{ textAlign: 'left' }}
                            />
                        </EditPanel>
                    </EditModal>

                    {/* 菜单编辑框 */}
                    <EditModal title={s.isLeaf ? s.curMenuC.key ? "编辑子菜单" : "新增子菜单" : s.curMenuB.key ? "编辑二级菜单" : "新增二级菜单"}
                        show={s.mEdit}
                        cancel={s.close}
                        ok={s.isLeaf ? s.curMenuC.key ? s.menuB() : s.menuB(s.curMenuB.key) : s.curMenuB.key ? s.menuB() : s.menuB(s.curMenuA.key)}
                    >
                        <EditPanel>
                            {
                                !s.isLeaf ? (
                                    <Eselect value={s.curMenuA.key} label="一级菜单" change={s.switchMenuA}
                                        options={s.menus.map(m => ({ label: m.menuContent, val: m.key }))}
                                        style={{ textAlign: 'left' }}
                                    />
                                ) : null
                            }
                            <Einput label="菜单名称" data={s.isLeaf ? s.curMenuC : s.curMenuB}
                                field="menuContent"
                                style={{ textAlign: 'left' }}
                            />
                            <Einput label="菜单图标" data={s.isLeaf ? s.curMenuC : s.curMenuB}
                                field="icon"
                                style={{ textAlign: 'left' }}
                            />
                            <Einput label="菜单路径" data={s.isLeaf ? s.curMenuC : s.curMenuB}
                                field="path"
                                style={{ textAlign: 'left' }}
                            />
                            <Einput label="菜单排序" data={s.isLeaf ? s.curMenuC : s.curMenuB}
                                field="OrderTag"
                                style={{ textAlign: 'left' }}
                            />
                            {
                                s.isLeaf ? (
                                    <div style={{ paddingLeft: '12px' }}>
                                        <SelfText prodLabelCN={'功能说明'} prodLabelTar={'Remark'}
                                            Ival={s.curMenuC.Remark} isTrue={false} input={this.Change} />
                                    </div>
                                    // <Einput label="功能说明" data={s.curMenuC}
                                    //     field="Remark"
                                    //     style={{ textAlign: 'left' }}
                                    // />
                                ) : null
                            }
                        </EditPanel>
                    </EditModal>

                    {/* 配置按钮模态框 */}
                    <EditModal title="按钮配置"
                        show={s.mBtns}
                        cancel={s.close}
                        footer={false}
                    >
                        <EditPanel>
                            <Table columns={cols(this.props.systemMenusStore)} dataSource={s.btnList.map(it => ({ ...it, key: it.MenuId + it.ButtonName + it.RequestMethod }))}
                                bordered={true}
                                pagination={false}
                                style={{ marginBottom: '16px' }}
                            />
                            <Einput label="按钮名称" data={s.curBtn}
                                field="ButtonName"
                                style={{ textAlign: 'left' }}
                                tips="编辑，删除，新增等等。。"
                            />
                            <Einput label="请求路径" data={s.curBtn}
                                field="RequestUrl"
                                style={{ textAlign: 'left' }}
                                tips="此按钮调用的接口"
                            />
                            <Eselect label="请求方法" value={s.curBtn.RequestMethod}
                                change={s.changeMethod}
                                style={{ textAlign: 'left' }}
                                options={[
                                    { label: 'GET', val: 'GET' },
                                    { label: 'POST', val: 'POST' },
                                    { label: 'PUT', val: 'PUT' },
                                    { label: 'DELETE', val: 'DELETE' }
                                ]}
                            />
                            <div style={{ padding: '24px', textAlign: 'right' }}>
                                <Button type="primary" onClick={s.addBtn}>添加按钮</Button>
                            </div>
                        </EditPanel>
                    </EditModal>
                </div>
            </div>
        )
    }



}