'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Modal, Button, Row, Col, Checkbox, message, Tooltip, Select, Tabs, Spin, Table } from 'antd'
import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import Validator from "../../api/validator"
import Title from '../../../views/title'
import UCMGUI from "../../api/ucmgui"

const FormItem = Form.Item
const Option = Select.Option
const baseServerURl = api.apiHost

class EditLdapPhonebook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ldapPhonebooks: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            sorter: {
                field: "dn",
                order: "asc"
            }
        }
    }
    componentDidMount() {
        this._listPhonebookDn()
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _handleTableChange = (pagination, filters, sorter) => {
        const pager = this.state.pagination

        pager.current = pagination.current

        this.setState({
            pagination: pager,
            sorter: sorter
        })

        this._listPhonebookDn({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field,
            sord: sorter.order === "ascend" ? "asc" : "desc",
            ...filters
        })
    }
    _listPhonebookDn = (
        params = {                
            item_num: 10,
            sidx: "dn",
            sord: "asc",
            page: 1 
        }) => {
        $.ajax({
            url: baseServerURl,
            method: 'post',
            data: {
                action: 'listPhonebookDn',
                ...params
            },
            type: 'json',
            async: true,
            success: function(res) {
                let ldapPhonebooks = res.response.ldap_phonebooks
                const pagination = this.state.pagination
                // Read total count from server
                pagination.total = res.response.total_item

                this.setState({
                    firstLoad: false,
                    ldapPhonebooks: ldapPhonebooks,
                    pagination
                })
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _deleteLdapPhonebook = (data) => {
        const { formatMessage } = this.props.intl

        let phonebookdn = data.dn
        message.loading(formatMessage({id: "LANG825"}, {0: "LANG11"}), 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deletePhonebook",
                "ldap_phonebooks": phonebookdn
            },
            type: 'json',
            async: true,
            success: function(res) {
                let bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    // message.success(formatMessage({id: "LANG816"}))
                    let cmd_action = {
                        "action": "phonebookDel",
                        "phonebook_del": phonebookdn
                    }

                    $.ajax({
                        type: "post",
                        url: baseServerURl,
                        async: false,
                        data: cmd_action,
                        error: function(jqXHR, textStatus, errorThrown) {
                            message.destroy()
                            message.error(errorThrown)
                        }.bind(this),
                        success: function(data) {
                            this._listPhonebookDn()
                        }.bind(this)
                    })
                }
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        const state = this.state
        const columns = [
            {
                title: formatMessage({id: "LANG2003"}),
                dataIndex: 'dn',
                sorter: true
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => {
                    return <span>
                        <span className="sprite sprite-edit" title={ formatMessage({ id: "LANG738"})} onClick={this._editLdapPhonebook.bind(this, record)}></span>
                        <Popconfirm title={
                            <FormattedHTMLMessage
                                id='LANG952'
                            />} 
                            onConfirm={() => this._deleteLdapPhonebook(record)}>
                            <span className="sprite sprite-del" title={ formatMessage({ id: "LANG739"})} ></span>
                        </Popconfirm>
                    </span>
                } 
            }
        ]
        const pagination = {
            total: state.ldapPhonebooks.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange(current) {
                console.log('Current: ', current)
            }
        }
        return (
            <div className="content">
                <Title 
                    headerTitle={ formatMessage({ id: "LANG953" }, { 0: "dn" }) } 
                    onSubmit={ this._handleSubmit } 
                    onCancel={ this._handleCancel } 
                    isDisplay="display-block"
                />
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2227"}) }>
                                        {formatMessage({id: "LANG2222"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('accountnumber', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2025"}) }>
                                        {formatMessage({id: "LANG1361"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('calleridname', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2033"}) }>
                                        {formatMessage({id: "LANG2032"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('email', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="64" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2027"}) }>
                                        {formatMessage({id: "LANG2026"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('firstname', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2029"}) }>
                                        {formatMessage({id: "LANG2028"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('lastname', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2031"}) }>
                                        {formatMessage({id: "LANG2030"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('department', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2035"}) }>
                                        {formatMessage({id: "LANG2034"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('mobilenumber', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2037"}) }>
                                        {formatMessage({id: "LANG2036"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('homenumber', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ formatMessage({id: "LANG2039"}) }>
                                        {formatMessage({id: "LANG95"})}
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('fax', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="32" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowSelection={ undefined } 
                    columns={ columns }
                    rowKey={ record => record.dn }
                    dataSource={ state.ldapPhonebooks }
                    pagination={ state.pagination }
                    onChange={ this._handleTableChange }
                />
            </div>
        )
    }
}

module.exports = Form.create()(injectIntl(EditLdapPhonebook))