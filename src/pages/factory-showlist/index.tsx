import * as React from 'react';
import './style.css';
import { Button, Icon, Drawer, Row, Col, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { FactoryShowlistStore, Item } from '../../stores/factory-showlist-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
// import { SearchBar } from '../../components/search-bar';
import { Options } from '../../components/options';
import { SelfInput } from '../../components/self-input';
import { UploadImg } from '../../components/upload-img';
import { UImg } from '../../components/urban-img';
import { UBack } from '../../components/urban-back';
import { exportExcel } from 'xlsx-oc';
import * as XLSX from "xlsx";

interface Iprops {
    factoryShowlistStore: FactoryShowlistStore
}

const cols = (page: FactoryShowlist): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '工厂名称',
        dataIndex: 'FactoryName',
        key: "FactoryName",
        align: "center",
    },
    {
        title: '工厂地址',
        dataIndex: 'FactoryAddress',
        align: "center",
        key: "FactoryAddress"
    },
    {
        title: '公司图片',
        align: "center",
        key: "FactoryImage",
        render: (t, val) => (
            <UImg path={val.FactoryImage === 'excel无图片' ? '' : val.FactoryImage} />
        )
    },
    {
        title: '工厂主营',
        dataIndex: 'MainCore',
        align: "center",
        key: "MainCore"
    },
    {
        title: '产能',
        dataIndex: 'Capacity',
        align: "center",
        key: "Capacity"
    },
    {
        title: '接单量',
        dataIndex: 'OrderQ',
        align: "center",
        key: "OrderQ"
    },
    {
        title: '累计金额',
        dataIndex: 'AmountMon',
        align: "center",
        key: "AmountMon"
    },
    {
        title: '经度',
        dataIndex: 'Longitude',
        align: "center",
        key: "Longitude"
    },
    {
        title: '纬度',
        dataIndex: 'Latitude',
        align: "center",
        key: "Latitude"
    },
    {
        title: '操作',
        align: "center",
        key: "opera",
        render: (t, val) => (
            < Options super={true} btns={
                [
                    { txt: '编辑', click: page.props.factoryShowlistStore.Add.bind(page, val) },
                    { txt: '删除', click: page.props.factoryShowlistStore.del.bind(page, val) },
                ]} />
        )
    },
];

@inject("factoryShowlistStore")
@observer
export default class FactoryShowlist extends React.Component<Iprops, {}> {
    file: HTMLInputElement;
    constructor(props: any) {
        super(props);
        const path = window.location.pathname;
        const s = this.props.factoryShowlistStore;
        s.curCategory.CategoryId = path.split("/")[2]
    }
    componentWillMount() {
        const s = this.props.factoryShowlistStore;
        const category = s.curCategory;
        s.getData(category);
    }
    getMsg = (t: any, tar: any) => {
        this.props.factoryShowlistStore.currItem[tar] = t;
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
    onUploads = (p: string) => {
        this.props.factoryShowlistStore.currItem.FactoryImage = p;
    }
    exportDefaultExcel = () => {
        const headers: any[] = [
            { k: 'FactoryName', v: '工厂名称' }, { k: 'MainCore', v: '工厂主营' },
            { k: 'Capacity', v: '产能' }, { k: 'OrderQ', v: '接单量' },
            { k: 'AmountMon', v: '累计金额' }, { k: 'FactoryAddress', v: '工厂地址' },
            { k: 'Longitude', v: '经度' }, { k: 'Latitude', v: '纬度' }];
        const dataSource = [{
            FactoryName: "",
            MainCore: "",
            Capacity: "",
            OrderQ: "",
            AmountMon: "",
            FactoryAddress: "",
            Longitude: "",
            Latitude: "",
        }];
        exportExcel(headers, dataSource, '工厂数据表');
    }
    onChange = async () => {
        let p: any = null;
        let formList: any = [];
        let data: any;
        let workbook: any;
        if (this.file.files && this.file.files.length) {
            p = this.file.files[0];
            this.setState({ loading: true });
            const reader = new FileReader();
            reader.readAsBinaryString(p);
            reader.onload = async () => {
                try {
                    data = reader.result,
                        workbook = XLSX.read(data, {
                            type: 'binary'
                        })
                } catch (e) {
                    alert('文件类型不正确');
                    return;
                }
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        formList = formList.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { raw: true, header: 1 }));
                        this.props.factoryShowlistStore.SaveExcel(formList);
                        this.props.factoryShowlistStore.name = p.name;
                    }
                }
            }
        }
    }
    back = () => {
        history.go(-1);
    }
    render() {
        const s = this.props.factoryShowlistStore;
        return (
            <div className="factory-showlist-page">
                <div style={{ padding: '25px' }}>
                    <Row style={{ margin: '14px 0' }}>
                        <Col span={17} />
                        <Col span={3}><Button type="primary" onClick={s.Show}>Excel操作</Button></Col>
                        <Col span={2}><Button type="primary" onClick={s.Add.bind(this, '')}><Icon type="plus" />新建</Button></Col>
                        <Col span={2}><UBack back={this.back} /></Col>
                    </Row>
                    <Utable
                        columns={cols(this)}
                        data={s.list}
                        loading={s.loading}
                        paging={s.paging}
                    // buttons={
                    //     <div>
                    //     </div>
                    // }
                    // search={
                    //     < SearchBar config={s.searchCfg} />
                    // }
                    />
                    < Drawer
                        title={s.title}
                        width={720}
                        placement="right"
                        onClose={s.onClose}
                        maskClosable={false}
                        visible={s.visible}
                        style={{
                            height: 'calc(100% - 55px)',
                            overflow: 'auto',
                            paddingBottom: 53,
                        }}
                    >
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="工厂名称" prodLabelTar="FactoryName"
                                Ival={s.currItem.FactoryName} isTrue={true} input={this.getMsg} />
                        </div>
                        <div className="input_wrap">
                            <Row>
                                <Col span={5}>
                                    {this.prodLabel("工厂图片", "", true)}</Col>
                                <Col span={19}>
                                    < UploadImg tip={'备注：图片大小限制为100KB以内，图片格式支持JPG、PNG，建议图片大小40*40mm'} size={100}
                                        txt="选择图片" loaded={this.onUploads} />
                                </Col>
                                <Col span={5} />
                                <Col span={19}>
                                    {
                                        s.currItem.FactoryImage ? (
                                            <img src={s.currItem.FactoryImage} alt="" style={{ width: "150px", margin: "0 20px" }} />
                                        )
                                            : null
                                    }
                                </Col>
                            </Row>
                        </div>
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="工厂主营" prodLabelTar="MainCore"
                                Ival={s.currItem.MainCore} isTrue={true} input={this.getMsg} />
                        </div>
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="产能" prodLabelTar="Capacity"
                                Ival={s.currItem.Capacity} isTrue={true} input={this.getMsg} />
                        </div>
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="接单量" prodLabelTar="OrderQ"
                                Ival={s.currItem.OrderQ} isTrue={true} input={this.getMsg} />
                        </div>
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="累计金额" prodLabelTar="AmountMon"
                                Ival={s.currItem.AmountMon} isTrue={true} input={this.getMsg} />
                        </div>
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="工厂地址" prodLabelTar="FactoryAddress"
                                Ival={s.currItem.FactoryAddress} isTrue={true} input={this.getMsg} />
                        </div>
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="经度" prodLabelTar="Longitude"
                                Ival={s.currItem.Longitude} isTrue={true} input={this.getMsg} />
                        </div>
                        <div className="input_wrap">
                            <SelfInput prodLabelCN="纬度" prodLabelTar="Latitude"
                                Ival={s.currItem.Latitude} isTrue={true} input={this.getMsg} />
                        </div>
                        < div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                borderTop: '1px solid #e8e8e8',
                                padding: '10px 16px',
                                textAlign: 'right',
                                left: 0,
                                background: '#fff',
                                borderRadius: '0 0 4px 4px',
                            }}
                        >
                            <Button style={{ marginRight: 8, }} onClick={s.onClose} > 取消 </Button>
                            <Button onClick={s.Save} type="primary">提交</Button>
                        </div >
                    </Drawer >
                    <Modal
                        title="Excel操作"
                        visible={s.show}
                        onOk={s.Show}
                        onCancel={s.Show}
                        footer={[
                            <Button key="submit" type="primary" onClick={s.Show}> 返回 </Button>,
                        ]}
                    >
                        <Row>
                            <Col span={3} />
                            <Col span={6}><Button style={{ margin: '0 auto' }} onClick={this.exportDefaultExcel} ><Icon type="folder-open" />下载模板</Button></Col>
                            <Col span={3} />
                            <Col span={6}>
                                <span className="load-file-wrap">
                                    <Icon type="upload" />
                                    <input width="50%" type="file" id={"read-excel"} ref={(r) => this.file = r as HTMLInputElement} onChange={this.onChange} />
                                    <span className="show_file_name">{s.name}</span>
                                </span></Col>
                            <Col span={6} />
                        </Row>
                    </Modal>
                </div>
            </div >
        )
    }

}