'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Icon, Table, Button, message, Modal, Menu, Dropdown, Popconfirm } from 'antd'
import { FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'

const baseServerURl = api.apiHost

class CallProgressToneFileList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            adtDump: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            sort: {
                field: "n",
                order: "desc"
            },
            loading: false
        }
    }
    componentDidMount() {
        this._listRecordings()
    }
    componentWillUnmount() {
    }
    _listRecordings = (
        params = {                
            item_num: 10,
            sidx: "d",
            sord: "desc",
            page: 1 
        }) => {
        this.setState({ loading: true })

        $.ajax({
            url: baseServerURl,
            method: 'post',
            data: {
                action: 'listFile',
                filter: '{"list_dir":0, "list_file":1, "file_suffix": ["raw"]}',
                ...params
            },
            type: 'json',
            async: true,
            success: function(res) {
                let adtDump = res.response.adt_dump
                const pagination = this.state.pagination
                // Read total count from server
                pagination.total = res.response.total_item

                this.setState({
                    loading: false,
                    adtDump: adtDump,
                    pagination
                })
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _downloadRecording = (record) => {
        const { formatMessage } = this.props.intl

        let fileName = record.n

        $.ajax({
            type: "post",
            url: baseServerURl,
            data: {
                "action": "checkFile",
                "type": "adt_dump",
                "data": fileName
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                    window.open("/cgi?action=downloadFile&type=adt_dump&data=" + fileName, '_self')
                } else {
                    message.error({id: "LANG3868"})
                }
            }
        })
    }
    _deleteRecording = (record) => {
        const { formatMessage } = this.props.intl

            let fileName = record.n

            Modal.confirm({
                title: '',
                content: formatMessage({id: "LANG938"}),
                okText: formatMessage({id: "LANG727"}),
                cancelText: formatMessage({id: "LANG726"}),
                onOk: () => {
                    $.ajax({
                        type: "post",
                        url: baseServerURl,
                        data: {
                            "action": "checkFile",
                            "type": "adt_dump",
                            "data": fileName
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                        },
                        success: function(data) {
                            if (data && data.hasOwnProperty("status") && (data.status === 0)) {
                                $.ajax({
                                    type: "post",
                                    url: baseServerURl,
                                    data: {
                                        "action": "removeFile",
                                        "type": "adt_dump",
                                        "data": fileName
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                    },
                                    success: function(data) {
                                        let bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                                        if (bool) {
                                            message.success(formatMessage({id: "LANG871"}))
                                            let pagination = this.state.pagination,
                                                sorter = this.state.sorter
                                                
                                            this._listRecordings({
                                                item_num: pagination.pageSize,
                                                page: pagination.current,
                                                sidx: sorter.field,
                                                sord: sorter.order === "ascend" ? "asc" : "desc"
                                            })
                                        }
                                    }.bind(this)
                                })
                            } else {
                                message.error(formatMessage({id: "LANG3868"}))
                            }
                        }
                    })               
                }
            })
    }
    _tranSize = (text, record, index) => {
        let size = parseFloat(text),
            rank = 0,
            rankchar = 'Bytes'

        while (size > 1024) {
            size = size / 1024
            rank++
        }

        if (rank === 1) {
            rankchar = "KB"
        } else if (rank === 2) {
            rankchar = "MB"
        } else if (rank === 3) {
            rankchar = "GB"
        }

        return Math.round(size * Math.pow(10, 2)) / Math.pow(10, 2) + " " + rankchar
    }
    render() {
        const {formatMessage} = this.props.intl

        const columns = [
            {
                title: formatMessage({id: "LANG135"}),
                dataIndex: 'n',
                sorter: true
            }, {
                title: formatMessage({id: "LANG203"}),
                dataIndex: 'd',
                sorter: true
            }, {
                title: formatMessage({id: "LANG2257"}),
                dataIndex: 's',
                sorter: true,
                render: (text, record, index) => {
                    this._tranSize(text, record, index)
                }
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => {
                    return <span>
                        <Popconfirm title={
                            <FormattedHTMLMessage
                                id='LANG4471'
                                values={{
                                    0: record.trunk_name
                                }}
                            />} 
                            onConfirm={() => this._deleteRecording(record)}>
                            <span className="sprite sprite-del" title={ formatMessage({ id: "LANG739"})} ></span>
                        </Popconfirm>
                        <span className="sprite sprite-download" title={ formatMessage({ id: "LANG738"})} onClick={this._downloadRecording.bind(this, record)}></span>
                    </span>
                } 
            }
        ]
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows)
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User'    // Column configuration not to be checked
            })
        }        
        return (
            <div className="app-content-main" id="app-content-main">
                <Table
                    rowSelection={ false } 
                    columns={ columns }
                    rowKey={ record => record.n }
                    dataSource={ this.state.adtDump }
                    pagination={ this.state.pagination }
                    loading={ this.state.loading}
                    onChange={ this._handleTableChange }
                />
            </div>
        )
    }
}

CallProgressToneFileList.propTypes = {
    
}

export default injectIntl(CallProgressToneFileList)