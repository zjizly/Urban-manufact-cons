import * as React from 'react';
import './style.css';
import { Modal, Form } from 'antd';
import { inject, observer } from 'mobx-react';
import { OtherConfigStore, Item } from '../../stores/other-config-store';
import { ColumnProps } from 'antd/lib/table';
import { Utable } from '../../components/universal-table';
import { action } from 'mobx';
import { Options } from '../../components/options';
import { UInput } from '../../components/urban-input';
import { app } from '../../utils';

interface Iprops {
    otherConfigStore: OtherConfigStore
}

const cols = (page: OtherConfig): (ColumnProps<Item>[]) => [
    {
        title: '序号',
        align: "center",
        dataIndex: 'index'
    },
    {
        title: '配置类型',
        align: "center",
        dataIndex: 'ConfigType'
    },
    {
        title: '配置内容',
        align: "center",
        dataIndex: 'ConfigContent'
    },
    {
        title: '编辑时间',
        align: "center",
        render(_, val) {
            return app.getdays(val.AddWhen);
        }
    },
    {
        title: '编辑人',
        align: "center",
        dataIndex: 'AddWho'
    },
    {
        title: '操作',
        align: "center",
        key: 'options',
        render: (_, val) => (
            <Options btns={[
                { txt: '编辑', click: page.showModal(val) }
            ]} />
        )
    }
];

@inject("otherConfigStore")
@observer
export default class OtherConfig extends React.Component<Iprops, {}> {

    componentWillMount() {
        const s = this.props.otherConfigStore;
        s.getData();
    }

    @action showModal = (it: Item) => () => {
        const s = this.props.otherConfigStore;
        s.currItem = it;
        s.mEdit = true;
    }

    render() {
        const s = this.props.otherConfigStore;
        return (
            <div className="other-config-page">

                {/* 页面主表 */}
                <Utable
                    columns={cols(this)}
                    data={s.list}
                    loading={s.loading}
                    paging={{ ...s.paging }}
                />

                <Modal title="编辑配置" width={'60%'} visible={s.mEdit} onCancel={s.close} onOk={s.submit} okText="提交">
                    <Form>
                        <UInput f={'ConfigType'} d={s.currItem} Sn={'配置类型'} isTrue={true} dis={true}/>
                        <UInput f={'ConfigContent'} d={s.currItem} Sn={'配置内容'} isTrue={true}/>
                    </Form>
                </Modal>

            </div>
        )
    }

}