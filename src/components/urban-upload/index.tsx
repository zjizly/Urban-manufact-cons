import * as React from 'react';
import './style.css'
import { message, Icon, Row, Col, Progress } from 'antd';
// import { CustomJSON } from '../../utils';
import * as OSS from "ali-oss";
import * as uuidv1 from "uuid/v1";

interface Iprops {
    f: string; // 目标属性；
    d: any; // 目标数据；
    Sn?: string; // 输入展示；
    isTrue?: boolean; // 是否必填；
    dis?: boolean;
    tip?: string;
    type?: string;
    show?: string;
    size?: number;
    cl?: number; // 尺寸调整
    loaded(url?: string, name?: string, size?: number): void;

}
interface State {
    show: any;
    percent: any;
    pShow: boolean;
}
export class Upload extends React.Component<Iprops, State> {

    file: HTMLInputElement;
    span: HTMLElement;
    constructor(props: Iprops) {
        super(props);
        this.state = {
            show: !this.props.show ? '请选择上传文件' : `请选择上传${this.props.show}`,
            percent: 0,
            pShow: false,
        };
    }

    componentWillMount() {
        this.setState({
            percent: 0
        })
    }

    onChange = async () => {
        this.setState({ percent: 0, pShow: true });
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
        // let tempCheckpoint;
        if (file) {
            fileName = file.name;
            fileSize = file.size;
            if (this.props.size && fileSize > (this.props.size * 1024)) {
                message.warn("大小超出范围！");
                return;
            }
        }
        if (this.props.type && file) {
            if (file.type.split("/")[0] !== this.props.type) {
                message.warn("上传文件格式不符！");
                return;
            }
        }
        const result = await client.multipartUpload(uuidv1(), file, {
            progress: async (p: any, c: any) => {
                const per = Math.floor(p * 10000) / 100;
                this.setState({ percent: per });
                // tempCheckpoint = c;
            }
        });
        if (result && result.res && result.res.status === 200 && result.res.statusCode === 200) {
            this.props.loaded(result.res.requestUrls[0].indexOf("?") !== -1 ? result.res.requestUrls[0].split("?")[0]: result.res.requestUrls[0], fileName, fileSize);
            message.success(`上传成功！`);
            this.hidden();
        } else {
            message.error(`上传失败`);
            this.hidden();
        }
        // await client.multipartUpload(uuidv1(), file).then((d: any) => {
        //     console.log(d);
        //     if (d.res.status === 200 && d.res.statusCode === 200) {
        //         this.props.loaded(d.url, fileName, fileSize);
        //         message.success(`上传成功！`)
        //     } else {
        //         message.error(`上传失败`);
        //     }
        // }).catch((e: any) => {
        //     message.error(`上传失败`);
        // })
        // const result = await client.multipartUpload(uuidv1(), file);
        // if (result.res.status === 200 && result.res.statusCode === 200) {
        //     this.props.loaded(result.url, fileName, fileSize);
        //     message.success(`上传成功！`)
        // } else {
        //     message.error(`上传失败`);
        // }
    }
    hidden = () => {
        setTimeout(() => {
            this.setState({ pShow: false });
        }, 500);
    }
    prodLabel = (title: string, r: boolean): any => {
        if (r) {
            return (
                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                    <span style={{ color: "red" }}>*</span>
                    {title + "："}
                </div>
            )
        } else {
            return (
                <div style={{ textAlign: "right", lineHeight: "32px" }}>
                    {title + "："}
                </div>
            )
        }
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px 0' }}>
                <Row>
                    <Col span={6} />
                    <Col span={12}>
                        <Row>
                            {
                                s.Sn ? (
                                    <Col span={s.cl ? s.cl : 7}>
                                        {this.prodLabel(s.Sn, s.isTrue ? s.isTrue : false)}
                                    </Col>
                                ) : <Col span={s.cl ? s.cl : 7} />
                            }

                            <Col span={s.cl ? Number(24 - s.cl) : 17}>
                                <span className="load-file-wrap">
                                    <Icon type="upload" />
                                    <input type="file"
                                        ref={(r) => this.file = r as HTMLInputElement}
                                        onChange={this.onChange} disabled={s.dis} />
                                    <span className="show_file_name"
                                        ref={(r) => this.span = r as HTMLElement} >
                                        {this.state.show}</span>
                                </span>
                                {
                                    this.state.pShow ? (
                                        <Progress percent={this.state.percent} />
                                    ) : null
                                }
                            </Col>
                            {
                                s.tip ? (
                                    <Col span={s.cl ? s.cl : 7} />
                                ) : null
                            }
                            {
                                s.tip ? (
                                    <Col span={s.cl ? Number(24 - s.cl) : 17}>
                                        <span style={{ color: "red" }}>{this.props.tip}</span>
                                    </Col>
                                ) : null
                            }
                        </Row>
                    </Col>
                    <Col span={6} />
                </Row>
            </div >

        )
    }
}