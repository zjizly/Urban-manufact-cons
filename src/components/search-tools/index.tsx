import * as React from 'react';
import './style.css';
import { Moment } from 'moment';
import { Input, Icon, Button, Select, DatePicker } from 'antd';

interface PropsSim {
    pl?: string;
    keyword: string;
    change(v: string): void;
}

// 搜索输入框
export class SimpleSearchInput extends React.Component<PropsSim, any> {

    onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.change(e.target.value);
    }

    render() {
        return (
            <div style={{ height: '45px', lineHeight: '45px', display: 'inline-block', paddingRight: '8px' }}>
                <Input value={this.props.keyword} onChange={this.onchange} prefix={
                    <Icon type="search" />
                }
                    placeholder={this.props.pl}
                />
            </div>
        )
    }


}

interface PropsBtn {
    click(): void;
}

// 搜索按钮
export class SearchButton extends React.Component<PropsBtn, any> {
    render() {
        return (
            <div style={{ display: 'inline-block', height: '45px', lineHeight: '45px', padding: '0 8px' }}>
                <Button type="primary" onClick={this.props.click} icon="search"
                    style={{ height: '32px', lineHeight: '32px' }}
                >
                    查询
                </Button>
            </div>
        )
    }
}

interface Opt {
    label: string;
    val: string;
}

interface PropsSct {
    label: string;
    val: string;
    options: Opt[];
    change(val: string): void;
}
// 下拉搜索框
export class SelectSearch extends React.Component<PropsSct, any> {

    render() {
        const p = this.props;
        return (
            <div style={{ display: 'inline-block', height: '45px', lineHeight: '45px', paddingRight: '8px' }}>
                <label style={{ display: 'inline-block', height: '45px', lineHeight: '45px' }}>
                    {p.label + "："}
                </label>
                <Select value={p.val} onChange={p.change} style={{ width: '10em' }}>
                    {
                        p.options.map((it, idx) => {
                            return (
                                <Select.Option value={it.val} key={idx+''}>
                                    {it.label}
                                </Select.Option>
                            )
                        })
                    }
                </Select>
            </div>
        )
    }

}


// 清空日期输入框（参数idx为组件的索引，由props传入,如未传则清空操作无效）
export const clearDate = (idx: string) => {
    const c = dateComps[idx];
    if (c) {
        c.clear();
    }
}

const dateComps: any = {};

interface Props {
    label?: string;
    idx?: string;
    clear?: boolean;
    // 开始日期在结束日期之后，check为false
    change(date1: string, date2: string, check?: boolean): void;
}
// 日期区间选择
export class DateRange extends React.Component<Props, any> {

    date1: Moment | undefined = undefined;
    date1Str: string = "";
    date2: Moment | undefined = undefined;
    date2Str: string = "";

    onchange1 = (date: Moment, dateStr: string) => {
        this.date1 = date;
        this.date1Str = dateStr;
        this.setState({}, () => {
            let check = false;
            if (this.date1 && this.date2) {
                check = this.date1.isBefore(this.date2);
            }
            this.props.change(this.date1Str, this.date2Str, check);
        });
    }

    onchange2 = (date: Moment, dateStr: string) => {
        this.date2 = date;
        this.date2Str = dateStr;
        this.setState({}, () => {
            let check = false;
            if (this.date1 && this.date2) {
                check = this.date1.isBefore(this.date2);
            }
            this.props.change(this.date1Str, this.date2Str, check);
        });
    }

    clear = () => {
        this.date1 = undefined;
        this.date2 = undefined;
        this.date1Str = "";
        this.date2Str = "";
        this.setState({});
    }

    componentDidMount() {
        const k = this.props.idx;
        if (!k) {
            return;
        }
        dateComps[k] = this;
    }

    render() {
        const p = this.props;
        return (
            <div className="date-range-comp">
                <label>{p.label ? p.label + "：" : "选择日期："}</label>
                <DatePicker onChange={this.onchange1} value={this.date1} />
                &nbsp;到&nbsp;
                <DatePicker onChange={this.onchange2} value={this.date2} />
            </div>
        )
    }


}