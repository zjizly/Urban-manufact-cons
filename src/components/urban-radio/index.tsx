import * as React from 'react';
import './style.css'
// Input, 
import { Row, Col, Radio } from 'antd';
const RadioGroup = Radio.Group;
interface Iprops {
    f: string; // 目标属性；
    d: any; // 目标数据；
    Sn?: string; // 输入展示；
    isTrue?: boolean; // 是否必填；
    rl: any[]; // 选项数组；
    dis?: boolean;
    tip?: string;
    change?(s: string) :void;
}

export class URadio extends React.Component<Iprops, {}> {
    onChange = (e: any) => {
        const s = this.props;
        s.d[s.f] = e.target.value;
        if(this.props.change) {
            this.props.change(e.target.value);
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
                                <RadioGroup
                                    disabled={s.dis ? s.dis : false}
                                    style={{ width: "100%", display: "flex" }}
                                    onChange={this.onChange}
                                    defaultValue={s.d[s.f]}
                                // value={s.d[s.f]}
                                >
                                    {
                                        s.rl.map((rs: any, idx: any) => (
                                            <Radio key={idx + rs.value}
                                                style={{ lineHeight: "32px", flex: "1" }}
                                                value={rs.value}>{rs.label}</Radio>
                                        ))
                                    }
                                </RadioGroup>
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