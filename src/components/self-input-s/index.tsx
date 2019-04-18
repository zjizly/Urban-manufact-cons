import * as React from 'react';
import './style.css'
import { Row, Col, Input } from 'antd';

interface Iprops {
    prodLabelCN: string;
    prodLabelTar: string;
    Ival: any;
    isTrue: boolean;
    dis?: boolean;
    index?: number;
    tip?: string;
    type?: string;
    input(result?: string, obj?: any, index?: number): void;
}
interface State {
    l: string;
}
export class SelfInputS extends React.Component<Iprops, State> {
    constructor(props: Iprops) {
        super(props);
        this.state = {
            l: this.props.Ival && this.props.Ival.toString().length ? this.props.Ival.toString().length : '0',
        };
    }
    onChange = (obj: any) => {
        return (e: any) => {
            this.setState({ l: e.target.value.length.toString() });
            this.props.input(e.target.value, obj, this.props.index);
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
                    <Col span={11}>
                        {this.prodLabel(this.props.prodLabelCN, this.props.prodLabelTar, this.props.isTrue)}
                    </Col>
                    <Col span={13}>
                        {
                            <Input
                                type={this.props.type ? this.props.type : 'text'}
                                disabled={this.props.dis ? this.props.dis : false}
                                style={{ lineHeight: "25px" }}
                                id={this.props.prodLabelTar}
                                placeholder={'请输入' + this.props.prodLabelCN}
                                value={this.props.Ival}
                                onChange={this.onChange(this.props.prodLabelTar)}
                            />
                        }
                    </Col>
                    {
                        this.props.tip ? (
                            <Col span={11} />
                        ) : null
                    }
                    {
                        this.props.tip ? (
                            <Col span={13}>
                                <span style={{ color: "red" }}>{this.props.tip}</span>
                            </Col>
                        ) : null
                    }
                </Row>
            </div>
        )
    }
}