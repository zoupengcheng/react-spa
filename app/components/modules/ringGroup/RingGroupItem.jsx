'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, message, Select, Tooltip, Checkbox, Row, Col, Transfer } from 'antd'

const FormItem = Form.Item

class RingGroupItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            targetKeysLDAP: [],
            accountList: [],
            ldapList: [],
            ringgroupnameList: [],
            numberList: [],
            mohnameList: [],
            fileList: [],
            ringGroupValues: {},
            disabled_exten: false,
            voicemailDisplay: false
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this._getInitData()
    }
    _checkName = (rule, value, callback) => {
        const { formatMessage } = this.props.intl
        const isCheckName = this.props.params.id ? false : true

        if (isCheckName) {
            if (value && _.indexOf(this.state.ringgroupnameList, value) > -1) {
                callback(formatMessage({id: "LANG2137"}))
            } else {
                callback()
            }
        } else {
            callback()
        }
    }
    _checkNumber = (rule, value, callback) => {
        const { formatMessage } = this.props.intl
        const isCheckNumber = this.props.params.id ? false : true

        if (isCheckNumber) {
            if (value && _.indexOf(this.state.numberList, value) > -1) {
                callback(formatMessage({id: "LANG2126"}))
            } else {
                callback()
            }
        } else {
            callback()
        }
    }
    _filterTransferOption = (inputValue, option) => {
        return (option.title.indexOf(inputValue) > -1)
    }
    _removeSuffix = (filename) => {
        let name = filename.toLocaleLowerCase(),
            file_suffix = [".mp3", ".wav", ".gsm", ".ulaw", ".alaw"]

        for (let i = 0; i < file_suffix.length; i++) {
            let num = name.lastIndexOf(file_suffix[i])

            if (num !== -1 && name.endsWith(file_suffix[i])) {
                filename = filename.substring(0, num)

                return filename
            }
        }
    }
    _onChangeAutoRecord = (e) => {
        let ringGroupValues = this.state.ringGroupValues || {}

        if (e.target.checked) {
            ringGroupValues.auto_record = 'yes'
        } else {
            ringGroupValues.auto_record = 'no'
        }
        this.setState({
            ringGroupValues: ringGroupValues
        })
    }
    _onChangeReplaceCaller = (e) => {
        let ringGroupValues = this.state.ringGroupValues || {}

        if (e.target.checked) {
            ringGroupValues.replace_caller_id = 'yes'
        } else {
            ringGroupValues.replace_caller_id = 'no'
        }
        this.setState({
            ringGroupValues: ringGroupValues
        })
    }
    _onChangeEnableDestination = (e) => {
        let ringGroupValues = this.state.ringGroupValues || {}

        if (e.target.checked) {
            ringGroupValues.enable_destination = 'yes'
        } else {
            ringGroupValues.enable_destination = 'no'
        }
        this.setState({
            ringGroupValues: ringGroupValues
        })
    }
    _onChangeMode = (e) => {
        if (e === 'extension') {
            this.setState({
                voicemailDisplay: false
            })
        } else if (e === 'voicemail') {
            this.setState({
                voicemailDisplay: false
            })
        } else if (e === 'callqueue') {
            this.setState({
                voicemailDisplay: false
            })
        } else if (e === 'vm_group') {
            this.setState({
                voicemailDisplay: false
            })
        } else if (e === 'ivr') {
            this.setState({
                voicemailDisplay: false
            })
        } else if (e === 'external_num') {
            this.setState({
                voicemailDisplay: false
            })
        }
    }
    _getInitData = () => {
        let targetKeys = []
        let targetKeysLDAP = []
        let accountList = []
        let ldapList = []
        let ringgroupnameList = []
        let numberList = []
        let mohnameList = []
        let fileList = []
        let ringGroupValues = {}
        const { formatMessage } = this.props.intl
        const ringgroup_exten = this.props.params.id
        const ringgroup_name = this.props.params.name
        const __this = this

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getRinggroupNameList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    ringgroupnameList = response.ringgroup_name || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getNumberList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    numberList = response.number || []
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getAccountList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const extension = response.extension || []
                    const disabled = formatMessage({id: "LANG273"})

                    accountList = extension.map(function(item) {
                        return {
                                key: item.extension,
                                out_of_service: item.out_of_service,
                                title: (item.extension +
                                        (item.fullname ? ' "' + item.fullname + '"' : '') +
                                        (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                            }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getPhonebookListDnAndMembers'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const disabled = formatMessage({id: "LANG273"})
                    const response = res.response || {}
                    let memberLDAP = response.extension

                    for (let i = 0; i < memberLDAP.length; i++) {
                        let phonebook = memberLDAP[i]["phonebook_dn"]
                        if (phonebook && (phonebook !== "ou=pbx,dc=pbx,dc=com")) {
                            let members = memberLDAP[i]["members"] ? memberLDAP[i]["members"].split('|') : []

                            for (let j = 0, length = members.length; j < length; j++) {
                                let extension = members[j]

                                if (extension) {
                                    let obj = {
                                    key: extension + '#' + phonebook,
                                    title: extension + '(' + phonebook + ')'
                                    }
                                    ldapList.push(obj)
                                }
                            }
                        }
                    }
                    console.log('ldapt is ', ldapList)
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getMohNameList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    mohnameList = response.moh_name
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listFile',
                type: 'ivr',
                filter: '{"list_dir":0,"list_file":1,"file_suffix":["mp3","wav","gsm","ulaw","alaw"]}',
                sidx: 'n',
                sord: 'desc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    response.ivr.map(function(item) {
                        let obj = {
                            text: item.n,
                            val: "record/" + __this._removeSuffix(item.n)
                        }
                        fileList.push(obj)
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        if (ringgroup_exten) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getRinggroup',
                    ringgroup: ringgroup_exten
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}
                        ringGroupValues = response.ringgroup

                        targetKeys = ringGroupValues.members ? ringGroupValues.members.split(',') : []
                        targetKeysLDAP = ringGroupValues.members_ldap ? ringGroupValues.members_ldap.split('|') : []

                        this.setState({
                            disabled_exten: true
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        this.setState({
            targetKeys: targetKeys,
            targetKeysLDAP: targetKeysLDAP,
            accountList: accountList,
            ldapList: ldapList,
            ringgroupnameList: ringgroupnameList,
            numberList: numberList,
            mohnameList: mohnameList,
            fileList: fileList,
            ringGroupValues: ringGroupValues
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/ringGroup')
    }
    _handleTransferChange = (targetKeys, direction, moveKeys) => {
        this.setState({
            targetKeys: targetKeys
        })

        console.log('targetKeys extension: ', targetKeys)
        console.log('direction extension: ', direction)
        console.log('moveKeys extension: ', moveKeys)
    }
    _handleTransferChangeLDAP = (targetKeys, direction, moveKeys) => {
        this.setState({
            targetKeysLDAP: targetKeys
        })

        console.log('targetKeys LDAP: ', targetKeys)
        console.log('direction LDAP: ', direction)
        console.log('moveKeys LDAP: ', moveKeys)
    }
    _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        // this.setState({ targetContactKeys: nextTargetKeys })
        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    _handleSubmit = () => {
        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const ringgroup_extension = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                if (!this.state.targetKeys.length && !this.state.targetKeysLDAP.length) {
                    message.error(errorMessage)

                    return
                }

                message.loading(loadingMessage)

                let action = values

                action.members = this.state.targetKeys.join()
                action.members_ldap = this.state.targetKeysLDAP.join('|')
                action.auto_record = this.state.ringGroupValues.auto_record
                action.replace_caller_id = this.state.ringGroupValues.replace_caller_id
                action.enable_destination = this.state.ringGroupValues.enable_destination

                if (ringgroup_extension) {
                    action.action = 'updateRinggroup'
                    action.ringgroup = ringgroup_extension
                    delete action.extension
                } else {
                    action.action = 'addRinggroup'
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
    _renderItem = (item) => {
        const customLabel = (
                <span>
                    { item.title }
                </span>
            )

        return {
                label: customLabel,  // for displayed item
                value: item.title   // for title and filter matching
            }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const ring_name = this.props.params.name
        const ring_extension = this.props.params.id
        const ringGroupValues = this.state.ringGroupValues

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemDestinationLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        }

        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG600"}),
                    1: this.props.params.id
                })
                : formatMessage({id: "LANG602"}))

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
                    isDisplay='display-block'
                />
                <div className="content">
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG1053"}) }</span>
                            )}
                        >
                            { getFieldDecorator('ringgroup_name', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkName
                                }],
                                initialValue: ring_name ? ring_name : ''
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1053"}) } maxLength="25" />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG85"}) }</span>
                            )}
                        >
                            { getFieldDecorator('extension', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG85"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.minlength(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                    }
                                }, {
                                    validator: this._checkNumber
                                }],
                                initialValue: ring_extension ? ring_extension : ''
                            })(
                                <Input disabled={ this.state.disabled_exten ? true : false } placeholder={ formatMessage({id: "LANG85"}) } maxLength="25" />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemTransferLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG128"}) }</span>
                            )}
                        >
                            <Transfer
                                showSearch
                                render={ this._renderItem }
                                targetKeys={ this.state.targetKeys }
                                dataSource={ this.state.accountList }
                                onChange={ this._handleTransferChange }
                                filterOption={ this._filterTransferOption }
                                notFoundContent={ formatMessage({id: "LANG133"}) }
                                onSelectChange={ this._handleTransferSelectChange }
                                searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                titles={[formatMessage({id: "LANG2484"}), formatMessage({id: "LANG2483"})]}
                            />
                        </FormItem>
                        <FormItem
                            { ...formItemTransferLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG714"}) }</span>
                            )}
                        >
                            <Transfer
                                showSearch
                                render={ this._renderItem }
                                targetKeys={ this.state.targetKeysLDAP }
                                dataSource={ this.state.ldapList }
                                onChange={ this._handleTransferChangeLDAP }
                                filterOption={ this._filterTransferOption }
                                notFoundContent={ formatMessage({id: "LANG133"}) }
                                onSelectChange={ this._handleTransferSelectChange }
                                searchPlaceholder={ formatMessage({id: "LANG803"}) }
                                titles={[formatMessage({id: "LANG3214"}), formatMessage({id: "LANG3215"})]}
                            />
                        </FormItem>
                        <div className="function-description">
                            <span>{ formatMessage({id: "LANG601"}) }</span>
                        </div>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG1061"}) }</span>
                            )}
                        >
                            { getFieldDecorator('strategy', {
                                rules: [],
                                initialValue: "ORDER"
                            })(
                                <Select>
                                    <Option value="SIMULTA">{ formatMessage({id: "LANG1062"}) }</Option>
                                    <Option value="ORDER">{ formatMessage({id: "LANG1063"}) }</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_musicclass"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG1179" />}>
                                    <span>{ formatMessage({id: "LANG1178"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('musicclass', {
                                rules: [],
                                initialValue: ringGroupValues.musicclass ? ringGroupValues.musicclass : ''
                            })(
                                <Select>
                                     <Option key="" value="">{ formatMessage({id: "LANG133"}) }</Option>
                                    {
                                        this.state.mohnameList.map(function(value, index) {
                                            return <Option value={ value } key={ index }>{ value }</Option>
                                        })
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_custom_prompt"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3489" />}>
                                    <span>{ formatMessage({id: "LANG28"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('custom_prompt', {
                                rules: [],
                                initialValue: ringGroupValues.custom_prompt ? ringGroupValues.custom_prompt : ''
                            })(
                                 <Select>
                                    <Option key="" value="">{ formatMessage({id: "LANG133"}) }</Option>
                                    {
                                        this.state.fileList.map(function(item) {
                                            return <Option
                                                    key={ item.text }
                                                    value={ item.val }>
                                                    { item.text }
                                                </Option>
                                            }
                                        )
                                    }
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_ringtime"
                            { ...formItemLayout }
                            label={
                                <Tooltip title={<FormattedHTMLMessage id="LANG1056" />}>
                                    <span>{formatMessage({id: "LANG1055"})}</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('ringtime', {
                            rules: [{ required: true,
                                message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: ringGroupValues.ringtime ? ringGroupValues.ringtime : '60'
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_auto_record"
                            { ...formItemLayout }
                            label={
                                <Tooltip title={<FormattedHTMLMessage id="LANG2544" />}>
                                    <span>{formatMessage({id: "LANG2543"})}</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('auto_record', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: ringGroupValues.auto_record === "yes"
                            })(
                                <Checkbox onChange={ this._onChangeAutoRecord } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_replace_caller_id"
                            { ...formItemLayout }
                            label={
                                <Tooltip title={<FormattedHTMLMessage id="LANG5073" />}>
                                    <span>{formatMessage({id: "LANG5071"})}</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('replace_caller_id', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: ringGroupValues.replace_caller_id === "yes"
                            })(
                                <Checkbox onChange={ this._onChangeReplaceCaller } />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_enable_destination"
                            { ...formItemLayout }
                            className= { ringGroupValues.voicemailDisplay ? 'display-block' : 'hidden' }
                            label={
                                <span>{formatMessage({id: "LANG2990"})}</span>
                            }>
                            { getFieldDecorator('enable_destination', {
                                rules: [],
                                initialValue: ringGroupValues.enable_destination ? ringGroupValues.enable_destination : 'no'
                            })(
                                <Checkbox onChange={ this._onChangeEnableDestination } />
                            ) }
                        </FormItem>
                        <Row>
                            <Col span={ 9 } style={{ marginRight: 20 }}>
                                <FormItem
                                    ref="div_destination_type"
                                    { ...formItemDestinationLayout }
                                    className= { ringGroupValues.voicemailDisplay ? 'display-block' : 'hidden' }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2991" />}>
                                            <span>{ formatMessage({id: "LANG1558"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('destination_type', {
                                        rules: [],
                                        width: 100,
                                        initialValue: 'account'
                                    })(
                                        <Select onChange={ this._onChangeMode } >
                                            <Option value='extension'>{ formatMessage({id: "LANG11"}) }</Option>
                                            <Option value='voicemail'>{ formatMessage({id: "LANG20"}) }</Option>
                                            <Option value='callqueue'>{ formatMessage({id: "LANG24"}) }</Option>
                                            <Option value='vm_group'>{ formatMessage({id: "LANG21"}) }</Option>
                                            <Option value='ivr'>{ formatMessage({id: "LANG19"}) }</Option>
                                            <Option value='external_num'>{ formatMessage({id: "LANG3458"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 } style={{ marginRight: 20 }}>
                                <FormItem
                                    ref="div_external_number"
                                    { ...formItemLayout }
                                    className= { ringGroupValues.voicemailDisplay ? 'display-block' : 'hidden' }
                                >
                                    { getFieldDecorator('external_number', {
                                        rules: [],
                                        width: 100,
                                        initialValue: ''
                                    })(
                                        <Select>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem
                            ref="div_vmsecret"
                            { ...formItemLayout }
                            className= { ringGroupValues.voicemailDisplay ? 'display-block' : 'hidden' }
                            label={
                                <span>{formatMessage({id: "LANG127"})}</span>
                            }>
                            { getFieldDecorator('vmsecret', {
                                rules: [],
                                initialValue: ''
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                        <FormItem
                            ref="div_email"
                            { ...formItemLayout }
                            className= { ringGroupValues.voicemailDisplay ? 'display-block' : 'hidden' }
                            label={
                                <span>{formatMessage({id: "LANG126"})}</span>
                            }>
                            { getFieldDecorator('email', {
                                rules: [],
                                initialValue: ''
                            })(
                                <Input/>
                            ) }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(RingGroupItem))