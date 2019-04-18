import * as React from 'react';
import { Row, Col, Button } from 'antd';

interface Iprops {
    sub(n: number): void;
}
interface State {
}
export class USub extends React.Component<Iprops, State> {
    Save = (n: any) => () => {
        this.props.sub(n);
    }
    render() {
        // const s = this.props;
        return (
            <div style={{ margin: '14px 0' }}>
                <Row>
                    <Col span={6} />
                    <Col span={12}>
                        <Row>
                            <Col span={7} />
                            <Col span={17}>
                                <div style={{ float: 'right' }}>
                                    <Button style={{ marginRight: '20px' }} type="primary" onClick={this.Save(1)}>保存</Button>
                                    <Button type="danger" onClick={this.Save(0)}>取消</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6} />
                </Row>
            </div>
        )
    }
}