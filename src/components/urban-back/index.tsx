import * as React from 'react';

interface Iprops {
    back(): void;
}
interface State {
}
export class UBack extends React.Component<Iprops, State> {
    back = () => {
        this.props.back();
    }
    render() {
        return (
            <div onClick={this.back} style={{cursor: 'pointer', position: 'absolute', right: '2%', top: '5%' }}>
                返回上级菜单
            </div>
        )
    }
}