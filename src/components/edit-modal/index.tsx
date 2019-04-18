import * as React from 'react';
import { Modal, Drawer } from 'antd';
import './style.css';

interface Props {
    title?: string;
    oktxt?: string;
    width?: string;
    footer?: boolean;
    show: boolean;
    ok?(): void;
    cancel(): void;
}

export class EditModal extends React.Component< Props, any > {

    render() {
        const p = this.props;
        if(p.footer === false){
            return (
                <Modal
                okText={p.oktxt}
                title={p.title || '编辑'}
                width={p.width || '680px'}
                visible={this.props.show}
                footer={p.footer === false ? false : true}
                onCancel={this.props.cancel}
                onOk={this.props.ok}
                className="emake-edit-modal"
                >
                    <div
                    style={{
                        width: '80%',
                        padding: '8px',
                        margin: '0 auto'
                    }}
                    >
                        {this.props.children}
                    </div>
                </Modal>
            )
        }
        return (
            <Modal
            title={p.title || '编辑'}
            width={p.width || '680px'}
            visible={this.props.show}
            onCancel={this.props.cancel}
            onOk={this.props.ok}
            className="emake-edit-modal"
            >
                <div
                style={{
                    width: '80%',
                    padding: '8px',
                    margin: '0 auto'
                }}
                >
                    {this.props.children}
                </div>
            </Modal>
        )
    }


}

interface DrawerProps {
    title: string;
    show: boolean;
    close():void;
}

export class Edrawer extends React.Component< DrawerProps, any > {

    render() {
        const p = this.props;
        return (
            <Drawer
            title={p.title}
            width={700}
            placement="right"
            onClose={p.close}
            maskClosable={false}
            visible={p.show}
            style={{
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: 53,
            }}
            >
                { p.children }
            </Drawer>
        )
    }

}