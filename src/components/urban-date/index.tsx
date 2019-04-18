import * as React from 'react';
import './style.css'
import { Row, Col, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

interface Iprops {
    time: any[];
    Sn?: string; // 输入展示；
    change?(): void;
}

export class UDate extends React.Component<Iprops, {}> {
    constructor(props: Iprops) {
        super(props);
        this.state = {};
    }
    onChange = (date: any, ds: any) => {
        const s = this.props;
        s.time.splice(0, 2);
        if (ds.length) {
            s.time.push(ds[0]);
            s.time.push(ds[1]);
        }
        if(s.change) {
            s.change();
        }
    }
    render() {
        const s = this.props;
        return (
            <div>
                <Row>
                    {
                        s.Sn ? (
                            <Col span={5}>
                                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                    {s.Sn + '：'}
                                </div>
                            </Col>
                        ) : <Col span={5} />
                    }
                    <Col span={19}>
                        <RangePicker onChange={this.onChange} />
                    </Col>
                </Row>
            </div>
        )
    }
}
