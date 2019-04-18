import * as React from 'react';
import './style.css';


export interface Category {
    CategoryId: string;
    CategoryName: string;
}

interface Props {
    code: any;
    isShow: boolean;
    menuList: string;
    productList: any[];
}

interface State {
    ParamsList: any;
    indeterminate: boolean;
    DataList: any;
    ExeclList: any;
    ShowList: any;
    price: any;
    titles: any
}

export class ParametersPriceComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ParamsList: [],
            indeterminate: true,
            DataList: [],
            ExeclList: [],
            ShowList: [],
            price: [],
            titles: ['起订量','不含税价格','含税价格'],
        };
    }

    componentWillMount() {
        this.getparams();
    }

    getparams = () => {
        const arr = JSON.parse(this.props.menuList);
        if(Boolean(arr)) {
            let length = arr.length;
            const titles = this.state.titles;
            arr.push({
                ParamId: '1222',
                ParamName: titles[0],
                index: length,
                ParamValueList: [''],
            })
            arr.push({
                ParamId: '1223',
                ParamName: titles[1],
                index: ++length,
                ParamValueList: [''],
            })
            arr.push({
                ParamId: '1224',
                ParamName: titles[2],
                index: ++length,
                ParamValueList: [''],
            })
            this.setState({DataList: arr})
            this.GoExecl(arr);      
        }   
    }
   
    // execl转换
    GoExecl = (Arr: any) => {
        let Brr: any[] = [];
        if (Arr.length) {
            for (let i = 0; i < Arr.length; i++) {
                if (!Brr.length) {
                    Arr[0].ParamValueList.forEach((it: any) => {
                        const d = new Object();
                        d[Arr[0].ParamName] = it.ParamOptionalName;
                        Brr.push(d);
                    });
                } else {
                    const arr: any[] = [];
                    const brr: any[] = [];
                    Arr[i].ParamValueList.forEach((ais: any) => {
                        const d = new Object();
                        d[Arr[i].ParamName] = ais.ParamOptionalName;
                        arr.push(d);
                    });
                    Brr.forEach(v1 => {
                        arr.forEach(v2 => {
                            brr.push(Object.assign({}, v1, v2))
                        })
                    })
                    Brr = brr;
                }
            }
            this.setState({ExeclList: Brr  });
            this.appendPrice(Brr);
        }
        this.makeShow();
    }

    appendPrice = (ExeclList: any) => {
        const titles = this.state.titles;
        const arr: any = [];

        ExeclList.map((item: any, idx: number) => {

            const cloneItem = Object.assign({}, item);
            delete cloneItem[titles[0]]
            delete cloneItem[titles[1]]
            delete cloneItem[titles[2]]

            const product = this.getParamPrice(cloneItem);
            
            if(product) {
                item[titles[0]] = product.SetNum;  
                item[titles[1]] = product.NowMarketNoTax;    
                item[titles[2]] = product.NowMarketTax; 
                arr.push(item);
            }    
        })

        this.setState({ExeclList: arr});
    }

    getParamPrice = (item: any) => {
        const ProductList = this.props.productList;

        for(let i=0; i < ProductList.length; i++) {
            const product = ProductList[i];
            const params = product.GoodsParamsDict;
            let equals = true;

            const keys = Object.keys(item);
            for(let j = 0; j < keys.length; j++) {
                if(item[keys[j]] !== params[keys[j]]) {
                    equals = false;
                    break;
                }
            }

            if(equals) {
                return product;
            }
        }

        return null;
    }

    // 显示列表构成
    makeShow = () => {
        const Arr = this.state.DataList;
        const tarA: any[] = [];
        for (let is = 0; is < Arr.length; is++) {
            if (is === 0) {
                tarA.push(Arr[is]);
            } else {
                const list = Arr[is].ParamValueList;
                const tar = Arr[is];
                if (tarA.length && tarA[is - 1].ParamValueList && tarA[is - 1].ParamValueList.length) {
                    tarA[is - 1].ParamValueList.forEach((ds: any, idx: any) => {
                        if (idx !== 0) {
                            tar.ParamValueList = tar.ParamValueList.concat(list);
                        }
                    });
                    tarA.push(tar);
                }
            }
        }
        this.setState({ ShowList: tarA });
    }

   
   
    render() {
        const s = this.state;
        // console.log(JSON.stringify(s.ExeclList), "++++++++++++++++++++++++++",
        //     JSON.stringify(s.DataList));
        return (
            <div style={{ backgroundColor: "#fff" }}>
               
                {
                    s.DataList.length ? (
                        <div id='media'>
                            <div style={{ margin: '0 auto' }}>
                                <div style={{
                                    width: '100%', textAlign: "center", lineHeight: "24px", fontSize: '24px'
                                }}>
                                    {
                                        s.ExeclList.length <= 15 ? (
                                            <table className="mytable" style={{ width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        {
                                                            s.DataList.map((si: any) => (
                                                                <td style={{ fontWeight: 'bold', lineHeight: '32px', fontSize: '32px' }} key={si.ParamId}>{si.ParamName}</td>
                                                            ))
                                                        }
                                                    </tr>
                                                </tbody>
                                            </table>
                                        ) : (
                                                <table className="mytable mytableTop" >
                                                    <tbody>
                                                        <tr>
                                                            {
                                                                s.DataList.map((si: any) => (
                                                                    <td style={{ fontWeight: 'bold', lineHeight: '32px', fontSize: '32px' }} key={si.ParamId}>{si.ParamName}</td>
                                                                ))
                                                            }
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )
                                    }

                                </div>
                                <div style={{ maxHeight: "385px", width: '100%', overflow: "auto", textAlign: "center", lineHeight: "24px", fontSize: '24px', }}>
                                    <table className="mytable" style={{ width: '100%' }}>
                                        <tbody>
                                            {/* <tr>
                                        {
                                            s.DataList.map((si: any) => (
                                                <td style={{ fontWeight: 'bold', lineHeight: '32px', fontSize: '32px' }} key={si.ParamId}>{si.ParamName}</td>
                                            ))
                                        }
                                    </tr> */}
                                            {/* {
                                                s.ExeclList.map((is: any, ic: any) => (
                                                    < tr key={"ExeclList" + ic} >
                                                        {
                                                            s.ShowList.map((si: any, it: any) => (
                                                                ic === 0 ? (
                                                                    < td style={{ cursor: "pointer" }} rowSpan={s.ExeclList.length / si.item.length} 
                                                                        key={"ExeclList" + ic + si.ParamId + it} id={"ExeclList" + ic + si.ParamId + it}> {is[si.ParamName]}</td>
                                                                ) : (
                                                                        ic % (s.ExeclList.length / si.item.length) === 0 ? (
                                                                            < td style={{ cursor: "pointer" }} rowSpan={s.ExeclList.length / si.item.length}
                                                                                key={"ExeclList" + ic + si.ParamId + it} id={"ExeclList" + ic + si.ParamId + it}> {is[si.ParamName]}</td>
                                                                        ) : null
                                                                    )
                                                            ))
                                                        }
                                                    </tr>
                                                ))
                                            } */}
                                            {
                                        s.ExeclList.map((is: any, ic: any) => (
                                            < tr key={"ExeclList" + ic} >
                                                {
                                                    s.DataList.map((si: any, it: any) => < td style={{ cursor: "pointer" }}
                                                    key={"ExeclList" + ic + si.ParamId + it} > {is[si.ParamName]}</td>)
                                                }
                                            </tr>
                                        ))
                                    }
                                        </tbody>
                                    </table>
                                </div>
                            </div >
                        </div >
                    ) : (
                            <div style={{ width: '100%' }}>
                                <h3 style={{ textAlign: "center" }}>此类型参数表未生成,请先配置参数</h3>
                            </div>
                        )
                }

            </div >
        )
    }
}