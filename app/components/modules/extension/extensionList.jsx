'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { Form, Icon, Button, Table, message, Popconfirm } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import * as Actions from './actions/'
import UCMGUI from "../../api/ucmgui"

class extensionList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        this.props.listAccount()
    }
    _deleteUser = (data) => {
        const { formatMessage } = this.props.intl

        let extension = data.extension
        message.loading(formatMessage({ id: "LANG825" }, {0: "LANG11"}), 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteUser",
                "user_name": extension
            },
            type: 'json',
            async: true,
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(formatMessage({ id: "LANG816" }))
                    this.props.listAccount()
                }
            }.bind(this),
            error: function(e) {
                console.log(e.toString())
            }
        })
    }
    _createStatus = (text, record, index) => {
        const {formatMessage} = this.props.intl

        let status,
            disabled = record.out_of_service,
            extension = record.extension

        if (disabled === 'yes') {
            status = <span extension={extension} className="sprite sprite-status-unmonitored" title={formatMessage({ id: "LANG273" })} ></span>
        } else if (!text || text === 'Unavailable') {
            status = <span extension={extension} className="sprite sprite-status-unavailable" title={formatMessage({ id: "LANG113" })} ></span>
            // status = <Icon type="delete" />
        } else if (text === 'Idle') {
            status = <span extension={extension} className="sprite sprite-status-idle" title={formatMessage({ id: "LANG2232" })} ></span>
        } else if (text === 'InUse') {
            status = <span extension={extension} className="sprite sprite-status-inuse" title={formatMessage({ id: "LANG2242" })} ></span>
        } else if (text === 'Ringing') {
            status = <span extension={extension} className="sprite sprite-status-ringing" title={formatMessage({ id: "LANG111" })} ></span>
        } else if (text === 'Busy') {
            status = <span extension={extension} className="sprite sprite-status-busy" title={formatMessage({ id: "LANG2237" })} ></span>
        }

        return status
        // return <Icon type="delete" />
    }
    _editUser = (e) => {
        browserHistory.push('/extension-trunk/extension/editExtension')
    }
    render() {
        const {formatMessage} = this.props.intl
        const data = this.props.account

        const columns = [
            {
                title: formatMessage({id: "LANG81"}),
                dataIndex: 'status', 
                render: (text, record, index) => (
                    this._createStatus(text, record, index)
                    // <Icon type="delete" />
                ) 
            }, {
                title: formatMessage({id: "LANG85"}),
                dataIndex: 'extension',
                sorter: (a, b) => a.age - b.age
            }, {
                title: formatMessage({id: "LANG1065"}),
                dataIndex: 'fullname'
            }, {
                title: formatMessage({id: "LANG623"}),
                dataIndex: 'account_type'
            }, {
                title: formatMessage({id: "LANG624"}),
                dataIndex: 'addr'
            }, {
                title: formatMessage({id: "LANG4152"}),
                dataIndex: 'email_to_user'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => (
                    <div>
                        <span className="sprite sprite-edit" onClick={this._editUser.bind(this, record)}></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this._deleteUser(record)}>
                            <span className="sprite sprite-del"></span>
                        </Popconfirm>
                    </div>
                ) 
            }
        ]
        
        const pagination = {
            total: data.length,
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
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
        )
    }
}

extensionList.defaultProps = {
    
}

const mapStateToProps = (state) => ({
   account: state.account
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(injectIntl(extensionList)))