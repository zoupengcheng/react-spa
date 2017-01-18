'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, InputNumber, message, Checkbox, Tooltip, Select, Row, Col } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

class SpeedDialItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountList: [],
            speedDialItem: {},
            keypress: 'account',
            keypressevent: '',
            account: [],
            voicemail: [],
            conference: [],
            vmgroup: [],
            ivr: [],
            ringgroup: [],
            queue: [],
            paginggroup: [],
            fax: [],
            disa: [],
            directory: [],
            external_number: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkAccount = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.accountList, value) > -1) {
            callback(formatMessage({id: "LANG2126"}))
        } else {
            callback()
        }
    }
    _transAccountVoicemailData = (res) => {
        const { formatMessage } = this.props.intl

        var arr = []

        for (var i = 0; i < res.length; i++) {
            var obj = {},
                extension = res[i].extension,
                fullname = res[i].fullname,
                disabled = res[i].out_of_service

            obj["val"] = extension

            if (disabled === 'yes') {
                obj["class"] = 'disabledExtOrTrunk'
                obj["text"] = extension + (fullname ? ' "' + fullname + '"' : '') + ' <' + formatMessage({id: "LANG273"}) + '>'
                obj["locale"] = '' + extension + (fullname ? ' "' + fullname + '"' : '') + ' <'
                obj["disable"] = true
            } else {
                obj["text"] = extension + (fullname ? ' "' + fullname + '"' : '')
            }

            arr.push(obj)
        }

        return arr
    }
    _transData = (res) => {
        var arr = []

        for (var i = 0; i < res.length; i++) {
            var obj = {}

            obj["val"] = res[i]

            arr.push(obj)
        }

        return arr
    }
    _transObjData = (res, options) => {
        var val = options.val,
            text = options.text,
            arr = []

        for (var i = 0; i < res.length; i++) {
            var obj = {}

            obj["val"] = res[i][val]
            obj["text"] = res[i][text]

            arr.push(obj)
        }

        return arr
    }
    _getInitData = () => {
        let accountList = []
        let speedDialItem = {}
        const { formatMessage } = this.props.intl
        const account = this.props.params.id

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'getNumberList' },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let response = res.response || {}
                    accountList = response.number || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        if (account) {
            accountList = _.without(accountList, account)
        }

        this.setState({
            accountList: accountList
        })

        let keyAccountList = this._transAccountVoicemailData(UCMGUI.isExist.getList("getAccountList"))
        this.setState({
            account: keyAccountList
        })

        let keyVoicemailList = this._transAccountVoicemailData(UCMGUI.isExist.getList("getVoicemailList"))
        this.setState({
            voicemail: keyVoicemailList
        })

        let keyConferencelList = this._transData(UCMGUI.isExist.getList("getConferenceList"))
        this.setState({
            conference: keyConferencelList
        })

        let keyVMGrouplList = this._transObjData(
            UCMGUI.isExist.getList("getVMgroupList"),
            {
                val: "extension",
                text: "vmgroup_name"
            }
        )
        this.setState({
            vmgroup: keyVMGrouplList
        })

        let keyIVRList = this._transObjData(
            UCMGUI.isExist.getList("getIVRList"),
            {
                val: "ivr_id",
                text: "ivr_name"
            }
        )
        this.setState({
            ivr: keyIVRList
        })

        let keyRinggroupList = this._transObjData(
            UCMGUI.isExist.getList("getRinggroupList"),
            {
                val: "extension",
                text: "ringgroup_name"
            }
        )
        this.setState({
            ringgroup: keyRinggroupList
        })

        let keyQueueList = this._transObjData(
            UCMGUI.isExist.getList("getQueueList"),
            {
                val: "extension",
                text: "queue_name"
            }
        )
        this.setState({
            queue: keyQueueList
        })

        let keyPaginList = this._transObjData(
            UCMGUI.isExist.getList("getPaginggroupList"),
            {
                val: "extension",
                text: "paginggroup_name"
            }
        )
        this.setState({
            paginggroup: keyPaginList
        })

        let keyFaxList = this._transObjData(
            UCMGUI.isExist.getList("getFaxList"),
            {
                val: "extension",
                text: "fax_name"
            }
        )
        this.setState({
            fax: keyFaxList
        })

        let keyDisaList = this._transObjData(
            UCMGUI.isExist.getList("getFaxList"),
            {
                val: "disa_id",
                text: "display_name"
            }
        )
        this.setState({
            disa: keyDisaList
        })

        let keyDirectoryList = this._transObjData(
            UCMGUI.isExist.getList("getDirectoryList"),
            {
                val: "extension",
                text: "name"
            }
        )
        this.setState({
            directory: keyDirectoryList
        })

        if (account) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getSpeedDial',
                    speed_dial: account
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        speedDialItem = res.response.speed_dial || {}
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })

            this.setState({
                speedDialItem: speedDialItem 
            })
        }
    }
    _handleKeypressChange = (e) => {
        let keypressevent = ''
        if (this.state[e].length > 0) {
            keypressevent = this.state[e][0].text
        }

        this.setState({
            keypress: e,
            keypressevent: keypressevent
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/speedDial')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const account = this.props.params.id

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

                if (action.enable_destination === true) {
                    action.enable_destination = "yes"  
                } else {
                    action.enable_destination = "no" 
                }

               if (account) {
                    action.action = 'updateSpeedDial'
                    action.speed_dial = account
                } else {
                    action.action = 'addSpeedDial'
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
    _createDial = () => {
        let accountList = this.state.accountList

        for (let i = 0; i < 100; i++) {
            if (_.indexOf(accountList, i.toString()) === -1) {
                return i
            }
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const speedDialItem = this.state.speedDialItem || {}
        let account = speedDialItem.extension
        let keypressevent = speedDialItem.keypressevent

        if (!account) {
            account = this._createDial()
        }

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemTransferLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3501"}),
                    1: this.props.params.id
                })
                : formatMessage({id: "LANG5087"}))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'/>
                <div className="content">
                    <Form>
                        <Row>
                            <Col span={ 24 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <span>{ formatMessage({id: "LANG2990"}) }</span>
                                        </span>
                                    )}>
                                    { getFieldDecorator('enable_destination', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: speedDialItem.enable_destination === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <span>{ formatMessage({id: "LANG5108"}) }</span>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('speed_dial', {
                                        rules: [{
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }, {
                                            validator: (data, value, callback) => {
                                                Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                            }
                                        }, {
                                            validator: this._checkAccount
                                        }],
                                        initialValue: account
                                    })(
                                        <Input maxLength="2" />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 6 } style={{ marginRight: 20 }}>
                                <FormItem
                                    { ...formItemTransferLayout }
                                    label={(
                                        <span>
                                            <span>{ formatMessage({id: "LANG1558"}) }</span>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('keypress', {
                                        initialValue: speedDialItem.keypress || 'account'
                                    })(
                                        <Select onChange={ this._handleKeypressChange }>
                                            <Option value="account">{ formatMessage({id: "LANG85"}) }</Option>
                                            <Option value="voicemail">{ formatMessage({id: "LANG90"}) }</Option>
                                            <Option value="conference">{ formatMessage({id: "LANG98"}) }</Option>
                                            <Option value="vmgroup">{ formatMessage({id: "LANG89"}) }</Option>
                                            <Option value="ivr">{ formatMessage({id: "LANG19"}) }</Option>
                                            <Option value="ringgroup">{ formatMessage({id: "LANG600"}) }</Option>
                                            <Option value="queue">{ formatMessage({id: "LANG91"}) }</Option>
                                            <Option value="paginggroup">{ formatMessage({id: "LANG94"}) }</Option>
                                            <Option value="fax">{ formatMessage({id: "LANG95"}) }</Option>
                                            <Option value="disa">{ formatMessage({id: "LANG2353"}) }</Option>
                                            <Option value="directory">{ formatMessage({id: "LANG2884"}) }</Option>
                                            <Option value="external_number">{ formatMessage({id: "LANG3458"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('keypressevent', {
                                        initialValue: this.state.keypressevent
                                    })(
                                        <Select>
                                            {
                                                this.state[this.state.keypress].map(function(value, index) {
                                                    return <Option value={ value.val } key={ index }>{ value.text }</Option>
                                                }) 
                                            }
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(SpeedDialItem))
