'use strict'

import $ from 'jquery'
import _ from 'underscore'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { browserHistory } from 'react-router'
import { Form, Input, Button, Row, Col, Checkbox, message, Popover, Select, Table, Tabs, Popconfirm } from 'antd'
const FormItem = Form.Item

import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import ZEROCONFIG from './parser/ZCDataSource'

class GlobalTemplates extends Component {
    constructor(props) {
        super(props)
        this.state = {
            templates: []
        }
    }
    componentDidMount() {
        this._listGlobalTemplates()
    }
    componentWillUnmount() {

    }
    _listGlobalTemplates = () => {
        $.ajax({
            method: "post",
            url: api.apiHost,
            data: {
                action: "getAllTemplates",
                template_type: "global"
            },
            async: true,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        templates = res.templates
                    this.setState({
                        templates: templates
                    })
                }
            }.bind(this)
        })              
    }
    _createGlobalTemplate() {
        browserHistory.push('/value-added-features/zeroConfig/createGlobalTemplate')
    }
    _editGlobalTemplate = (record) => {
        browserHistory.push('/value-added-features/zeroConfig/editGlobalTemplate/edit/' + record.id)
    }
    _deleteGlobalTemplate = (data) => {
        const { formatMessage } = this.props.intl
    }
    render() {
        const {formatMessage} = this.props.intl

        const columns = [
            {
                title: formatMessage({id: "LANG3449"}),
                dataIndex: 'name'
            }, {
                title: formatMessage({id: "LANG3450"}),
                dataIndex: 'description'
            }, {
                title: formatMessage({id: "LANG3061"}),
                dataIndex: 'enabled'
            }, {
                title: formatMessage({id: "LANG3453"}),
                dataIndex: 'used'
            }, {
                title: formatMessage({id: "LANG3454"}),
                dataIndex: 'last_modified'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => (
                    <span>
                        <span className="sprite sprite-edit" onClick={this._editGlobalTemplate.bind(this, record)}></span>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this._deleteGlobalTemplate(record)}>
                            <span className="sprite sprite-del" ></span>
                        </Popconfirm>
                    </span>
                ) 
            }
        ]
        
        const pagination = {
            total: this.state.templates.length,
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
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this._createGlobalTemplate} >
                            {formatMessage({id: "LANG3446"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._deleteGlobalTemplate} >
                            {formatMessage({id: "LANG3447"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._toggleGlobalTemplate} >
                            {formatMessage({id: "LANG3448"})}
                        </Button>
                    </div>
                    <Table rowSelection={rowSelection} 
                           columns={columns} 
                           dataSource={this.state.templates} 
                           pagination={pagination} 
                    />
                </div>
            </div>
        )
    }
}

GlobalTemplates.propTypes = {
}

export default injectIntl(GlobalTemplates)