'use strict'

import {Row, Col, message } from 'antd'
import '../../../css/userInformation'
import VoiceMail from './voicemail'
import AlarmClock from './alarmClock'
import DOD from './dod'
import Transfer from './transfer'
import MissCall from './missCall'
import FollowMe from './followMe'
import ConferenceSchedule from './conferenceSchedule'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"

class UserInformation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            infoList: {}
        }
    }
    componentDidMount() {
        this._getInfo()
    }
    _getInfo = () => {
        $.ajax({
            url: api.apiHost,
            type: 'post',
            data: {
                'action': 'getUserInfo',
                'extension': localStorage.getItem('username')
            },
            async: false,
            success: function(res) {
                let infoList = res.response
                this.setState({
                    infoList: infoList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    componentWillUnmount() {
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG2802"})
        })

        let infoList = this.state.infoList

        return (
            <div className="user-information">
                <div className="app-content-main" id="app-content-main">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={ 6 }>
                            <VoiceMail voicemailData={ infoList.voicemail } />
                        </Col>
                        <Col className="gutter-row" span={ 6 }>
                            <AlarmClock wakeupData={ infoList.wakeup } />
                        </Col>
                        <Col className="gutter-row" span={ 6 }>
                            <DOD dodData = { infoList.dndwhitelist } />
                        </Col>
                        <Col className="gutter-row" span={ 6 }>
                            <Transfer transferData={ infoList.transfer } />
                        </Col>
                        <Col className="gutter-row" span={ 8 }>
                            <MissCall missCallData={ infoList.failed_call } />
                        </Col>
                        <Col className="gutter-row" span={ 8 }>
                            <FollowMe followMeData={ infoList.followme } />
                        </Col>
                        <Col className="gutter-row" span={ 8 }>
                            <ConferenceSchedule />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(UserInformation)
