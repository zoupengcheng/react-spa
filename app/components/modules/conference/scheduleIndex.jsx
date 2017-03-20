'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import { injectIntl } from 'react-intl'
import Title from '../../../views/title'
import { Form, Input, message, Tabs, Modal } from 'antd'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'

import ScheduleSettings from './scheduleSettings'
import ScheduleConference from './scheduleConference'

const TabPane = Tabs.TabPane

class ScheduleIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            meetList: {}
        }
    }
    componentDidMount() {
        
    }
    componentWillMount() {
        this._getInitData()
    }
    _getInitData = () => {
        const bookid = this.props.params.id

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getMeetme',
                bookid: bookid
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    let meetList = response.bookid

                    this.setState({
                        meetList: meetList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _addZero = (n) => {
        if (n < 10) {
            n = "0" + n
        }
        return n
    }
    _handleCancel = (e) => {
        browserHistory.push('/call-features/conference')
    }
    _handleSendMail = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: {
                action: 'sendMeetmeMail'
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                }

                this._handleCancel()
            }.bind(this)
        })
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

                let aList = [],
                    localeRightSelect = values.localeRightSelect,
                    remoteRightSelect = values.remoteRightSelect

                _.each(localeRightSelect, function(item, key) {
                    aList.push({
                        'member_name': item,
                        'member_extension': item,
                        'email': '',
                        'send_email': 'yes',
                        'location': 'local',
                        'is_admin': 'yes',
                        'state': 'needsAction',
                        'comment': ''
                    })
                })

                _.each(remoteRightSelect, function(item, key) {
                    aList.push({
                        'member_name': item,
                        'member_extension': item,
                        'email': '',
                        'send_email': 'yes',
                        'location': 'local',
                        'is_admin': 'yes',
                        'state': 'needsAction',
                        'comment': ''
                    })
                })

                let action = values

                action.public = (action.public ? 'yes' : 'no')
                action.wait_admin = (action.wait_admin ? 'yes' : 'no')
                action.quiet_mode = (action.quiet_mode ? 'yes' : 'no')
                action.announce_callers = (action.announce_callers ? 'yes' : 'no')
                action.call_menu = (action.call_menu ? 'yes' : 'no')
                action.recording = (action.recording ? 'yes' : 'no')
                action.moh_firstcaller = (action.moh_firstcaller ? 'yes' : 'no')
                action.skipauth = (action.skipauth ? 'yes' : 'no')
                action.user_invite = (action.user_invite ? 'yes' : 'no')
                action.open_calendar = (action.open_calendar ? 'yes' : 'no')

                if (action.moh_firstcaller === 'no') {
                    delete action.musicclass
                }

                action.members = JSON.stringify(aList)

                if (bookId) {
                    action.action = 'updateMeetme'
                    delete action.open_calendar
                    action.bookid = bookId
                } else {
                    action.action = 'addMeetme'
                    action.timezone = '+0800'
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

                delete action.extenLists
                delete action.localeRightSelect
                delete action.remoteRightSelect
                delete action.locale_send_email
                delete action.member_mail
                delete action.member_name
                delete action.member_tel
                delete action.remote_send_email

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
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

         const title = (this.props.params.id
                ? formatMessage({id: "LANG222"}, {
                    0: formatMessage({id: "LANG3775"}),
                    1: this.props.params.id
                })
                : formatMessage({id: "LANG3776"}))

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                    isDisplay='display-block'/>
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={ formatMessage({id: "LANG4275"}) } key="1">
                            <ScheduleSettings form={ form } meetList={ this.state.meetList } />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG599"}) } key="2">
                            <ScheduleConference form={ form } meetList={ this.state.meetList } />
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(ScheduleIndex))
