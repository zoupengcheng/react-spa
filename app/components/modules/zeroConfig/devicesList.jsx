'use strict'

import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { Table, message, Popconfirm } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"

class DevicesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            zeroconfig: [],
            filter: props.filter
        }
    }
    componentDidMount() {
        this._listZeroConfig(this.state.filter)
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            filter: newProps.filter
        })
        this._listZeroConfig(newProps.filter)
    }
    _listZeroConfig = (filter) => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'listZeroConfig',
                "options": "mac,ip,members,version,vendor,model,state,last_access",
                "filter": filter
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        zeroconfig = res.zeroconfig
                    this.setState({
                        zeroconfig: zeroconfig
                    })
                }
            }.bind(this)
        })         
    }
    _deleteTrunk = (data) => {
        const { formatMessage } = this.props.intl

        let trunkIndex = data.trunk_index
        message.loading(formatMessage({ id: "LANG825" }, {0: "LANG11"}), 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteAnalogTrunk",
                "analogtrunk": trunkIndex
            },
            type: 'json',
            async: true,
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    // message.success(formatMessage({ id: "LANG816" }))
                    this._listVoipTrunk()
                }
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _editTrunk = (e) => {
        browserHistory.push('/extension-trunk/voipTrunk/editVoipTrunk')
    }
    render() {
        const {formatMessage} = this.props.intl

        const columns = [
            {
                title: formatMessage({id: "LANG1293"}),
                dataIndex: 'mac'
            }, {
                title: formatMessage({id: "LANG1291"}),
                dataIndex: 'ip'
            }, {
                title: formatMessage({id: "LANG85"}),
                dataIndex: 'members'
            }, {
                title: formatMessage({id: "LANG1298"}),
                dataIndex: 'version'
            }, {
                title: formatMessage({id: "LANG1299"}),
                dataIndex: 'vendor'
            }, {
                title: formatMessage({id: "LANG1295"}),
                dataIndex: 'model'
            }, {
                title: formatMessage({id: "LANG1301"}),
                dataIndex: 'state'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => (
                    <span>
                        <span className="sprite sprite-edit" onClick={this._editTrunk.bind(this, record)}></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this._deleteTrunk(record)}>
                            <span className="sprite sprite-del" ></span>
                        </Popconfirm>
                    </span>
                ) 
            }
        ]
        
        const pagination = {
            total: this.state.zeroconfig.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange(current) {
                console.log('Current: ', current)
            }
        }
        
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            },
            onSelect(record, selected, selectedRows) {
                console.log(record, selected, selectedRows)
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows)
            }
        }

        return (
            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.zeroconfig} pagination={pagination} />
        )
    }
}

DevicesList.defaultProps = {
    
}

export default injectIntl(DevicesList)