import * as React from 'react';
import { Popconfirm } from 'antd';
import { authStore, Btn as Butn } from '../../stores';
import { app } from '../../utils';


interface Btn {
    color?: string;
    disabled?: boolean;     // 是否禁用
    txt: string;            // 按钮显示的文字
    click(e?: any): void;   // 点击事件回调，按钮禁用时无效
}

interface Props {
    tips?: string;
    super?: boolean;
    btns: Btn[];
    path?: string;
}

export class Options extends React.Component<Props, any> {

    btns: Butn[] = [];

    componentWillMount() {
        const bm = authStore.btnMap;
        
        this.btns = this.props.path ? bm.get(this.props.path) || [] : bm.get(window.location.pathname) || [];
    }

    show = (name: string): boolean => {
        if(app.baseUrl.indexOf("//apitest.emake.cn") >= 0 || app.baseUrl.indexOf("//git.emake.cn") >= 0) {
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

    suffix = (idx: number): string => {
        const str = " |";
        if (idx === this.props.btns.length - 1) {
            return ""
        }
        return str;
    }

    render() {
        const bs = this.props.btns;
        // console.log(bs);
        return (
            <span className="emake-options">
                {
                    bs.map((b, idx) => {
                        return (
                            b.txt.indexOf("删除") === -1 && b.txt.indexOf("冻结") === -1 && b.txt.indexOf("激活") === -1 && b.txt.indexOf("上架") === -1 && b.txt.indexOf("下架") === -1 ? 
                                <a href="javascript: void(0)" style={{ color: (b.disabled || !this.show(b.txt)) ? '#ccc' : (b.color || '#3300FF') }} key={idx}
                                    onClick={(b.disabled || !this.show(b.txt)) ? undefined : b.click}
                                >
                                    {" " + b.txt}
                                    <span style={{ color: '#505050' }}>{this.suffix(idx)}</span>
                                </a>
                                :
                                (b.disabled || !this.show(b.txt)) ? <a href="javascript: void(0)" key={idx} style={{ color: '#ccc' }}>{" " + b.txt}<span style={{ color: '#505050' }}>{this.suffix(idx)}</span></a>
                                    :
                                    <Popconfirm title={this.props.tips ? this.props.tips : "确定" + b.txt + "本条数据？"
                                    } onConfirm={b.click} key={idx} >
                                        <a href="javascript: void(0)" style={{ color: 'red' }}>{" " + b.txt}<span style={{ color: '#505050' }}>{this.suffix(idx)}</span></a>
                                    </Popconfirm>
                        )
                    })
                }
            </span>
        )
    }


}