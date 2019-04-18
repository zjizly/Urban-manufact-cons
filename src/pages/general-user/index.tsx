import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { GeneralUserStore, Item } from '../../stores/general-user-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { UDate } from '../../components/urban-date';
import { SearchList } from '../../components/search-list';
import { UImg } from '../../components/urban-img';
import { app } from '../../utils';
import { Options } from '../../components/options';
import { Modal, Input } from 'antd';
import { ChangeEvent } from 'react';

interface Iprops {
    generalUserStore: GeneralUserStore
}

const cols = (page: GeneralUser): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        dataIndex: 'index',
        key: "index",
        align: "center",
    },
    {
        title: '用户手机号',
        dataIndex: 'MobileNumber',
        key: "MobileNumber",
        align: "center",
    },
    {
        title: '昵称',
        key: "NickName",
        align: "center",
        render: (t, val) => (
            <span>{val.NickName ? val.NickName : ("用户" + val.MobileNumber.substr((val.MobileNumber.length - 4), 4))}</span>
        )
    },
    {
        title: '性别',
        key: "sex",
        align: "center",
        render: (t, val) => {
            return val.Sex === '' ? '保密' : val.Sex
        }
    },
    {
        title: '头像',
        key: "HeadImageUrl",
        align: "center",
        render(_, val) {
            return <UImg path={val.HeadImageUrl ? val.HeadImageUrl : 'http://img-emake-cn.oss-cn-shanghai.aliyuncs.com/3c96c580-59d9-11e9-a326-a7437fc21815'} />
        }
    },
    {
        title: '注册时间',
        key: "CreateTime",
        align: "center",
        render(_, val) {
            return app.getdays(val.CreateTime);
        }
    },
];

@inject("generalUserStore")
@observer
export default class GeneralUser extends React.Component<Iprops, {}> {

    TelCell: Input;
    componentWillMount() {
        const s = this.props.generalUserStore;
        s.paging.current = 1;
        s.key = '';
        s.time = [];
        s.getData();
    }

    SeachUser = () => {
        this.props.generalUserStore.lookuser = {
            TelCell: '',
            VerificationCode: ''
        };
        this.props.generalUserStore.UserLook = !this.props.generalUserStore.UserLook;
    }

    Seachuser = () => {
        this.props.generalUserStore.Getverificationcode();
    }

    onChange = (obj: any, field: string) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            obj[field] = e.target.value;
        }
    }

    prodLabel = (title: string, id: string, r: boolean = true): any => {
        if (r) {
            return (
                <label htmlFor={id}>
                    <span style={{ color: "red" }}>*</span>
                    {title + "："}
                </label>
            )
        } else {
            return (
                <label htmlFor={id}>
                    {title + "："}
                </label>
            )
        }
    }

    render() {
        const s = this.props.generalUserStore;
        return (
            <div className="general-user-page">

                {/* 页面主表 */}
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
                    buttons={
                        <Options btns={[
                            { txt: '查询验证', click: this.SeachUser }
                        ]} />
                    }
                    search={
                        <SearchList
                            search={s.search}
                            other={
                                <div style={{ height: '21px', display: 'inline-block', width: '400px' }}><UDate change={s.change} time={s.time} Sn={'注册时间'} /></div>
                            }
                        />

                    }
                />

                <Modal
                    // width={"75%"}
                    visible={s.UserLook}
                    onOk={this.Seachuser}
                    onCancel={this.SeachUser}
                >
                    <Input.Group>
                        <div className="input_wrap">
                            <Input type="text" id="TelCell"
                                placeholder={'请输入查询电话'}
                                value={s.lookuser.TelCell}
                                onChange={this.onChange(s.lookuser, 'TelCell')}
                                addonBefore={this.prodLabel("查询电话", "TelCell")}
                                ref={r => this.TelCell = r as Input} />
                        </div>
                        <span>验证码信息：{s.lookuser.VerificationCode}</span>
                    </Input.Group>
                </Modal>
            </div >
        )
    }

}