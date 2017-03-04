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
import { Form, Input, message, Select, Tooltip, Checkbox, Row, Col, Transfer, Modal } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

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
            voicemailDisplay: false,
            extensionList: [],
            voicemailList: [],
            queueList: [],
            ringGroupList: [],
            vmGroupList: [],
            externalNumber: false
        }
    }
    componentWillMount() {
        this._getAccountList()
        this._getVoicemailList()
        this._getQueueList()
        this._getRingGroupList()
        this._getVmGroupList()
        this._getIvrList()
        this._getRingGroupValues()
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

    _handleSelectExtension = (val) => {
        console.log('-----value is-----: ', val)
        let displayList = []
        let voicemailDisplay = false
        let externalNumber = false
        if (val === 'account') {
            let accountList = this.state.accountList
            for (let i = 0; i < accountList.length; i++) {
                let extension = accountList[i].key
                if (extension) {
                    let obj = {
                        key: extension,
                        val: extension
                    }
                    displayList.push(obj)
                }
            }
        } else if (val === 'voicemail') {
            voicemailDisplay = true
            let voicemailList = this.state.voicemailList
            for (let i = 0; i < voicemailList.length; i++) {
                let extension = voicemailList[i]["extension"]
                if (extension) {
                    let obj = {
                        key: extension,
                        val: extension
                    }
                    displayList.push(obj)
                }
            }
        } else if (val === 'queue') {
            let queueList = this.state.queueList
            for (let i = 0; i < queueList.length; i++) {
                let extension = queueList[i]["extension"]
                let queueName = queueList[i]["queue_name"]
                if (extension && queueName) {
                    let obj = {
                        key: extension,
                        val: queueName
                    }
                    displayList.push(obj)
                }
            }
        } else if (val === 'ringgroup') {
            let ringGroupList = this.state.ringGroupList
            let ringGroupExten = this.state.ringGroupValues.extension
            for (let i = 0; i < ringGroupList.length; i++) {
                let extension = ringGroupList[i]["extension"]
                let ringGroupName = ringGroupList[i]["ringgroup_name"]
                if (extension && ringGroupName && extension !== ringGroupExten) {
                    let obj = {
                        key: extension,
                        val: ringGroupName
                    }
                    displayList.push(obj)
                }
            }
        } else if (val === 'vmgroup') {
            let vmGroupList = this.state.vmGroupList
            for (let i = 0; i < vmGroupList.length; i++) {
                let extension = vmGroupList[i]["extension"]
                let vmGroupName = vmGroupList[i]["vmgroup_name"]
                if (extension && vmGroupName) {
                    let obj = {
                        key: extension,
                        val: vmGroupName
                    }
                    displayList.push(obj)
                }
            }
        } else if (val === 'ivr') {
            displayList = this.state.fileList
        } else if (val === 'external_number') {
            displayList = []
            externalNumber = true
        }

        this.setState({
            extensionList: displayList,
            voicemailDisplay: voicemailDisplay,
            externalNumber: externalNumber
        })
        console.log('distination value is: ', displayList)
    }

    _getAccountList = () => {
        const { formatMessage } = this.props.intl
        let accountList = []
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
                    this.setState({
                        accountList: accountList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getVoicemailList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getVoicemailList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    let voicemailList = response.extension || []
                    this.setState({
                        voicemailList: voicemailList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getQueueList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getQueueList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    let queueList = response.queues || []
                    this.setState({
                        queueList: queueList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getRingGroupList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getRinggroupList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    let ringGroupList = response.ringgroups || []
                    this.setState({
                        ringGroupList: ringGroupList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getVmGroupList = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getVMgroupList'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    let vmGroupList = response.vmgroups || []
                    this.setState({
                        vmGroupList: vmGroupList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getIvrList = () => {
        let fileList = []
        let __this = this
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
                    this.setState({
                        fileList: fileList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }

    _getRingGroupValues = () => {
        let ringGroupValues = {}
        const ringgroup_exten = this.props.params.id
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

                        this.setState({
                            disabled_exten: true,
                            ringGroupValues: ringGroupValues
                        })
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }
    }

    _getInitData = () => {
        let targetKeys = []
        let targetKeysLDAP = []
        let ldapList = []
        let ringgroupnameList = []
        let numberList = []
        let mohnameList = []
        const { formatMessage } = this.props.intl
        const ringGroupExten = this.props.params.id
        const ringGroupName = this.props.params.name
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

        if (ringGroupExten) {
            let ringGroupValues = this.state.ringGroupValues
            let destinationType = ringGroupValues.destination_type

            targetKeys = ringGroupValues.members ? ringGroupValues.members.split(',') : []
            targetKeysLDAP = ringGroupValues.members_ldap ? ringGroupValues.members_ldap.split('|') : []
            this._handleSelectExtension(destinationType)
        } else {
            this._handleSelectExtension('account')
        }

        this.setState({
            targetKeys: targetKeys,
            targetKeysLDAP: targetKeysLDAP,
            ldapList: ldapList,
            ringgroupnameList: ringgroupnameList,
            numberList: numberList,
            mohnameList: mohnameList
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

    _updateDestinationInfo = (destType, value, action) => {
        if (destType === 'account') {
            action['account'] = value
        } else {
            action['account'] = ''
        }

        if (destType === 'voicemail') {
            action['vm_extension'] = value
            action['hasvoicemail'] = 'yes'
        } else {
            action['vm_extension'] = ''
            action['hasvoicemail'] = 'no'
        }

        if (destType === 'callqueue') {
            let extension = ''
            this.state.queueList.map(function(item) {
                if (item.queue_name === value) {
                    extension = item.extension
                }
            })
            action['queue'] = extension
        } else {
            action['queue'] = ''
        }

        if (destType === 'ringgroup') {
            let extension = ''
            this.state.ringgroupList.map(function(item) {
                if (item.ringgroup_name === value) {
                    extension = item.extension
                }
            })
            action['ringgroup_dest'] = extension
        } else {
            action['ringgroup_dest'] = ''
        }

        if (destType === 'vm_group') {
            let extension = ''
            this.state.vmGroupList.map(function(item) {
                if (item.vmgroup_name === value) {
                    extension = item.extension
                }
            })
            action['vmgroup'] = extension
        } else {
            action['vmgroup'] = ''
        }

        if (destType === 'ivr') {
            action['ivr'] = value
        } else {
            action['ivr'] = ''
        }

        if (destType === 'external_num') {
            action['external_number'] = value
        } else {
            action['external_number'] = ''
        }

        console.log('add dest val ', action)
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
                let selectExtension = values.select_extension
                let selectDestType = values.destination_type

                delete action.select_extension
                action.members = this.state.targetKeys.join()
                action.members_ldap = this.state.targetKeysLDAP.join('|')
                action.auto_record = this.state.ringGroupValues.auto_record
                action.replace_caller_id = this.state.ringGroupValues.replace_caller_id
                action.enable_destination = this.state.ringGroupValues.enable_destination

                this._updateDestinationInfo(selectDestType, selectExtension, action)

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
    _gotoPromptOk = () => {
        browserHistory.push('/pbx-settings/voicePrompt/2')
    }
    _gotoPrompt = () => {
        console.log('enter goto Prompt')
        const { formatMessage } = this.props.intl
        const __this = this
        confirm({
            title: (formatMessage({id: "LANG543"})),
            content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG843"}, {0: formatMessage({id: "LANG28"})})}} ></span>,
            onOk() {
                __this._gotoPromptOk()
            },
            onCancel() {},
            okText: formatMessage({id: "LANG727"}),
            cancelText: formatMessage({id: "LANG726"})
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        const ring_name = this.props.params.name
        const ring_extension = this.props.params.id
        const ringGroupValues = this.state.ringGroupValues
        const extensionList = this.state.extensionList

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemPromptLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 9 }
        }

        const formItemDestinationLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
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
                                <Tooltip title={<FormattedHTMLMessage id="LANG4724" />}>
                                    <span>{ formatMessage({id: "LANG714"}) }</span>
                                </Tooltip>
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
                        <div className="section-title">
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
                                initialValue: ringGroupValues.strategy ? ringGroupValues.strategy : "ORDER"
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
                            { ...formItemPromptLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3489" />}>
                                    <span>{ formatMessage({id: "LANG28"}) }</span>
                                </Tooltip>
                            )}
                        >
                            <Row>
                                <Col span={ 16 }>
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
                                </Col>
                                <Col span={6} offset={1} >
                                    <a className="prompt_setting" onClick={ this._gotoPrompt } >{ formatMessage({id: "LANG1484"}) }</a>
                                </Col>
                            </Row>
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
                                }, {
                                        validator: (data, value, callback) => {
                                            Validator.digits(data, value, callback, formatMessage, 2)
                                    }
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
                            label={
                                <span>{formatMessage({id: "LANG2990"})}</span>
                            }>
                                <Checkbox onChange={ this._onChangeEnableDestination } checked={ ringGroupValues.enable_destination === 'yes' }/>
                        </FormItem>
                        <Row>
                            <Col span={ 6 } style={{ marginRight: 20 }}>
                                <FormItem
                                    ref="div_destination_type"
                                    { ...formItemDestinationLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2991" />}>
                                            <span>{ formatMessage({id: "LANG1558"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('destination_type', {
                                        rules: [],
                                        width: 100,
                                        initialValue: ringGroupValues.destination_type ? ringGroupValues.destination_type : 'account'
                                    })(
                                        <Select disabled = { ringGroupValues.enable_destination === 'no' } onChange={ this._handleSelectExtension } >
                                            <Option value='account'>{ formatMessage({id: "LANG11"}) }</Option>
                                            <Option value='voicemail'>{ formatMessage({id: "LANG20"}) }</Option>
                                            <Option value='queue'>{ formatMessage({id: "LANG24"}) }</Option>
                                            <Option value='ringgroup'>{ formatMessage({id: "LANG600"}) }</Option>
                                            <Option value='vmgroup'>{ formatMessage({id: "LANG21"}) }</Option>
                                            <Option value='ivr'>{ formatMessage({id: "LANG19"}) }</Option>
                                            <Option value='external_number'>{ formatMessage({id: "LANG3458"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 3 } style={{ marginRight: 20 }} className= { this.state.externalNumber ? 'hidden' : 'display-block' }>
                                { getFieldDecorator('select_extension', {
                                    rules: [],
                                    width: 100,
                                    initialValue: extensionList.length > 0 ? extensionList[0].val : ''
                                })(
                                     <Select disabled = { ringGroupValues.enable_destination === 'no' }>
                                        {
                                            extensionList.map(function(item) {
                                                return <Option value={ item.val }>{ item.val }</Option>
                                                }
                                            )
                                        }
                                    </Select>
                                ) }
                            </Col>
                            <Col span={ 3 } style={{ marginRight: 20 }} className= { this.state.externalNumber ? 'display-block' : 'hidden' }>
                                { getFieldDecorator('external_number', {
                                    rules: [],
                                    initialValue: ringGroupValues.external_number ? ringGroupValues.external_number : ''
                                })(
                                    <Input disabled = { ringGroupValues.enable_destination === 'no' } />
                                ) }
                            </Col>
                        </Row>
                        <FormItem
                            ref="div_vmsecret"
                            { ...formItemLayout }
                            className= { this.state.voicemailDisplay ? 'display-block' : 'hidden' }
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
                            className= { this.state.voicemailDisplay ? 'display-block' : 'hidden' }
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