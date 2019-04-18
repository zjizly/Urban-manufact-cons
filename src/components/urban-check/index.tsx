import * as React from 'react';
import './style.css'
import { Row, Col, Checkbox } from 'antd';

interface Iprops {
    f: string; // 目标属性；
    d: any; // 目标数据；
    Sn?: string; // 输入展示；
    isTrue?: boolean; // 是否必填；
    cl: any[]; // 选项数组；
    dis?: boolean;
    tip?: string;
    el?: number; // 行显示
}
interface State {
}
export class UCheck extends React.Component<Iprops, State> {
    onChange = (o: any) => {
        const s = this.props;
        s.d[s.f] = o;
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
                                <Checkbox.Group
                                    defaultValue={[...s.d[s.f]]}
                                    // value={this.props.Ival}
                                    style={{ width: '100%', marginTop: '3px' }}
                                    onChange={this.onChange}>
                                    <Row>
                                        {
                                            s.cl.map((ds: any, idx: any) => (
                                                <Col span={s.el ? s.el : 12} key={s.f + idx}>
                                                    <Checkbox disabled={s.dis}
                                                        value={ds.value}>{ds.label}</Checkbox>
                                                </Col>
                                            ))
                                        }

                                    </Row>
                                </Checkbox.Group>
                            </Col>
                            {
                                s.tip ? (
                                    <Col span={7} />
                                ) : null
                            }
                            {
                                s.tip ? (
                                    <Col span={17}>
                                        <span style={{ color: "red" }}>{s.tip}</span>
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