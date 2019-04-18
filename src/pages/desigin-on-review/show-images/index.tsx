import * as React from 'react';
import './style.css';
import { inject, observer } from 'mobx-react';
import { ShowImagesStore, } from './show-images-store';
import { action } from 'mobx';
import { UBack } from '../../../components/urban-back';
import { USelect } from '../../../components/urban-select';
import { UImgList } from '../../../components/urban-ImageShows';
import RadioGroup from 'antd/lib/radio/group';
import { Radio, Row, Col } from 'antd';


interface Iprops {
    showImagesStore: ShowImagesStore
}

@inject("showImagesStore")
@observer
export default class ShowImages extends React.Component<Iprops, {}> {

    constructor(props: any) {
        super(props);
        const s = this.props.showImagesStore;
        const path = window.location.pathname;
        s.curCategory.categoryA = path.split("/")[2];
        s.curCategory.categoryB = path.split("/")[3];
        s.curCategory.categoryC = path.split("/")[4];
    }

    async componentWillMount() {
        const s = this.props.showImagesStore;
        s.getCategoryA();
    }

    @action back = () => {
        window.history.go(-1);
    }

    render() {
        const s = this.props.showImagesStore;
        // console.log(s.images.length);
        return (
            <div className="show-images-page">
                <div style={{paddingTop: '50px', position: 'relative'}}>
                    <UBack back={this.back} />
                </div>
                <USelect change={s.handleChange} f={'categoryA'} d={s.curCategory} Sn={'行业分类'} sl={s.CategoryAOptions} />
                <Row>
                    <Col span={8}>
                        <div style={{ textAlign: "right", lineHeight: "32px" }}>
                            { "一级品类："}
                        </div>
                    </Col>
                    <Col span={16}>
                        <RadioGroup onChange={s.handleChange1} value={s.curCategory.categoryB}>
                            {s.CategoryBOptions.map((it: any, idx: number) => <Radio key={idx} value={it.value}>{it.label}</Radio>)}
                        </RadioGroup>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <div style={{ textAlign: "right", lineHeight: "32px" }}>
                            { "二级品类："}
                        </div>
                    </Col>
                    <Col span={16}>
                        <RadioGroup onChange={s.handleChange2} value={s.curCategory.categoryC}>
                            {s.CategoryCOptions.map((it: any, idx: number) => <Radio key={idx} value={it.value}>{it.label}</Radio>)}
                        </RadioGroup>
                    </Col>
                </Row>
                
               
                <UImgList ls={[...s.images]} />
            </div>
        )
    }

}