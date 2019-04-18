import * as React from 'react';
import { Layout, Icon, Popover, Row, Col, Breadcrumb } from 'antd';
import { SiderMenu, SiderMenuItem, SiderSubMenu } from '../../components';
import './style.css';
import * as _ from 'lodash';
import { withRouter } from 'react-router-dom';
import logo from '../../assets/imgs/logo.png';
import dfimg from '../../assets/imgs/avatar.jpg';
import { Tips } from '../../components/Look-tips';
// import { MenuItems } from './menu';

const { Header, Content, Sider } = Layout;

// const menuItems: SiderSubMenu[] = MenuItems;

const menuItems: SiderSubMenu[] = JSON.parse(sessionStorage.getItem("menu") as string) || [];

menuItems.forEach(it => {
  if (it.icon) {
    it.icon = <Icon type={(it.icon) as string} />;
  }
  it.items.forEach((its: any) => {
    if (its.icon) {
      its.icon = <Icon type={(its.icon) as string} />;
    }
  })
})
class UserOptions extends React.Component {
  onClick = (path: string) => {
    return () => {
      window.location.href = `./${path}`;
    }
  }

  loginOut = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  }

  render() {
    return (
      <ul className="user_setting_container">
        <li onClick={this.onClick('safe')}>
          <Icon type="setting" />
          &nbsp;&nbsp;
          安全设置
        </li>
        <li onClick={this.loginOut}>
          <Icon type="poweroff" />
          &nbsp;&nbsp;
          退出登陆
        </li>
      </ul>
    )
  }
}

interface Props {
  children?: React.ReactNode;
  history: { push: (s: string) => void };
  location: { pathname: string };
}

interface State {
  collapsed: boolean;
  selected: string;
  openKey: string;
  navigation: any[];
  navigationList: any[];
  menuItemsList: any[];
  fnavigation: any;
}

class BasicLayout extends React.Component<Props, State> {


  state = {
    collapsed: false,
    selected: '1',
    openKey: '',
    navigation: [],
    navigationList: [],
    menuItemsList: [],
    fnavigation: {
      key: "",
    },
  };


  private openKeyStore = '';

  onCollapse = (collapsed: boolean) => {
    if (collapsed) {
      this.openKeyStore = this.state.openKey;
      this.setState({ collapsed, openKey: '' });
    } else {
      this.setState({ collapsed, openKey: this.openKeyStore });
    }
  };

  onClose = () => this.onCollapse(false);

  onToggle = () => this.onCollapse(!this.state.collapsed);

  onMenuChanged = ({ key, path }: SiderMenuItem | SiderSubMenu) => {
    this.setState({ selected: key });
    let targetBrr: any[] = [];
    const strArr: any[] = [];
    targetBrr = this.state.menuItemsList.filter((ts: any) => ts.key === key);
    if (targetBrr[0].ParentId !== 1) {
      targetBrr.splice(0, 0, this.state.menuItemsList.filter((ts: any) => ts.key === targetBrr[0].ParentId.toString())[0]);
      if (targetBrr[0].ParentID !== 1) {
        targetBrr.splice(0, 0, this.state.menuItemsList.filter((ts: any) => ts.key === targetBrr[0].ParentId.toString())[0]);
      }
    }
    targetBrr.forEach((bs: any) => {
      strArr.push(bs.menuContent);
    });
    sessionStorage.setItem("navigationList", JSON.stringify(strArr));
    localStorage.setItem('NavigationHierarchy', '');
    this.setState({ navigationList: strArr });
    this.props.history.push(path || '/');
  };
  getAllmenu = (tar?: any) => {
    const targetArr: any[] = [];
    menuItems.forEach((ms: any) => {
      if (ms) {
        targetArr.push(ms);
      }
      if (ms.items.length) {
        ms.items.forEach((mis: any) => {
          if (mis) {
            targetArr.push(mis);
          }
          if (mis.items.length) {
            mis.items.forEach((mes: any) => {
              if (mes) {
                targetArr.push(mes);
              }
            });
          }
        });
      }
    });
    if (tar) {
      const tA = targetArr.filter((ts: any) => ts.menuContent === tar[(tar.length - 1)]);
      const tB = targetArr.filter((ts: any) => ts.menuContent === tar[0]);

      this.setState({
        selected: tA.length ? tA[0].key : '',
        fnavigation: tB.length ? tB[0] : {},
        navigation: tB.length && tB[0].items && tB[0].items.length ? tB[0].items : [],
      });
    }
    this.setState({ menuItemsList: targetArr });
  }
  onOpenChanged = (open: string[]) => this.setState({ openKey: open[open.length - 1] || '' });

  onRouteChanged = (pathname: string) => {
    const selectedSub = menuItems.find(({ path }) => path === pathname);
    if (selectedSub) {
      this.setState({ selected: selectedSub.key });
      document.title = selectedSub.menuContent;
    } else {
      const selectedItem = _.flatMap(menuItems, it => it.items).find(it => it.path === pathname);
      if (selectedItem) {
        const { key } = selectedItem;
        const found = menuItems.find(({ items }) => !!items.find(({ key: k }) => k === key));
        const openKey = found && found.key || '';
        this.openKeyStore = openKey;
        this.setState({ selected: selectedItem.key, openKey });
        document.title = selectedItem.menuContent;
      }
    }
  };
  // componentWillUpdate(np: any, ns: any) {
  //   console.log(np);
  //   console.log(this.props.location);
  //   // localStorage.setItem('NavigationHierarchy', '');
  // }
  componentWillMount() {
    if (menuItems && menuItems.length) {
      this.setState({ navigation: menuItems[0].items });
      const arr = [];
      if (!sessionStorage.getItem("navigationList")) {
        if (menuItems.length) {
          arr.push(menuItems[0].menuContent);
          if (menuItems[0].items.length) {
            arr.push(menuItems[0].items[0].menuContent);
            if (menuItems[0].items[0].items.length) {
              arr.push(menuItems[0].items[0].items[0].menuContent);
            }
          }
        }
        sessionStorage.setItem("navigationList", JSON.stringify(arr));
        this.setState({
          navigationList: arr,
          fnavigation: menuItems.length ? menuItems[0] : { key: '' },
        });
        this.getAllmenu();
      } else {
        const list = JSON.parse(sessionStorage.getItem("navigationList") as string);
        this.getAllmenu(list);
        this.setState({
          navigationList: list,
        });
      }
    }
    this.onRouteChanged(this.props.location.pathname);
  }
  // 路由显示修改
  RouteChangShow = (s: any) => {
    this.setState({ navigationList: [] });
    const menu = JSON.parse(sessionStorage.getItem('menu') || '[]');
    const menuArr: any = [];
    const menuArrs: any = [];
    const menuArrsi: any = [];
    menu.forEach((ms: any) => {
      menuArr.push(ms);
      if (ms.items.length) {
        ms.items.forEach((mes: any) => {
          menuArrs.push(mes);
          if (mes.items.length) {
            mes.items.forEach((mis: any) => {
              menuArrsi.push(mis);
            });
          }
        });
      }
    });
    const menuArrTar = menuArrsi.filter((ms: any) => ms.path === s);
    const routeStr = [];
    if (menuArrTar.length) {
      routeStr.push(menuArrTar[0].menuContent);
      if (menuArrTar[0].ParentId) {
        const menuArrTars = menuArrs.filter((ms: any) => ms.key === menuArrTar[0].ParentId.toString());
        if (menuArrTars.length && menuArrTars[0].ParentId) {
          routeStr.push(menuArrTars[0].menuContent);
          const menuArrTarsi = menuArr.filter((ms: any) => ms.key === menuArrTars[0].ParentId.toString());
          if (menuItems && menuItems.length) {
            const Shows = menuItems.find((ms: any) => ms.key === menuArrTarsi[0].key);
            if (Shows) {
              routeStr.push(Shows.menuContent);
              this.setState({
                navigation: Shows.items,
                fnavigation: Shows,
                navigationList: routeStr.reverse(),
              });
            }
          }
        }
      }
      this.setState({ selected: menuArrTar[0].key });
    }
  }
  componentWillReceiveProps(props: Props) {
    this.RouteChangShow(props.location.pathname);
    this.onRouteChanged(props.location.pathname);
  }
  changeTab = (val: any, e: any) => {
    const arr = e.target.parentNode.children;
    const TarArr = [];
    for (let i = 0; i < arr.length; i++) {
      arr[i].className = "li-left-tab";
    }
    e.target.className = "li-left-tab clicked-tab";
    TarArr.push(val.menuContent);
    if (val.items.length) {
      if (val.items[0].path) {
        TarArr.push(val.items[0].menuContent);
        this.props.history.push(val.items[0].path || '/');
      } else {
        if (val.items[0].items.length) {
          TarArr.push(val.items[0].menuContent);
          TarArr.push(val.items[0].items[0].menuContent);
          this.props.history.push(val.items[0].items[0].path || '/');
        }
      }
    }
    sessionStorage.setItem("navigationList", JSON.stringify(TarArr));
    this.setState({
      navigationList: TarArr,
      navigation: val.items,
      selected: val.items.length ? val.items[0].key : '',
      fnavigation: val,
    });
  }
  backMeun = () => {
    // localStorage.setItem('NavigationHierarchy', 'NoShow'); // 导航返回显示
    localStorage.setItem('NavigationHierarchy', '');
    history.go(-1);
    // setTimeout(() => {
    //   location.reload();
    // }, 0);
  }
  render() {
    const { collapsed, selected, openKey } = this.state;
    const { children } = this.props;
    const userInfo = sessionStorage.getItem('user');
    let avatar = '';
    if (userInfo) {
      const a = JSON.parse(userInfo).HeadImageUrl;
      if (a) {
        avatar = a;
      }
    }
    const menu = JSON.parse(sessionStorage.getItem('menu') || '[]');
    const menuArr: any = [];
    menu.forEach((ms: any) => {
      menuArr.push(ms);
      if (ms.items.length) {
        ms.items.forEach((mes: any) => {
          menuArr.push(mes);
          if (mes.items.length) {
            mes.items.forEach((mis: any) => {
              menuArr.push(mis);
            });
          }
        });
      }
    });
    // console.log(this.state.navigationList);
    // const funcDis = localStorage.getItem('NavigationHierarchy') === '2' ? false : true;  // 功能说明显示
    const showConten = menuArr.filter((mns: any) => mns.menuContent === this.state.navigationList[this.state.navigationList.length - 1]);
    // console.log(this.props.location);
    return (
      <Layout className="basic-layout-page">
        <Layout >
          <Header>
            <Row>
              <Col span={6}>
                <img
                  src={logo}
                  style={{ width: "75px", padding: "0 10px" }} />
                <span style={{ fontSize: "14px", color: "#ffffff" }}>
                  都市智造控制台
                </span>
                <Icon
                  className="trigger"
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.onToggle}
                />
              </Col>
              <Col style={{ position: 'absolute', top: '0', left: '300px' }}>
                <span style={{ height: "" }}>
                  <ul style={{ margin: "0" }}>
                    {
                      menuItems.map((ms: any, i: number) =>
                        this.state.fnavigation.key === ms.key ? (
                          <li
                            onClick={this.changeTab.bind(BasicLayout, ms)}
                            key={"menuItems" + ms.key}
                            className="li-left-tab clicked-tab"
                          > {ms.menuContent}</li>
                        ) : (
                            < li
                              onClick={this.changeTab.bind(BasicLayout, ms)}
                              key={"menuItems" + ms.key}
                              className="li-left-tab"
                            > {ms.menuContent}</li>
                          )

                      )
                    }
                  </ul>
                </span>
              </Col>
              <Col style={{ float: 'right' }}>
                <Popover placement="bottomRight" title="个人中心" content={<UserOptions />} trigger="click">
                  <img className="user_avatar_img"
                    src={avatar ? avatar : dfimg}
                  />
                </Popover>
              </Col>
            </Row>
            {/* <ChatOption /> */}
          </Header>
          <Layout>
            <Sider
              // height: '90.4vh'
              style={{ backgroundColor: '#CCCCCC' }}
              collapsed={this.state.collapsed}
            >
              <SiderMenu
                openKey={openKey}
                collapsed={collapsed}
                menuItems={this.state.navigation}
                selected={selected}
                onMenuChanged={this.onMenuChanged}
                onMenuClosed={this.onClose}
                onOpenChanged={this.onOpenChanged}
              />
            </Sider>
            <Layout >
              <Content style={{ overflow: 'initial', backgroundColor: '#F2F2F2' }}>
                <div style={{ padding: '25px' }}>
                  <div className='header-tips' >
                    <Row>
                      <Col span={18} style={{ textIndent: '12px' }}>
                        <Breadcrumb style={{ display: 'inline-block', width: '90%' }}>
                          {
                            this.state.navigationList.map((ns: any, i: number) => (
                              <Breadcrumb.Item key={"navigationList" + i}>{ns}</Breadcrumb.Item>
                            ))
                          }
                        </Breadcrumb>
                      </Col>
                      {
                        showConten.length && showConten[0].Remark && showConten[0].Remark.length ? (
                          <Col span={6} style={{ textAlign: 'right', padding: '0 12px 0  0' }}>
                            <Tips showTips={'功能说明'} showContent={showConten.length ?
                              (showConten[0].Remark && showConten[0].Remark.length ?
                                showConten[0].Remark : '') : ''}
                              show={
                                <div style={{ fontSize: '14px', lineHeight: '21px', color: '#66CC00' }}>
                                  功能说明
                            </div>
                              } />
                          </Col>
                        ) : (
                            <Col span={6} />
                          )
                      }

                    </Row>
                  </div>
                  <div className='content-urban'>
                    {children}
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Layout >
    );
  }
}

export default withRouter((props => <BasicLayout {...props} />))