import * as React from 'react';
import { Menu, Layout } from 'antd';
import MediaQuery from 'react-responsive';
import { app } from '../../utils';
import DrawerMenu from 'react-motion-drawer';
import * as _ from 'lodash';
import './style.css';

const { Sider } = Layout;

export interface SiderSubMenu {
  icon: React.ReactNode;
  menuContent: string;
  key: string;
  path?: string;
  items: SiderMenuItem[];
}

export interface SiderMenuItem {
  icon: React.ReactNode;
  menuContent: string;
  key: string;
  path: string;
  items: any;
}

interface Props {
  collapsed: boolean; // 是否收缩
  menuItems: SiderSubMenu[];
  selected: string;
  openKey: string;
  onMenuChanged?: (item: SiderMenuItem | SiderSubMenu) => void;
  onMenuClosed?: () => void;
  onOpenChanged?: (open: string[]) => void;
}

interface State {
}

export default class SiderMenu extends React.Component<Props, State> {

  defaultOpenedKey: string[] = [];
  constructor(props: Props) {
    super(props);
    const { menuItems, selected } = props;
    let opened: string | undefined;
    const subMenu = menuItems.find(({ key }) => key === selected);
    if (!subMenu) {
      const found = menuItems.find(({ items }) => !!items.find(({ key }) => key === selected));
      if (found) {
        opened = found.key;
      }
    }
    if (opened) {
      this.defaultOpenedKey.push(opened);
    }
  }

  onMenuChange = (isMobile: boolean) => ({ key }: { key: string }) => {
    const { onMenuChanged, menuItems, onMenuClosed } = this.props;
    if (onMenuChanged) {
      const subMenu = menuItems.find(({ key: k }) => key === k);
      if (subMenu) {
        onMenuChanged(subMenu);
      } else {
        const menuItem = _.flatMap(menuItems, it => it.items).find(({ key: k }) => key === k);
        if (menuItem) {
          onMenuChanged(menuItem);
        }
      }
    }
    if (isMobile && onMenuClosed) {
      onMenuClosed();
    }
  };

  onMenuToggle = (open: boolean) => {
    const { onMenuClosed } = this.props;
    if (!open && onMenuClosed) {
      onMenuClosed();
    }
  };

  renderMenu(collapsible: boolean, collapsed: boolean) {
    const { menuItems, selected, openKey, onOpenChanged } = this.props;
    return (
      <Sider
        style={{
          // borderTop: '1px solid rgb(86, 82, 82)',
          // backgroundColor: 'rgb(37, 42, 47)'
          backgroundColor: '#D7D7D7'
        }}
        trigger={null}
        collapsible={collapsible}
        collapsed={collapsed}
      >
        <Menu
          style={{
            // backgroundColor: 'rgb(37, 42, 47)',
            backgroundColor: '#D7D7D7'
          }}
          onClick={this.onMenuChange(!collapsible)}
          // theme="dark"
          openKeys={openKey ? [openKey] : []}
          selectedKeys={[selected]}
          onOpenChange={onOpenChanged}
          mode="inline"
        >
          {menuItems.map(({ icon, menuContent, key, items }) => (
            items[0] ? (
              <Menu.SubMenu key={key} title={<span>{icon}<span>{menuContent}</span></span>}>
                {items.map(({ key: innerKey, menuContent: innerContent, icon: innerIcon }) => (
                  <Menu.Item key={innerKey}>
                    {innerIcon}
                    <span>{innerContent}</span>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
                <Menu.Item key={key}>
                  {icon}
                  <span>{menuContent}</span>
                </Menu.Item>
              )
          ))}
        </Menu>
      </Sider>
    );
  }

  render() {
    const { collapsed } = this.props;
    return (
      <MediaQuery minDeviceWidth={app.screen.sm.minWidth}>
        {(matches) => matches ? (
          this.renderMenu(true, collapsed)
        ) : (
            <DrawerMenu open={collapsed} onChange={this.onMenuToggle} width={200} >
              {this.renderMenu(false, false)}
            </DrawerMenu>
          )}
      </MediaQuery>
    );
  }
}