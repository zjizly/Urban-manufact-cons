import * as React from 'react';
import './style.css';
import { observer } from 'mobx-react';
import { ServiceListStore } from '../../stores/service-list-store';
import { UInput } from '../../components/urban-input';
import { Upload } from '../../components/urban-upload';
import { UImgeS } from '../../components/urban-ImageShows';
import { USub } from '../../components/urban-submit';
import { UBack } from '../../components/urban-back';

interface Props {
    store: ServiceListStore
}

@observer
export class Edit extends React.Component<Props, any> {

    render() {
        const s = this.props.store;
        return (
            <div className="service-list-page">
                <div style={{ margin: '0 auto', padding: '25px' }}>
                    <UBack back={s.back} />
                    <UInput isTrue={true} f={'MobileNumber'} d={s.currItem} Sn={'手机号码'} lim='tel'
                        limN={11} limPle={`请输入11位手机号码`} />
                    <UInput isTrue={true} f={'Password'} d={s.currItem} Sn={'登录密码'} lim='ps'
                        limPle={`请设置登录密码 6-18位`} ac={'new-password'} type={'password'} dis={s.currItem.UserId ? true : false} />
                    <UInput isTrue={true} f={'RealName'} d={s.currItem} Sn={'真实姓名'} limN={4}
                        limPle={`请输入4个字以内的真实姓名`} />
                    <UInput isTrue={true} f={'NickName'} d={s.currItem} Sn={'客服昵称'} limN={6}
                        limPle={`请输入6个字以内的昵称`} tip={'此昵称用户端展示为：“官方客服+昵称”，请勿重复'} />
                    {
                        s.currItem.UserId ? (
                            <UInput isTrue={true} f={'ServiceID'} d={s.currItem} Sn={'客服工号'} dis={true} />
                        ) : null
                    }
                    <UInput isTrue={true} f={'Email'} d={s.currItem} Sn={'用户邮箱'} lim='e'
                        limPle={`请输入邮箱号`} />
                    <Upload isTrue={true} size={1024} f={'HeadImageUrl'} d={s.currItem} Sn={'上传头像'}
                        loaded={s.loaded} show={'图片'} tip={`备注：图片建议宽120*高120px，大小限制
                        为1M以内，格式支持JPG、PNG等`} />
                    <UImgeS l={[...[s.currItem.HeadImageUrl]]} del={s.DelHeadImageUrl} />
                    <USub sub={s.Save} />
                </div>

            </div>
        )
    }

}