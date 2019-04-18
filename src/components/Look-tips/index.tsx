import * as React from 'react';
// Icon
import { Modal, message } from 'antd';

interface Props {
    list?: any;
    showTips?: any;
    showContent?: any;
    show?: any;
}
export class Tips extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }
    tipsShow = () => {
        if (!this.props.showContent) {
            message.warn('该模块尚未配置功能说明，请联系管理员配置后查看！');
            return;
        }
        const List = this.props.showContent.split('<br/>');
        Modal.info({
            title: this.props.showTips,
            content: (
                <div>
                    {
                        List.map((ls: any, idx: number) => (
                            <p key={idx}>{ls}</p>
                        ))
                    }
                </div>
            ),
            onOk() { },
        });
    }
    render() {
        return (
            <div onClick={this.tipsShow} style={{
                display: 'inline-block', float: "right", lineHeight: '45px'
            }}>
                {this.props.show}
            </ div>
        )
    }
}