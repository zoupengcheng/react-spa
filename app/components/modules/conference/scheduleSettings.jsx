'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl'
import { Checkbox, Col, Form, Input, message, Row, Select, Tooltip, Modal, DatePicker, Popconfirm, Icon } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class ScheduleSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scheduleSettings: {},
            conference: [],
            transAccountList: [],
            remoteExtList: [],
            bCandler: true
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _emailConfirm = () => {
        browserHistory.push('/system-settings/emailSettings')
    }
    _googleConfirm = () => {
        browserHistory.push('/call-features/conference')
    }
    _transLocale = (res) => {
        var arr = [],
            ele, firstname, lastname, username, email, fullname

        for (var i = 0; i < res.users.length; i++) {
            ele = res.users[i]
            firstname = ele.first_name
            lastname = ele.last_name
            username = ele.user_name
            email = ele.email

            if (firstname && lastname) {
                fullname = '"' + firstname + ' ' + lastname + '"'
            } else if (firstname) {
                fullname = '"' + firstname + '"'
            } else if (lastname) {
                fullname = '"' + lastname + '"'
            } else {
                fullname = ''
            }

            arr.push({
                text: username + ' ' + fullname,
                val: username,
                attr: email ? email : ''
            })
        }

        return arr
    }
    _transRemote = (res) => {
        var arr = [],
            ele, firstname, lastname, accountnumber, email, phonebook, fullname

        for (var i = 0; i < res.phonebooks.length; i++) {
            ele = res.phonebooks[i]
            firstname = ele.firstname
            lastname = ele.lastname
            accountnumber = ele.accountnumber
            email = ele.email
            phonebook = ele.phonebook_dn

            if (firstname && lastname) {
                fullname = '"' + firstname + ' ' + lastname + '"'
            } else if (firstname) {
                fullname = '"' + firstname + '"'
            } else if (lastname) {
                fullname = '"' + lastname + '"'
            } else {
                fullname = ''
            }

            arr.push({
                text: phonebook.split(',')[0].slice(3) + '--' + accountnumber + ' ' + fullname,
                val: accountnumber,
                attr: email ? email : ''
            })
        }

        return arr
    }
    _getInitData = () => {
        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'listConfStatus'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.conference

                if (list && list.length > 0) {
                    this.setState({
                        conference: list
                    })
                }
            }.bind(this)
        })

        let accountList = UCMGUI.isExist.getList("getUserList")
        let transAccountList = this._transLocale(accountList)

        let remoteList = UCMGUI.isExist.getList("getRemoteUser")
        let remoteExtList = this._transRemote(remoteList)

        this.setState({
            transAccountList: transAccountList,
            remoteExtList: remoteExtList
        })

        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'getGoogleAccountCal'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var res = data.response,
                    calendarName = res.googlecalendar.calendar_name.slice(0, -1),
                    oCandler = $('#open_calendar')

                if (calendarName !== "anonymous@gmail.com" && calendarName !== "" && calendarName.match(/^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/)) {
                    this.setState({
                        bCandler: false
                    })
                }
            }.bind(this)
        })
    }
    _addZero = (n) => {
        if (n < 10) {
            n = "0" + n
        }
        return n
    }
    _generateWhiteListID = (existIDs) => {
        let newID = 1

        if (existIDs && existIDs.length) {
            newID = _.find([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(key) {
                    return !_.contains(existIDs, key)
                })
        }

        return newID
    }
    _addList = () => {
        const { form } = this.props
        const { formatMessage } = this.props.intl

        // can use data-binding to get
        const extenLists = form.getFieldValue('extenLists')

        if (extenLists.length <= 8) {
            const newextenLists = extenLists.concat(this._generateWhiteListID(extenLists))

            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                extenLists: newextenLists
            })
        } else {
            message.warning(formatMessage({id: "LANG809"}, {
                    0: '',
                    1: 10
                }))

            return false
        }
    }
    _removeList = (k) => {
        const { form } = this.props
        // can use data-binding to get
        const extenLists = form.getFieldValue('extenLists')

        // can use data-binding to set
        form.setFieldsValue({
            extenLists: extenLists.filter(key => key !== k)
        })
    }
    _handleCancel = () => {
        browserHistory.push('/call-features/conference')
    }
    _handleSubmit = () => {
        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const bookId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let aList = []

                let action = values
                action.members = JSON.stringify(aList)

                if (bookId) {
                    action.action = 'updateMeetme'
                } else {
                    action.action = 'addMeetme'
                    action.zone = '+0800'
                    action.bookid = new Date().getTime()
                }

                action.starttime = action.starttime.format('YYYY-MM-DD HH:mm:ss')

                let sStartTime = action.starttime,
                    nMinute = action.endtime,
                    nEhour = parseInt(sStartTime.slice(11, 13), 10) + Math.floor(nMinute / 60),
                    nEmin = parseInt(sStartTime.slice(14, 16), 10) + nMinute % 60

                if (nEmin >= 60) {
                    nEmin = nEmin - 60
                    nEhour = nEhour + 1
                }

                action['endtime'] = sStartTime.slice(0, 11) + this._addZero(nEhour) + ':' + this._addZero(nEmin) + ':00'

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
        const { getFieldDecorator, getFieldValue } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutEmail = {
            labelCol: { span: 12 },
            wrapperCol: { span: 6 }
        }

        const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3775"}),
                    1: this.props.params.id
                })
                : formatMessage({id: "LANG3776"}))

        const scheduleSettings = this.state.scheduleSettings || {}

        getFieldDecorator('extenLists', { initialValue: [] })

        const extenLists = getFieldValue('extenLists')

        const SpecialExtenFormItems = extenLists.map((k, index) => {
            return <Row key={ k }>
                        <Col span={ 6 } style={{ marginRight: 20 }}>
                            <FormItem
                                { ...formItemLayoutEmail }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4461" /> }>
                                            <span>{ formatMessage({id: "LANG3778"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator(`member_name${k}`, {
                                    initialValue: scheduleSettings[`member_name${k}`]
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2026"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 3 } style={{ marginRight: 20 }}>
                            <FormItem>
                                { getFieldDecorator(`member_tel${k}`, {
                                    initialValue: scheduleSettings[`member_tel$[k]`]
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG3781"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 3 } style={{ marginRight: 20 }}>
                            <FormItem>
                                { getFieldDecorator(`member_mail${k}`, {
                                    initialValue: scheduleSettings[`member_mail${k}`]
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2032"}) } />
                                ) }
                            </FormItem>
                        </Col>
                         <Col span={ 3 }>
                            <FormItem
                                { ...formItemLayoutEmail }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                            <span>{ formatMessage({id: "LANG3782"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator(`remote_send_email${k}`, {
                                    initialValue: scheduleSettings[`remote_send_email${k}`]
                                })(
                                    <Checkbox />
                                ) }
                                <Icon
                                    type="minus-circle-o"
                                    onClick={ () => this._removeList(k) }
                                    className="dynamic-network-button"
                                />
                            </FormItem>
                        </Col>
                    </Row>
        })

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main app-content-conference">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'/>
                <div className="content">
                    <Form>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4455" /> }>
                                            <span>{ formatMessage({id: "LANG3783"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('confname', {
                                        initialValue: scheduleSettings.confname
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4456" /> }>
                                                <span>{ formatMessage({id: "LANG3777"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('confno', {
                                        initialValue: scheduleSettings.confno
                                    })(
                                        <Select>
                                            {
                                                this.state.conference.map(function(value, index) {
                                                    return <Option value={ value.extension } key={ index }>{ value.extension }</Option>
                                                })
                                            }
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG4460" /> }>
                                            <span>{ formatMessage({id: "LANG4309"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('con_admin', {
                                        initialValue: scheduleSettings.con_admin
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4457" /> }>
                                                <span>{ formatMessage({id: "LANG4281"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('kickall_time', {
                                        initialValue: scheduleSettings.kickall_time
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3808" /> }>
                                            <span>{ formatMessage({id: "LANG3807"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('starttime', {
                                        initialValue: scheduleSettings.starttime
                                    })(
                                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2230" /> }>
                                                <span>{ formatMessage({id: "LANG2230"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('endtime', {
                                        initialValue: scheduleSettings.endtime
                                    })(
                                        <Select>
                                            <Option value='15'>15</Option>
                                            <Option value='30'>30</Option>
                                            <Option value='45'>45</Option>
                                            <Option value='60'>60</Option>
                                            <Option value='75'>75</Option>
                                            <Option value='90'>90</Option>
                                            <Option value='105'>105</Option>
                                            <Option value='120'>120</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4459" /> }>
                                                <span>{ formatMessage({id: "LANG3803"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('recurringevent', {
                                        initialValue: scheduleSettings.recurringevent
                                    })(
                                        <Select>
                                            <Option value='COMMON'>{ formatMessage({id: "LANG3806"}) }</Option>
                                            <Option value='DAILY'>{ formatMessage({id: "LANG3804"}) }</Option>
                                            <Option value='WEEKLY'>{ formatMessage({id: "LANG3805"}) }</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3801" /> }>
                                            <span>{ formatMessage({id: "LANG3791"}) }</span>
                                        </Tooltip>
                                    )}
                                >
                                    { getFieldDecorator('open_calendar', {
                                        initialValue: scheduleSettings.open_calendar
                                    })(
                                        <Checkbox disabled={ this.state.bCandler } />
                                    ) }
                                    <Popconfirm
                                        onConfirm={ this._googleConfirm }
                                        okText={ formatMessage({id: "LANG136"}) }
                                        cancelText={ formatMessage({id: "LANG137"}) }
                                        title={ formatMessage({id: "LANG843"}, {0: formatMessage({id: "LANG3513"})}) }
                                    >
                                        <a href="#" style={{ marginLeft: 20 }}>{ formatMessage({id: "LANG3513"}) }</a>
                                    </Popconfirm>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4462" /> }>
                                                <span>{ formatMessage({id: "LANG2479"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('localeRightSelect', {
                                        initialValue: scheduleSettings.localeRightSelect
                                    })(
                                        <Select multiple>
                                            {
                                                this.state.transAccountList.map(function(value, index) {
                                                    return <Option value={ value.val } key={ index }>{ value.text }</Option>
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                                <span>{ formatMessage({id: "LANG3782"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('locale_send_email', {
                                        initialValue: scheduleSettings.locale_send_email
                                    })(
                                        <Checkbox />
                                    ) }
                                    <Popconfirm
                                        onConfirm={ this._emailConfirm }
                                        okText={ formatMessage({id: "LANG136"}) }
                                        cancelText={ formatMessage({id: "LANG137"}) }
                                        title={ formatMessage({id: "LANG843"}, {0: formatMessage({id: "LANG4572"})}) }
                                    >
                                        <a href="#" style={{ marginLeft: 20 }}>{ formatMessage({id: "LANG4572"}) }</a>
                                    </Popconfirm>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG2531" /> }>
                                                <span>{ formatMessage({id: "LANG2480"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('remoteRightSelect', {
                                        initialValue: scheduleSettings.remoteRightSelect
                                    })(
                                        <Select multiple>
                                            {
                                                this.state.remoteExtList.map(function(value, index) {
                                                    return <Option value={ value.val } key={ index }>{ value.text }</Option>
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
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                                <span>{ formatMessage({id: "LANG3782"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('remote_send_email', {
                                        initialValue: scheduleSettings.remote_send_email
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 6 } style={{ marginRight: 20 }}>
                                <FormItem
                                    { ...formItemLayoutEmail }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4461" /> }>
                                                <span>{ formatMessage({id: "LANG3778"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('member_name', {
                                        initialValue: scheduleSettings.member_name
                                    })(
                                        <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2026"}) } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 3 } style={{ marginRight: 20 }}>
                                <FormItem>
                                    { getFieldDecorator('member_tel', {
                                        initialValue: scheduleSettings.member_tel
                                    })(
                                        <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG3781"}) } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 3 } style={{ marginRight: 20 }}>
                                <FormItem>
                                    { getFieldDecorator('member_mail', {
                                        initialValue: scheduleSettings.member_mail
                                    })(
                                        <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2032"}) } />
                                    ) }
                                </FormItem>
                            </Col>
                             <Col span={ 3 }>
                                <FormItem
                                    { ...formItemLayoutEmail }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                                <span>{ formatMessage({id: "LANG3782"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('remote_send_email', {
                                        initialValue: scheduleSettings.remote_send_email
                                    })(
                                        <Checkbox />
                                    ) }
                                    <Icon
                                        type="plus-circle-o"
                                        onClick={ this._addList }
                                        className="dynamic-network-button"
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        { SpecialExtenFormItems }
                        <Row>
                            <Col span={ 6 } style={{ marginRight: 20 }}>
                                <FormItem
                                    { ...formItemLayoutEmail }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4479" /> }>
                                                <span>{ formatMessage({id: "LANG4478"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('create_remote_room', {
                                        initialValue: scheduleSettings.create_remote_room
                                    })(
                                        <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2693"}) } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 6 }>
                                <FormItem>
                                    { getFieldDecorator('create_remote_pass', {
                                        initialValue: scheduleSettings.create_remote_pass
                                    })(
                                        <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2694"}) } />
                                    ) }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={ 12 }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <span>
                                            <Tooltip title={ <FormattedHTMLMessage id="LANG4458" /> }>
                                                <span>{ formatMessage({id: "LANG3799"}) }</span>
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    { getFieldDecorator('description', {
                                        initialValue: scheduleSettings.description
                                    })(
                                        <Input type="textarea" />
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

export default Form.create()(injectIntl(ScheduleSettings))