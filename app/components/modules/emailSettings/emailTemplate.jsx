'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Table } from 'antd'
const FormItem = Form.Item
import Validator from "../../api/validator"

class EmailTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            account_template: [],
            emailType: {
                'account': 'LANG85',
                'cdr': 'LANG7',
                'conference': 'LANG3775',
                'alert': 'LANG2553',
                'fax': 'LANG95',
                'password': 'LANG2810',
                'voicemail': 'LANG20',
                'sip_account': 'LANG2927',
                'iax_account': 'LANG2928',
                'fxs_account': 'LANG2929'
            },
            fileList: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    componentWillUnmount() {

    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        let account_template = this.state.account_template
        let fileList = this.state.fileList
        const emailType = this.state.emailType

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'account_template',
                sord: 'desc',
                sidx: 'd'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    account_template = response.account_template || []

                    $.each(account_template, function(index, item) {
                        let name = item.n
                        let type = name.substr(0, name.length - 14)

                        if (emailType[type]) {
                            fileList.push(item)
                        }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            account_template: account_template,
            fileList: fileList
        })
    }
    _createType = (text, record, index) => {
        const { formatMessage } = this.props.intl
        const emailType = this.state.emailType
        let type = record.n.substr(0, record.n.length - 14)
        let locale = emailType[type]

        const cellvalue = <span>{ formatMessage({id: locale}) }</span>
        return <div>
            { cellvalue }
        </div>
    }
    _edit = (record) => {

    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const columns = [{
                key: 'type',
                dataIndex: 'type',
                title: formatMessage({id: "LANG84"}),
                width: 150,
                render: (text, record, index) => (
                    this._createType(text, record, index)
                )
            }, {
                key: 'n',
                dataIndex: 'n',
                title: formatMessage({id: "LANG135"}),
                width: 150
            }, {
                key: 'd',
                dataIndex: 'd',
                title: formatMessage({id: "LANG247"}),
                width: 150
            }, {
                key: 'options',
                dataIndex: 'options',
                title: <span>Warn</span>,
                width: 150,
                render: (text, record, index) => {
                    return <div>
                            <span
                                className="sprite sprite-edit"
                                title={ formatMessage({id: "LANG738"}) }
                                onClick={ this._edit.bind(this, record) }>
                            </span>
                        </div>
                }
            }]

        const pagination = {
                total: this.state.fileList.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }
        return (
                <div className="app-content-main" id="app-content-main">
                    <div className="content">
                        <Table
                            rowKey=""
                            columns={ columns }
                            pagination={ false }
                            dataSource={ this.state.fileList }
                            showHeader={ !!this.state.fileList.length }
                        />
                    </div>
                </div>
            )
    }
}

EmailTemplate.propTypes = {
}

export default Form.create()(injectIntl(EmailTemplate))
