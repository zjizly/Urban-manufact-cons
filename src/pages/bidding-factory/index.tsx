import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { BiddingFactoryStore, Item, CompanyDocument, Review, AddCategory } from '../../stores/bidding-factory-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { UImg } from 'src/components/urban-img';
import * as moment from 'moment';
import { Options } from 'src/components/options';
import { Modal, Icon, Row, Col, Divider, Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Upload } from '../../components/urban-upload';
import { UNames, UImgeS, UImgList } from '../../components/urban-ImageShows';
import { UCheck } from '../../components/urban-check';
import { USelect } from '../../components/urban-select';
import { app, Utils } from '../../utils';
import { UInput, UText } from '../../components/urban-input';

interface Iprops {
    biddingFactoryStore: BiddingFactoryStore
}

const cols = (page: BiddingFactory): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
    },
    {
        title: '注册手机号',
        dataIndex: 'MobileNumber',
        align: 'center',
    },
    {
        title: '营业执照',
        render(val, row) {
            return (
                <UImg path={row.CompanyLicenseImg} />
            )
        },
        align: 'center'
    },
    {
        title: '公司名称',
        dataIndex: 'CompanyName',
        className: "company-cell",
        align: 'center'
    },
    {
        title: '申请验厂时间',
        dataIndex: 'AppointmentTime',
        align: 'center',
        render(val, row) {
            return (
                <span> {val ? moment(val).format("YYYY[-]MM[-]DD") : ""} </span>
            )
        },
    },
    {
        title: '品类',
        align: 'center',
        render(val, row) {
            return (
                <span> {page.props.biddingFactoryStore.companyStateMap[row.CompanyState] !== '待申请' ? row.CategoryName : ''} </span>
            )
        },
    },
    {
        title: '审核状态',
        align: 'center',
        render(val, row) {
            return (
                <span> {page.props.biddingFactoryStore.companyStateMap[row.CompanyState]} </span>
            )
        },
    },
    {
        title: '编辑人',
        align: 'center',
        // dataIndex: 'UpdateUserID',
        render(_, row) {
            return (
                <span title={row.UpdateUserID}>{Utils.cut(row.UpdateUserID, 8)} </span>
            )
        },
    },
    {
        title: '编辑时间',
        align: 'center',
        dataIndex: 'UpdateTime',
        render(_, row) {
            return (
                <span> {row.UpdateTime ? app.getdays(row.UpdateTime) : ''} </span>
            )
        },
    },
    {
        title: "操作",
        render: (val, row) => {
            if (row.CompanyState === '1') {
                return <Options btns={[
                    { txt: '详情', click: page.showDetail.bind(BiddingFactory, val) },
                    { txt: '验厂文件', click: page.showFiles.bind(BiddingFactory, val) },
                    { txt: '审核', click: page.showReview.bind(BiddingFactory, val) },
                ]} />
            } else if (row.CompanyState === '2') {
                return <Options btns={[
                    { txt: '详情', click: page.showDetail.bind(BiddingFactory, val) },
                    { txt: '新增品类', click: page.showAddCategory.bind(BiddingFactory, val) },
                    { txt: '编辑', click: page.edit(val) },
                ]} />
            } else if (row.CompanyState === '-2') {
                return <Options btns={[
                    { txt: '详情', click: page.showDetail.bind(BiddingFactory, val) },
                ]} />
            }
            return null;
        },
        align: 'center'
    }
];

@inject("biddingFactoryStore")
@observer
export default class BiddingFactory extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.biddingFactoryStore;
        s.getCategoryA();
        s.key = '';
        s.CompanyState = '';
        s.CAId = '';
        s.getData();
    }
    edit = (v: any) => () => {
        const s = this.props.biddingFactoryStore;
        s.currItem = v;
        s.currItem.CompanyViewLists = JSON.parse(v.CompanyViewList);
        s.editShow = true;
    }
    showDetail = (it: Item) => {
        const s = this.props.biddingFactoryStore;
        s.currItem = it;
        s.currItem.CompanyViewLists = JSON.parse(it.CompanyViewList);
        s.curCompanyDocument = new CompanyDocument();
        s.curCompanyDocument.CompanyID = it.CompanyID;
        s.curCompanyDocument.Certificate = it.Certificate && JSON.parse(it.Certificate) ? JSON.parse(it.Certificate) : [];
        s.curCompanyDocument.Report = it.Report && JSON.parse(it.Report) ? JSON.parse(it.Report) : [];
        s.curCompanyDocument.Authentication = it.Authentication && JSON.parse(it.Authentication) ? JSON.parse(it.Authentication) : [];
        s.curCompanyDocument.Quality = it.Quality && JSON.parse(it.Quality) ? JSON.parse(it.Quality) : [];
        s.detailShow = true;
    }

    showFiles = (it: Item) => {
        const s = this.props.biddingFactoryStore;
        s.curCompanyDocument = new CompanyDocument();
        s.curCompanyDocument.CompanyID = it.CompanyID;
        s.curCompanyDocument.Certificate = it.Certificate && JSON.parse(it.Certificate) ? JSON.parse(it.Certificate) : [];
        s.curCompanyDocument.Report = it.Report && JSON.parse(it.Report) ? JSON.parse(it.Report) : [];
        s.curCompanyDocument.Authentication = it.Authentication && JSON.parse(it.Authentication) ? JSON.parse(it.Authentication) : [];
        s.curCompanyDocument.Quality = it.Quality && JSON.parse(it.Quality) ? JSON.parse(it.Quality) : [];
        s.filesShow = true;
    }

    showReview = (it: Item) => {
        const s = this.props.biddingFactoryStore;
        s.review = new Review();
        s.review.CompanyID = it.CompanyID;
        s.reviewShow = true;
    }

    showAddCategory = (it: Item) => {
        const s = this.props.biddingFactoryStore;
        s.currAddCategory = new AddCategory();
        s.currAddCategory.CompanyID = it.CompanyID;
        s.currItem = it;
        s.currItem.CompanyViewLists = JSON.parse(it.CompanyViewList);
        s.getCategory();
        s.addCategoryShow = true;
    }

    loadedCertificate = (u: any, n: any, s: any) => {
        const store = this.props.biddingFactoryStore;
        store.curCompanyDocument.Certificate.push({ "name": n, 'url': u });
    }

    delCertificate = (s: any) => {
        this.props.biddingFactoryStore.curCompanyDocument.Certificate = s;
    }

    loadedReport = (u: any, n: any, s: any) => {
        const store = this.props.biddingFactoryStore;
        store.curCompanyDocument.Report.push({ "name": n, 'url': u });
    }

    delReport = (s: any) => {
        this.props.biddingFactoryStore.curCompanyDocument.Report = s;
    }

    loadedAuthentication = (u: any, n: any, s: any) => {
        const store = this.props.biddingFactoryStore;
        store.curCompanyDocument.Authentication.push({ "name": n, 'url': u });
    }

    delAuthentication = (s: any) => {
        this.props.biddingFactoryStore.curCompanyDocument.Authentication = s;
    }

    loadedQuality = (u: any, n: any, s: any) => {
        const store = this.props.biddingFactoryStore;
        store.curCompanyDocument.Quality.push({ "name": n, 'url': u });
    }

    delQuality = (s: any) => {
        this.props.biddingFactoryStore.curCompanyDocument.Quality = s;
    }
    RenderCategory = (s: any) => {
        let str = '';
        s.CategoryIDList.forEach((ci: any, idx: any) => {
            if (!idx) {
                str = str + ci.CategoryName;
            } else {
                str = str + ',' + ci.CategoryName;
            }
        });
        return str;
    }
    loadedCompanyLicenseImg = (u: any, n: any, s: any) => {
        const store = this.props.biddingFactoryStore;
        store.currItem.CompanyLicenseImg = u;
    }
    delCompanyLicenseImg = (s: any) => {
        this.props.biddingFactoryStore.currItem.CompanyLicenseImg = '';
    }
    loadedCompanyViewList = (u: any, n: any, s: any) => {
        const store = this.props.biddingFactoryStore;
        store.currItem.CompanyViewLists.push(u);
        store.currItem.CompanyViewList = JSON.stringify(store.currItem.CompanyViewLists);
    }
    delCompanyViewList = (s: any) => {
        this.props.biddingFactoryStore.currItem.CompanyViewLists = s;
        this.props.biddingFactoryStore.currItem.CompanyViewList = JSON.stringify(s);
    }
    render() {
        const s = this.props.biddingFactoryStore;
        return (
            <div className="bidding-factory-page">
                <Modal
                    width={'50%'}
                    title={(<span><Icon type="file-search" />编辑</span>)}
                    visible={s.editShow}
                    onOk={s.editSub}
                    onCancel={s.close}
                >
                    <UInput f={'MobileNumber'} d={s.currItem} Sn='注册手机号' />
                    <UInput f={'Contacter'} d={s.currItem} Sn='联系人' />
                    <Upload f={'CompanyLicenseImg'} d={s.currItem} Sn={'营业执照'}
                        loaded={this.loadedCompanyLicenseImg} show={'图片'} />
                    <UImgeS l={[...[s.currItem.CompanyLicenseImg]]} del={this.delCompanyLicenseImg} />
                    <UInput f={'CompanyName'} d={s.currItem} Sn='工厂名称' />
                    <UInput f={'CompanyAddress'} d={s.currItem} Sn='公司地址' />
                    <UText f={'CompanyDesc'} d={s.currItem} Sn='工厂简介' />
                    <Upload f={'CompanyViewList'} d={s.currItem} Sn={'工厂图片'}
                        loaded={this.loadedCompanyViewList} show={'图片'} />
                    {s.currItem.CompanyViewLists && s.currItem.CompanyViewLists.length ? (
                        <UImgeS l={[...s.currItem.CompanyViewLists]} del={this.delCompanyViewList} />
                    ) : null}
                </Modal>

                <Utable
                    columns={cols(this)}
                    data={s.list}
                    loading={s.loading}
                    paging={{
                        current: s.paging.current,
                        total: s.paging.total,
                        size: s.paging.size,
                        onChange: s.paging.onChange
                    }}
                    search={
                        <SearchList search={s.search}
                            // 下拉选项数据格式
                            SelectList={[
                                {
                                    Name: '行业分类',
                                    Data: [...s.Alist],
                                    check: '',
                                },
                                {
                                    Name: '审核状态',
                                    Data: [
                                        { label: '全部', value: '' },
                                        { label: '待申请', value: '0' },
                                        { label: '申请中', value: '1' },
                                        { label: '审核成功', value: '2' },
                                        { label: '审核失败', value: '-2' },
                                    ],
                                    check: '',
                                },

                            ]}
                        />
                    }
                />

                <Modal
                    width={'50%'}
                    title={(<span><Icon type="file-text" />添加品类</span>)}
                    visible={s.addCategoryShow}
                    onOk={s.addCategory}
                    onCancel={s.close}
                >
                    <Row>
                        <Col span={6} />
                        <Col span={12}>
                            <Row>
                                <Col span={7}><p style={{ textAlign: 'right' }}>所属行业：</p></Col>
                                <Col span={17}><p style={{ textAlign: 'center' }}>{
                                    s.Alist.filter((ais: any) => ais.value === s.currItem.MainCategoryID).length ?
                                        s.Alist.filter((ais: any) => ais.value === s.currItem.MainCategoryID)[0].label : ''
                                }</p></Col>
                            </Row>
                        </Col>
                        <Col span={6} />
                    </Row>
                    <Row>
                        <Col span={6} />
                        <Col span={12}>
                            <Row>
                                <Col span={7}><p style={{ textAlign: 'right' }}>已有品类：</p></Col>
                                <Col span={17}><p style={{ textAlign: 'center' }}>{this.RenderCategory(s.currItem)}</p></Col>
                            </Row>
                        </Col>
                        <Col span={6} />
                    </Row>
                    <UCheck el={24} f={'CategoryIDList'} d={s.currAddCategory} Sn={'可添加品类'} cl={[...s.categoryOptions]} />
                </Modal>

                <Modal
                    title={(<span><Icon type="file-text" />查看详情</span>)}
                    visible={s.detailShow}
                    onOk={s.close}
                    onCancel={s.close}
                    footer={[
                        <Button key='back' type='primary' onClick={s.close}>关闭</Button>,
                    ]}
                >
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>注册手机号：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.MobileNumber}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>联系人：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.Contacter}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>营业执照：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}><UImgList ls={[s.currItem.CompanyLicenseImg]} cl={0}/></p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>工厂名称：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.CompanyName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>公司地址：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.CompanyArea + '-' + s.currItem.CompanyAddress}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>品类：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.CategoryName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>工厂简介：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.CompanyDesc}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>工厂图片：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.CompanyViewList && <UImgList num={2} ls={[...JSON.parse(s.currItem.CompanyViewList)]} cl={1}/>}</p></Col>
                    </Row>
                    <h3><Icon type="file-text" />验厂文件 </h3>
                    <Divider />
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>主营产品资质证书：</p></Col>
                        <Col span={16}><UNames cl={1} l={[...s.curCompanyDocument.Certificate]} del={this.delCertificate} /></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>实验报告：</p></Col>
                        <Col span={16}><UNames cl={1} l={[...s.curCompanyDocument.Report]} del={this.delReport} /></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>企业管理认证体系：</p></Col>
                        <Col span={16}><UNames cl={1} l={[...s.curCompanyDocument.Authentication]} del={this.delAuthentication} /></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>质量管理：</p></Col>
                        <Col span={16}> <UNames cl={1} l={[...s.curCompanyDocument.Quality]} del={this.delQuality} /></Col>
                    </Row>
                    <h3><Icon type="audit" />审核信息 </h3>
                    <Divider />
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>审核结果：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{s.companyStateMap[s.currItem.CompanyState]}</p></Col>
                    </Row>
                    {
                        s.companyStateMap[s.currItem.CompanyState] === '审核失败' ? (
                            <Row>
                                <Col span={8}><p style={{ textAlign: 'right' }}>失败原因：</p></Col>
                                <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.AuditReason}</p></Col>
                            </Row>
                        ) : null
                    }
                    {
                        s.companyStateMap[s.currItem.CompanyState] !== '申请中' ? (
                            <Row>
                                <Col span={8}><p style={{ textAlign: 'right' }}>审核人员：</p></Col>
                                <Col span={16}><p style={{ textAlign: 'center' }}>{s.currItem.ConsoleAuditWho}</p></Col>
                            </Row>
                        ) : null
                    }
                    {
                        s.companyStateMap[s.currItem.CompanyState] !== '申请中' ? (
                            <Row>
                                <Col span={8}><p style={{ textAlign: 'right' }}>审核时间：</p></Col>
                                <Col span={16}><p style={{ textAlign: 'center' }}>{app.getdays(s.currItem.ConsoleAuditTime)}</p></Col>
                            </Row>
                        ) : null
                    }
                </Modal>

                <Modal
                    width={'50%'}
                    title={(<span><Icon type="file-text" />上传验厂文件</span>)}
                    visible={s.filesShow}
                    onOk={s.saveFiles}
                    onCancel={s.close}
                    okText={'确认提交'}
                >
                    <Upload cl={10} f={'Certificate'} d={s.curCompanyDocument} Sn={'主营产品资质证书'} loaded={this.loadedCertificate} show={'文件'} />
                    <UNames cl={10} l={[...s.curCompanyDocument.Certificate]} del={this.delCertificate} />
                    <Upload cl={10} f={'Report'} d={s.curCompanyDocument} Sn={'实验报告'} loaded={this.loadedReport} show={'文件'} />
                    <UNames cl={10} l={[...s.curCompanyDocument.Report]} del={this.delReport} />
                    <Upload cl={10} f={'Authentication'} d={s.curCompanyDocument} Sn={'企业管理认证体系'} loaded={this.loadedAuthentication} show={'文件'} />
                    <UNames cl={10} l={[...s.curCompanyDocument.Authentication]} del={this.delAuthentication} />
                    <Upload cl={10} f={'Quality'} d={s.curCompanyDocument} Sn={'质量管理'} loaded={this.loadedQuality} show={'文件'} />
                    <UNames cl={10} l={[...s.curCompanyDocument.Quality]} del={this.delQuality} />
                </Modal>

                <Modal
                    width={'50%'}
                    title={(<span><Icon type="audit" />审核</span>)}
                    visible={s.reviewShow}
                    onOk={s.saveReview}
                    onCancel={s.close}
                >
                    <USelect Sn={'审核'} f={'CompanyState'} d={s.review} sl={[
                        { label: '审核通过', value: '2' }, { label: '审核不通过', value: '-2' }]} />
                    {/* <Row className='review-content' style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <Col span={24}>
                            <div className="checkbox">
                                <RadioGroup value={s.review.CompanyState} onChange={s.changeStat}>
                                    <Radio value={'2'}>审核通过</Radio>
                                    <Radio value={'-2'}>审核不通过</Radio>
                                </RadioGroup>
                            </div>
                        </Col>
                    </Row> */}
                    {s.review.CompanyState === '-2' ? (
                        <Row>
                            <Col span={6} />
                            <Col span={12}>
                                <Row>
                                    <Col span={7}>
                                        <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                            {"失败原因："}
                                        </div>
                                    </Col>
                                    <Col span={17}>
                                        <TextArea placeholder='请输入失败原因' rows={4} value={s.review.AuditReason} onChange={s.textChange} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6} />
                        </Row>
                    ) : null}

                    {/* <Row className='review-content'>
                        {s.review.CompanyState === '-2' ? (<TextArea rows={4} value={s.review.AuditReason} onChange={s.textChange} />) : null}
                    </Row> */}
                </Modal>

            </div>
        )
    }

}