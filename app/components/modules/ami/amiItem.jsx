'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Icon } from 'antd'

const FormItem = Form.Item
let uuid = 1

class RoomAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ipList: [],
            netmaskList: [],
            userItem: {},
            priBox: {
                "originate": false,
                "call": false,
                "cdr": false,
                "agent": false,
                "cc": false,
                "dtmf": false,
                "dialplan": false,
                "reporting": false,
                "user": false,
                "security": false,
                "all": false
            }
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.groupNameList, value) > -1) {
            callback(formatMessage({id: "LANG2137"}))
        } else {
            callback()
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _getInitData = () => {
        const userId = this.props.params.id
        const userName = this.props.params.name
        let userItem = {}
        let ipList = this.ipList || []
        let netmaskList = this.netmaskList || []

        if (userId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getAmiUser',
                    user: userId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        userItem = res.response.user || {}

                        let ipallList = userItem.permit.split(';')
                        for (let i = 0; i < ipallList.length; i++) {
                            let tmp = ipallList[i]
                            let tmpList = tmp.split('/')
                            ipList.push(tmpList[0])
                            netmaskList.push(tmpList[1])
                        }
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            userItem: userItem,
            ipList: ipList,
            netmaskList: netmaskList
        })
    }
    _removeIP = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')

        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        })
    }

    _addIP = () => {
        uuid++
        const { form } = this.props
        // can use data-binding to get
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(uuid)
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys
        })
    }
    _priallChecked = (e) => {
        let priBox = this.state.priBox
        if (e.target.checked) {
            priBox.originate = true
            priBox.call = true
            priBox.cdr = true
            priBox.agent = true
            priBox.cc = true
            priBox.dtmf = true
            priBox.dialplan = true
            priBox.reporting = true
            priBox.user = true
            priBox.security = true
            priBox.all = true
        } else {
            priBox.originate = false
            priBox.call = false
            priBox.cdr = false
            priBox.agent = false
            priBox.cc = false
            priBox.dtmf = false
            priBox.dialplan = false
            priBox.reporting = false
            priBox.user = false
            priBox.security = false
            priBox.all = false
        }
        this.setState({
            priBox: priBox
        })
    }
    _handleCancel = () => {
        browserHistory.push('/value-added-features/ami')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const { getFieldValue } = this.props.form
        const userId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let action = values
                let priList = []
                let ipList = []

                if (values.originate) {
                    priList.push('originate')
                }
                if (values.originate) {
                    priList.push('call')
                }
                if (values.originate) {
                    priList.push('cdr')
                }
                if (values.originate) {
                    priList.push('agent')
                }
                if (values.originate) {
                    priList.push('cc')
                }
                if (values.originate) {
                    priList.push('dtmf')
                }
                if (values.originate) {
                    priList.push('dialplan')
                }
                if (values.originate) {
                    priList.push('reporting')
                }
                if (values.originate) {
                    priList.push('user')
                }
                if (values.originate) {
                    priList.push('security')
                }
                action.pri = priList.join(',')

                ipList.push(values.permitIP_0 + '/' + values.permitNetmask_0)
                const keys = getFieldValue('keys')
                keys.map((k, index) => {
                    let ip = `permitIP_${k}`
                    let netmask = `permitNetmask_${k}`
                    ipList.push(values[ip] + '/' + values[netmask])
                })
                action.permit = ipList.join(';')
                let i = 1
                if (i === 1) {
                    return false
                }
                action["user"] = values.username
                action["secret"] = values.secret
                action["pri"] = ""
                action["permit"] = ""

                if (userId) {
                    action.action = 'updateAmiUser'
                    action.user = userId
                } else {
                    action.action = 'addAmiUser'
                }

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

                        this._handleCancel()
                    }.bind(this)
                })
            }
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue, getFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemIPLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }
        const formItemIPWithoutLabelLayout = {
            wrapperCol: { span: 18, offset: 3 }
        }
        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3528"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG4340"}, {0: formatMessage({id: "LANG3528"}) }))

        const userItem = this.state.userItem || {}
        const priBox = this.state.priBox || {}
        const ipList = this.state.ipList || []
        const netmaskList = this.state.netmaskList || []
        const ipallList = this.state.ipallList || []

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        let keyList = []
        for (let k = 1; k < ipList.length; k++) {
            keyList.push(k)
        }

        getFieldDecorator('keys', { initialValue: keyList })
        const keys = getFieldValue('keys')
        const formIPItems = keys.map((k, index) => {
            return (
            <FormItem
                { ...formItemIPWithoutLabelLayout }
            >
                <Col span="8">
                    <FormItem>
                        {getFieldDecorator(`permitIP_${k}`, {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: ipList[index + 1]
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1915"}) } />
                        )}
                    </FormItem>
                </Col>
                <Col span="1">
                    <p className="ant-form-split">/</p>
                </Col>
                <Col span="8" style={{ marginRight: 10 }}>
                    <FormItem>
                        {getFieldDecorator(`permitNetmask_${k}`, {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: netmaskList[index + 1]
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1902"}) } />
                        )}
                    </FormItem>
                </Col>
                <Col span="1">
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={ () => this._removeIP(k) }
                    />
                </Col>
            </FormItem>
            )
        })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'
                />
                <div className="content">
                    <Form>
                        <FormItem
                            ref="div_username"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG72" />}>
                                    <span>{formatMessage({id: "LANG72"})}</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('username', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: this.props.params.name ? this.props.params.name : ""
                            })(
                                <Input maxLength="128" disabled={ this.props.params.id ? true : false } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_secret"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG73" />}>
                                    <span>{formatMessage({id: "LANG73"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('secret', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                width: 100,
                                initialValue: userItem.secret ? userItem.secret : ""
                            })(
                                <Input maxLength="128" />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemIPLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3826" />}>
                                    <span>{formatMessage({id: "LANG2776"})}</span>
                                </Tooltip>
                            )}>
                            <Col span="8">
                                <FormItem>
                                    {getFieldDecorator("permitIP_0", {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: ipList[0] ? ipList[0] : ""
                                        })(
                                            <Input placeholder={ formatMessage({id: "LANG1915"}) } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="1">
                                <p className="ant-form-split">/</p>
                            </Col>
                            <Col span="8" style={{ marginRight: 10 }}>
                                <FormItem>
                                    {getFieldDecorator("permitNetmask_0", {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }],
                                        initialValue: netmaskList[0] ? netmaskList[0] : ""
                                        })(
                                            <Input placeholder={ formatMessage({id: "LANG1902"}) } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="1">
                                <Icon
                                    className="dynamic-plus-button"
                                    type="plus-circle-o"
                                    onClick={ this._addIP }
                                />
                            </Col>
                        </FormItem>
                        { formIPItems }
                        <FormItem
                            ref="div_all_pri_container"
                            { ...formItemLayout }

                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3529" />}>
                                    <span>{formatMessage({id: "LANG2811"})}</span>
                                </Tooltip>
                            )}>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('chk_pri_all', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.all
                                })(
                                        <Checkbox onChange={ this._priallChecked } />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>{formatMessage({id: "LANG104"})}</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('originate', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.originate
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>originate</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('call', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.call
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>call</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('cdr', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.cdr
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>cdr</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('agent', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.agent
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>agent</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('cc', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.cc
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>CC</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('dtmf', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.dtmf
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>DTMF</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('dialplan', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.dialplan
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>dialplan</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('reporting', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.reporting
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>reporting</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('user', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.user
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>user</Col>
                            <Col span={ 2 }>
                                <FormItem>
                                { getFieldDecorator('security', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: priBox.security
                                })(
                                        <Checkbox />
                                ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>security</Col>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(RoomAdd))