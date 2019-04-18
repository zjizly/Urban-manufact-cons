import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { ArgConfigEditStore } from './arg-config-edit-store';
import { Input, Button, Row, Col } from 'antd';
import { UInput } from '../../../components/urban-input';
import { Upload } from '../../../components/urban-upload';
import { UImgeS } from '../../../components/urban-ImageShows';
import { UBack } from '../../../components/urban-back';

interface Iprops {
    argConfigEditStore: ArgConfigEditStore
}

@inject("argConfigEditStore")
@observer
export default class ArgConfigEdit extends React.Component< Iprops, {} > {

    constructor(props: any) {
        super(props);
        const item = sessionStorage.getItem("item");
        const s = this.props.argConfigEditStore;
        const it = item && JSON.parse(item).data;
        it.CategoryIconArray = [it.CategoryIcon];
        it.BannerIconArray = [it.BannerIcon];
        it.DesignRateMinValue = s.toPercent(it.DesignRateMin);
        it.DesignRateMaxValue = s.toPercent(it.DesignRateMax);
        s.currItem = it;
        s.mTitle = item && JSON.parse(item).mTitle;
    }

    componentWillMount() {
    }
    
    categoryLoaded = (u: any, n: any, s: any) => {
        this.props.argConfigEditStore.currItem.CategoryIconArray[0] = u;
    }

    categoryDel = (s: any) => {
        this.props.argConfigEditStore.currItem.CategoryIconArray = s;
    }

    bannerLoaded = (u: any, n: any, s: any) => {
        this.props.argConfigEditStore.currItem.BannerIconArray[0] = u;
    }

    bannerDel = (s: any) => {
        this.props.argConfigEditStore.currItem.BannerIconArray = s;
    }

    subEdit = () => {
        this.props.argConfigEditStore.editSec();
    }

    back = () => {
        window.history.go(-1);
    }

    onChange = (e: any) => {
        const s = this.props.argConfigEditStore;
        s.currItem.DesignRateMinValue = e.target.value;
    }

    onChange1 = (e: any) => {
        const s = this.props.argConfigEditStore;
        s.currItem.DesignRateMaxValue = e.target.value;
    }
    
    render() {
        const s = this.props.argConfigEditStore;
        return (
            <div className="arg-config-edit-page">
                <div style={{paddingTop: '50px', position: 'relative'}}>
                    <UBack back={this.back} />
                </div>
                <div>
                    <Input.Group>
                        <UInput Sn="行业分类" f="CategoryName" d={s.currItem} isTrue={true} limPle="请输入行业分类，休闲食品"/>
                        <Upload f={'CategoryIconArray'} d={s.currItem} Sn={'分类图片上传'} isTrue={true} loaded={this.categoryLoaded} show={'图片'} tip="备注：图片建议宽120*高120px，大小限制为1M以内，格式支持JPG、PNG等"/>
                        <UImgeS l={[...s.currItem.CategoryIconArray]} del={this.categoryDel}/>
                        <Upload f={'BannerIconArray'} d={s.currItem} Sn={'banner图上传'} isTrue={true} loaded={this.bannerLoaded} show={'图片'} tip="备注：图片建议宽804*高294px，大小限制为1M以内，格式支持JPG、PNG等"/>
                        <UImgeS l={[...s.currItem.BannerIconArray]} del={this.bannerDel}/>
                        <UInput Sn="订单编号(含税)" f="ContractBTypeTax" d={s.currItem} isTrue={true} limPle="请输入订单编号  如：A1"/>
                        <UInput Sn="订单编号(不含税)" f="ContractBTypeNoTax" d={s.currItem} isTrue={true} limPle="请输入订单编号  如：A1"/>
                        <UInput Sn="众测订单编号(含税)" f="PresellContractBTypeTax" d={s.currItem} isTrue={true} limPle="请输入众测订单编号  如：A1"/>
                        <UInput Sn="众测订单编号(不含税)" f="PresellContractBTypeNoTax" d={s.currItem} isTrue={true} limPle="请输入众测订单编号  如：A1"/>
                        {/* <UInput Sn="众测订单定金比例" f="DepositRate" d={s.currItem} isTrue={true} limPle="请输入众测订单定金比例"/>
                        <UInput Sn="常规订单预付款比例" f="Advance" d={s.currItem} isTrue={true} limPle="请输入常规订单预付款比例"/>
                        <UInput Sn="众测订单预付款比例" f="PresellAdvance" d={s.currItem} isTrue={true} limPle="请输入众测订单预付款比例"/> */}
                        <UInput Sn="排序" f="OrderTag" d={s.currItem} isTrue={true} limPle="请输入序号"/>
                        <Row>
                            <Col span={6}/>
                            <Col span={12}>
                                <Col span={7}>
                                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                    <span style={{ color: "red" }}>*</span>
                                    {"设计师分成比例区间："}
                                </div>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        defaultValue=''
                                        style={{ lineHeight: "25px" }}
                                        placeholder={'最小值'}
                                        value={s.currItem.DesignRateMinValue}
                                        onChange={this.onChange}
                                    />
                                    {/* <UInput f="DesignRateMin" d={s.currItem} limPle="最小值"/> */}
                                </Col>
                                <Col span={1}>
                                <div style={{textAlign:"center"}}>~</div>
                                </Col>
                                <Col span={8}>
                                    <Input
                                        defaultValue=''
                                        style={{ lineHeight: "25px" }}
                                        placeholder={'最大值'}
                                        value={s.currItem.DesignRateMaxValue}
                                        onChange={this.onChange1}
                                    />
                                    {/* <UInput f="DesignRateMax" d={s.currItem} limPle="最大值"/> */}
                                </Col>
                            </Col>
                            <Col span={6}/>
                            
                        </Row>
                    </Input.Group>
                </div>
                <div style={{width: '100%',textAlign: 'center',paddingTop: 20}}>
                    <Button style={{ marginRight: 8 }} onClick={this.subEdit.bind(ArgConfigEdit)} type="primary">确认</Button>
                    <Button onClick={this.back}>取消</Button>
                </div>
            </div>
        )
    }

}