import * as React from 'react';
import './style.css'
import { Row, Col, Input } from 'antd';
const { TextArea } = Input;
interface Iprops {
    prodLabelCN: string;
    prodLabelTar: string;
    Ival: any;
    isTrue: boolean;
    dis?: boolean;
    max?: number;
    min?: number;
    index?: number;
    l?: number;
    tip?: string;
    input(result?: string, obj?: any, index?: number): void;
}

export class SelfText extends React.Component<Iprops, {}> {
    onChange = (obj: any) => {
        return (e: any) => {
            this.props.input(e.target.value, obj, this.props.index)
        }
    }
    prodLabel = (title: string, id: string, r: boolean): any => {
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

        return (
            <div>
                <Row>
                    <Col span={5}>
                        {this.prodLabel(this.props.prodLabelCN, this.props.prodLabelTar, this.props.isTrue)}
                    </Col>
                    <Col span={19}>
                        {
                            this.props.l ? (
                                <TextArea
                                    disabled={this.props.dis ? this.props.dis : false}
                                    style={{ lineHeight: "25px" }}
                                    placeholder={'请输入' + this.props.prodLabelCN}
                                    value={this.props.Ival}
                                    onChange={this.onChange(this.props.prodLabelTar)}
                                    maxLength={this.props.l}
                                    autosize={{ minRows: this.props.min ? this.props.min : 2, maxRows: this.props.max ? this.props.max : 6 }} />
                            ) : (
                                    <TextArea
                                        disabled={this.props.dis ? this.props.dis : false}
                                        style={{ lineHeight: "25px" }}
                                        placeholder={'请输入' + this.props.prodLabelCN}
                                        value={this.props.Ival}
                                        onChange={this.onChange(this.props.prodLabelTar)}
                                        autosize={{ minRows: this.props.min ? this.props.min : 2, maxRows: this.props.max ? this.props.max : 6 }} />
                                )
                        }
                    </Col>
                    {
                        this.props.tip ? (
                            <Col span={5} />
                        ) : null
                    }
                    {
                        this.props.tip ? (
                            <Col span={19}>
                                <span style={{ color: "red" }}>{this.props.tip}</span>
                            </Col>
                        ) : null
                    }
                </Row>
            </div>
        )
    }
}