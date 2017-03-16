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
import { Checkbox, Col, Form, Input, message, Row, Select, Transfer, Tooltip } from 'antd'

let secret
let vmsecret
let newExtension
let user_password
let hasGeneratePassword = false

const FormItem = Form.Item
const Option = Select.Option

class BasicSettings extends Component {
    constructor(props) {
        super(props)

        let hasvoicemail = this.props.settings.hasvoicemail
                        ? (this.props.settings.hasvoicemail === 'yes' ? true : false)
                        : true

        this.state = {
            languages: [],
            batch_number: '5',
            add_method: 'single',
            hasvoicemail: hasvoicemail,
            enable_qualify: this.props.settings.enable_qualify === 'yes' ? true : false
        }
    }
    componentDidMount() {
    }
    componentWillMount() {
        this._getLanguages()
    }
    _getLanguages = () => {
        const { formatMessage } = this.props.intl

        let languages = UCMGUI.isExist.getList('getLanguage', formatMessage)

        this.setState({
            languages: languages
        })
    }
    _generateNewExtension = (extensionRange, existNumberList) => {
        let startExt = extensionRange[0]
        let endExt = extensionRange[1]
        let i = startExt

        for (i; i <= endExt; i++) {
            if (i < 10) {
                i = "0" + i
            }

            if (!_.contains(existNumberList, i.toString())) {
                return i.toString()
            }
        }
    }
    _generatePassword(extensionRange, existNumberList, type, length) {
        if (extensionRange[3].toLowerCase() === "yes") { // Strong Password
            let pw = ''
            let chars = ''
            let strLength = (length ? length : Math.floor((Math.random() * 3) + 6))

            switch (type) {
                case 'number':
                    chars += '3745890162'
                    break
                case 'char':
                    chars += 'ZmnopqrMDEFGabcdefgABCXYRSstuvwxyzhijklHIJKLTUVWNOPQ'
                    break
                case 'special':
                    chars += '~!@#$%^*'
                    break
                default:
                    chars += '^*VW01234XYZabcdefghijklmnoABCNOHIJKLMp$%PQRSTz56qrstuvwxy9~!@#78UDEFG'
                    break
            }

            chars = chars.split('')

            for (let i = 0; i < strLength; i++) {
                pw += chars[Math.floor(Math.random() * chars.length)]
            }

            // Pengcheng Zou Added. Check if has number.
            if (!/\d/g.test(pw)) {
                pw = pw.substr(1) // length - 1
                pw += this._generatePassword(extensionRange, existNumberList, 'number', 1)
            }

            return pw
        } else {
            return ''
            // return this._generateNewExtension(extensionRange, existNumberList)
        }
    }
    _onChangeExtensionType = (value) => {
        if (value === 'fxs') {
            this.setState({
                add_method: 'single'
            })
        }

        this.props.onExtensionTypeChange(value)
    }
    _onChangeAddMethod = (value) => {
        this.setState({
            add_method: value
        })
    }
    _onChangeHasVoicemail = (e) => {
        this.setState({
            hasvoicemail: e.target.checked
        })
    }
    _onChangeQualify = (e) => {
        this.setState({
            enable_qualify: e.target.checked
        })
    }
    _onFocus = (e) => {
        e.preventDefault()

        const form = this.props.form

        form.validateFields([e.target.id], { force: true })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const settings = this.props.settings || {}
        const { getFieldDecorator } = this.props.form
        const currentEditId = this.props.currentEditId
        const extension_type = this.props.extensionType
        const extensionRange = this.props.extensionRange
        const existNumberList = this.props.existNumberList
        const userSettings = this.props.userSettings || {}

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutRow = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 }
        }

        if (!currentEditId && !hasGeneratePassword &&
            extensionRange && extensionRange.length &&
            existNumberList && existNumberList.length) {
            newExtension = this._generateNewExtension(extensionRange, existNumberList)

            secret = this._generatePassword(extensionRange, existNumberList) || newExtension
            user_password = this._generatePassword(extensionRange, existNumberList) || newExtension
            vmsecret = this._generatePassword(extensionRange, existNumberList, 'number') || newExtension

            hasGeneratePassword = true
        }

        return (
            <div className="content">
                <div className="ant-form">
                    <Row
                        className={ !currentEditId ? 'display-block' : 'hidden' }
                    >
                        <Col span={ 24 }>
                            <FormItem
                                { ...formItemLayoutRow }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5417" /> }>
                                            <span>{ formatMessage({id: "LANG5417"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('extension_type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: extension_type,
                                    className: (!currentEditId ? 'display-block' : 'hidden')
                                })(
                                    <Select onChange={ this._onChangeExtensionType }>
                                        <Option value='sip'>{ formatMessage({id: "LANG2927"}) }</Option>
                                        <Option value='iax'>{ formatMessage({id: "LANG2929"}) }</Option>
                                        <Option value='fxs'>{ formatMessage({id: "LANG2928"}) }</Option>
                                    </Select>
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG5418" /> }>
                                            <span>{ formatMessage({id: "LANG5418"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                <Select
                                    value={ this.state.add_method }
                                    onChange={ this._onChangeAddMethod }
                                >
                                    <Option value='single'>{ formatMessage({id: "LANG5420"}) }</Option>
                                    <Option
                                        value='batch'
                                        disabled={ extension_type === 'fxs' }
                                    >
                                        { formatMessage({id: "LANG5419"}) }
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                className={ (!currentEditId && this.state.add_method === 'batch')
                                                    ? 'display-block'
                                                    : 'hidden'
                                                }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1158" /> }>
                                            <span>{ formatMessage({id: "LANG1157"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('batch_number', {
                                    rules: [
                                        {
                                            // type: 'integer',
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: this.state.batch_number,
                                    className: (!currentEditId && this.state.add_method === 'batch')
                                                    ? 'display-block'
                                                    : 'hidden'
                                })(
                                    <Input min={ 1 } max={ 100 } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG625"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1064" /> }>
                                            <span>{ formatMessage({id: "LANG85"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('extension', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.extension ? settings.extension : newExtension
                                })(
                                    <Input disabled={ !!currentEditId } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'fxs' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1092" /> }>
                                            <span>{ formatMessage({id: "LANG1091"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('dahdi', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.dahdi ? settings.dahdi + '' : '1',
                                    className: extension_type === 'fxs' ? 'display-block' : 'hidden'
                                })(
                                    <Select>
                                        <Option value='1'>{ 'FXS 1' }</Option>
                                        <Option value='2'>{ 'FXS 2' }</Option>
                                    </Select>
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
                                    initialValue: settings.cidnumber
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1070" /> }>
                                            <span>{ formatMessage({id: "LANG1069"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('permission', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.permission ? settings.permission : 'internal'
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
                        <Col
                            span={ 12 }
                            className={ extension_type === 'fxs' ? 'hidden' : 'display-block' }
                        >
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
                                    rules: [
                                        {
                                            required: (extension_type !== 'fxs'),
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.secret ? settings.secret : secret,
                                    className: extension_type === 'fxs' ? 'hidden' : 'display-block'
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2488" /> }>
                                            <span>{ formatMessage({id: "LANG2487"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('authid', {
                                    rules: [],
                                    initialValue: settings.authid,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1078" /> }>
                                            <span>{ formatMessage({id: "LANG1077"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('hasvoicemail', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: this.state.hasvoicemail
                                })(
                                    <Checkbox onChange={ this._onChangeHasVoicemail } />
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
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.vmsecret ? settings.vmsecret : vmsecret
                                })(
                                    <Input disabled={ !this.state.hasvoicemail } />
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
                                    initialValue: settings.skip_vmsecret === 'yes'
                                })(
                                    <Checkbox disabled={ !this.state.hasvoicemail } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
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
                                    valuePropName: 'checked',
                                    initialValue: this.state.enable_qualify,
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Checkbox onChange={ this._onChangeQualify } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
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
                                    rules: [
                                        {
                                            // type: 'integer',
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.qualifyfreq ? settings.qualifyfreq + '' : '60',
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
                                })(
                                    <Input disabled={ !this.state.enable_qualify } />
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
                                    valuePropName: 'checked',
                                    initialValue: settings.out_of_service === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG2712"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2848" /> }>
                                            <span>{ formatMessage({id: "LANG2817"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('first_name', {
                                    rules: [],
                                    initialValue: userSettings.first_name
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2849" /> }>
                                            <span>{ formatMessage({id: "LANG2813"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('last_name', {
                                    rules: [],
                                    initialValue: userSettings.last_name
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1082" /> }>
                                            <span>{ formatMessage({id: "LANG1081"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('email', {
                                    rules: [],
                                    initialValue: userSettings.email
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2845" /> }>
                                            <span>{ formatMessage({id: "LANG2810"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('user_password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: userSettings.user_password ? userSettings.user_password : user_password
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
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: userSettings.language ? userSettings.language : 'default'
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
                        <Col
                            span={ 12 }
                            className={ extension_type === 'sip' ? 'display-block' : 'hidden' }
                        >
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
                                    rules: [
                                        {
                                            // type: 'integer',
                                            required: true,
                                            message: formatMessage({id: "LANG2150"})
                                        }
                                    ],
                                    initialValue: settings.max_contacts ? settings.max_contacts + '' : '1',
                                    className: extension_type === 'sip' ? 'display-block' : 'hidden'
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2851" /> }>
                                            <span>{ formatMessage({id: "LANG2815"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('phone_number', {
                                    rules: [],
                                    initialValue: userSettings.phone_number
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(BasicSettings)