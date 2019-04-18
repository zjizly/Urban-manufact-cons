import * as React from 'react';
import './style.css';
import { Row, Col, Card, Button, Radio } from 'antd';
import { inject, observer } from 'mobx-react';
import { StatisticalStore, SaleroomStatistics } from '../../stores/statistical-store';
import { SelfInputS } from '../../components/self-input-s';
import { Link } from 'react-router-dom';

interface Iprops {
    statisticalStore: StatisticalStore
}

@inject("statisticalStore")
@observer
export default class Statistical extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.statisticalStore;
        // s.getCate();
        s.getData();
    }
    getMsg = (t: any, tar: any) => {
        const a = tar.split('/');
        const s = this.props.statisticalStore;
        const n = s.ShowTable.filter((si: any) => si.CategoryBName === a[0]);
        n[0][a[1]] = t;
    }
    del = (ts: SaleroomStatistics, i: number) => {
        const isAdd = ts.isAdd;
        const s = this.props.statisticalStore;
        if (isAdd) {
            s.ShowTable.splice(i, 1);
        } else {
            s.curItem = ts;
            s.del();
        }
    }
    add = () => {
        const s = this.props.statisticalStore;
        const it = new SaleroomStatistics();
        it.isAdd = true;
        it.DataType = s.Type;
        it.Region = '';
        s.ShowTable.push(it);
    }
    render() {
        const s = this.props.statisticalStore;
        const filterShowTable = s.ShowTable.filter((ts: any) => ts.CategoryBId !== '123456' && ts.CategoryBName !== '设计师用户数' && ts.CategoryBName !== '工厂数');
        return (
            <div className="statistical-page">
                <div style={{ padding: '25px' }}>
                    <Row>
                        <Col span={16} >
                            <Radio.Group defaultValue="0" buttonStyle="solid" onChange={s.ChangeType}>
                                <Radio.Button value="0">当前值</Radio.Button>
                                <Radio.Button value="1">出厂值</Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col span={4} />
                        <Col span={2}>
                            <Button type='primary' onClick={s.Save}>提交</Button>
                        </Col>
                        {/* <Col span={4}>
                        <Button type='primary' onClick={s.Reset}>恢复出厂设置</Button>
                    </Col> */}
                        <Col span={2}>
                            <Button type='primary' onClick={this.add}>新增品类</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Card title="用户统计" bordered={false} style={{ width: '100%' }}>
                                <Row>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="普通用户总数" prodLabelTar="总用户/VipSum"
                                            Ival={
                                                s.ShowTable.filter((si: any) => si.CategoryBId === '123456').length && s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipSum ?
                                                    s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipSum : 0
                                            } isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    {/* <Col span={24}>
                                    <SelfInputS prodLabelCN="当月增长普通用户数" prodLabelTar="123456/VipCurMonAdd"
                                        Ival={s.ShowTable.filter((si: any) => si.CategoryBId === '123456').length && s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipCurMonAdd ?
                                            s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipCurMonAdd : 0} isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={24}>
                                    <SelfInputS prodLabelCN="环比增长率" prodLabelTar="123456/VipRate"
                                        Ival={s.ShowTable.filter((si: any) => si.CategoryBId === '123456').length && s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipRate ?
                                            s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipRate : 0} isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col> */}
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="数据跟新时间" prodLabelTar="总用户/VipIntervalM"
                                            Ival={s.ShowTable.filter((si: any) => si.CategoryBId === '123456').length && s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipIntervalM ?
                                                s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipIntervalM : 0} isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="增长数量" prodLabelTar="总用户/VipAddNum"
                                            Ival={s.ShowTable.filter((si: any) => si.CategoryBId === '123456').length && s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipAddNum ?
                                                s.ShowTable.filter((si: any) => si.CategoryBId === '123456')[0].VipAddNum : 0} isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={24} />
                                </Row>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="设计师用户" bordered={false} style={{ width: '100%' }}>
                                <Row>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="设计师用户总数" prodLabelTar="设计师用户数/VipSum"
                                            Ival={
                                                s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipSum ?
                                                    s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipSum : 0
                                            } isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    {/* <Col span={24}>
                                    <SelfInputS prodLabelCN="当月增长普通用户数" prodLabelTar="设计师用户数/VipCurMonAdd"
                                        Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipCurMonAdd ?
                                            s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipCurMonAdd : 0} isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={24}>
                                    <SelfInputS prodLabelCN="环比增长率" prodLabelTar='设计师用户数/VipRate'
                                        Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipRate ?
                                            s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipRate : 0} isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col> */}
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="数据跟新时间" prodLabelTar='设计师用户数/VipIntervalM'
                                            Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipIntervalM ?
                                                s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipIntervalM : 0} isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="增长数量" prodLabelTar='设计师用户数/VipAddNum'
                                            Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipAddNum ?
                                                s.ShowTable.filter((si: any) => si.CategoryBName === '设计师用户数')[0].VipAddNum : 0} isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={24} />
                                </Row>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="工厂数" bordered={false} style={{ width: '100%' }}>
                                <Row>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="工厂数总数" prodLabelTar="工厂数/VipSum"
                                            Ival={
                                                s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipSum ?
                                                    s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipSum : 0
                                            } isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    {/* <Col span={24}>
                                    <SelfInputS prodLabelCN="当月增长普通用户数" prodLabelTar="工厂数/VipCurMonAdd"
                                        Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipCurMonAdd ?
                                            s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipCurMonAdd : 0} isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={24}>
                                    <SelfInputS prodLabelCN="环比增长率" prodLabelTar='工厂数/VipRate'
                                        Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipRate ?
                                            s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipRate : 0} isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col> */}
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="数据跟新时间" prodLabelTar='工厂数/VipIntervalM'
                                            Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipIntervalM ?
                                                s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipIntervalM : 0} isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <SelfInputS prodLabelCN="增长数量" prodLabelTar='工厂数/VipAddNum'
                                            Ival={s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数').length && s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipAddNum ?
                                                s.ShowTable.filter((si: any) => si.CategoryBName === '工厂数')[0].VipAddNum : 0} isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={24} />
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    {
                        filterShowTable.map((ts: any, idx: number) =>
                            // s.tabeData.map((ts: any) => (
                            <Card key={ts.CategoryBId} title={"品类:" + (ts.isAdd ? "新增品类" : ts.CategoryBName
                            )} bordered={false} style={{ width: '100%' }}>
                                <Row style={{ marginBottom: '14px' }}>
                                    <Col span={20} />
                                    <Col span={2} >
                                        <Button type='primary' onClick={this.del.bind(Statistical, ts, idx)}>删除</Button>
                                    </Col>
                                    <Col span={2}>
                                        <Button type='primary'><Link to={`./factoryShowlist/${ts.CategoryBId}`}>配置</Link></Button>
                                    </Col>
                                </Row>
                                {
                                    ts.isAdd ?
                                        <Row>
                                            <Col span={8}>
                                                <SelfInputS prodLabelCN="品类名称" prodLabelTar={ts.CategoryBName + "/CategoryBName"}
                                                    Ival={ts.CategoryBName}
                                                    isTrue={false} input={this.getMsg} type='string'
                                                />
                                            </Col>
                                        </Row> : null
                                }

                                {/* <Row>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="会员数量" prodLabelTar={ts.CategoryBName + "/VipSum"}
                                        Ival={ts.VipSum}
                                        // Ival={
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipSum ?
                                        //         s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipSum : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="当月会员增长数" prodLabelTar={ts.CategoryBName + "/VipCurMonAdd"}
                                        Ival={ts.VipCurMonAdd}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipCurMonAdd ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipCurMonAdd : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="会员环比增长率" prodLabelTar={ts.CategoryBName + "/VipRate"}
                                        Ival={ts.VipRate}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipRate ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipRate : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                            </Row> */}
                                <Row>
                                    {/* <Col span={8}>
                                    <SelfInputS prodLabelCN="数据跟新间隔" prodLabelTar={ts.CategoryBName + "/VipIntervalM"}
                                        Ival={ts.VipIntervalM}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipIntervalM ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipIntervalM : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="增长量" prodLabelTar={ts.CategoryBName + "/VipAddNum"}
                                        Ival={ts.VipAddNum}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipAddNum ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].VipAddNum : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col> */}

                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <SelfInputS prodLabelCN="销售额" prodLabelTar={ts.CategoryBName + "/SaleSum"}
                                            Ival={ts.SaleSum}
                                            // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleSum ?
                                            //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleSum : 0}
                                            isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <SelfInputS prodLabelCN="当月销售额" prodLabelTar={ts.CategoryBName + "/SaleCurMonAdd"}
                                            Ival={ts.SaleCurMonAdd}
                                            // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleCurMonAdd ?
                                            //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleCurMonAdd : 0}
                                            isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <SelfInputS prodLabelCN="销售额环比增长率" prodLabelTar={ts.CategoryBName + "/SaleRate"}
                                            Ival={ts.SaleRate}
                                            // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleRate ?
                                            //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleRate : 0}
                                            isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <SelfInputS prodLabelCN="数据跟新间隔" prodLabelTar={ts.CategoryBName + "/SaleIntervalM"}
                                            Ival={ts.SaleIntervalM}
                                            // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleIntervalM ?
                                            //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleIntervalM : 0}
                                            isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <SelfInputS prodLabelCN="增长数量" prodLabelTar={ts.CategoryBName + "/SaleAddNum"}
                                            Ival={ts.SaleAddNum}
                                            // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleAddNum ?
                                            //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].SaleAddNum : 0}
                                            isTrue={false} input={this.getMsg} type='number'
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <SelfInputS prodLabelCN="地区" prodLabelTar={ts.CategoryBName + "/Region"}
                                            Ival={ts.Region}
                                            // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].Region ?
                                            //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].Region : ""}
                                            isTrue={false} input={this.getMsg}
                                        />
                                    </Col>
                                    {/* <Col span={8}>
                                    <SelfInputS prodLabelCN="经度" prodLabelTar={ts.CategoryBName + "/Longitude"}
                                        Ival={ts.Longitude}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].Longitude ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].Longitude : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col> */}
                                </Row>
                                {/* <Row>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="分布式车间数" prodLabelTar={ts.CategoryBName + "/WorkShopSum"}
                                        Ival={ts.WorkShopSum}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopSum ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopSum : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="当月车间数" prodLabelTar={ts.CategoryBName + "/WorkShopCurMonAdd"}
                                        Ival={ts.WorkShopCurMonAdd}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopCurMonAdd ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopCurMonAdd : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="车间环比增长率" prodLabelTar={ts.CategoryBName + "/WorkShopRate"}
                                        Ival={ts.WorkShopRate}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopRate ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopRate : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="数据跟新间隔" prodLabelTar={ts.CategoryBName + "/WorkShopIntervalM"}
                                        Ival={ts.WorkShopIntervalM}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopIntervalM ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopIntervalM : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="增长数量" prodLabelTar={ts.CategoryBName + "/WorkShopAddNum"}
                                        Ival={ts.WorkShopAddNum}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopAddNum ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].WorkShopAddNum : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                                <Col span={8}>
                                    <SelfInputS prodLabelCN="纬度" prodLabelTar={ts.CategoryBName + "/Latitude"}
                                        Ival={ts.Latitude}
                                        // Ival={s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId).length && s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].Latitude ?
                                        //     s.ShowTable.filter((si: any) => si.CategoryBId === ts.CategoryId)[0].Latitude : 0}
                                        isTrue={false} input={this.getMsg} type='number'
                                    />
                                </Col>
                            </Row> */}
                            </Card>
                        )
                    }
                </div>
            </div >
        )
    }

}