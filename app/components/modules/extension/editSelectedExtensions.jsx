'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, Icon, message, Row, Select, Transfer, Tooltip } from 'antd'

const MAXLOCALNETWORK = 10
const FormItem = Form.Item
const Option = Select.Option

class BatchEditExtension extends Component {
    constructor(props) {
        super(props)

        this.state = {
            languages: [],
            accountList: [],
            out_limitime: false,
            strategy_ipacl: '0',
            targetKeysSeamless: [],
            bypass_outrt_auth: 'no',
            targetKeysCallbarging: [],
            extensionType: this.props.params.type,
            selectedExtensions: this.props.params.id,
            mohNameList: ['default', 'ringbacktone_default'],
            targetKeysAllow: ['ulaw', 'alaw', 'gsm', 'g726', 'g722', 'g729', 'h264', 'ilbc'],
            availableCodecs: [
                {
                    key: 'g726aal2', title: 'AAL2-G.726-32'
                }, {
                    key: 'adpcm', title: 'ADPCM'
                }, {
                    key: 'g723', title: 'G.723'
                }, {
                    key: 'h263', title: 'H.263'
                }, {
                    key: 'h263p', title: 'H.263p'
                }, {
                    key: 'vp8', title: 'VP8'
                }, {
                    key: 'opus', title: 'OPUS'
                }, {
                    key: 'ulaw', title: 'PCMU'
                }, {
                    key: 'alaw', title: 'PCMA'
                }, {
                    key: 'gsm', title: 'GSM'
                }, {
                    key: 'g726', title: 'G.726'
                }, {
                    key: 'g722', title: 'G.722'
                }, {
                    key: 'g729', title: 'G.729'
                }, {
                    key: 'h264', title: 'H.264'
                }, {
                    key: 'ilbc', title: 'iLBC'
                }
            ]
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    componentWillUnmount() {
    }
    _addLocalNetwork = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl

        // can use data-binding to get
        const localNetworks = form.getFieldValue('localNetworks')

        if (localNetworks.length <= 8) {
            const newLocalNetworks = localNetworks.concat(this._generateLocalNetworkID(localNetworks))

            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                localNetworks: newLocalNetworks
            })
        } else {
            message.warning(formatMessage({id: "LANG948"}))

            return false
        }
    }
    _filterCodecsSource = () => {
        if (this.state.extensionType === 'iax') {
            return _.filter(this.state.availableCodecs, function(item) {
                    return item.key !== 'opus'
                })
        } else {
            return this.state.availableCodecs
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _generateLocalNetworkID = (existIDs) => {
        let newID = 2
        const keyList = _.pluck(existIDs, 'key')

        if (keyList && keyList.length) {
            newID = _.find([2, 3, 4, 5, 6, 7, 8, 9, 10], function(key) {
                    return !_.contains(keyList, key)
                })
        }

        return {
                new: true,
                key: newID
            }
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        const extensionId = this.props.params.id
        const extensionType = this.props.params.type
        const disabled = formatMessage({id: "LANG273"})
        const languages = UCMGUI.isExist.getList('getLanguage', formatMessage)
        const extensionRange = UCMGUI.isExist.getRange('extension', formatMessage)
        const existNumberList = UCMGUI.isExist.getList('getNumberList', formatMessage)
        const extensionTypeUpperCase = extensionType ? extensionType.toUpperCase() : ''

        this.setState({
            languages: languages,
            extensionRange: extensionRange,
            existNumberList: existNumberList
        })

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getMohNameList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    let mohNameList = response.moh_name || []

                    this.setState({
                        mohNameList: mohNameList ? mohNameList : ['default', 'ringbacktone_default']
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                action: 'getAccountList'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    let extension = response.extension || []

                    extension = extension.map(function(item) {
                        return {
                                key: item.extension,
                                value: item.extension,
                                out_of_service: item.out_of_service,
                                // disabled: (item.out_of_service === 'yes'),
                                label: (item.extension +
                                        (item.fullname ? ' "' + item.fullname + '"' : '') +
                                        (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                            }
                    })

                    this.setState({
                        accountList: extension
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleCancel = (e) => {
        browserHistory.push('/extension-trunk/extension')
    }
    _handleSubmit = (e) => {
        // e.preventDefault()
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const getFieldInstance = form.getFieldInstance

        form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                let action = {},
                    type = this.state.extensionType,
                    fax = values.faxmode ? values.faxmode : ''

                action.extension = this.state.selectedExtensions
                action.action = `update${this.state.extensionType.toUpperCase()}Account`

                _.map(values, function(value, key) {
                    let fieldInstance = getFieldInstance(key)

                    if (key === 'mode' || key === 'out_limitime' || key === 'maximumTime' ||
                        key === 'whiteLists' || key === 'localNetworks' || key === 'enable_cc' ||
                        key === 'presence_dst_account_voicemail' || key === 'presence_dst_external_number' ||
                        key === 'room' || key === 'faxmode' || key === 'cc_mode' || key === 'batch_number' ||
                        key === 'cc_max_agents' || key === 'cc_max_monitors' || key === 'custom_alert_info' ||
                        key === 'user_password' || key === 'phone_number' || key === 'email' || key === 'language' ||
                        key === 'extension_type' || key === 'fullname' || key === 'first_name' || key === 'last_name') {
                        return false
                    }

                    if (key.indexOf('whitelist') > -1) {
                        action.dndwhitelist.push(value)

                        return false
                    }

                    if (fieldInstance && fieldInstance.props) {
                        let medaData = fieldInstance.props['data-__meta']

                        if (!medaData.className || medaData.className !== 'hidden') {
                            if (typeof value === 'boolean') {
                                action[key] = UCMGUI.transCheckboxVal(value)
                            } else if (value) {
                                action[key] = value
                            }
                        }
                    } else {
                        if (value) {
                            action[key] = value
                        }
                    }
                })

                if (fax === 'no') {
                    action['faxdetect'] = 'no'

                    if (type === 'fxs') {
                        action['fax_gateway'] = 'no'
                    }
                } else if (fax === 'detect') {
                    action['faxdetect'] = 'yes'

                    if (type === 'fxs') {
                        action['fax_gateway'] = 'no'
                    }
                } else if (fax === 'gateway') {
                    action['faxdetect'] = 'no'

                    if (type === 'fxs') {
                        action['fax_gateway'] = 'yes'
                    }
                }

                if (type === 'fxs') {
                    action['hanguponpolarityswitch'] = action['answeronpolarityswitch']

                    if (values.enable_cc) {
                        action['cc_agent_policy'] = 'generic'
                        action['cc_monitor_policy'] = 'generic'
                        action['cc_max_agents'] = '1'
                        action['cc_max_monitors'] = '5'
                        action['cc_offer_timer'] = '120'
                        action['ccnr_available_timer'] = '3600'
                        action['ccbs_available_timer'] = '3600'
                    } else {
                        action['cc_agent_policy'] = 'never'
                        action['cc_monitor_policy'] = 'never'
                    }

                    delete action.allow
                } else {
                    // SIP/ IAX
                    for (var i = 1; i <= MAXLOCALNETWORK; i++) {
                        if (!action.hasOwnProperty('local_network' + i)) {
                            action['local_network' + i] = ''
                        }
                    }

                    if (type === 'sip') {
                        if (values.enable_cc) {
                            if (values.cc_mode === 'trunk') {
                                action['cc_agent_policy'] = 'native'
                                action['cc_monitor_policy'] = 'native'
                                action['cc_max_agents'] = values.cc_max_agents ? values.cc_max_agents : ''
                                action['cc_max_monitors'] = values.cc_max_monitors ? values.cc_max_monitors : ''
                                action['cc_offer_timer'] = '120'
                                action['ccnr_available_timer'] = '3600'
                                action['ccbs_available_timer'] = '3600'
                            } else {
                                action['cc_agent_policy'] = 'generic'
                                action['cc_monitor_policy'] = 'generic'
                                action['cc_max_agents'] = '1'
                                action['cc_max_monitors'] = '5'
                                action['cc_offer_timer'] = '120'
                                action['ccnr_available_timer'] = '3600'
                                action['ccbs_available_timer'] = '3600'
                            }
                        } else {
                            action['cc_agent_policy'] = 'never'
                            action['cc_monitor_policy'] = 'never'
                        }

                        if (values.enable_webrtc) {
                            action['enable_webrtc'] = 'yes'
                            action['media_encryption'] = 'auto_dtls'
                            action['account_type'] = 'SIP(WebRTC)'
                        } else {
                            action['enable_webrtc'] = 'no'
                            action['media_encryption'] = 'no'
                            action['account_type'] = 'SIP'
                        }

                        if (values.alertinfo === 'custom') {
                            action['alertinfo'] = 'custom_' + values.custom_alert_info
                        }

                        if (values.room) {
                            action['room'] = action['extension']
                        }
                    }
                }

                if (values.maximumTime) {
                    action['limitime'] = parseInt(values.maximumTime) * 1000
                } else {
                    action['limitime'] = ''
                }

                message.loading(formatMessage({ id: "LANG826" }), 0)

                $.ajax({
                    data: action,
                    type: 'json',
                    method: "post",
                    url: api.apiHost,
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4104" })}}></span>, 2)

                            this._handleCancel()
                        }
                    }.bind(this)
                })
            }
        })
    }
    _handleAllowChange = (targetKeys, direction, moveKeys) => {
        const { form } = this.props

        this.setState({
            targetKeysAllow: targetKeys
        })

        form.setFieldsValue({
            allow: targetKeys.toString()
        })

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleCallbargingChange = (targetKeys, direction, moveKeys) => {
        const { form } = this.props

        this.setState({
            targetKeysCallbarging: targetKeys
        })

        form.setFieldsValue({
            callbarging_monitor: targetKeys.toString()
        })

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleSeamlessChange = (targetKeys, direction, moveKeys) => {
        const { form } = this.props

        this.setState({
            targetKeysSeamless: targetKeys
        })

        form.setFieldsValue({
            seamless_transfer_members: targetKeys.toString()
        })

        console.log('targetKeys: ', targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        // this.setState({ targetContactKeys: nextTargetKeys })
        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    _onChangeLimiTime = (e) => {
        this.setState({
            out_limitime: e.target.checked
        })
    }
    _onChangeStrategy = (value) => {
        this.setState({
            strategy_ipacl: value
        })
    }
    _onChangeTrunkAuth = (value) => {
        this.setState({
            bypass_outrt_auth: value
        })
    }
    _onExtensionTypeChange = (value) => {
        this.setState({
            extensionType: value
        })
    }
    _renderItem = (item) => {
        const customLabel = (
                <span className={ item.out_of_service === 'yes' ? 'out-of-service' : '' }>
                    { item.label }
                </span>
            )

        return {
                label: customLabel,  // for displayed item
                value: item.value   // for title and filter matching
            }
    }
    _removeLocalNetwork = (k) => {
        let fieldsValue = {}
        const { form } = this.props
        // can use data-binding to get
        const localNetworks = form.getFieldValue('localNetworks')

        fieldsValue['local_network' + k] = ''
        fieldsValue.localNetworks = localNetworks.filter(item => item.key !== k)

        // can use data-binding to set
        form.setFieldsValue(fieldsValue)
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, getFieldValue } = this.props.form

        const title = formatMessage({id: "LANG734"})
        const extensionType = this.state.extensionType
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
                labelCol: { span: 8 },
                wrapperCol: { span: 12 }
            }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        }

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        getFieldDecorator('localNetworks', { initialValue: [] })
        getFieldDecorator('callbarging_monitor', { initialValue: '' })
        getFieldDecorator('seamless_transfer_members', { initialValue: '' })
        getFieldDecorator('allow', { initialValue: 'ulaw,alaw,gsm,g726,g722,g729,h264,ilbc' })

        const localNetworks = getFieldValue('localNetworks')
        const localNetworkFormItems = localNetworks.map((item, index) => {
            return (
                <Col
                    span={ 12 }
                    key={ item.key }
                    className={ this.state.strategy_ipacl === '1' ? 'display-block' : 'hidden' }
                >
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1145" /> }>
                                    <span>{ formatMessage({id: "LANG1146"}) }</span>
                                </Tooltip>
                            </span>
                        )}
                    >
                        { getFieldDecorator(`local_network${item.key}`, {
                            rules: [
                                this.state.strategy_ipacl === '1'
                                    ? {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    : {}
                            ],
                            initialValue: '',
                            className: this.state.strategy_ipacl === '1' ? 'display-block' : 'hidden'
                        })(
                            <Input />
                        ) }
                        <Icon
                            type="minus-circle-o"
                            onClick={ () => this._removeLocalNetwork(item.key) }
                            className="dynamic-network-button"
                        />
                    </FormItem>
                </Col>
            )
        })

        return (
            <div className="app-content-main app-content-extension">
                <Title
                    headerTitle={ title }
                    isDisplay='display-block'
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                />
                <div className="content">
                    <Form>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG625"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1070" /> }>
                                                <span>{ formatMessage({id: "LANG1069"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('permission', {
                                        rules: [],
                                        initialValue: 'internal'
                                    })(
                                        <Select>
                                            <Option value='internal'>{ formatMessage({id: 'LANG1071'}) }</Option>
                                            <Option value='internal-local'>{ formatMessage({id: 'LANG1072'}) }</Option>
                                            <Option value='internal-local-national'>{ formatMessage({id: 'LANG1073'}) }</Option>
                                            <Option value='internal-local-national-international'>{ formatMessage({id: 'LANG1074'}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1078" /> }>
                                                <span>{ formatMessage({id: "LANG1077"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('hasvoicemail', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: true
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1076" /> }>
                                                <span>{ formatMessage({id: "LANG1075"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('secret', {
                                        rules: [],
                                        initialValue: ''
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1080" /> }>
                                                <span>{ formatMessage({id: "LANG1079"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('vmsecret', {
                                        rules: [],
                                        initialValue: ''
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1068" /> }>
                                                <span>{ formatMessage({id: "LANG1067"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('cidnumber', {
                                        rules: [],
                                        initialValue: ''
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1599" /> }>
                                                <span>{ formatMessage({id: "LANG1598"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('ring_timeout', {
                                        rules: [],
                                        initialValue: ''
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2544" /> }>
                                                <span>{ formatMessage({id: "LANG2543"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('auto_record', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2686" /> }>
                                                <span>{ formatMessage({id: "LANG2685"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('skip_vmsecret', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ extensionType === 'sip' ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1106" /> }>
                                                <span>{ formatMessage({id: "LANG1105"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_qualify', {
                                        rules: [],
                                        initialValue: false,
                                        valuePropName: 'checked',
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ extensionType === 'sip' ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1108" /> }>
                                                <span>{ formatMessage({id: "LANG1107"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('qualifyfreq', {
                                        rules: [],
                                        initialValue: '60',
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1800" /> }>
                                                <span>{ formatMessage({id: "LANG1178"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('mohsuggest', {
                                        rules: [],
                                        initialValue: 'default'
                                    })(
                                        <Select>
                                            {
                                                this.state.mohNameList.map(function(value) {
                                                    return <Option
                                                                key={ value }
                                                                value={ value }
                                                            >
                                                                { value }
                                                            </Option>
                                                })
                                            }
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2756" /> }>
                                                <span>{ formatMessage({id: "LANG2755"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('out_of_service', {
                                        rules: [],
                                        initialValue: false,
                                        valuePropName: 'checked'
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4136" /> }>
                                                <span>{ formatMessage({id: "LANG4135"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_ldap', {
                                        rules: [],
                                        initialValue: true,
                                        valuePropName: 'checked'
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ extensionType === 'sip' ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4452" /> }>
                                                <span>{ formatMessage({id: "LANG4393"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('enable_webrtc', {
                                        rules: [],
                                        initialValue: false,
                                        valuePropName: 'checked',
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3026" /> }>
                                                <span>{ formatMessage({id: "LANG3025"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('out_limitime', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: this.state.out_limitime
                                    })(
                                        <Checkbox onChange={ this._onChangeLimiTime } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ this.state.out_limitime ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3018" /> }>
                                                <span>{ formatMessage({id: "LANG3017"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('maximumTime', {
                                        rules: [],
                                        initialValue: '',
                                        className: this.state.out_limitime ? 'display-block' : 'hidden'
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2545" /> }>
                                                <span>{ formatMessage({id: "LANG31"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('language', {
                                        rules: [],
                                        initialValue: 'default'
                                    })(
                                        <Select>
                                            <Option value='default'>{ formatMessage({id: "LANG257"}) }</Option>
                                            {
                                                this.state.languages.map(function(item) {
                                                    return <Option
                                                                key={ item.language_id }
                                                                value={ item.language_id }
                                                            >
                                                                { item.language_name }
                                                            </Option>
                                                })
                                            }
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row
                            className={ extensionType === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG626"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1093" /> }>
                                                <span>{ 'NAT' }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('nat', {
                                        rules: [],
                                        initialValue: true,
                                        valuePropName: 'checked',
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1095" /> }>
                                                <span>{ formatMessage({id: "LANG1094"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('directmedia', {
                                        rules: [],
                                        initialValue: 'no',
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Select>
                                            <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                            <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1098" /> }>
                                                <span>{ formatMessage({id: "LANG1097"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('dtmfmode', {
                                        rules: [],
                                        initialValue: 'rfc2833',
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Select>
                                            <Option value='rfc2833'>{ 'RFC2833' }</Option>
                                            <Option value='info'>{ formatMessage({id: "LANG1099"}) }</Option>
                                            <Option value='inband'>{ formatMessage({id: "LANG1100"}) }</Option>
                                            <Option value='auto'>{ formatMessage({id: "LANG138"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2769" /> }>
                                                <span>{ formatMessage({id: "LANG2768"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('tel_uri', {
                                        rules: [],
                                        initialValue: 'disabled',
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Select>
                                            <Option value='disabled'>{ formatMessage({id: "LANG2770"}) }</Option>
                                            <Option value='user_phone'>{ formatMessage({id: "LANG2771"}) }</Option>
                                            <Option value='enabled'>{ formatMessage({id: "LANG2772"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4223" /> }>
                                                <span>{ formatMessage({id: "LANG4222"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('max_contacts', {
                                        rules: [],
                                        initialValue: 1,
                                        className: extensionType === 'sip' ? 'display-block' : 'hidden'
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row
                            className={ extensionType === 'iax' ? 'display-block' : 'hidden' }
                        >
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG627"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1131" /> }>
                                                <span>{ formatMessage({id: "LANG1130"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('maxcallnumbers', {
                                        rules: [],
                                        initialValue: '',
                                        className: extensionType === 'iax' ? 'display-block' : 'hidden'
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1133" /> }>
                                                <span>{ formatMessage({id: "LANG1132"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('requirecalltoken', {
                                        rules: [],
                                        initialValue: 'yes',
                                        className: extensionType === 'iax' ? 'display-block' : 'hidden'
                                    })(
                                        <Select>
                                            <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                            <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                            <Option value='auto'>{ formatMessage({id: "LANG138"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG5079"}) }</span>
                                </div>
                            </Col>
                            <Col
                                span={ 24 }
                            >
                                <FormItem
                                    { ...formItemLayoutRow }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5081" /> }>
                                                <span>{ formatMessage({id: "LANG5080"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Transfer
                                        showSearch
                                        render={ this._renderItem }
                                        dataSource={ this.state.accountList }
                                        onChange={ this._handleCallbargingChange }
                                        filterOption={ this._filterTransferOption }
                                        targetKeys={ this.state.targetKeysCallbarging }
                                        notFoundContent={ formatMessage({id: "LANG133"}) }
                                        onSelectChange={ this._handleTransferSelectChange }
                                        searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                        titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG5294"}) }</span>
                                </div>
                            </Col>
                            <Col
                                span={ 24 }
                            >
                                <FormItem
                                    { ...formItemLayoutRow }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG5296" /> }>
                                                <span>{ formatMessage({id: "LANG5295"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Transfer
                                        showSearch
                                        render={ this._renderItem }
                                        dataSource={ this.state.accountList }
                                        onChange={ this._handleSeamlessChange }
                                        filterOption={ this._filterTransferOption }
                                        targetKeys={ this.state.targetKeysSeamless }
                                        notFoundContent={ formatMessage({id: "LANG133"}) }
                                        onSelectChange={ this._handleTransferSelectChange }
                                        searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                        titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG629"}) }</span>
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1134" /> }>
                                                <span>{ 'SRTP' }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('encryption', {
                                        rules: [],
                                        initialValue: 'no'
                                    })(
                                        <Select>
                                            <Option value='no'>{ formatMessage({id: "LANG4377"}) }</Option>
                                            <Option value="yes">{ formatMessage({id: "LANG4375"}) }</Option>
                                            <Option value='support'>{ formatMessage({id: "LANG4376"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4199" /> }>
                                                <span>{ formatMessage({id: "LANG3871"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('faxmode', {
                                        rules: [],
                                        initialValue: 'no'
                                    })(
                                        <Select>
                                            <Option value='no'>{ formatMessage({id: "LANG133"}) }</Option>
                                            <Option value='detect'>{ formatMessage({id: "LANG1135"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4047" /> }>
                                                <span>{ formatMessage({id: "LANG1142"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('bypass_outrt_auth', {
                                        rules: [],
                                        initialValue: this.state.bypass_outrt_auth
                                    })(
                                        <Select onChange={ this._onChangeTrunkAuth }>
                                            <Option value='no'>{ formatMessage({id: "LANG137"}) }</Option>
                                            <Option value='yes'>{ formatMessage({id: "LANG136"}) }</Option>
                                            <Option value='bytime'>{ formatMessage({id: "LANG4044"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ this.state.bypass_outrt_auth === 'bytime' ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4046" /> }>
                                                <span>{ formatMessage({id: "LANG4045"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('skip_auth_timetype', {
                                        rules: [],
                                        initialValue: '0',
                                        className: this.state.bypass_outrt_auth === 'bytime' ? 'display-block' : 'hidden'
                                    })(
                                        <Select>
                                            <Option value='0'>{ formatMessage({id: "LANG3285"}) }</Option>
                                            <Option value='1'>{ formatMessage({id: "LANG3271"}) }</Option>
                                            <Option value='2'>{ formatMessage({id: "LANG3275"}) }</Option>
                                            <Option value='3'>{ formatMessage({id: "LANG3266"}) }</Option>
                                            <Option value='4'>{ formatMessage({id: "LANG3286"}) }</Option>
                                            <Option value='5'>{ formatMessage({id: "LANG3287"}) }</Option>
                                            <Option value='6'>{ formatMessage({id: "LANG3288"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1138" /> }>
                                                <span>{ formatMessage({id: "LANG1137"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('strategy_ipacl', {
                                        rules: [],
                                        initialValue: this.state.strategy_ipacl,
                                        className: extensionType === 'fxs' ? 'hidden' : 'display-block'
                                    })(
                                        <Select onChange={ this._onChangeStrategy }>
                                            <Option value='0'>{ formatMessage({id: "LANG1139"}) }</Option>
                                            <Option value="1">{ formatMessage({id: "LANG1140"}) }</Option>
                                            <Option value='2'>{ formatMessage({id: "LANG1141"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ this.state.strategy_ipacl === '2' ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2346" /> }>
                                                <span>{ formatMessage({id: "LANG1144"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('specific_ip', {
                                        rules: [
                                            this.state.strategy_ipacl === '2'
                                                ? {
                                                        required: true,
                                                        message: formatMessage({id: "LANG2150"})
                                                    }
                                                : {}
                                        ],
                                        initialValue: '',
                                        className: this.state.strategy_ipacl === '2' ? 'display-block' : 'hidden'
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col
                                span={ 12 }
                                className={ this.state.strategy_ipacl === '1' ? 'display-block' : 'hidden' }
                            >
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1145" /> }>
                                                <span>{ formatMessage({id: "LANG1146"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('local_network1', {
                                        rules: [
                                            this.state.strategy_ipacl === '1'
                                                ? {
                                                        required: true,
                                                        message: formatMessage({id: "LANG2150"})
                                                    }
                                                : {}
                                        ],
                                        initialValue: '',
                                        className: this.state.strategy_ipacl === '1' ? 'display-block' : 'hidden'
                                    })(
                                        <Input />
                                    ) }
                                    <Icon
                                        type="plus-circle-o"
                                        onClick={ this._addLocalNetwork }
                                        className="dynamic-network-button"
                                    />
                                </FormItem>
                            </Col>
                            { localNetworkFormItems }
                            <Col
                                span={ 24 }
                            >
                                <FormItem
                                    { ...formItemLayoutRow }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG1150" /> }>
                                                <span>{ formatMessage({id: "LANG1149"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    <Transfer
                                        showSearch
                                        render={ item => item.title }
                                        onChange={ this._handleAllowChange }
                                        targetKeys={ this.state.targetKeysAllow }
                                        dataSource={ this._filterCodecsSource() }
                                        filterOption={ this._filterTransferOption }
                                        notFoundContent={ formatMessage({id: "LANG133"}) }
                                        onSelectChange={ this._handleTransferSelectChange }
                                        searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                        titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}

BatchEditExtension.propTypes = {}

export default Form.create()(injectIntl(BatchEditExtension))