import * as React from 'react';
import './style.css'
import { Row, Col, Select } from 'antd';
const Option = Select.Option;
interface Iprops {
    f: string; // 目标属性；
    d: any; // 目标数据；
    Sn?: string; // 输入展示；
    isTrue?: boolean; // 是否必填；
    sl: any[]; // 选项数组；
    dis?: boolean;
    tip?: string;
    change?(s: string): void;
}
export class USelect extends React.Component<Iprops, {}> {
    handleChange = (val: any) => {
        const s = this.props;
        s.d[s.f] = val;
        if (this.props.change) {
            this.props.change(val);
        }
        this.setState({});
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
                                <Select
                                    value={s.d[s.f]}
                                    defaultValue={s.d[s.f]}
                                    style={{ width: "100%" }}
                                    onChange={this.handleChange}
                                    notFoundContent={"选项为空!"}
                                    disabled={s.dis}>
                                    {
                                        s.sl.map((si: any, i: number) => (
                                            <Option key={si.value + i} value={si.value}>{si.label}</Option>
                                        ))
                                    }
                                </Select>
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