import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { SafeStore, Item } from '../../stores/safe-store';
import { UInput } from '../../components/urban-input';
import { UBack } from '../../components/urban-back';
import { authStore } from '../../stores/user';
import { USub } from '../../components/urban-submit';
// import { UCut } from '../../components/urban-cut';

interface Iprops {
    safeStore: SafeStore
}


@inject("safeStore")
@observer
export default class Safe extends React.Component<Iprops, {}> {
    componentDidMount() {
        const s = this.props.safeStore;
        s.currItem = new Item();
        s.currItem.Password = authStore.userInfo.Password || '';
        s.currItem.UserId = authStore.userInfo.UserId || '';
    }
    render() {
        const s = this.props.safeStore;
        return (
            <div className="safe-page">
                <div style={{ margin: '0 auto', padding: '25px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <UBack back={s.back} /></div>
                    <UInput f={'Passwordis'} d={s.currItem} Sn={'原登录密码'} lim='ps'
                        limPle={`请输入登录密码`} ac={'new-password'}
                        type={'password'} />
                    <UInput f={'PasswordNew'} d={s.currItem} Sn={'新登录密码'} lim='ps'
                        limPle={`请输入新的6-18位登录密码`} ac={'new-password'}
                        type={'password'} />
                    <USub sub={s.Save} />
                    {/* <UCut path={'http://img-emake-cn.oss-cn-shanghai.aliyuncs.com/fb1c6210-08cd-11e9-b2b8-812f99b0dc90'} /> */}
                </div>
            </div>
        )
    }

}