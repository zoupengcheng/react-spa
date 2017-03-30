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
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
let uuid = 1

class ScheduleSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
                let res = data.response,
                    calendarName = res.googlecalendar.calendar_name.slice(0, -1)

                if (calendarName !== "anonymous@gmail.com" &&
                    calendarName !== "" &&
                    calendarName.match(/^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/)) {
                    this.setState({
                        bCandler: false
                    })
                }
            }.bind(this)
        })
    }
    _addList = () => {
        uuid++

        const { form } = this.props
        const { formatMessage } = this.props.intl

        const extenLists = form.getFieldValue('extenLists')
        const nextKeys = extenLists.concat(uuid)

        form.setFieldsValue({
            extenLists: nextKeys
        })
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
    _renderEndTime = (starttime, endtime) => {
        if (!starttime) {
            return '15'
        }

        var nShour = parseInt(starttime.slice(11, 13), 10),
            nSmin = parseInt(starttime.slice(14, 16), 10),
            nEhour = parseInt(endtime.slice(11, 13), 10),
            nEmin = parseInt(endtime.slice(14, 16), 10)

        return ((nEhour - nShour) * 60 + nEmin - nSmin).toString()
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, getFieldValue } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        const formItemLayoutEmail = {
            labelCol: { span: 12 },
            wrapperCol: { span: 6 }
        }

        const formItemLayoutEmailIcon = {
            labelCol: { span: 18 },
            wrapperCol: { span: 6 }
        }

        const meetList = this.props.meetList || {}

        let aMembers = meetList.members ? meetList.members : [],
            localeRightSelectArray = [],
            remoteRightSelectArray = [],
            specialArray = []

        _.each(aMembers, function(item, key) {
            let location = item.location,
                extension = item.member_extension,
                bSendEmail = item.send_email,
                membername = item.member_name,
                sState = item.state,
                sComment = item.comment

            if (location === 'local') {
                localeRightSelectArray.push(extension)
            } else if (location === 'remote') {
                remoteRightSelectArray.push(extension)
            } else if (location === 'special') {
                specialArray.push({
                    membername: membername,
                    extension: extension,
                    bSendEmail: bSendEmail === 'yes',
                    email: item.email
                })
            }
        })

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
                                    initialValue: meetList[`member_name${k}`]
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2026"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 3 } style={{ marginRight: 20 }}>
                            <FormItem>
                                { getFieldDecorator(`member_tel${k}`, {
                                    initialValue: meetList[`member_tel$[k]`]
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG3781"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 3 } style={{ marginRight: 20 }}>
                            <FormItem>
                                { getFieldDecorator(`member_mail${k}`, {
                                    initialValue: meetList[`member_mail${k}`]
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2032"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 2 }>
                            <FormItem
                                { ...formItemLayoutEmailIcon }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                            <span>{ formatMessage({id: "LANG3782"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator(`remote_send_email${k}`, {
                                    valuePropName: 'checked',
                                    initialValue: meetList[`remote_send_email${k}`] === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 1 }>
                            <FormItem>
                                <Icon
                                    type="minus-circle-o"
                                    onClick={ () => this._removeList(k) }
                                    className="dynamic-network-button"/>
                            </FormItem>
                        </Col>
                    </Row>
        })

        let conference = this.state.conference

        return (
            <div className="content">
                <div className="ant-form">
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
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }],
                                    initialValue: meetList.confname
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
                                    initialValue: meetList.confno || conference[0] && conference[0].extension
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
                                    initialValue: meetList.con_admin
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
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }],
                                    initialValue: meetList.kickall_time || '10'
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
                                    initialValue: (meetList.starttime ? moment(meetList.starttime, 'YYYY-MM-DD HH:mm:ss') : '')
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
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }],
                                    initialValue: this._renderEndTime(meetList.starttime, meetList.endtime)
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
                                    initialValue: meetList.recurringevent || 'COMMON'
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
                                    valuePropName: 'checked',
                                    initialValue: meetList.open_calendar === 'yes'
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
                                    initialValue: localeRightSelectArray
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
                                    valuePropName: 'checked',
                                    initialValue: meetList.locale_send_email === 'yes'
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
                                    initialValue: remoteRightSelectArray
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
                                    valuePropName: 'checked',
                                    initialValue: meetList.remote_send_email === 'yes'
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
                                    initialValue: meetList.member_name
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2026"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 3 } style={{ marginRight: 20 }}>
                            <FormItem>
                                { getFieldDecorator('member_tel', {
                                    initialValue: meetList.member_tel
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG3781"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 3 } style={{ marginRight: 20 }}>
                            <FormItem>
                                { getFieldDecorator('member_mail', {
                                    initialValue: meetList.member_mail
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2032"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 2 }>
                            <FormItem
                                { ...formItemLayoutEmailIcon }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG3782" /> }>
                                            <span>{ formatMessage({id: "LANG3782"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('remote_send_email', {
                                    valuePropName: 'checked',
                                    initialValue: meetList.remote_send_email === 'yes'
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 1 }>
                            <FormItem>
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
                                    initialValue: meetList.create_remote_room
                                })(
                                    <Input style={{ width: 200 }} placeholder={ formatMessage({id: "LANG2693"}) } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 6 }>
                            <FormItem>
                                { getFieldDecorator('create_remote_pass', {
                                    initialValue: meetList.create_remote_pass
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
                                    initialValue: meetList.description
                                })(
                                    <Input type="textarea" />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(ScheduleSettings)