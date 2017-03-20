'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Button, message, Form, Input, Modal, Table, Tag, Tooltip, Col, Icon } from 'antd'
import Validator from "../../api/validator"

const confirm = Modal.confirm
const FormItem = Form.Item

class WarningContact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            superList: [],
            managerList: []
        }
    }
    componentDidMount() {
        this._getInitDate()
    }
    _checkRequire = (rule, value, callback) => {
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        const enEmail = this.props.enEmail
        const manager_0 = getFieldValue('manager_0')
        if (enEmail && manager_0 === "") {
            callback(formatMessage({id: "LANG2150"}))
        } else {
            callback()
        }
    }
    _getInitDate = () => {
        let superList = this.state.superList
        let managerList = this.state.managerList

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'warningGetEmailSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    let dataItem = response.body
                    let superListTmp = dataItem.admin_email.split(',')
                    let managerListTmp = dataItem.email.split(',')
                    for (let i = 0; i < superListTmp.length; i++) {
                        superList.push({
                            value: superListTmp[i],
                            key: i,
                            new: false
                        })
                    }
                    for (let i = 0; i < managerListTmp.length; i++) {
                        managerList.push({
                            value: managerListTmp[i],
                            key: i,
                            new: false
                        })
                    }
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        this.setState({
            superList: superList,
            managerList: managerList
        })
    }
    _generateKeysID = (existIDs) => {
        let newID = 1
        const keyList = _.pluck(existIDs, 'key')

        if (keyList && keyList.length) {
            newID = _.find([1, 2, 3, 4, 5, 6, 7, 8, 9], function(key) {
                    return !_.contains(keyList, key)
                })
        }

        return {
                new: true,
                key: newID,
                value: ""
            }
    }
    _addSuperEmail = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        // can use data-binding to get
        const keys = form.getFieldValue('super_keys')
        if (keys.length <= 9) {
            const nextKeys = keys.concat(this._generateKeysID(keys))
            form.setFieldsValue({
                super_keys: nextKeys
            })
        } else {
            message.warning(formatMessage({id: "LANG2574"}))

            return false
        }
    }
    _addManagerEmail = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl
        // can use data-binding to get
        const keys = form.getFieldValue('manager_keys')
        if (keys.length <= 9) {
            const nextKeys = keys.concat(this._generateKeysID(keys))
            form.setFieldsValue({
                manager_keys: nextKeys
            })
        } else {
            message.warning(formatMessage({id: "LANG2574"}))

            return false
        }
    }
    _removeSuperEmail = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('super_keys')

        form.setFieldsValue({
            super_keys: keys.filter(key => key !== k)
        })
    }
    _removeManagerEmail = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('manager_keys')

        form.setFieldsValue({
            manager_keys: keys.filter(key => key !== k)
        })
    }
    _gotoEmailTemplateOK = () => {
        browserHistory.push('/system-settings/emailSettings/template')
    }
    _gotoEmailTemplate = () => {
        const { formatMessage } = this.props.intl
        const __this = this
        confirm({
            title: (formatMessage({id: "LANG543"})),
            content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG843"}, {0: formatMessage({id: "LANG4576"})})}} ></span>,
            onOk() {
                __this._gotoEmailTemplateOK()
            },
            onCancel() {}
        })
    }
    _warningStart = () => {
        $.ajax({
            url: api.apiHost + 'action=reloadWarning&warningStart=',
            method: "GET",
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }
            }.bind(this)
        })
    }
    _warningStop = () => {
        $.ajax({
            url: api.apiHost + 'action=reloadWarning&warningStop=',
            method: "GET",
            type: 'json',
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }

                this._handleCancel()
            }.bind(this)
        })
    }
    _handleSubmit = () => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG904" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG844" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this._warningStop()
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)
                let action = {}
                action.action = 'warningUpdateEmailSettings'
                let admin_email_list = []
                let email_list = []
                for (let i = 0; i <= 9; i++) {
                    if (values[`super_${i}`]) {
                        admin_email_list.push(values[`super_${i}`])
                    }
                    if (values[`manager_${i}`]) {
                        email_list.push(values[`manager_${i}`])
                    }
                }
                action.admin_email = admin_email_list.join(',')
                action.email = email_list.join(',')

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(successMessage)
                        }
                    }.bind(this)
                })
                this._warningStart()
            }
        })
    }
    _handleCancel = () => {

    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue, getFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: formatMessage({id: "LANG2546"})
                })
        const formItemWithoutLabelLayout = {
            wrapperCol: { span: 18, offset: 3 }
        }
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }
        const superList = this.state.superList || []
        const managerList = this.state.managerList || []
        // let superKeyList = []
        // let managerKeyList = []

        getFieldDecorator('super_keys', { initialValue: superList })
        getFieldDecorator('manager_keys', { initialValue: managerList })
        const super_keys = getFieldValue('super_keys')
        const manager_keys = getFieldValue('manager_keys')
        const formSuperItem = super_keys.map((k, index) => {
            if (index === 0) {

            } else {
                return (
                <FormItem key={k.key}
                    { ...formItemWithoutLabelLayout }
                >
                    <Col span="8">
                        <FormItem>
                            {getFieldDecorator(`super_${k.key}`, {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.email(data, value, callback, formatMessage)
                                    }
                                }],
                                initialValue: k.value
                                })(
                                    <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="1">
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={ () => this._removeSuperEmail(k) }
                        />
                    </Col>
                </FormItem>
                )
            }
        })
        const formManagerItem = manager_keys.map((k, index) => {
            if (index === 0) {

            } else {
                return (
                <FormItem key={k.key}
                    { ...formItemWithoutLabelLayout }
                >
                    <Col span="8">
                        <FormItem>
                            {getFieldDecorator(`manager_${k.key}`, {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.email(data, value, callback, formatMessage)
                                    }
                                }],
                                initialValue: k.value
                                })(
                                    <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span="1">
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={ () => this._removeManagerEmail(k) }
                        />
                    </Col>
                </FormItem>
                )
            }
        })

        return (
            <div className="app-content-main">
                <div className="content">
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2573" />}>
                                    <span>{formatMessage({id: "LANG5058"})}</span>
                                </Tooltip>
                            )}>
                            <Col span="8">
                                <FormItem>
                                    {getFieldDecorator("super_0", {
                                        rules: [{
                                            validator: this._checkRequire
                                        }, {
                                            validator: (data, value, callback) => {
                                                Validator.email(data, value, callback, formatMessage)
                                            }
                                        }],
                                        initialValue: superList[0] ? superList[0].value : ""
                                        })(
                                            <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="1">
                                <Icon
                                    className="dynamic-plus-button"
                                    type="plus-circle-o"
                                    onClick={ this._addSuperEmail }
                                />
                            </Col>
                            <Col span={6} offset={1} >
                                <a className="email_template" onClick={ this._gotoEmailTemplate } >{ formatMessage({id: "LANG4576"}) }</a>
                            </Col>
                        </FormItem>
                        { formSuperItem }
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG2573" />}>
                                    <span>{formatMessage({id: "LANG2572"})}</span>
                                </Tooltip>
                            )}>
                            <Col span="8">
                                <FormItem>
                                    {getFieldDecorator("manager_0", {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                Validator.email(data, value, callback, formatMessage)
                                            }
                                        }],
                                        initialValue: managerList[0] ? managerList[0].value : ""
                                        })(
                                            <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="1">
                                <Icon
                                    className="dynamic-plus-button"
                                    type="plus-circle-o"
                                    onClick={ this._addManagerEmail }
                                />
                            </Col>
                            <Col span={6} offset={1} >
                                <a className="email_template" onClick={ this._gotoEmailTemplate } >{ formatMessage({id: "LANG4576"}) }</a>
                            </Col>
                        </FormItem>
                        { formManagerItem }
                    </Form>
                </div>
            </div>
        )
    }
}

export default injectIntl(WarningContact)