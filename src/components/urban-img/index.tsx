import * as React from 'react';
import dfAvatar from '../../assets/imgs/avatar.jpg';
import { app } from '../../utils';

interface Iprops {
    path: string;
    dfPath?: string;
    host?: string;
}

interface Istate {

}

export class UImg extends React.Component<Iprops, Istate>{

    static defaultProps = {
        path: dfAvatar
    }

    src: string = "";
    img: HTMLImageElement;
    dfPath: string = dfAvatar;
    host: string = app.baseUrl;

    err = () => {
        const p = this.props.dfPath || this.dfPath;
        this.img.src = p;
    }

    render() {
        return (
            <img
                src={this.props.host ? this.props.host + this.props.path : this.props.path}
                ref={r => this.img = r as HTMLImageElement}
                onError={this.err}
                style={{ width: "44px", height: "44px", borderRadius: "5px" }}
            />
        );
    }
}