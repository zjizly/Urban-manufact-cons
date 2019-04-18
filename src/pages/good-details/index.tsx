import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { GoodDetailsStore, } from '../../stores/good-details-store';
import { Row, Col, Divider } from 'antd';
import { UBack } from '../../components/urban-back';
import { UImg } from '../../components/urban-img';

interface Iprops {
    goodDetailsStore: GoodDetailsStore
}

@inject("goodDetailsStore")
@observer
export default class GoodDetails extends React.Component< Iprops, {} > {

    componentWillMount() {
       
       const s = this.props.goodDetailsStore;
       const good =  sessionStorage.getItem("designGood");
       s.currItem = good ? JSON.parse(good) : '';
    }
    
    back=()=>{
        window.history.go(-1);
    }

    render() {
        const s = this.props.goodDetailsStore;
        const it = s.currItem;
        return (
            <div className="good-details-page">
                <div style={{position: 'relative',paddingTop: '15px'}}>
                    <UBack back={this.back}/>
                </div>
                
                <div className="basic_info">
                    <div className="info_title">
                        基本信息
                    </div>
                    <Divider/>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>选择品类：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}>{`${it.CategoryName1}|${it.CategoryName2}|${it.CategoryName3}` }</p></Col>
                    </Row>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>品牌名称：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}>{it.BrandName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>品牌图片：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}>{it.BrandViewList.map((item: any, idx: number) => <span key={idx} style={{paddingRight: 5}}><UImg path={item.Url}/></span>)}</p></Col>
                    </Row>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>品牌文化：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}><span style={{whiteSpace: "normal", display: 'inline-block', width: '100%', wordWrap: 'break-word'}}>{it.BrandCulture}</span></p></Col>
                    </Row>

                    <div className="info_title">
                        产品设计
                    </div>
                    <Divider/>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>产品设计名称：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}>{it.GoodsSeriesTitle}</p></Col>
                    </Row>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>产品设计展示图：</p></Col>
                        <Col span={18}>{it.ViewList.map((item: any, idx: number) => <Col span={2} key={idx}><Row><UImg  path={item.Url}/></Row><Row>{item.Name}</Row></Col>)}</Col>
                    </Row>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>设计说明：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}><span style={{whiteSpace: "normal", display: 'inline-block', width: '100%', wordWrap: 'break-word'}}>{it.DesignDesc}</span></p></Col>
                    </Row>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>产品设计文件：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}>{it.DesignFileList.map((item: any, idx: number) => <a key={idx} target="_blank" href={item.Url}>{item.Name}</a>)}</p></Col>
                    </Row>
                    <div className="info_title">
                        商务说明
                    </div> 
                    <Divider/>
                    <Row>
                        <Col span={6}><p style={{ textAlign: 'right' }}>设计师分成比例：</p></Col>
                        <Col span={18}><p style={{ textAlign: 'left' }}>{`${it.DesignRate*100}%`}</p></Col>
                    </Row>

                </div>

            </div>
        )
    }

}