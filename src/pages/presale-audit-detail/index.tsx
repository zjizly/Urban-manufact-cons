import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { Row, Col, Divider } from 'antd';
import { PresaleAuditDetailStore } from '../../stores/presale-audit-detail-store';
import { UImg } from '../../components/urban-img';
import { UBack } from '../../components/urban-back';
import { ParametersPriceComponent } from '../../components/parameters-price-component';

interface Props {
    presaleAuditDetailStore: PresaleAuditDetailStore,
    match: any
}

interface InfoProps {
    label: string,
    value: string | string[],
    hidden?: boolean,
}
class Info extends React.Component<InfoProps, any> {
    render() {
        const { label, value } = this.props;
        let arr = false
        if (value instanceof Array) {
            arr = true
        }
        return (
            
            <Row>
                <Col span={6} style={{textAlign:"right"}}>
                    {!this.props.hidden ? <span style={{ color: 'red', fontWeight: 'bold' }}>*  </span> : ''}
                    {label}：
                </Col>
                <Col span={18} style={{textAlign:"left"}}>
                    {
                        arr ? (
                            (value as string[]).map((v, i) => {
                                return (
                                    <a href={v} key={i} target="_blank">
                                        <UImg path={v}/>
                                    </a>
                                )
                            })
                        ) : value
                    }
                </Col>
            </Row>
        )
    }
}

@inject("presaleAuditDetailStore")
@observer
export default class AuditDetail extends React.Component<Props, any> {

    componentWillMount() {
        const s = this.props.presaleAuditDetailStore;
        s.info = JSON.parse(localStorage.getItem('series') || '');
        s.fmtData(s.info);
    }

    back() {
        window.history.go(-1)
    }

    render() {
        const s = this.props.presaleAuditDetailStore;
        if (!s.info || !s.info.GoodsSeriesCode) {
            return s.tip
        }
        return (
            <div className="audit-detail-page">
                <div style={{position: 'relative',paddingTop: '15px'}}>
                    <UBack back={this.back}/>
                </div>

                <div className="info_title">
                    商品基本信息
                </div>
                <Divider/>
                <Info label="商品品类" value={s.info.CategoryName3}  hidden={true}/>
                <Info label="商品名称" value={s.info.GoodsSeriesTitle} hidden={true}/>
                <Info label="商品简称" value={s.info.GoodsSeriesName} hidden={true}/>
                <Info label="商品卖点" value={s.info.GoodsSeriesKeywords} hidden={true}/>
                <Info label="商品配套" value={s.info.GoodsSeriesMatch} hidden={true} />
                <Row>
                    <Col span={6}  style={{textAlign: "right"}}>
                        服务承诺：
                    </Col>
                    <Col span={18} style={{textAlign: "left"}}>
                    {
                        s.info.GoodsSeriesAfterSale.length > 0 ? s.info.GoodsSeriesAfterSale.map((it: string, idx: number) => <p key={idx}><input type="checkbox" defaultChecked={true} />{it}</p>) : "无"
                    }
                    </Col>
                </Row>
            
                <div className="info_title">
                    商品轮播图和详情页
                </div>
                <Divider/>
                {
                    s.info.GoodsKind === '1' ?  <Info label="封面图" value={[s.info.GoodsSurfaceImg]} hidden={true}/> : null
                }
               
                <Info label="商品轮播图" value={s.info.GoodsSeriesPhotos} hidden={true}/>
                <Info label="商品详情页" value={s.info.GoodsSeriesDetail} hidden={true}/>
            
                <div className="info_title">
                    商品参数和规格
                </div>
                <Divider/>
                <Row>
                    <Col span={6} style={{textAlign: "right"}}>
                        商品规格：
                    </Col>
                    <Col span={18} style={{textAlign: "left"}}>
                        {!s.info.GoodsSeriesParams ? '' : s.info.GoodsSeriesParams.map((it, i) => {
                            return <p key={i}><label>{it.ParamName}：</label>{it.ParamValue}</p>
                        })}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign: "right"}}>
                        商品参数：
                    </Col>
                    <Col span={18} style={{textAlign: "left"}}>
                        {
                           s.info.SeriesParams &&  JSON.parse(s.info.SeriesParams).map((si: any) => (
                                // <div key={'si' + si.ParamId} style={{ width: '100%' }}>
                                <Row key={'si' + si.ParamId}>
                                    <Col span={4}><p>{si.ParamName}:</p></Col>
                                    <Col span={20}>
                                        {
                                            si.ParamValueList.map((its: any, idx: number) => (
                                                <span key={idx} style={{ display: 'inline-block', marginRight: '6px', marginBottom: '6px', textAlign: 'center' }}>
                                                    {its.ParamOptionalIcon ? <UImg path={its.ParamOptionalIcon} /> : null}
                                                    <span style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: '12px' }}>{its.ParamOptionalName}</span>
                                                </span>
                                            ))
                                        }
                                    </Col>
                                </Row>
                            ))
                        }
                    </Col>
                </Row>
                <Row style={{ marginBottom: '16px' }}>
                    <Col span={6} style={{textAlign: "right"}}>
                        商品价格：
                    </Col>
                    <Col span={18} style={{textAlign: "left" }}>
                        <ParametersPriceComponent code={s.info.GoodsSeriesCode} isShow={true} menuList={s.info.SeriesParams} productList={s.info.Products}/>
                    </Col>
                </Row>
                <Info label="商品单位" value={s.info.GoodsSeriesUnit} hidden={true}/>
                {
                    s.info.GoodsKind === '1' ? <span> <Info label="众测截止时间" value={s.info.EndTime} hidden={true}/>
                    <Info label="众测总量" value={`${s.info.PresellNum}${s.info.GoodsSeriesUnit}`} hidden={true}/>
                    <Info label="众测定金" value={`${s.info.DepositRate}`} hidden={true}/></span> : null
                }
               
            
            </div>
        )
    }

}