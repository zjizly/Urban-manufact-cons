import * as React from 'react';
import './style.css'
import { Input, Select } from 'antd';

const Search = Input.Search;
const Option = Select.Option;
interface Iprops {
    SelectList?: any;
    other?: any;
    otherTip?: any;
    ple?: string;
    search(tips: any, list?: any): void;
}
interface State {
    values: any;
    reList: any;
}
export class SearchList extends React.Component<Iprops, State> {
    constructor(props: Iprops) {
        super(props);
        this.state = {
            values: '',
            reList: [],
        };
    }
    componentWillMount() {
        const arr: any[] = [];
        if (this.props.SelectList && this.props.SelectList.length) {
            this.props.SelectList.forEach((si: any) => {
                arr.push({ check: '' });
            });
        }
        this.setState({ reList: arr });
    }
    Search = (v: any) => {
        this.setState({ values: v })
        this.props.search(v, this.state.reList);
    }
    Change = (e: any) => {
        this.setState({ values: e.target.value })
        this.props.search(e.target.value, this.state.reList);
    }
    handleChange = (e: any, t: any) => {
        const num = this.props.SelectList.findIndex((si: any) => si.Name === e.Name);
        const arr = this.state.reList;
        arr[num].check = t;
        this.setState({ reList: arr }, () => {
            this.props.search(this.state.values, this.state.reList);
        });
    }
    render() {
        const s = this.props;
        return (
            <div>
                <Search
                    placeholder={this.props.ple ? this.props.ple : "请输入搜索内容"}
                    onChange={this.Change}
                    onSearch={this.Search}
                    style={{ width: 200, marginRight: '20px' }}
                />
                {
                    s.SelectList ? s.SelectList.map((si: any) => (
                        <div key={si.Name} style={{ display: 'inline-block', marginRight: '20px' }}>
                            <div style={{ marginRight: '5px', textAlign: "right", lineHeight: "32px", display: 'inline-block' }}>
                                <span>{si.Name}</span>
                            </div>
                            <Select defaultValue={si.check} style={{ width: 120 }}
                                onChange={this.handleChange.bind(this, si)}>
                                {
                                    si.Data.map((ds: any) => (
                                        <Option key={si.Name + ds.label + ds.value}
                                            value={ds.value}>{ds.label}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                    )) : null
                }
                {s.otherTip ? <span>{s.otherTip}</span> : null}
                {s.other ? s.other : null}
            </div>
        )
    }
}