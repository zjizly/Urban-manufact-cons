import * as React from 'react';
import './style.css';
import { observer } from 'mobx-react';
import { SystemUsersStore } from '../../stores/system-users-store';
import { UInput } from '../../components/urban-input';
import { UCheck } from '../../components/urban-check';
import { Upload } from '../../components/urban-upload';
import { UImgeS } from '../../components/urban-ImageShows';
import { USelect } from '../../components/urban-select';
import { USub } from '../../components/urban-submit';
import { UBack } from '../../components/urban-back';

interface Props {
    store: SystemUsersStore
}

@observer
export class Edit extends React.Component<Props, any> {

    render() {
        const s = this.props.store;
        return (
            <div className="system-users-page">
                <div style={{ margin: '0 auto', padding: '25px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <UBack back={s.back} /></div>
                    <input type='text' style={{ display: 'none' }} />
                    <UInput isTrue={true} f={'MobileNumber'} d={s.currItem} Sn={'手机号码'} lim='tel'
                        limN={11} limPle={`请输入11位手机号码`} />
                    <UInput isTrue={true} f={'Password'} d={s.currItem} Sn={'登录密码'} lim='ps'
                        limPle={`请设置登录密码 6-18位`} ac={'new-password'} type={'password'} dis={s.currItem.UserId ? true : false} />
                    <UInput isTrue={true} f={'RealName'} d={s.currItem} Sn={'真实姓名'} limN={4}
                        limPle={`请输入4个字以内的真实姓名`} />
                    <UInput isTrue={true} f={'Email'} d={s.currItem} Sn={'用户邮箱'} lim='e'
                        limPle={`请输入邮箱号`} type={'email'} />
                    <UCheck isTrue={true} f={'BusinessCategorys'} d={s.currItem} Sn={'经营品类'}
                        cl={[...s.BusinessList]} />
                    <Upload isTrue={true} f={'HeadImageUrl'} d={s.currItem} Sn={'上传头像'}
                        loaded={s.loaded} show={'图片'} />
                    <UImgeS l={[...[s.currItem.HeadImageUrl]]} del={s.DelHeadImageUrl} />
                    <USelect isTrue={true} f={'RoleId'} d={s.currItem} Sn={'用户角色'}
                        sl={[...s.RoleListC]} />
                    <USub sub={s.Save} />
                </div>

            </div>
        )
    }

}