import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { GoodPropsalStore, Item } from '../../stores/good-propsal-store';
import { Card, Col, Row, Badge, Icon } from 'antd';
import { UBack } from '../../components/urban-back';
import { Utils } from '../../utils';
import { UImgList } from '../../components/urban-ImageShows';

interface Iprops {
    goodPropsalStore: GoodPropsalStore
}

@inject("goodPropsalStore")
@observer
export default class GoodPropsal extends React.Component<Iprops, {}> {

    constructor(props: any) {
        super(props);
        const path = window.location.pathname;
        const s = this.props.goodPropsalStore;
        s.GoodsSeriesCode = path.split('/')[2];
        s.state = path.split('/')[3];
    }

    componentWillMount() {
        const s = this.props.goodPropsalStore;
        s.getData();
    }

    back = () => {
        window.history.go(-1);
    }

    render() {
        const s = this.props.goodPropsalStore;
        return (
            <div className="good-propsal-page">
                <div style={{ position: 'relative', paddingTop: '15px', paddingBottom: '15px' }}>
                    <UBack back={this.back} />
                </div>
                {s.tableData.length > 0 ? s.tableData.map((it: Item, idx: number) =>
                    <Col key={idx} span={12} style={{ padding: 5, backgroundColor: '#FFF' }}>
                        <Card bordered={false} style={{ backgroundColor: '#F2F2F2', height: '300px' }}>
                            <Col span={1}>
                                <Badge count={idx + 1} style={{ backgroundColor: '#ccc', color: 'black' }} />
                            </Col>
                            <Col span={22}>
                                <Row>
                                    <Col span={4} style={{ textAlign: "right" }}>工厂名称：</Col>
                                    <Col span={20}>{it.CompanyName}</Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{ textAlign: "right" }}>工厂简介：</Col>
                                    <Col span={20}><span style={{ whiteSpace: "normal", display: 'inline-block', width: '100%', wordWrap: 'break-word' }} title={it.CompanyDesc}>{Utils.cut(it.CompanyDesc, 100)}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{ textAlign: "right" }}>工厂图片：</Col>
                                    <Col span={20}><UImgList num={3} ls={[...it.CompanyViewList]} cl={idx} /></Col>
                                    {/* <Col span={20}>{it.CompanyViewList.map((it1: string, idx1: number) => <span key={idx1} style={{paddingRight: 5}}><UImg path={it1}/></span>)}</Col> */}
                                </Row>
                                <Row>
                                    <Col span={4} style={{ textAlign: "right" }}>选择时间：</Col>
                                    <Col span={20}>{it.EditTime}</Col>
                                </Row>
                            </Col>
                            <Col span={1} style={{ height: '200px', lineHeight: '400px' }}>
                                {
                                    s.state === '1' ? <div>
                                        {
                                            idx === 0 ? <span style={{ fontSize: '30px' }}><Icon type="check-circle" style={{ color: 'red' }} /></span> : <span />
                                        }
                                    </div> : null
                                }

                            </Col>
                        </Card>
                    </Col>
                ) : <div style={{ textAlign: 'center', width: '100%', lineHeight: '500px' }}>暂无方案</div>}

            </div>
        )
    }

}