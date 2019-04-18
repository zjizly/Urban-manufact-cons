import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { AuthenticatedUserStore, Item } from '../../stores/authenticated-user-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { SearchList } from '../../components/search-list';
import { Options } from 'src/components/options';
import { app } from '../../utils';
import { Modal, Row, Col, Icon, Input } from 'antd';
import { UDate } from '../../components/urban-date';
import { UImgList } from '../../components/urban-ImageShows';


interface Iprops {
    authenticatedUserStore: AuthenticatedUserStore
}

const cols = ( page: AuthenticatedUser ): ( ColumnProps< Item >[] ) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: 'center',
    },
    {
        title: '用户手机号',
        dataIndex: 'MobileNumber',
        key: "MobileNumber",
        align: 'center',
    },
    {
        title: '昵称',
        dataIndex: 'NickName',
        key: "NickName",
        align: 'center',
    },
    {
        title: '姓名',
        dataIndex: 'RealName',
        key: "RealName",
        align: 'center',
    },
    {
        title: '性别',
        key: "Sex",
        align: 'center',
        render(_ ,val) {
            return val.Sex === '' ? '保密' : val.Sex
        }   
    },
    {
        title: '城市',
        dataIndex: 'City',
        key: "City",
        align: 'center',
    },
    {
        title: '认证类型',
        key: "IsCompany",
        align: 'center',
        render: (t, val) => (
            <span>
                {val.IsCompany === '1' ? "企业" : "个人"}
            </span>
        )
    },
    {
        title: '认证时间',
        key: "AuthTime",
        align: 'center',
        render: (t, val) => (
            <span>
                {val.AuthTime && app.getdays(val.AuthTime)}
            </span>
        )
    },
    {
        title: "操作",
        align: "center",
        render: (t, val) => (
            <Options btns={
                [
                    { txt: '认证资料', click: page.Show.bind(AuthenticatedUser, val) },
                ]} />
        )
    }
];

@inject("authenticatedUserStore")
@observer
export default class AuthenticatedUser extends React.Component< Iprops, {} > {

    componentWillMount() {
        const s = this.props.authenticatedUserStore;
        s.key = '';
        s.IsBusiness = '';
        s.time = [];
        s.getData();
    }

    Show = (v: any) => {
        Modal.info({
            title: v.IsCompany === '1' ? <span><Icon type="file-protect" />认证资料(企业)</span> : <span><Icon type="file-protect" />认证资料(个人)</span>,
            content: (
                <div>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>手机号：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{v.MobileNumber}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>姓名：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{v.RealName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>性别：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{ v.Sex === '' ? '保密' : v.Sex}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>昵称：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{v.NickName}</p></Col>
                    </Row>
                    <Row>
                        <Col span={8}><p style={{ textAlign: 'right' }}>地区：</p></Col>
                        <Col span={16}><p style={{ textAlign: 'center' }}>{`${v.Province}${v.Province ? '-': ''}${v.City}`}</p></Col>
                    </Row>

                    {v.IsCompany === '1' ? (
                        <span>
                            <Row>
                                <Col span={8}><p style={{ textAlign: 'right' }}>公司名称：</p></Col>
                                <Col span={16}><p style={{ textAlign: 'center' }}>{v.Company}</p></Col>
                            </Row>
                            <Row>
                                <Col span={8}><p style={{ textAlign: 'right' }}>营业执照：</p></Col>
                                <Col span={16}>
                                    <p style={{ textAlign: 'center' }}>
                                        {
                                            Boolean(v.License) ? <UImgList ls={JSON.parse(v.License)}/> : null
                                        }
                                    </p>
                                </Col>
                            </Row>
                        </span>
                    ) : (
                        <span>
                            <Row>
                                <Col span={8}><p style={{ textAlign: 'right' }}>标签：</p></Col>
                                <Col span={16}><p style={{ textAlign: 'center' }}>{JSON.parse(v.Tag).join("、")}</p></Col>
                            </Row>
                        </span>
                    )}
                </div>
            ),
            onOk() { },
        });
    }

    // 新建
    setLabel=async ()=>{
        const s = this.props.authenticatedUserStore; 
        await s.getuserauthidlist();
        s.isLabelShow = true;
    }

    handleCancel=()=>{
       const s = this.props.authenticatedUserStore;
       s.isLabelShow = false;
    }

    delLabel = (idx: number) => {
        const s = this.props.authenticatedUserStore;
        s.labels.splice(idx, 1);
    }

    saveLabels = () => {
        const s = this.props.authenticatedUserStore;
        s.saveLabels();
    }

    onChange = (e: any) => {
        const s = this.props.authenticatedUserStore;
        s.currLabel.label = e.target.value;
    }

    render() {
        const s = this.props.authenticatedUserStore;
        return (
            <div className="authenticated-user-page">

                <Utable 
                columns={ cols(this) }
                data={ s.list }
                loading={ s.loading }
                paging={ {
                                current: s.paging.current,
                                total: s.paging.total,
                                size: s.paging.size,
                                onChange: s.paging.onChange
                            } }
                buttons = {
                    // <CreateBtn click={this.create} />
                    <Options btns={[
                                   { txt: '标签设置', click: this.setLabel }
                               ]} />
                }
                search = {
                     <SearchList search={s.search}

                     // 下拉选项数据格式
                       SelectList={[
                                       {
                                           Name: '认证类型',
                                           Data: [
                                               { label: '全部', value: '' },
                                               { label: '个人', value: '0' },
                                               { label: '企业', value: '1' },
                                           ],
                                           check: '',
                                       },
                       ]}
                       other={
                        <div style={{ height:'21px', display: 'inline-block', width: '400px' }}><UDate time={s.time} Sn={'认证时间'} change={s.change}/></div>
                        }
                     />
                }
                />


                <Modal
                    title={(<span><Icon type="setting" />创建标签</span>)} 
                    visible={s.isLabelShow}
                    onOk={this.saveLabels}
                    onCancel={this.handleCancel}
                    width={500}
                    >
                    <div>
                        <Row style={{paddingBottom: '20px'}}>
                            <Col span={4}>
                                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                                    { "标签名称："}
                                </div>
                            </Col>
                            <Col span={20}>
                                <Input
                                    style={{ lineHeight: "25px" }}
                                    placeholder={'请输入标签名称'}
                                    value={s.currLabel.label}
                                    onChange={this.onChange}
                                />
                            </Col>
                        </Row>

                        {s.labels.map((it: string, idx: number) => {
                            return <span key={idx}>
                                    <span className="label">{it}<span onClick={this.delLabel.bind(AuthenticatedUser, idx)}><Icon type="close-circle" /></span></span>
                                </span>
                        })}
                    </div>
                </Modal>

            </div>
        )
    }

}