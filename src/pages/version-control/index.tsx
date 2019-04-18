import * as React from 'react';
import './style.css';
import { Modal, Form, Icon, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { VersionControlStore, Item } from '../../stores/version-control-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { Options } from '../../components/options';
import { UInput } from '../../components/urban-input';
import { USelect } from '../../components/urban-select';
import TextArea from 'antd/lib/input/TextArea';
import { Utils } from '../../utils';
import { SearchList } from 'src/components/search-list';
import { Upload } from 'src/components/urban-upload';


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};


interface Iprops {
    versionControlStore: VersionControlStore
}

const cols = (page: VersionControl): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        key: "index"
    },
    {
        title: '类别',
        align: 'center',
        key: "app_type",
        render: (_, val) => {
            return <span>{val.app_type === '1' ? 'IOS用户APP' :
                (val.app_type === '2' ? '安卓用户APP' : (
                    val.app_type === '3' ? 'IOS客服' : (
                        val.app_type === '4' ? '安卓客服' : (
                            val.app_type === '5' ? 'IOS省域' : (
                                val.app_type === '6' ? '安卓省域' : ''
                            )
                        )
                    )
                ))
            }</span>
        }
    },
    {
        title: '版本号',
        dataIndex: 'app_version',
        align: 'center',
        key: "app_version"
    },
    {
        title: '更新说明',
        align: 'center',
        key: "update_text",
        render(_, row) {
            return <span title={row.update_text}>{Utils.cut(row.update_text, 15)}</span>
        }
    },
    {
        title: '更新数据库',
        align: "center",
        key: 'isNeedClearFMDB',
        render(_, row) {
            return row.isNeedClearFMDB === '0' ? '不更新数据库' : '更新数据库'
        }
    },
    {
        title: '展示付款信息',
        align: "center",
        key: 'is_payment',
        render(_, row) {
            return row.is_payment === '0' ? '不展示' : '展示'
        }
    },
    {
        title: '更新方式',
        align: "center",
        key: 'is_update',
        render(_, row) {
            return row.is_update === '0' ? '不更新' : row.is_update === '1' ? '不强制更新' : '强制更新'
        }
    },
    {
        title: '支付方式设置',
        align: "center",
        dataIndex: 'payStyle',
        render: (_, row) => (
            <Options btns={[
                { txt: '查看', click: page.LookPay(row) },
            ]} />
        )
    },
    {
        title: '操作',
        align: "center",
        dataIndex: 'options',
        render: (_, row) => (
            <Options btns={[
                { txt: '编辑', click: page.showEditModal(row) },
            ]} />
        )
    }

];

@inject("versionControlStore")
@observer
export default class VersionControl extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.versionControlStore;
        s.key = '';
        s.getData();
    }
    LookPay = (si: Item) => () => {
        const s = this.props.versionControlStore;
        s.currItem = si;
        s.look = true;
    }
    showEditModal = (it: Item) => () => {
        const s = this.props.versionControlStore;
        s.currItem = it;
        s.mEdit = true;
    }
    Files = (u: any, n: any) => {
        const store = this.props.versionControlStore;
        store.currItem.apk_url = u;
        store.currItem.apk_name = n;
    }
    render() {
        const s = this.props.versionControlStore;
        return (
            <div className="version-control-page">

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
                        <SearchList search={s.search} />
                    }
                />
                <Modal
                    title={<span><Icon type="file-search" />查看</span>}
                    visible={s.look}
                    onCancel={s.close}
                    onOk={s.close}
                    okText="退出">
                    {
                        s.currItem ? (
                            <div>
                                <Row>
                                    <Col span={6} style={{ textAlign: 'right' }}>支付宝支付:</Col>
                                    <Col span={18} style={{ textAlign: 'center' }}>{
                                        s.currItem.alipay_switch === '1' ? '开启' : '关闭'
                                    }</Col>
                                </Row>
                                <Row>
                                    <Col span={6} style={{ textAlign: 'right' }}>微信支付:</Col>
                                    <Col span={18} style={{ textAlign: 'center' }}> {
                                        s.currItem.wechat_switch === '1' ? '开启' : '关闭'
                                    }</Col>
                                </Row>
                                <Row>
                                    <Col span={6} style={{ textAlign: 'right' }}>海尔支付:</Col>
                                    <Col span={18} style={{ textAlign: 'center' }}>{
                                        s.currItem.haier_switch === '1' ? '开启' : '关闭'
                                    }</Col>
                                </Row>
                            </div>
                        ) : null
                    }
                </Modal>
                <Modal
                    width={"65%"}
                    title="编辑版本"
                    visible={s.mEdit}
                    onCancel={s.close}
                    onOk={s.submit}
                    okText="提交">
                    <UInput f={'app_version'} d={s.currItem} Sn={'版本号'} />
                    <UInput f={'app_name'} d={s.currItem} Sn={'应用名称'} />
                    <UInput f={'app_type'} d={s.currItem} Sn={'应用编号'} dis={true} />
                    <USelect f={'isNeedClearFMDB'} d={s.currItem} Sn={'更新数据库'} sl={[
                        { value: '0', label: '不更新' },
                        { value: '1', label: '更新' }
                    ]} />
                    <USelect f={'is_payment'} d={s.currItem} Sn={'展示付款信息'} sl={[
                        { value: '0', label: '不展示' },
                        { value: '1', label: '展示' }
                    ]} />
                    <USelect f={'alipay_switch'} d={s.currItem} Sn={'支付宝开关'} sl={[
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' }
                    ]} />
                    <USelect f={'wechat_switch'} d={s.currItem} Sn={'微信支付开关'} sl={[
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' }
                    ]} />
                    <USelect f={'haier_switch'} d={s.currItem} Sn={'海尔支付开关'} sl={[
                        { value: '0', label: '关闭' },
                        { value: '1', label: '开启' }
                    ]} />
                    <USelect f={'is_update'} d={s.currItem} Sn={'更新方式'} sl={[
                        { value: '0', label: '不更新' },
                        { value: '1', label: '不强制更新' },
                        { value: '2', label: '强制更新' }
                    ]} />
                   
                    <Upload f={'Certificate'} d={s.currItem} Sn={'安卓APK上传'}
                        loaded={this.Files} show={'文件'} />

                        {s.currItem &&   <Row style={{paddingBottom: '20px'}}><Col span={6} />
                    <Col span={12}> <Col span={7}>
                    安卓APK文件名：
                                    </Col><Col span={17}>
                                        {/* <Input disabled={true} style={{ lineHeight: "25px" }}
                                        placeholder={'安卓APK文件名'}
                                        value={s.currItem.apk_name}
                                        /> */}
                                        <a href={s.currItem.apk_url}>{s.currItem.apk_name}</a>
                                    </Col></Col><Col span={6} /></Row>}
                   
                    {/* <UImgeS l={!s.currItem.ADUrl ? [] : [...[s.currItem.ADUrl]]} del={this.delFiles} /> */}
                    {
                        s.currItem ? (
                            <Form>
                                <Form.Item {...formItemLayout} label="更新说明" required={true} >
                                    <TextArea
                                        rows={6}
                                        value={s.currItem.update_text}
                                        onChange={s.onEdit}
                                    />
                                </Form.Item>
                            </Form>
                        ) : null
                    }
                </Modal>
            </div>
        )
    }

}