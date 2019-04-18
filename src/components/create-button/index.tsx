import * as React from 'react';
import { Button } from 'antd';
import { authStore } from '../../stores';
import { app } from '../../utils';

interface Props {
    tips?: string;
    super?: boolean;
    path?: string;
    disabled?: boolean;     // 是否禁用
    click(e?: any): void;   // 点击事件回调，按钮禁用时无效
}

export class CreateBtn extends React.Component<Props, any> {

    btns: any[] = [];

    componentWillMount() {
        const bm = authStore.btnMap;
        this.btns = this.props.path ? bm.get(this.props.path) || [] : bm.get(window.location.pathname) || [];
    }

    show = (name: string): boolean => {
        if (app.baseUrl.indexOf("//apitest.emake.cn") >= 0 || app.baseUrl.indexOf("//git.emake.cn") >= 0) {
            return true;
        }
        if (this.props.super) {
            return true;
        }
        let resp = false;
        this.btns.forEach(it => {
            if (it.ButtonName === name) {
                resp = true;
            }
        })
        return resp;
    }

    render() {
        return (
            <span className="emake-options">
                <Button type="primary"
                    disabled={(this.props.disabled || !this.show('新增')) ? true : false}
                    onClick={(this.props.disabled || !this.show('新增')) ? undefined : this.props.click}>
                    新增</Button>
            </span>
        )
    }


}