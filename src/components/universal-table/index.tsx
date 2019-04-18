import * as React from 'react';
import './style.css'
import { Table, Row, Col, Pagination } from 'antd';
import { ColumnProps } from 'antd/lib/table';


interface Ipaging {
    current: number;
    total: number;
    size?: number;
    onChange(index: number): void;
}

interface RowSelectCfg {
    selectedRowKeys?: string[] | number[];
    onChange(key: string[] | number[], val: any): void;
}

interface ItableProps<T> {
    scroll?: boolean;
    clickExpend?: boolean;
    border?: boolean;                // 边框
    selectCfg?: RowSelectCfg;       // 多选框配置
    paging?: Ipaging;                // 分页配置
    buttons?: JSX.Element | JSX.Element[];           // 表格顶部的操作按钮
    search?: JSX.Element;            // 表格右上角的搜索按钮
    columns: ColumnProps<T>[];       // 表格列配置
    data: T[];                       // 表格数据源
    loading: boolean;                // 是否显示加载动画
    selectRow?(val: T): void;         // 点击行
    equal?(a?: T, b?: T): boolean;     // 判断两个对象是否相等
    extend?(record: T): JSX.Element;
    onExpand?(expaned: boolean, record: any): void;
}

interface ItableState<T> {
    selected: T | undefined;
}

export class Utable<T> extends React.Component<ItableProps<T>, ItableState<T>> {

    state = {
        selected: undefined,
    };

    row = (r: T, i: number) => {
        const rh = this.props.selectRow;
        return {
            onClick: () => {
                this.setState({ selected: r });
                if (rh) {
                    rh(r);
                }
            }
        }
    };

    rowClassName = (r: T, idx: any): string => (
        this.props.equal ?
            this.props.equal(r, this.state.selected) :
            r === this.state.selected
    ) ? 'selected' : '';
    // rowClassName = (r: T, idx: number): string => (idx % 2 !== 0) ? 'show' : '';



    selectItem = (selected?: T | null) => this.setState({ selected: selected || undefined });

    render() {
        return (
            <div >
                <div className="card_for_utable">
                    <Row>
                        <Col span={21}>
                            {this.props.search ? this.props.search : ''}</Col>
                        <Col span={3}>
                            {this.props.buttons ? this.props.buttons : ''}</Col>
                    </Row>
                </div>
                <Table
                    expandRowByClick={this.props.clickExpend || undefined}
                    onRow={this.props.selectRow ? this.row : undefined}
                    scroll={{ x: this.props.scroll ? this.props.scroll : false }}
                    columns={this.props.columns}
                    dataSource={this.props.data}
                    bordered={this.props.border ? true : false}
                    loading={this.props.loading}
                    expandedRowRender={this.props.extend || undefined}
                    onExpand={this.props.onExpand || undefined}
                    rowSelection={this.props.selectCfg}
                    rowClassName={this.rowClassName}
                    pagination={false}
                />
                {
                    this.props.paging && this.props.paging.total > 10 ? (
                        <div className="card_for_utable">
                            <Row>
                                <Col span={16}>
                                    <Pagination
                                        showQuickJumper={true}
                                        current={this.props.paging.current}
                                        pageSize={this.props.paging.size}
                                        total={this.props.paging.total}
                                        onChange={this.props.paging.onChange} />
                                </Col>
                                <Col span={8} style={{ textAlign: 'right', lineHeight: '32px' }}>
                                    <div>
                                        <span>共{Math.ceil(Number(this.props.paging.total) / Number(this.props.paging.size))}页，{this.props.paging.total}条记录，每页显示{this.props.paging.size}条</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}

