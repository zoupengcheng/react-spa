'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Input, message, Tabs } from 'antd'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import RTP from './rtp'
import Payload from './payload'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

class RTPSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeKey: "1"
        }
    }
    componentDidMount() {
    }
    _handleCancel = () => {
        browserHistory.push('/pbx-settings/rtpSettings')
    }
    _handleSubmit = () => {
        // e.preventDefault()

        const { formatMessage } = this.props.intl
        const successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(formatMessage({ id: "LANG826" }), 0)

                let action_rtp = {}

                action_rtp.action = 'updateRTPSettings'
                action_rtp.strictrtp = (values.strictrtp ? 'yes' : 'no')
                action_rtp.rtpchecksums = (values.rtpchecksums ? 'yes' : 'no')
                action_rtp.icesupport = (values.icesupport ? 'yes' : 'no')

                action_rtp.rtpstart = values.rtpstart
                action_rtp.rtpend = values.rtpend
                action_rtp.stunaddr = values.stunaddr
                action_rtp.bfcpstart = values.bfcpstart
                action_rtp.bfcpend = values.bfcpend
                action_rtp.bfcp_tcp_start = values.bfcp_tcp_start
                action_rtp.bfcp_tcp_end = values.bfcp_tcp_end
                action_rtp.turnaddr = values.turnaddr
                action_rtp.turnusername = values.turnusername
                action_rtp.turnpassword = values.turnpassword

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action_rtp,
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
                    }.bind(this)
                })

                if (values.ast_format_g726_aal2 !== undefined) {
                    let action_payload = {}
                    action_payload.action = 'updatePayloadSettings'
                    action_payload.ast_format_g726_aal2 = values.ast_format_g726_aal2
                    action_payload.ast_rtp_dtmf = values.ast_rtp_dtmf
                    action_payload.option_g726_compatible_g721 = values.option_g726_compatible_g721 ? 'yes' : 'no'
                    action_payload.ast_format_ilbc = values.ast_format_ilbc
                    action_payload.ast_format_opus = values.ast_format_opus
                    action_payload.ast_format_h264 = values.ast_format_h264
                    action_payload.ast_format_vp8 = values.ast_format_vp8
                    action_payload.ast_format_main_video_fec = values.ast_format_main_video_fec
                    action_payload.ast_format_slides_video_fec = values.ast_format_main_video_fec
                    action_payload.ast_format_audio_fec = values.ast_format_main_video_fec
                    action_payload.ast_format_fecc = values.ast_format_fecc
                    action_payload.ast_format_h263_plus = values.h263p_1 + ',' + values.h263p_2
                    action_payload.ast_format_g726 = values.ast_format_g726
                    $.ajax({
                        url: api.apiHost,
                        method: "post",
                        data: action_payload,
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
                        }.bind(this)
                    })
                }
            }
        })
    }
    _onChangeTabs = (e) => {
        this.setState({
            activeKey: e
        })
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const title = formatMessage({id: "LANG676"})

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main app-content-extension">
                <Title
                    headerTitle={ title }
                    onCancel={ this._handleCancel }
                    onSubmit={ this._handleSubmit.bind(this) }
                    isDisplay='display-block'
                />
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey={ this.state.activeKey } onChange={ this._onChangeTabs }>
                        <TabPane tab={ formatMessage({id: "LANG676"}) } key="1">
                            <RTP
                                form={ form }
                            />
                        </TabPane>
                        <TabPane tab={ formatMessage({id: "LANG2899"}) } key="2">
                            <Payload
                                form={ form }
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(RTPSettings))