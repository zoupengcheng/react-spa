'use strict'

import $ from 'jquery'
import api from "../../api/api"
import _ from 'underscore'
import UCMGUI from "../../api/ucmgui"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions/'
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl'
import { Badge, Button, message, Popconfirm, Popover, Table, Tag, Form, Input, Modal, Checkbox, Tooltip } from 'antd'

const FormItem = Form.Item

class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confoList: [],
            visible: false
        }
    }
    componentDidMount() {
        this._getConfoList()
        this._getMembers()
    }
    _add = () => {
        browserHistory.push('/call-features/conference/add')
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage, 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteConference",
                "conference": record.extension
            },
            type: 'json',
            async: true,
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getConfoList()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _edit = (record) => {
        browserHistory.push('/call-features/conference/edit/' + record.extension)
    }
    _conferenceSettings = () => {
        browserHistory.push('/call-features/conference/conferenceSettings')
    }
    _getConfoList = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listConfStatus'
            },
            type: 'json',
            success: function(res) {
                const response = res.response || {}
                const confoList = response.conference || []

                this.setState({
                    confoList: confoList
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        }) 
    }
    _getMembers = (extension) => {
        let members

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                'action': 'getConfMemberStatusListSortByExten'
            },
            type: 'json',
            async: false,
            success: function(res) {
                members = res.response || []

                this.setState({
                    members: members
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getCurrentTime = () => {
        let currentTime = '1970-01-01 00:00:00'

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'checkInfo'
            },
            type: 'json',
            async: false,
            success: function(data) {
                if (data && data.status === 0) {
                    currentTime = data.response.current_time
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        return currentTime
    }
    _getActivityTime = (text) => {
        if (text === '--') {
            return '--'
        }

        let startTime = text.replace(/-/g, "/"),
            endTime = this._getCurrentTime().replace(/-/g, "/"),
            timeAry = endTime.split(' '),
            milliseconds = Date.parse(timeAry[0] + " " + timeAry[1]) - Date.parse(startTime),
            activity = ''

        if (milliseconds < 0) {
            milliseconds = 0
        }

        var days = UCMGUI.addZero(Math.floor(milliseconds / (24 * 3600 * 1000)))

        var leave1 = milliseconds % (24 * 3600 * 1000),
            hours = UCMGUI.addZero(Math.floor(leave1 / (3600 * 1000)))

        var leave2 = leave1 % (3600 * 1000),
            minutes = UCMGUI.addZero(Math.floor(leave2 / (60 * 1000)))

        var leave3 = leave2 % (60 * 1000),
            seconds = UCMGUI.addZero(Math.round(leave3 / 1000))

        if (days === '00') {
            activity = hours + ":" + minutes + ":" + seconds
        } else {
            activity = days + " " + hours + ":" + minutes + ":" + seconds
        }

        return activity
    }
    _addMcb = (record) => {
        this.setState({
            visible: true,
            type: 'addMcb',
            roomId: record.extension
        })
    }
    _addUser = (record) => {
        this.setState({
            visible: true,
            type: 'addUser',
            roomId: record.extension
        })
    }
    _lockRoom = (record) => {
        let action = {},
            roomLock = true

        if (roomLock) {
            action = {
                'action': 'lockroom',
                'conf-room': record.extension
            }
        } else {
            this.setState({
                roomLock: true
            })

            action = {
                'action': 'unlockroom',
                'conf-room': record.extension
            }
        }

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: action,
            type: 'json',
            async: false,
            success: function(data) {
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleOk = () => {
        const { formatMessage } = this.props.intl

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let action = {},
                    type = this.state.type

                if (type === 'addMcb') {
                    action = {
                        'action': 'inviteroom',
                        'conf-room': this.state.roomId,
                        'remote-room': values.create_remote_room + '@' + values.create_remote_pass
                    }
                } else {
                    action = {
                        'action': 'inviteuser',
                        'conf-room': this.state.roomId,
                        'user': values.create_user_id + '@' + (values.need_confirm ? '1' : '0')
                    }
                }

                $.ajax({
                    url: api.apiHost,
                    method: 'post',
                    data: action,
                    type: 'json',
                    async: false,
                    success: function(data) {
                        message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG922" })}}></span>)
                        this.setState({
                            visible: false
                        })
                    }.bind(this),
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            } 
        })
    }
    _handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    _mutedRequest = (record) => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                'action': 'muteuser',
                'conf-room': record.extension,
                'conf-user': record.channel_name
            },
            type: 'json',
            success: function(data) {
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _unMutedRequest = (record) => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                'action': 'unmuteuser',
                'conf-room': record.extension,
                'conf-user': record.channel_name
            },
            type: 'json',
            success: function(data) {
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _delUser = (record) => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                'action': 'kickuser',
                'conf-room': record.extension,
                'conf-user': record.channel_name
            },
            type: 'json',
            success: function(data) {
                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG819" })}}></span>)
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _renderOptions = (record) => {
        const { formatMessage } = this.props.intl
        let addMcb, addUser, lock

        if (record.attend_count === 0) {
            lock = <span
                        className= "sprite sprite-room-lock-disabled"
                        title={ formatMessage({id: 'LANG787'}) }
                    ></span>
        } else {
            lock = <span
                        className="sprite sprite-room-lock"
                        title={ formatMessage({id: 'LANG788'}) }
                        onClick={ this._lockRoom.bind(this, record) }
                    ></span>
        }

        return <div>
                <span
                    className="sprite sprite-add-mcb"
                    title={ formatMessage({id: "LANG2695"}) }
                    onClick={ this._addMcb.bind(this, record) }
                >
                </span>
                <span
                    className="sprite sprite-add-user"
                    title={ formatMessage({id: "LANG786"}) }
                    onClick={ this._addUser.bind(this, record) }
                >
                </span>
                { lock }
                <span
                    className="sprite sprite-edit"
                    title={ formatMessage({id: "LANG738"}) }
                    onClick={ this._edit.bind(this, record) }
                >
                </span>
                <Popconfirm
                    title={ formatMessage({id: "LANG841"}) }
                    okText={ formatMessage({id: "LANG727"}) }
                    cancelText={ formatMessage({id: "LANG726"}) }
                    onConfirm={ this._delete.bind(this, record) }
                >
                    <span className="sprite sprite-del" title={ formatMessage({id: "LANG739"}) }></span>
                </Popconfirm>
            </div>
    }
    _renderExapndOptions = (record) => {
        const { formatMessage } = this.props.intl

        let mute

        if (record.is_muted === 1) {
            mute = <span
                    className="sprite sprite-unmute"
                    title={ formatMessage({id: "LANG790"}) }
                    onClick = { this._unMutedRequest.bind(this, record) }
                ></span>
        } else {
            mute = <span
                    className="sprite sprite-mute"
                    title={ formatMessage({id: "LANG791"}) }
                    onClick = { this._mutedRequest.bind(this, record) }
                ></span>
        }

        return (
            <div>
                <Popconfirm
                    title={ formatMessage({id: "LANG921"}) + ' ' + record.caller_name + '( ' + record.caller_id + ' ) ?' }
                    okText={ formatMessage({id: "LANG727"}) }
                    cancelText={ formatMessage({id: "LANG726"}) }
                    onConfirm={ this._delUser.bind(this, record) }
                >
                    <span
                        className="sprite sprite-userkick"
                        title={ formatMessage({id: "LANG792"}) }
                    ></span>
                </Popconfirm>
                { mute }
            </div>
        )
    }
    render() {
        const { formatMessage } = this.props.intl
        const columns = [{
                key: 'extension',
                dataIndex: 'extension',
                title: formatMessage({id: "LANG1045"})
            }, {
                key: 'attend_count',
                dataIndex: 'attend_count',
                title: formatMessage({id: "LANG1046"})
            }, {
                key: 'admin_count',
                dataIndex: 'admin_count',
                title: formatMessage({id: "LANG1047"})
            }, {
                key: 'start_time',
                dataIndex: 'start_time',
                title: formatMessage({id: "LANG1048"})
            }, {
                key: 'time',
                dataIndex: 'start_time',
                title: formatMessage({id: "LANG1050"}),
                render: (text, record, index) => {
                    return this._getActivityTime(text)
                }
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    return this._renderOptions(record)
                }
            }]

        const expandedRowRender = (e) => {
            const columns = [
                { 
                    title: formatMessage({id: "LANG82"}),
                    dataIndex: 'user_no',
                    key: 'user_no'
                }, { 
                    title: formatMessage({id: "LANG78"}),
                    dataIndex: 'caller_id',
                    key: 'caller_id'
                }, {
                    title: formatMessage({id: "LANG79"}),
                    dataIndex: 'caller_name',
                    key: 'caller_name'
                }, {
                    title: formatMessage({id: "LANG80"}),
                    dataIndex: 'channel_name',
                    key: 'channel_name'
                }, {
                    title: formatMessage({id: "LANG1050"}),
                    dataIndex: 'join_time',
                    key: 'join_time',
                    render: (text, record, index) => {
                        return this._getActivityTime(text)
                    }
                }, {
                    key: 'options',
                    dataIndex: 'options',
                    title: formatMessage({id: "LANG74"}),
                    render: (text, record, index) => {
                        return this._renderExapndOptions(record)
                    }
                }
            ] 

            return (
                <Table
                    columns={ columns }
                    dataSource={ this.state.members[e.extension] }
                    defaultExpandAllRows = { true }
                    pagination={ false } />
            )
        }

        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        }

        return (
            <div className="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size="default"
                            onClick={ this._add }
                        >
                            { formatMessage({id: "LANG597"}) }
                        </Button>
                        <Button
                            icon="setting"
                            type="primary"
                            size="default"
                            onClick={ this._conferenceSettings }
                        >
                            { formatMessage({id: "LANG5097"}) }
                        </Button>
                    </div>
                    <Table
                        rowKey="extension"
                        columns={ columns }
                        pagination={ false }
                        dataSource={ this.state.confoList }
                        expandedRowRender = { expandedRowRender }
                        defaultExpandAllRows = { true }
                        showHeader={ !!this.state.confoList.length }
                    >
                    </Table>
                    <Modal 
                        title={ formatMessage({id: "LANG1051"}) }
                        visible={this.state.visible}
                        onOk={this._handleOk} 
                        onCancel={this._handleCancel}
                        okText={formatMessage({id: "LANG769"})}
                        cancelText={formatMessage({id: "LANG726"})}>
                        <Form>
                            <div className={ this.state.type === "addMcb" ? "display-block" : "hidden" }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2693" /> }>
                                            <span>{formatMessage({id: "LANG2693"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('create_remote_room')(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2694" /> }>
                                            <span>{formatMessage({id: "LANG2694"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('create_remote_pass')(
                                        <Input />
                                    )}
                                </FormItem>
                            </div>
                            <div className={ this.state.type === "addUser" ? "display-block" : "hidden" }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG1042" /> }>
                                            <span>{formatMessage({id: "LANG1042"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('create_user_id')(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2352" /> }>
                                            <span>{formatMessage({id: "LANG2351"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('need_confirm')(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    conferenceStatus: state.conferenceStatus
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(injectIntl(Room)))