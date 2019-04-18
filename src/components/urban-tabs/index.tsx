import * as React from 'react';
import './style.css'
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

interface Iprops {
    sl: any[];
    switch(cate: any): void;       // 点击按钮切换时的回调
}
export class UTabs extends React.Component<Iprops, {}> {
    handleChange = (val: any) => {
        const s = this.props;
        const t = s.sl.filter(si => si.val === val);
        this.props.switch(t[0]);
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px' }}>
                <Tabs onChange={this.handleChange} type="card" tabBarGutter={14}>
                    {
                        s.sl.map(si => (
                            <TabPane tab={si.label} key={si.val} />
                        ))
                    }
                </Tabs>
            </div>
        )
    }
}