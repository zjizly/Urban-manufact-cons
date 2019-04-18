import * as React from 'react';
import './style.css';
import { Modal, Icon, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { WithdrawalappStore, Item } from '../../stores/WithdrawalApp-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { Options } from '../../components/options';
import { SearchList } from '../../components/search-list';
import { UTabs } from '../../components/urban-tabs';
// import { SelfRadio } from '../../components/self-radio';

interface Iprops {
    withdrawalappStore: WithdrawalappStore
}
const cols = (page: Withdrawalapp): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '手机号',
        dataIndex: 'MobileNumber',
        key: "MobileNumber",
        align: "center",
    },
    {
        title: '用户姓名',
        dataIndex: 'RealName',
        key: "RealName",
        align: "center",
    },
    {
        title: '提现金额',
        dataIndex: 'Money',
        key: "Money",
        align: "center",
    },
    {
        title: '用户类型',
        dataIndex: 'UserType',
        key: "UserType",
        align: "center",
    },
    {
        title: '提现账号',
        dataIndex: 'CardId',
        key: "CardId",
        align: "center",
    },
    {
        title: '账户余额',
        dataIndex: 'AccountBalance',
        key: "AccountBalance",
        align: "center",
    },
    {
        title: '提现时间',
        dataIndex: 'CreateTime',
        key: "CreateTime",
        align: "center",
    },
    {
        title: "审核",
        key: "operation",
        align: "center",
        render: (t, val) => {
            return < Options super={true} btns={
                [
                    { txt: '审核', click: page.open.bind(Withdrawalapp, val) },
                ]} />
        }
    },
];


const cols1 = (page: Withdrawalapp): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '手机号',
        dataIndex: 'MobileNumber',
        key: "MobileNumber",
        align: "center",
    },
    {
        title: '用户姓名',
        dataIndex: 'RealName',
        key: "RealName",
        align: "center",
    },
    {
        title: '提现金额',
        dataIndex: 'Money',
        key: "Money",
        align: "center",
    },
    {
        title: '用户类型',
        dataIndex: 'UserType',
        key: "UserType",
        align: "center",
    },
    {
        title: '提现账号',
        dataIndex: 'CardId',
        key: "CardId",
        align: "center",
    },
    {
        title: '账户余额',
        dataIndex: 'AccountBalance',
        key: "AccountBalance",
        align: "center",
    },
    {
        title: '提现时间',
        dataIndex: 'CreateTime',
        key: "CreateTime",
        align: "center",
    },
];

@inject("withdrawalappStore")
@observer
export default class Withdrawalapp extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.withdrawalappStore;
        s.paging.current = 1;
        s.key = '';
        s.CashState = '1';
        s.getData();
    }

    switch = (e: any) => {
        const s = this.props.withdrawalappStore;
        s.CashState = e.val;
        s.getData();
    }

    open = (v: any) => {
        const s = this.props.withdrawalappStore;
        s.currItem = v;
        s.Show = true;
    }
    
    cannel = () => {
        const s = this.props.withdrawalappStore;
        s.Show = false;
    }

    StateChange = () => {
        const s = this.props.withdrawalappStore;
        s.StateChange();
    }

    render() {
        const s = this.props.withdrawalappStore;
        return (
            <div className="WithdrawalApp-page">
                <UTabs sl={[{ val: '1', label: '申请中' }, { val: '2', label: '已提现' }]} switch={this.switch} />

                {/* 页面主表 */}
                <Utable
                    columns={s.CashState === '1' ? cols(this): cols1(this)}
                    data={s.list}
                    loading={s.loading}
                    paging={{...s.paging}}
                    search={
                        <SearchList search={s.search} />
                    }
                />
                <Modal
                    title={(<span><Icon type="audit" />提现审核</span>)}
                    visible={s.Show}
                    // onOk={this.StateChange}
                    // onCancel={this.cannel} type='primary' 
                    onCancel={this.cannel}
                    footer={[<Button key='ok'  type='primary'  onClick={this.StateChange}>确认</Button>,
                        <Button key='cancel' onClick={this.cannel}>关闭</Button>]}
                >
                   <span>该用户的提现申请确认已处理？</span>
                </Modal>
               
            </div>
        )
    }

}