import * as React from 'react';
import './style.css';
import { Input, Select, Button, Icon } from 'antd';

interface Option{
    val: string;
    label: string;
}

interface SearchModel{
    keyType?: string;
    key: string | number;
    searchHandler( keyType: string, keyword: string): void;
}

interface Props{
    states?: Option[];      // 按状态搜索传此参数
    keyTypes?:Option[];    // 搜索关键字的类型
    placeholder?: string;
    stateLabel?: string;
    config: SearchModel;
}

interface States{
    keyType: string;
    key: string;
    currState: string;
}

export class SearchBar extends React.Component< Props, States >{
    
    constructor(p: Props){
        super(p);
        this.state = {
            keyType: p.config.keyType || '',
            key: '',
            currState: ''
        }
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const p = this.props;
        const k = e.target.value;
        this.props.config.key = k;
        this.setState({
            key: k,
            currState: this.state.currState,
            keyType: this.state.keyType
        });
        if(k === ''){
            p.config.searchHandler('', k);
            return;
        }
    }

    onStateChange = (val: string) => {
        this.setState({
            key: '',
            currState: val,
            keyType: this.state.keyType
        });
        this.props.config.key = val;
        const t = val === '' ? '' : this.state.keyType;
        this.props.config.searchHandler( t, val );
    }

    onSearchClick = () => {
        const s = this.state;
        this.props.config.searchHandler(s.keyType, s.key);
    }

    onKeyTypeChange = (val: string) => {
        this.setState({
            keyType: val,
            currState: this.state.currState,
            key: this.state.key
        })
        this.props.config.keyType = val;
    }

    render(){
        const p = this.props;
        const s = this.state;
        if(p.states !== undefined){
            if(p.states[0] !== undefined && p.states[0].label !== '全部'){
                p.states.unshift({
                    val: '',
                    label: '全部'
                });
            }
        }
        return (
            <div className="search-bar-warpper">
                {
                    p.keyTypes ? (
                        <Select value={s.keyType} onChange={ this.onKeyTypeChange }>
                            {
                                p.keyTypes.map((ele, idx) => <Select.Option value={ ele.val } key={ ele.val+ele.label }>
                                        { ele.label }
                                    </Select.Option>
                                )
                            }
                        </Select>
                    )
                    : null
                }
                <Input value={ p.config.key === '' ? '' : s.key } onChange={ this.onChange } 
                placeholder={ p.placeholder || '' } 
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                {
                    p.states ?
                    <span>
                        <label className="search-bar-label">
                            {
                                p.stateLabel ? p.stateLabel + ':' : '状态:'
                            }
                        </label>
                        <Select value={ s.currState || '' } onChange={ this.onStateChange }>
                            {
                                p.states.map((it, idx) => (
                                    <Select.Option key={String(idx)} value={ it.val }>{ it.label }</Select.Option>
                                ))
                            }
                        </Select>
                    </span>
                    : ''
                }
                <Button type="primary" onClick={ this.onSearchClick } className="search-bar-button">
                    <Icon type="search"/>搜索
                </Button>
            </div>
        )
    }

}