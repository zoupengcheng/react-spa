'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Form, Input, message, Transfer, Tooltip, Select, Checkbox, Row, Col, Modal } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

class PagingIntercomItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            targetKeys: [],
            accountList: [],
            groupList: [],
            groupNameList: [],
            numberList: [],
            fileList: [],
            pagingIntercomItem: {}
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
    _checkExtension = (rule, value, callback) => {
        const { formatMessage } = this.props.intl

        if (value && _.indexOf(this.state.numberList, value) > -1) {
            callback(formatMessage({id: "LANG2126"}))
        } else {
            callback()
        }
    }
    _gotoPromptOk = () => {
        browserHistory.push('/pbx-settings/voicePrompt/2')
    }
    _gotoPrompt = () => {
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
    _getInitData = () => {
        let targetKeys = []
        let accountList = []
        let groupList = []
        let groupNameList = []
        let numberList = []
        let fileList = []
        let pagingIntercom = {}
        const { formatMessage } = this.props.intl
        const paginggroupId = this.props.params.id
        const paginggroupName = this.props.params.name
        const __this = this

        let getList = []
        getList.push({"getNumberList": ""})
        getList.push({"getPaginggroupNameList": ""})
        getList.push({"getAccountList": ""})
        getList.push({"getExtensionGroupList": ""})

        $.ajax({
            url: api.apiHost + 'action=combineAction&data=' + JSON.stringify(getList),
            method: 'GET',
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const getNumberList = response.getNumberList || {}
                    const getPaginggroupNameList = response.getPagingGroupNameList || {}
                    const getAccountList = response.getAccountList || {}
                    const getExtensionGroupList = response.getExtensionGroupList || {}
                    const disabled = formatMessage({id: "LANG273"})
                    const extgroupLabel = formatMessage({id: "LANG2714"})

                    numberList = getNumberList.number || []
                    groupNameList = getPaginggroupNameList.paginggroup_name || []
                    const getAccountList_extension = getAccountList.extension
                    const getExtensionGroupList_extension = getExtensionGroupList.extension_groups

                    accountList = getAccountList_extension.map(function(item) {
                        return {
                                key: item.extension,
                                out_of_service: item.out_of_service,
                                // disabled: (item.out_of_service === 'yes'),
                                title: (item.extension +
                                        (item.fullname ? ' "' + item.fullname + '"' : '') +
                                        (item.out_of_service === 'yes' ? ' <' + disabled + '>' : ''))
                            }
                    })

                    groupList = getExtensionGroupList_extension.map(function(item) {
                        return {
                                key: item.group_id,
                                out_of_service: "no",
                                // disabled: (item.out_of_service === 'yes'),
                                title: (extgroupLabel + "--" + item.group_name)
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

        if (paginggroupId) {
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    action: 'getPaginggroup',
                    paginggroup: paginggroupId
                },
                type: 'json',
                async: false,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        const response = res.response || {}

                        pagingIntercom = res.response.paginggroup || {}
                        targetKeys = pagingIntercom.members.split(',') || []
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }

        if (pagingIntercom.paginggroup_name) {
            groupNameList = _.without(groupNameList, pagingIntercom.paginggroup_name)
        }
        if (pagingIntercom.extension) {
            numberList = _.without(numberList, pagingIntercom.extension)
        }
        // if (extensionGroupName) {
        //     groupNameList = _.without(groupNameList, extensionGroupName)
        // }
        for (let i = 0; i < groupList.length; i++) {
            accountList.push(groupList[i])
        }

        this.setState({
            targetKeys: targetKeys,
            accountList: accountList,
            groupList: groupList,
            groupNameList: groupNameList,
            fileList: fileList,
            numberList: numberList,
            pagingIntercomItem: pagingIntercom
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/pagingIntercom')
    }
    _handleTransferChange = (targetKeys, direction, moveKeys) => {
        this.setState({
            targetKeys: targetKeys
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
    _handleSubmit = () => {
        // e.preventDefault()

        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const paginggroupId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>
        errorMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4762"}, {
                    0: formatMessage({id: "LANG85"}).toLowerCase()
                })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                if (!this.state.targetKeys.length) {
                    message.error(errorMessage)

                    return
                }

                message.loading(loadingMessage)

                let action = values
                action.replace_caller_id = values.replace_caller_id === true ? 'yes' : 'no'

                action.members = this.state.targetKeys.join()

                if (paginggroupId) {
                    action.action = 'updatePaginggroup'
                    action.paginggroup = paginggroupId
                } else {
                    action.action = 'addPaginggroup'
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
                <span className={ item.out_of_service === 'yes' ? 'out-of-service' : '' }>
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

        const pagingIntercomItem = this.state.pagingIntercomItem || {}
        const name = pagingIntercomItem.paginggroup_name

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemPromptLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 9 }
        }

        const formItemTransferLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG604"}),
                    1: this.props.params.name
                })
                : formatMessage({id: "LANG604"}))

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
                                <span>{ formatMessage({id: "LANG135"}) }</span>
                            )}
                        >
                            { getFieldDecorator('paginggroup_name', {
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
                                initialValue: name
                            })(
                                <Input placeholder={ formatMessage({id: "LANG135"}) } maxLength='25' />
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

                                    message: formatMessage({id: "LANG2150"})
                                }, {
                                    validator: (data, value, callback) => {
                                        Validator.digits(data, value, callback, formatMessage, 2)
                                    }
                                }, {
                                    validator: this._checkExtension
                                }],
                                initialValue: pagingIntercomItem.extension
                            })(
                                <Input placeholder={ formatMessage({id: "LANG85"}) } maxLength='25' />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <span>{ formatMessage({id: "LANG84"}) }</span>
                            )}
                        >
                            { getFieldDecorator('paginggroup_type', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                initialValue: pagingIntercomItem.paginggroup_type ? pagingIntercomItem.paginggroup_type : "2way" 
                            })(
                                <Select>
                                    <Option value="2way">{ formatMessage({id: "LANG1162"}) }</Option>
                                    <Option value="1way">{ formatMessage({id: "LANG1161"}) }</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG5074" />}>
                                    <span>{formatMessage({id: "LANG5071"})}</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('replace_caller_id', {
                                rules: [{
                                    required: true,
                                    message: formatMessage({id: "LANG2150"})
                                }],
                                valuePropName: 'checked',
                                initialValue: pagingIntercomItem.replace_caller_id === "yes"
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemPromptLayout }
                            label={(
                                <Tooltip title={<FormattedHTMLMessage id="LANG3490" />}>
                                    <span>{formatMessage({id: "LANG28"})}</span>
                                </Tooltip>
                            )}
                        >
                            <Row>
                                <Col span={16}>
                                { getFieldDecorator('custom_prompt', {
                                    rules: [],
                                    initialValue: pagingIntercomItem.custom_prompt ? pagingIntercomItem.custom_prompt : ""
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
                                titles={[formatMessage({id: "LANG5121"}), formatMessage({id: "LANG3475"})]}
                            />
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(PagingIntercomItem))
