import * as React from 'react';
import './style.css'
import { Row, Col, Input, message } from 'antd';

interface Iprops {
    f: string; // 目标属性；
    d: any; // 目标数据；
    Sn?: string; // 输入展示；
    isTrue?: boolean; // 是否必填；
    dis?: boolean; // 是否有效;
    tip?: string; // 提示信息；
    type?: string; // 输入类型；
    limN?: any; // 字数限制；
    lim?: any; // 输入校验
    limPle?: string; // 输入提示；
    ac?: string;
}
interface State {
    l: string;
}
export class UInput extends React.Component<Iprops, State> {
    constructor(props: Iprops) {
        super(props);
        this.state = {
            l: this.props.d[this.props.f] && this.props.d[this.props.f].toString().length ? this.props.d[this.props.f].toString().length : '0',
        };
    }
    onChange = (e: any) => {
        const s = this.props;
        s.d[s.f] = e.target.value;
        this.setState({ l: s.d[s.f].length.toString() });
    }
    // 校验
    check = () => {
        const s = this.props;
        let str: any;
        if (s.lim) {
            if (s.d[s.f]) {
                switch (s.lim) {
                    case 'tel':
                        str = /^1\d{10}$/;
                        if (!str.test(s.d[s.f])) {
                            message.warn('请输入正确的手机号码!');
                        }; break;
                    case 'ps':
                        if (!(s.d[s.f].length > 5 && s.d[s.f].length < 19)) {
                            message.warn('请输入6-18位的密码!');
                        }; break;
                    case 'e':
                        str = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
                        if (!str.test(s.d[s.f])) {
                            message.warn('请输入正确的邮箱!');
                        }; break;
                }
            }
        }
    }
    prodLabel = (title: string, r: boolean): any => {
        if (r) {
            return (
                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                    <span style={{ color: "red" }}>*</span>
                    {title + "："}
                </div>
            )
        } else {
            return (
                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                    {title + "："}
                </div>
            )
        }
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px 0' }}>
                <Row>
                    <Col span={6} />
                    <Col span={12}>
                        <Row>
                            {
                                s.Sn ? (
                                    <Col span={7}>
                                        {this.prodLabel(s.Sn, s.isTrue ? s.isTrue : false)}
                                    </Col>
                                ) : <Col span={7} />
                            }

                            <Col span={17}>
                                {
                                    s.limN ? (
                                        <Input
                                            defaultValue=''
                                            autoComplete={s.ac ? s.ac : ''}
                                            type={s.type ? s.type : 'text'}
                                            disabled={s.dis ? s.dis : false}
                                            style={{ lineHeight: "25px" }}
                                            id={s.f}
                                            placeholder={s.limPle ? s.limPle : '请输入相应的内容'}
                                            value={s.d[s.f]}
                                            onChange={this.onChange}
                                            onBlur={this.check}
                                            addonAfter={this.state.l + '/' + s.limN}
                                            maxLength={Number(s.limN)}
                                        />
                                    ) : (
                                            <Input
                                                defaultValue=''
                                                autoComplete={s.ac ? s.ac : ''}
                                                type={s.type ? s.type : 'text'}
                                                disabled={s.dis ? s.dis : false}
                                                style={{ lineHeight: "25px" }}
                                                id={s.f}
                                                placeholder={s.limPle ? s.limPle : '请输入相应的内容'}
                                                value={s.d[s.f]}
                                                onChange={this.onChange}
                                                onBlur={this.check}
                                            />
                                        )
                                }

                            </Col>
                            {
                                this.props.tip ? (
                                    <Col span={7} />
                                ) : null
                            }
                            {
                                this.props.tip ? (
                                    <Col span={17}>
                                        <span style={{ color: "red" }}>{this.props.tip}</span>
                                    </Col>
                                ) : null
                            }
                        </Row>
                    </Col>
                    <Col span={6} />
                </Row>
            </div>
        )
    }
}




interface Iiprops {
    f: string; // 目标属性；
    d: any; // 目标数据；
    Sn?: string; // 输入展示；
    isTrue?: boolean; // 是否必填；
    dis?: boolean; // 是否有效;
    tip?: string; // 提示信息；
    type?: string; // 输入类型；
    limN?: any; // 字数限制；
    lim?: any; // 输入校验
    limPle?: string; // 输入提示；
}
interface LiState {
    l: string;
}

const { TextArea } = Input;

export class UText extends React.Component<Iiprops, LiState> {
    constructor(props: Iprops) {
        super(props);
        this.state = {
            l: this.props.d[this.props.f] && this.props.d[this.props.f].toString().length ? this.props.d[this.props.f].toString().length : '0',
        };
    }
    onChange = (e: any) => {
        const s = this.props;
        s.d[s.f] = e.target.value;
        this.setState({ l: s.d[s.f].length.toString() });
    }
    prodLabel = (title: string, r: boolean): any => {
        if (r) {
            return (
                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                    <span style={{ color: "red" }}>*</span>
                    {title + "："}
                </div>
            )
        } else {
            return (
                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                    {title + "："}
                </div>
            )
        }
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px 0' }}>
                <Row>
                    <Col span={6} />
                    <Col span={12}>
                        <Row>
                            {
                                s.Sn ? (
                                    <Col span={7}>
                                        {this.prodLabel(s.Sn, s.isTrue ? s.isTrue : false)}
                                    </Col>
                                ) : <Col span={7} />
                            }

                            <Col span={17}>
                                {
                                    s.limN ? (
                                        <TextArea placeholder={s.limPle ? s.limPle : '请输入相应的内容'}
                                            autosize={{ minRows: 2, maxRows: 6 }}
                                            maxLength={Number(s.limN)}
                                            value={s.d[s.f]}
                                            onChange={this.onChange} />
                                    ) : (
                                            <TextArea placeholder={s.limPle ? s.limPle : '请输入相应的内容'}
                                                autosize={{ minRows: 2, maxRows: 6 }}
                                                value={s.d[s.f]}
                                                onChange={this.onChange} />
                                        )
                                }

                            </Col>
                            {
                                this.props.tip ? (
                                    <Col span={7} />
                                ) : null
                            }
                            {
                                this.props.tip ? (
                                    <Col span={17}>
                                        <span style={{ color: "red" }}>{this.props.tip}</span>
                                    </Col>
                                ) : null
                            }
                        </Row>
                    </Col>
                    <Col span={6} />
                </Row>
            </div>
        )
    }
}