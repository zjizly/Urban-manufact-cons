import * as React from 'react';
import dfAvatar from '../../assets/imgs/avatar.jpg';
import Cropper from 'cropperjs';
import 'cropperjs/src/css/cropper.css';
import './style.css';
import { Button } from "antd";

interface Iprops {
    path?: string;
    dfPath?: string;
    host?: string;
}

interface Istate {

}



export class UCut extends React.Component<Iprops, Istate>{

    static defaultProps = {
        path: dfAvatar
    }
    cropper: any;
    img: HTMLImageElement;
    cut = () => {
        this.cropper = new Cropper(this.img, {
            aspectRatio: 16 / 9,
        });
    }
    Save = () => {
        console.log(this.cropper);
    }
    render() {
        return (
            <div style={{ margin: '0 auto', width: '50%' }}>
                <div onClick={this.cut}>
                    <img id="image" src={this.props.path} ref={r => this.img = r as HTMLImageElement} />
                </div>
                <Button onClick={this.Save} type={'primary'}>裁剪</Button>
            </div>

        );
    }
}