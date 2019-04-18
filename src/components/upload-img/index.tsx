import * as React from 'react';
import './style.css'
import { message, Icon } from 'antd';
// import { CustomJSON } from '../../utils';
import * as OSS from "ali-oss";
import * as uuidv1 from "uuid/v1";

interface Iprops {
    txt: string;
    type?: string;
    size?: number;
    tip?: string;
    dis?: boolean;
    loaded(url?: string, name?: string, size?: number): void;

}
interface State {
    show: any;
}
export class UploadImg extends React.Component<Iprops, State> {

    file: HTMLInputElement;
    span: HTMLElement;
    constructor(props: Iprops) {
        super(props);
        this.state = {
            show: this.props.txt ? this.props.txt : '请选择上传图片',
        };
    }
    onChange = async () => {
        const bucket = 'img-emake-cn';
        const region = 'oss-cn-shanghai';
        const accessKeyId = 'LTAIjK54yB5rocuv';
        const accessKeySecret = 'T0odXNBRpw2tvTffxcNDdfcHlT9lzD';

        const client = new OSS({
            region,
            accessKeyId,
            accessKeySecret,
            bucket,
        });
        const file = this.file && this.file.files && this.file.files[0];
        let fileName = "";
        let fileSize = 0;
        if (file) {
            fileName = file.name;
            fileSize = file.size;
            if (this.props.size && fileSize > (this.props.size * 1024)) {
                message.warn("图片大小超出范围！");
                return;
            }
        }
        if (this.props.type && file) {
            if (file.type.split("/")[0] !== this.props.type) {
                message.warn("上传文件格式不符！");
                return;
            }
        }
        const result = await client.put(uuidv1(), file);
        if (result.res.status === 200 && result.res.statusCode === 200) {
            this.props.loaded(result.url, fileName, fileSize);
            // this.span.innerHTML = fileName;
            this.setState({ show: fileName });
            message.success(`上传成功！`)
        } else {
            message.error(`上传失败`);
        }
    }
    render() {
        return (
            <span className="load-file-wrap">
                <Icon type="upload" />
                <input type="file" ref={(r) => this.file = r as HTMLInputElement} onChange={this.onChange} disabled={this.props.dis} />
                {/* <span className="show_file_name" ref={(r) => this.span = r as HTMLElement}>{this.props.txt}</span> */}
                <span className="show_file_name" ref={(r) => this.span = r as HTMLElement}>{this.state.show}</span>
                {
                    this.props.tip ? (<p style={{ color: "red" }}>{this.props.tip}</p>) : null
                }
            </span>
        )
    }
}