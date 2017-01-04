'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Button, Checkbox, Input, message, Popover, Select } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

const FormItem = Form.Item
const Option = Select.Option

class DDNS extends Component {
    constructor(props) {
        super(props)
        this.state = {
            class: {
                inadyn: 'hidden',
                hash: 'hidden',
                phddns: 'hidden'
            },
            inadyn_settings: {},
            phddns_settings: {},
            dyndns_system: '',
            enable_inadyn: false,
            enable_phddns: false
        }
    }
    componentWillMount() {
        this._getInadyn()
        this._getPhddns()
    }
    componentDidMount() {
        this._loadDefault()
    }
    _checkJBLen = (rule, value, callback) => {
        const form = this.props.form

        if (value) {
            form.validateFields(['gs_jbmax'], { force: true })
        }

        callback()
    }
    _checkJBMax = (rule, value, callback) => {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const len = form.getFieldValue('gs_jblen')

        if (value && len && value < len) {
            callback(formatMessage({id: "LANG2142"}, { 0: formatMessage({id: "LANG1655"}), 1: formatMessage({id: "LANG2460"}) }))
        } else {
            callback()
        }
    }
    _loadDefault = () => {
        const dyndns_system = this.state.dyndns_system

        if (dyndns_system === 'oray.net' || !dyndns_system) {
            if (!dyndns_system) {
                this.setState({
                    dyndns_system: 'oray.net'
                })
            }

            this.setState({
                class: {
                    inadyn: 'hidden',
                    hash: 'hidden',
                    phddns: 'display-block'
                },
                enable_inadyn: this.state.enable_phddns
            })
        } else {
            if (dyndns_system === "freedns.afraid.org") {
                this.setState({
                    class: {
                        inadyn: 'display-block',
                        hash: 'display-block',
                        phddns: 'hidden'
                    },
                    enable_phddns: this.state.enable_inadyn
                })
            } else {
                this.setState({
                    class: {
                        inadyn: 'display-block',
                        hash: 'hidden',
                        phddns: 'hidden'
                    },
                    enable_phddns: this.state.enable_inadyn
                })
            }
        }
    }
    _getInadyn = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getInadyn' },
            type: 'json',
            async: false,
            success: function(res) {
                let inadyn_settings = res.response.inadyn_settings || {}

                this.setState({
                    inadyn_settings: inadyn_settings,
                    enable_inadyn: (inadyn_settings.enable_inadyn === 'yes'),
                    dyndns_system: inadyn_settings.dyndns_system
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getPhddns = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getPhddns' },
            type: 'json',
            async: false,
            success: function(res) {
                let phddns_settings = res.response.phddns_settings || {}

                this.setState({
                    phddns_settings: phddns_settings,
                    enable_phddns: (phddns_settings.enable_phddns === 'yes')
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = () => {
        browserHistory.push('/system-settings/ddnsSettings')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action = values

                action.action = 'setUpgradeValue'

                action.gs_jbenable = (action.service_check_enable ? 'yes' : 'no')

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({ id: "LANG815" }))
                        }
                    }.bind(this)
                })
            }
        })
    }
    _onChangeInadyn = (e) => {
        this.setState({
            enable_inadyn: e.target.checked,
            enable_phddns: e.target.checked
        })
    }
    _onChangePhddns = (e) => {
        this.setState({
            enable_inadyn: e.target.checked,
            enable_phddns: e.target.checked
        })
    }
    _onChangeSystem = (value) => {
        if (value === 'oray.net') {
            this.setState({
                class: {
                    inadyn: 'hidden',
                    hash: 'hidden',
                    phddns: 'display-block'
                }
            })
        } else {
            if (value === "freedns.afraid.org") {
                this.setState({
                    class: {
                        inadyn: 'display-block',
                        hash: 'display-block',
                        phddns: 'hidden'
                    }
                })
            } else {
                this.setState({
                    class: {
                        inadyn: 'display-block',
                        hash: 'hidden',
                        phddns: 'hidden'
                    }
                })
            }
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let inadyn_settings = this.state.inadyn_settings || {}
        let phddns_settings = this.state.phddns_settings || {}
        let username = inadyn_settings.username
        let password = inadyn_settings.password
        let alias = inadyn_settings.alias
        let hash = inadyn_settings.hash
        let szHost = phddns_settings.szHost
        let szUserID = phddns_settings.szUserID
        let szUserPWD = phddns_settings.szUserPWD
        let nicName = phddns_settings.nicName

        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG4040"})})

        return (
            <div className="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG4040"}) } onSubmit={ this._handleSubmit } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4041"}) } content={ formatMessage({id: "LANG4042"}) }><span>{ formatMessage({id: "LANG4041"}) }</span></Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('dyndns_system', {
                            initialValue: this.state.dyndns_system
                        })(
                            <Select onChange={ this._onChangeSystem }>
                                <Option value="dyndns.org">dyndns.org</Option>
                                <Option value="freedns.afraid.org">freedns.afraid.org</Option>
                                <Option value="zoneedit.com">zoneedit.com</Option>
                                <Option value="no-ip.com">no-ip.com</Option>
                                <Option value="oray.net">oray.net</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4030"}) } content={ formatMessage({id: "LANG4031"}) }><span>{ formatMessage({id: "LANG4030"}) }</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.inadyn }
                    >
                        { getFieldDecorator('enable_inadyn', {
                            valuePropName: 'checked',
                            initialValue: this.state.enable_inadyn
                        })(
                            <Checkbox onChange={ this._onChangeInadyn } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG72"}) } content={ formatMessage({id: "LANG4025"}) }><span>{ formatMessage({id: "LANG72"}) }</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.inadyn }
                    >
                        <input type="text" name="username" className="hidden" />
                        { getFieldDecorator('username', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBMax }
                            ],
                            initialValue: username
                        })(
                            <Input disabled={ !this.state.enable_inadyn } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG73"}) } content={ formatMessage({id: "LANG4026"}) }><span>{ formatMessage({id: "LANG73"}) }</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.inadyn }
                    >
                        <input type="password" name="password" className="hidden" />
                        { getFieldDecorator('password', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBMax }
                            ],
                            initialValue: password
                        })(
                            <Input type="password" disabled={ !this.state.enable_inadyn } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title="Hash" content={ formatMessage({id: "LANG4029"}) }><span>Hash</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.hash }
                    >
                        { getFieldDecorator('hash', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBMax }
                            ],
                            initialValue: hash
                        })(
                            <Input disabled={ !this.state.enable_inadyn } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4027"}) } content={ formatMessage({id: "LANG4028"}) }><span>{ formatMessage({id: "LANG4027"}) }</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.inadyn }
                    >
                        { getFieldDecorator('alias', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBMax }
                            ],
                            initialValue: alias
                        })(
                            <Input disabled={ !this.state.enable_inadyn } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG4030"}) } content={ formatMessage({id: "LANG4031"}) }><span>{ formatMessage({id: "LANG4030"}) }</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.phddns }
                    >
                        { getFieldDecorator('enable_phddns', {
                            valuePropName: 'checked',
                            initialValue: this.state.enable_phddns
                        })(
                            <Checkbox onChange={ this._onChangePhddns } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG72"}) } content={ formatMessage({id: "LANG4025"}) }><span>{ formatMessage({id: "LANG72"}) }</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.phddns }
                    >
                        <input type="text" name="szUserID" className="hidden" />
                        { getFieldDecorator('szUserID', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBMax }
                            ],
                            initialValue: szUserID
                        })(
                            <Input disabled={ !this.state.enable_phddns } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover title={ formatMessage({id: "LANG73"}) } content={ formatMessage({id: "LANG4026"}) }><span>{ formatMessage({id: "LANG73"}) }</span></Popover>
                            </span>
                        )}
                        className={ this.state.class.phddns }
                    >
                        <input type="password" name="szUserPWD" className="hidden" />
                        { getFieldDecorator('szUserPWD', {
                            rules: [
                                { type: "integer", required: true, message: formatMessage({id: "LANG2150"}) },
                                { validator: this._checkJBMax }
                            ],
                            initialValue: szUserPWD
                        })(
                            <Input type="password" disabled={ !this.state.enable_phddns } />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(DDNS))