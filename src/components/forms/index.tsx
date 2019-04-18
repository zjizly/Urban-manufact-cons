import * as React from 'react';
import './style.css'
import { Input, Select } from 'antd';
// import { UploadImg } from '../upload-img';


interface PropsIpt<T> {
    data: T;
    field: keyof T;
    label: string;
    tips?: string;
    value?: string;
    require?: boolean;
    id?: string;
    placeholder?: string;
    type?: string;
    style?: React.CSSProperties;
    inline?: boolean;
    disabled?: boolean;
    change?(v: string): void;
}

export class Einput<T> extends React.Component<PropsIpt<T>, any> {

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.data[this.props.field] = e.target.value as any;
        if (this.props.change) {
            this.props.change(e.target.value);
        }
        this.setState({});
    }

    render() {
        const p = this.props;
        const val = p.value ? p.value : p.data[p.field];
        return (
            <div style={p.style} className="emake-ipt">
                <label>
                    {
                        p.require ? <span style={{ color: "red" }}>*&nbsp;</span> : ""
                    }
                    {p.label + "："}
                </label>
                <Input placeholder={p.placeholder} disabled={p.disabled ? p.disabled : false}
                    id={p.id}
                    value={val ? val.toString() : ""} onChange={this.onChange} type={p.type || 'text'} />
                <span className="tips" title={p.tips}>{p.tips || ""}</span>
            </div>
        )
    }
}

// panel
export class EditPanel extends React.Component {

    render() {
        return (
            <div style={{
                width: '100%',
                textAlign: 'center',
                position: 'relative'
            }}>
                {this.props.children}
            </div>
        )
    }

}

// Select
interface Opt {
    label: string;
    val: string;
}

interface PropsSct {
    label: string;
    value: string;
    options: Opt[];
    style?: React.CSSProperties;
    require?: boolean;
    disabled?: boolean;
    tips?: string;
    change(val: string): void;
}

export class Eselect extends React.Component<PropsSct, any> {

    render() {
        const p = this.props;
        return (
            <div style={p.style} className="emake-ipt">
                <label>
                    {
                        p.require ? <span style={{ color: "red" }}>*&nbsp;</span> : ""
                    }
                    {p.label + "："}
                </label>
                <Select value={p.value} onChange={p.change} className="emake-select" disabled={p.disabled || false}>
                    {
                        p.options.map((ele, idx) => {
                            return (
                                <Select.Option value={ele.val} key={idx + ele.label}>
                                    {ele.label}
                                </Select.Option>
                            )
                        })
                    }
                </Select>
                <span className="tips" title={p.tips}>{p.tips || ""}</span>
            </div>
        )
    }

}

export class BtnPanel extends React.Component {

    render() {
        return (
            <div style={{
                width: '530px',
                padding: '24px',
                margin: '16px auto',
                textAlign: 'right'
            }}>
                {this.props.children}
            </div>
        )
    }

}