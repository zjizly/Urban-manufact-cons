import * as React from 'react';
import './style.css'
import { Row, Col, Modal } from 'antd';
import { UImg } from '../urban-img';
import dfAvatar from '../../assets/imgs/avatar.jpg';
import swiper from 'swiper';
import 'swiper/dist/css/swiper.min.css';
import { Utils } from '../../utils';


interface Isprops {
    l: any[];
    cl?: number;
    del(d?: any[]): void;
}
interface IsState {
}
export class UNames extends React.Component<Isprops, IsState> {
    Del = (i: any) => () => {
        const t = this.props.l;
        t.splice(i, 1);
        this.props.del(t);
    }
    link = (s: any) => () => {
        window.open(s.url);
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px 0' }}>
                <Row>
                    <Col span={6} />
                    <Col span={12}>
                        <Row>
                            <Col span={s.cl ? s.cl : 7} />
                            <Col span={s.cl ? Number(24 - s.cl) : 17}>
                                {
                                    s.l.map((ls: any, idx: any) => (
                                        <span key={ls + idx} style={{ display: 'inline-block', margin: '0 14px 14px 0' }} >
                                            <div style={{
                                                backgroundColor: 'red',
                                                width: '14px',
                                                height: '14px',
                                                textAlign: 'center',
                                                color: 'white',
                                                borderRadius: '50%',
                                                lineHeight: '14px',
                                                float: "right",
                                                top: '-7px',
                                                right: '7px',
                                                position: 'relative',
                                                cursor: 'pointer',
                                            }} onClick={this.Del(idx)}>X</div>
                                            <span style={{ color: '#3300FF' }} onClick={this.link(ls)} title={ls.name}>{Utils.cut(ls.name, 15)}</span>
                                        </span>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6} />
                </Row>
            </div>
        )
    }
}

interface Iprops {
    l: any[];
    del(d?: any[]): void;
}
interface State {
}
export class UImgeS extends React.Component<Iprops, State> {
    Del = (i: any) => () => {
        const t = this.props.l;
        t.splice(i, 1);
        this.props.del(t);
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px 0' }}>
                <Row>
                    <Col span={6} />
                    <Col span={12}>
                        <Row>
                            <Col span={7} />
                            <Col span={17}>
                                {
                                    s.l.map((ls: any, idx: any) => (
                                        <span key={ls + idx} style={{ display: 'inline-block', margin: '0 14px 14px 0' }} >
                                            <div style={{
                                                backgroundColor: 'red',
                                                width: '14px',
                                                height: '14px',
                                                textAlign: 'center',
                                                color: 'white',
                                                borderRadius: '50%',
                                                lineHeight: '14px',
                                                float: "right",
                                                top: '-7px',
                                                right: '7px',
                                                position: 'relative',
                                                cursor: 'pointer',
                                            }} onClick={this.Del(idx)}>X</div>
                                            <UImg path={ls} />
                                        </span>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6} />
                </Row>
            </div>
        )
    }
}


interface IiLiprops {
    ls: any[];
    dfPath?: string;
    num?: number;
    cl?: any;
    // del(d?: any[]): void;
}
interface LiState {
    show: boolean;
}
export class UImgList extends React.Component<IiLiprops, LiState> {
    img: HTMLImageElement;

    dfPath: string = dfAvatar;

    mySwiper: any;
    galleryThumbs: any;

    constructor(props: IiLiprops) {
        super(props);
        this.state = {
            show: false,
        };
    }
    err = () => {
        const p = this.props.dfPath || this.dfPath;
        this.img.src = p;
    }
    amplification = (s: string, i: number) => () => {
        this.setState({ show: !this.state.show });
        setTimeout(() => {
            this.galleryThumbs = new swiper('.gallery-thumbs', {
                spaceBetween: 10, // 间隔   
                slidesPerView: 5, // 展示数
                freeMode: true, // 是否跳跃滑动
                watchSlidesVisibility: true, // 可见元素class赋值
                grabCursor: true, // 变手
                centeredSlides: true, // 居中
                slideToClickedSlide: true, // 可点击
                initialSlide: i, // 位置
            });
            this.mySwiper = new swiper('.gallery-top', {
                grabCursor: true,
                slideToClickedSlide: true,
                navigation: { // 左右切换
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                initialSlide: i,
            });
            const l = this.props.cl;
            if (!this.galleryThumbs.length) {
                this.galleryThumbs.controller.control = this.mySwiper;// Swiper1控制Swiper2，需要在Swiper2初始化后
                this.mySwiper.controller.control = this.galleryThumbs;// Swiper2控制Swiper1，需要在Swiper1初始化后
            } else {
                this.galleryThumbs[l].controller.control = this.mySwiper[l];// Swiper1控制Swiper2，需要在Swiper2初始化后
                this.mySwiper[l].controller.control = this.galleryThumbs[l];// Swiper2控制Swiper1，需要在Swiper1初始化后
            }
        }, 0);
    }
    handleCancel = () => {
        this.setState({ show: false })
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px 0', textAlign: 'center', }}>
                {
                    s.ls.map((li: any, idx: any) => {
                        if (this.props.num) {
                            if (idx < this.props.num) {
                                return <span key={li + idx} style={{ display: 'inline-block', margin: '0 14px 14px 0' }}>
                                    <img
                                        onClick={this.amplification(li, idx)}
                                        src={li}
                                        ref={r => this.img = r as HTMLImageElement}
                                        onError={this.err}
                                        style={{ width: "100px", height: "83px", borderRadius: "5px", margin: '0 auto' }}
                                    />
                                </span>
                            } else if (idx === this.props.num) {
                                return '...'
                            } else {
                                return null;
                            }

                        } else {
                            return <span key={li + idx} style={{ display: 'inline-block', margin: '0 14px 14px 0' }}>
                                <img
                                    onClick={this.amplification(li, idx)}
                                    src={li}
                                    ref={r => this.img = r as HTMLImageElement}
                                    onError={this.err}
                                    style={{ width: "100px", height: "83px", borderRadius: "5px", margin: '0 auto' }}
                                />
                            </span>
                        }
                    }

                    )
                }
                <Modal
                    width={'55%'}
                    visible={this.state.show}
                    // title={<span ><Icon type="search" />查看大图</span>}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                    style={{ textAlign: 'center' }}
                >
                    <div className="swiper-container gallery-top" style={{ width: '40vw', height: '50vh' }}>
                        <div className="swiper-wrapper">
                            {
                                s.ls.map((les: any, idx: any) => (
                                    <div className="swiper-slide bigImage" key={les} data-id={idx.toString()}
                                    >
                                        <img
                                            className='box'
                                            src={les}
                                            ref={r => this.img = r as HTMLImageElement}
                                            onError={this.err}
                                            style={{ width: "100%", height: "100%", margin: '0 auto' }}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="swiper-button-prev swiper-button-black" />
                        <div className="swiper-button-next swiper-button-black" />
                    </div>
                    <div className="swiper-container gallery-thumbs" style={{ width: '40vw', height: '10vh', marginTop: '14px' }}>
                        <div className="swiper-wrapper">
                            {
                                s.ls.map((les: any, idx: number) => (
                                    <div className="swiper-slide small" key={les} data-id={idx.toString()}
                                    ><img
                                            className='box'
                                            src={les}
                                            ref={r => this.img = r as HTMLImageElement}
                                            onError={this.err}
                                            style={{ width: "100%", height: "100%", margin: '0 auto' }}
                                        />
                                    </div>

                                ))
                            }
                        </div>
                    </div>

                </Modal>
            </div>
        )
    }
}


interface IeLiprops {
    ls: any[];
    dfPath?: string;
    show: boolean;
    Cancel(v: any): void
}
interface LeState {
    show: boolean;
}
export class UImgListNoList extends React.Component<IeLiprops, LeState> {
    img: HTMLImageElement;
    dfPath: string = dfAvatar;
    mySwiper: any;
    galleryThumbs: any;
    constructor(props: IeLiprops) {
        super(props);
        this.state = {
            show: false,
        };
    }
    componentDidUpdate() {
        if (this.props.show && !this.state.show) {
            this.amplification(0);
        }
    }
    err = () => {
        const p = this.props.dfPath || this.dfPath;
        this.img.src = p;
    }
    amplification = (i: number) => {
        this.setState({ show: !this.state.show });
        setTimeout(() => {
            this.mySwiper = new swiper('.gallery-top', {
                grabCursor: true,
                slideToClickedSlide: true,
                navigation: { // 左右切换
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                initialSlide: i,
            });
            if (this.props.ls.length > 4) {
                this.galleryThumbs = new swiper('.gallery-thumbs', {
                    spaceBetween: 10, // 间隔   
                    slidesPerView: 5, // 展示数
                    freeMode: true, // 是否跳跃滑动
                    watchSlidesVisibility: true, // 可见元素class赋值
                    grabCursor: true, // 变手
                    centeredSlides: true, // 居中
                    slideToClickedSlide: true, // 可点击
                    initialSlide: i, // 位置
                });
                this.galleryThumbs.controller.control = this.mySwiper;// Swiper1控制Swiper2，需要在Swiper2初始化后
                this.mySwiper.controller.control = this.galleryThumbs;// Swiper2控制Swiper1，需要在Swiper1初始化后
            }
        }, 0);
    }
    handleCancel = () => {
        this.setState({ show: false });
        this.props.Cancel(false);
    }
    render() {
        const s = this.props;
        return (
            <div style={{ margin: '14px 0', textAlign: 'center', }}>
                <Modal
                    width={'55%'}
                    visible={this.state.show}
                    // title={<span ><Icon type="search" />查看大图</span>}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                    style={{ textAlign: 'center' }}
                >
                    <div className="swiper-container gallery-top" style={{ width: '40vw', height: '50vh' }}>
                        <div className="swiper-wrapper">
                            {
                                s.ls.map((les: any, idx: any) => (
                                    <div className="swiper-slide bigImage" key={les} data-id={idx.toString()}
                                    >
                                        <img
                                            className='box'
                                            src={les}
                                            ref={r => this.img = r as HTMLImageElement}
                                            onError={this.err}
                                            style={{ width: "100%", height: "100%", margin: '0 auto' }}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="swiper-button-prev swiper-button-black" />
                        <div className="swiper-button-next swiper-button-black" />
                    </div>
                    {
                        s.ls.length > 4 ? (
                            <div className="swiper-container gallery-thumbs" style={{ width: '40vw', height: '10vh', marginTop: '14px' }}>
                                <div className="swiper-wrapper">
                                    {
                                        s.ls.map((les: any, idx: any) => (
                                            <div className="swiper-slide small" key={les} data-id={idx.toString()}
                                            ><img
                                                    className='box'
                                                    src={les}
                                                    ref={r => this.img = r as HTMLImageElement}
                                                    onError={this.err}
                                                    style={{ width: "100%", height: "100%", margin: '0 auto' }}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : null
                    }
                </Modal>
            </div>
        )
    }
}