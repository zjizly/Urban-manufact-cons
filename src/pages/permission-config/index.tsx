import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { PermissionConfigStore } from '../../stores/permission-config-store';
import { Eselect } from '../../components/forms';
import { Checkbox, Button, Row, Col, Card, Spin } from 'antd';
import { UBack } from '../../components/urban-back';

interface Props {
    permissionConfigStore: PermissionConfigStore
}

@inject("permissionConfigStore")
@observer
export default class PermissionConfig extends React.Component<Props, any> {

    async componentWillMount() {
        const s = this.props.permissionConfigStore;
        let p = window.location.pathname;
        // s.loading = true;
        const idx = p.lastIndexOf("/");
        p = p.substring(idx + 1);
        s.curRoleId = p;
        await s.getmenus();
        await s.getRoles();
        await s.getRoleMenus();
        this.setState({});
    }
    // 权限菜单
    accessMenuChange = (e: any) => {
        const s = this.props.permissionConfigStore;
        const is = e.filter((es: any) => es === s.curMenuA.key);
        if (!is.length) {
            s.reduceArr(s.navigationMenuListStr, s.curMenuA.items);
            s.curMenuA.items.map(cs => { s.reduceArr(s.moduleMenuListStr, cs.items); });
        }
        s.accessMenuListStr = e;
    }
    // 导航菜单
    navigationMenuChange = (e: any) => {
        const s = this.props.permissionConfigStore;
        s.navigationMenuListStr = e;
        const is = e.filter((es: any) => es === s.curMenuB.key);
        if (!is.length) {
            s.reduceArr(s.moduleMenuListStr, s.curMenuB.items);
        }
        const parent = s.accessMenuListStr.filter((ais: any) => ais === s.curMenuB.ParentId.toString());
        if (!parent.length) {
            s.accessMenuListStr.push(s.curMenuB.ParentId.toString());
        }
    }
    // 模块菜单
    moduleMenuChange = (e: any) => {
        const s = this.props.permissionConfigStore;
        s.moduleMenuListStr = e;
        const parent = s.navigationMenuListStr.filter((ais: any) => ais === s.curMenuC.ParentId.toString());
        if (!parent.length) {
            s.navigationMenuListStr.push(s.curMenuC.ParentId.toString());
        }
    }
    // 按钮菜单
    BtnChange = (e: any) => {
        const s = this.props.permissionConfigStore;
        s.buttonListStr = e;
        const parent = s.moduleMenuListStr.filter((ais: any) => ais === s.curMenuC.key);
        if (!parent.length) {
            s.moduleMenuListStr.push(s.curMenuC.key.toString());
        }
        // console.log(s.buttonListStr);
    }
    render() {
        const s = this.props.permissionConfigStore;
        return (
            <Spin spinning={s.loading}>
            <div className="permission-config-page">
               
                <div style={{ padding: '25px' }}>
                    <div style={{ marginBottom: '16px', position: 'relative' }}>
                        <Eselect label="用户角色" value={s.curRoleId} change={s.switchRole}
                            style={{ marginLeft: '-42px' }}
                            options={s.roles}
                        />
                        <UBack back={s.back} />
                    </div>
                    {/* 权限菜单 */}
                    <Card title="模块权限" style={{ width: "100%" }} >
                        <Checkbox.Group value={[...s.accessMenuListStr]} style={{ width: '100%' }} onChange={this.accessMenuChange}>
                            <Row>
                                {
                                    s.menus.map(ms => (
                                        <Col onClick={s.switchMenuA(ms)} key={ms.key} span={8}>
                                            <p className="menu-item" key={ms.key}
                                                style={{
                                                    borderColor: ms.key === s.curMenuA.key ? '#4ebfcd' : '#ccc',
                                                    color: ms.key === s.curMenuA.key ? '#4ebfcd' : '#ccc',
                                                    marginLeft: '7px'
                                                }}
                                            >
                                                <Checkbox style={{ color: ms.key === s.curMenuA.key ? '#4ebfcd' : '#ccc' }}
                                                    value={ms.key}>{ms.menuContent}</Checkbox>
                                            </p>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </Checkbox.Group>
                    </Card>
                    <Row>
                        <Col span={8}>
                            <Card title="一级菜单" style={{ width: "100%" }} >
                                <Checkbox.Group value={[...s.navigationMenuListStr]} style={{ width: '100%' }} onChange={this.navigationMenuChange}>
                                    <div style={{ height: '20vh', overflowY: 'auto' }}>
                                        <Row>
                                            {
                                                s.curMenuA.items.map(ms => (
                                                    <Col onClick={s.pedit(ms)} key={ms.key} span={24}>
                                                        <p className="menu-item" key={ms.key}
                                                            style={{
                                                                borderColor: ms.key === s.curMenuB.key ? '#4ebfcd' : '#ccc',
                                                                color: ms.key === s.curMenuB.key ? '#4ebfcd' : '#ccc',
                                                                marginLeft: '7px'
                                                            }}
                                                        >
                                                            <Checkbox style={{ color: ms.key === s.curMenuB.key ? '#4CBECC' : '#000' }}
                                                                value={ms.key}>{ms.menuContent}</Checkbox>
                                                        </p>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    </div>
                                </Checkbox.Group>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="二级菜单" style={{ width: "100%" }} >
                                <Checkbox.Group value={[...s.moduleMenuListStr]} style={{ width: '100%' }} onChange={this.moduleMenuChange}>
                                    <div style={{ height: '20vh', overflowY: 'auto' }}>
                                        <Row>
                                            {
                                                s.curMenuB.items.map(ms => (
                                                    <Col onClick={s.clickP(ms)} key={ms.key} span={24}>
                                                        <p className="menu-item" key={ms.key}
                                                            style={{
                                                                borderColor: ms.key === s.curMenuC.key ? '#4ebfcd' : '#ccc',
                                                                color: ms.key === s.curMenuC.key ? '#4ebfcd' : '#ccc',
                                                                marginLeft: '7px'
                                                            }}
                                                        >
                                                            <Checkbox style={{ color: ms.key === s.curMenuC.key ? '#4CBECC' : '#000' }}
                                                                value={ms.key}>{ms.menuContent}</Checkbox>
                                                        </p>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    </div>
                                </Checkbox.Group>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="权限按钮" style={{ width: "100%", height: "100%" }} >
                                <Checkbox.Group value={[...s.buttonListStr]} style={{ width: '100%' }} onChange={this.BtnChange}>
                                    <div style={{ height: '20vh', overflowY: 'auto' }}>
                                        <Row>
                                            {
                                                s.btns.map(btn => (
                                                    <Col key={btn.ButtonId} span={12}>
                                                        <Checkbox value={btn.ButtonId}>{btn.ButtonName}</Checkbox>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    </div>
                                </Checkbox.Group>
                            </Card>
                        </Col>
                    </Row>









                    {/* <p>
                    <span>模块权限：</span>
                    <Options super={true} btns={s.menus.map(m => ({
                        txt: m.menuContent,
                        click: s.switchMenuA(m),
                        color: m.key === s.curMenuA.key ? '#4ebfcd' : '#ccc'
                    }))} />
                </p>
                <div className="permission-main">
                    <div className="menu">
                        <h4 className="main-header">一级菜单</h4>
                        <div className="content">
                            {
                                s.curMenuA.items.map(b => {
                                    return (
                                        <p className="menu-item" key={b.key}
                                            style={{ borderColor: b.key === s.curMenuB.key ? '#4CBECC' : '#ccc', color: b.key === s.curMenuB.key ? '#4CBECC' : '#000' }}
                                            onClick={s.pedit(b)}
                                        >{b.menuContent}</p>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="menu">
                        <h4 className="main-header">二级菜单</h4>
                        <div className="content">
                            {
                                s.curMenuB.items.map(c => {
                                    return (
                                        <p className="menu-item" key={c.key}
                                            style={{ borderColor: c.key === s.curMenuC.key ? '#4CBECC' : '#ccc', color: c.key === s.curMenuC.key ? '#4CBECC' : '#000', marginLeft: '7px' }}
                                            onClick={s.clickP(c)}
                                        >
                                            <Checkbox value={c}
                                                style={{
                                                    color: c.key === s.curMenuC.key ? '#4CBECC' : '#000'
                                                }}
                                                onChange={s.cedit(c)}
                                                checked={s.hasMenu(c.key)}>
                                                {c.menuContent}
                                            </Checkbox>
                                        </p>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="btns">
                        <h4 className="main-header">操作按钮</h4>
                        <div className="content">
                            {
                                s.btns.length ? <Checkbox onChange={s.selectAll} className="btn-item" checked={s.sctall()} style={{ width: '5em' }}>全选</Checkbox> : ''
                            }
                            {
                                s.btns.map(btn => {
                                    return (
                                        <Checkbox className="btn-item" key={btn.ButtonId} value={btn.ButtonId} checked={s.hasBtn(btn.ButtonId)}
                                            onChange={s.btnClick(btn.ButtonId)}
                                        >
                                            {btn.ButtonName}
                                        </Checkbox>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div> */}
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" style={{ width: '180px', margin: '16px 0' }} onClick={s.submit}>
                            提  交
                    </Button>
                    </div>
                </div>
            </div >
            </Spin>
        )
    }

}