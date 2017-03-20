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
import { Checkbox, Col, Form, Input, message, Row, Select, Tooltip, Modal } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class ScheduleConference extends Component {
    constructor(props) {
        super(props)
        this.state = {
            publicEnable: true,
            waitAdminEnable: false,
            quiteModeEnable: false,
            announceCallers: false,
            userInviteEnable: false,
            musicclassHidden: 'hidden',
            mohNameList: [],
            conferenceRange: [],
            existNumberList: []
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _getInitData = () => {
        $.ajax({
            url: api.apiHost,
            type: "post",
            data: {
                'action': 'getMohNameList'
            },
            async: false,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var list = data.response.moh_name

                if (list && list.length > 0) {
                    this.setState({
                        mohNameList: list
                    })
                }
            }.bind(this)
        })

        this.setState({
            conferenceRange: UCMGUI.isExist.getRange('conference'),
            existNumberList: UCMGUI.isExist.getList("getNumberList")
        })
    }
    _handlePublicChange = (e) => {
        const {formatMessage} = this.props.intl,
            self = this

        this.setState({
            publicEnable: e.target.checked
        })

        if (this.state.userInviteEnable && e.target.checked) {
            Modal.confirm({
                title: formatMessage({id: "LANG543" }),
                content: formatMessage({id: "LANG2433"}, {
                        0: formatMessage({id: "LANG1027"}),
                        1: formatMessage({id: "LANG2431"})
                    }),
                okText: formatMessage({id: "LANG727" }),
                cancelText: formatMessage({id: "LANG726" }),
                onOk() {
                    self.props.form.setFieldsValue({
                        public: true
                    })

                    self.setState({
                        publicEnable: true
                    })
                },
                onCancel() {
                    self.props.form.setFieldsValue({
                        public: false
                    })

                    self.setState({
                        publicEnable: false
                    })
                }
            })
        }
    }
    _handleWaitAdminChange = (e) => {
        this.setState({
            waitAdminEnable: e.target.checked
        })
    }
    _handleQuiteModeChange = (e) => {
        this.setState({
            quiteModeEnable: e.target.checked
        })
    }
    _handleAnnounceChange = (e) => {
        this.setState({
            announceCallers: e.target.checked
        })
    }
    _handleMusicclassChange = (e) => {
        if (e.target.checked) {
            this.setState({
                musicclassHidden: 'block'
            })
        } else {
            this.setState({
                musicclassHidden: 'hidden'
            })
        }
    }
    _handleUserInviteChange = (e) => {
        const {formatMessage} = this.props.intl,
            self = this

        this.setState({
            userInviteEnable: e.target.checked
        })

        if (this.state.publicEnable && e.target.checked) {
            Modal.confirm({
                title: formatMessage({id: "LANG543" }),
                content: formatMessage({id: "LANG2433"}, {
                        0: formatMessage({id: "LANG1027"}),
                        1: formatMessage({id: "LANG2431"})
                    }),
                okText: formatMessage({id: "LANG727" }),
                cancelText: formatMessage({id: "LANG726" }),
                onOk() {
                    self.props.form.setFieldsValue({
                        user_invite: true
                    })

                    self.setState({
                        userInviteEnable: true
                    })
                },
                onCancel() {
                    self.props.form.setFieldsValue({
                        user_invite: false
                    })

                    self.setState({
                        userInviteEnable: false
                    })
                }
            })
        }
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        const meetList = this.props.meetList || {}

        return (
            <div className="content">
                <div className="ant-form">
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG2432" /> }>
                                        <span>{ formatMessage({id: "LANG2431"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('public', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.publicEnable
                                })(
                                    <Checkbox disabled={ this.state.waitAdminEnable } onChange={ this._handlePublicChange } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1037" /> }>
                                            <span>{ formatMessage({id: "LANG1041"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('wait_admin', {
                                    initialValue: meetList.wait_admin
                                })(
                                    <Checkbox disabled={ this.state.publicEnable } onChange={ this._handleWaitAdminChange } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1033" /> }>
                                        <span>{ formatMessage({id: "LANG1032"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('pincode', {
                                    initialValue: meetList.pincode
                                })(
                                    <Input disabled={ this.state.publicEnable } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1021" /> }>
                                            <span>{ formatMessage({id: "LANG1020"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('admin_pincode', {
                                    initialValue: meetList.admin_pincode
                                })(
                                    <Input disabled={ this.state.publicEnable } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1037" /> }>
                                        <span>{ formatMessage({id: "LANG1036"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('quiet_mode', {
                                    initialValue: meetList.quiet_mode
                                })(
                                    <Checkbox disabled={ this.state.announceCallers } onChange={ this._handleQuiteModeChange } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1023" /> }>
                                            <span>{ formatMessage({id: "LANG1022"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('announce_callers', {
                                    initialValue: meetList.announce_callers
                                })(
                                    <Checkbox disabled={ this.state.quiteModeEnable } onChange={ this._handleAnnounceChange } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1026" /> }>
                                        <span>{ formatMessage({id: "LANG1025"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('call_menu', {
                                    initialValue: meetList.call_menu
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1039" /> }>
                                            <span>{ formatMessage({id: "LANG1038"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('recording', {
                                    initialValue: meetList.recording
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1035" /> }>
                                        <span>{ formatMessage({id: "LANG1034"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('moh_firstcaller', {
                                    initialValue: meetList.moh_firstcaller
                                })(
                                    <Checkbox onChange={ this._handleMusicclassChange } />
                                ) }
                            </FormItem>
                        </Col>
                        <Col span={ 12 } className={ this.state.musicclassHidden }>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <span>
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1031" /> }>
                                            <span>{ formatMessage({id: "LANG1031"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('musicclass', {
                                    initialValue: meetList.musicclass
                                })(
                                    <Select>
                                        {
                                            this.state.mohNameList.map(function(value, index) {
                                                return <Option value={ value } key={ index }>{ value }</Option>
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
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1044" /> }>
                                        <span>{ formatMessage({id: "LANG1043"}) }</span>
                                    </Tooltip>
                                )}
                            >
                                { getFieldDecorator('skipauth', {
                                    initialValue: meetList.skipauth
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
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1028" /> }>
                                            <span>{ formatMessage({id: "LANG1027"}) }</span>
                                        </Tooltip>
                                    </span>
                                )}
                            >
                                { getFieldDecorator('user_invite', {
                                    valuePropName: 'checked',
                                    initialValue: this.state.userInviteEnable
                                })(
                                    <Checkbox onChange={ this._handleUserInviteChange } />
                                ) }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(ScheduleConference)