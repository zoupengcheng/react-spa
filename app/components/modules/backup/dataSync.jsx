'use strict'

import $ from 'jquery'
import _ from 'underscore'
import moment from "moment"
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"
import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl'
import { Col, Form, Input, message, Transfer, Tooltip, Checkbox, Select, DatePicker, TimePicker, Button, Modal, Row } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

class DataSync extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            log: ""
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    componentWillUnmount() {

    }
    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)
    }
    _getInitData = () => {
        const { formatMessage } = this.props.intl
        $.ajax({
            type: "GET",
            url: "/cgi?action=getDataSyncValue",
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, formatMessage)
                let data = {}
                if (bool) {
                    const response = res.response || {}
                     _.each(response, function(num, key) {
                        if (key === 'Pen_auto_backup') {
                            data[key] = num === "1" ? true : false
                        } else if (key === 'Psync_cdr' || key === 'Psync_record' || key === 'Psync_voicemail' || key === 'Psync_vfax') {
                            data[key] = num === "yes" ? true : false
                        } else {
                            data[key] = num
                        }
                    })
                    this.setState({
                        data: data
                    })
                }
            }.bind(this)
        })
        this._readLog()
    }
    _readLog = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        $.ajax({
            type: "GET",
            url: api.imageHost + "/html/userdefined/backup_results?_=" + Math.random().toString(),
            dataType: "text",
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status !== 404) {
                    message.error(formatMessage({ id: "LANG909"}))
                }
            },
            success: function(data) {
                let arr = data.split("\n").reverse()
                this.setState({
                    log: arr
                })
            }.bind(this)
        })
    }
    _doCleanLog = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        $.ajax({
            type: "GET",
            url: "../cgi?action=reloadBackupLog&backuplog=",
            dataType: "json",
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.success(formatMessage({ id: "LANG3903"}))
                    this._readLog()
                }
            }.bind(this)
        })
    }
    _cleanLog = () => {
        const { formatMessage } = this.props.intl
        Modal.confirm({
                title: 'Confirm',
                content: formatMessage({id: "LANG3902"}),
                okText: formatMessage({id: "LANG727"}),
                cancelText: formatMessage({id: "LANG726"}),
                onOk: this._doCleanLog.bind(this)
            })
    }
     _onChangeFile = (e) => {
        let data = this.state.data
        data.Pen_auto_backup = e.target.checked
        this.setState({
            data: data
        })
    }
    _testServer = (e) => {
        const { formatMessage } = this.props.intl
        const { form } = this.props
        let a = form.getFieldValue('Pen_auto_backup') 

        if (a !== true) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG858"})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            let loadingMessage = ''
            let successMessage = ''

            loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG859" })}}></span>
            successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

            message.loading(loadingMessage)

            let test_server = ''
            test_server = form.getFieldValue('Psftp_account') + ',' + form.getFieldValue('Psftp_pass') + ',' + form.getFieldValue('Psftp_address')
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    "action": "reloadTestSftp",
                    "test_server": test_server
                },
                type: 'json',
                async: true,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        message.destroy()
                        message.success(formatMessage({ id: "LANG3213"}))
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }
    }
    _syncAll = (e) => {
        const { formatMessage } = this.props.intl
        const { form } = this.props
        let settings = form.getFieldsValue() 

        if (!settings.Pen_auto_backup || !settings.Psftp_address || !settings.Psftp_account || (!settings.Phour_backup && settings.Phour_backup !== "0")) {
            Modal.warning({
                content: <span dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG3960"})}} ></span>,
                okText: (formatMessage({id: "LANG727"}))
            })
        } else {
            let loadingMessage = ''
            let successMessage = ''

            loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG3961" })}}></span>
            successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

            message.loading(loadingMessage)

            let test_server = ''
            test_server = form.getFieldValue('Psftp_account') + ',' + form.getFieldValue('Psftp_pass') + ',' + form.getFieldValue('Psftp_address')
            $.ajax({
                url: api.apiHost,
                method: 'post',
                data: {
                    "action": "doDataSyncAll",
                    "sync_all": "all"
                },
                type: 'json',
                async: true,
                success: function(res) {
                    const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                    if (bool) {
                        message.destroy()
                        message.success(formatMessage({ id: "LANG3963"}))
                    }
                }.bind(this),
                error: function(e) {
                    message.error(e.statusText)
                }
            })
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        let logList = this.state.log || []
        const spanLogList = logList.map((item, index) => {
            return (
                <row>
                    <Col>
                        <span style={item.indexOf("success") > -1 ? { color: 'green' } : { color: 'red' }}>{item}</span>
                    </Col>
                </row>
                )
        })
        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <div className="lite-desc">
                        { formatMessage({id: "LANG1419"}) }
                    </div>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG4079"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1421" />}>
                                <span>{formatMessage({id: "LANG1420"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('Pen_auto_backup', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: this.state.data.Pen_auto_backup
                        })(
                            <Checkbox onChange={ this._onChangeFile } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG4075" />}>
                                <span>{formatMessage({id: "LANG4075"})}</span>
                            </Tooltip>
                        )}>
                        <Col span={ 2 }>
                            { getFieldDecorator('Psync_cdr', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Psync_cdr
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_backup } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG4053"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('Psync_record', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Psync_record
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_backup } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG2640"})}</Col>
                       <Col span={ 2 }>
                            { getFieldDecorator('Psync_voicemail', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Psync_voicemail
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_backup } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG3601"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('Psync_vfax', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Psync_vfax
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_backup } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG2375"})}</Col>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1423" />}>
                                <span>{formatMessage({id: "LANG1422"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Psftp_account', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: this.state.data.Psftp_account
                        })(
                            <Input maxLength="32" disabled={ !this.state.data.Pen_auto_backup } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1425" />}>
                                <span>{formatMessage({id: "LANG1424"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Psftp_pass', {
                            rules: [],
                            initialValue: this.state.data.Psftp_pass
                        })(
                            <Input maxLength="32" disabled={ !this.state.data.Pen_auto_backup } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1427" />}>
                                <span>{formatMessage({id: "LANG1426"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Psftp_address', {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: this.state.data.Psftp_address
                        })(
                            <Input maxLength="256" disabled={ !this.state.data.Pen_auto_backup } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4536" />}>
                                <span>{formatMessage({id: "LANG4535"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Psftp_directory', {
                            rules: [],
                            initialValue: this.state.data.Psftp_directory
                        })(
                            <Input maxLength="256" disabled={ !this.state.data.Pen_auto_backup } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4078" />}>
                                <span>{formatMessage({id: "LANG4077"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Phour_backup', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: this.state.data.Phour_backup
                        })(
                            <Input min={ 0 } max={ 23 } disabled={ !this.state.data.Pen_auto_backup } />
                        ) }
                    </FormItem>
                    <div className="top-button">
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._testServer }
                        >
                            { formatMessage({id: "LANG761"}) }
                        </Button>
                        <Button
                            icon="plus"
                            type="primary"
                            size='default'
                            onClick={ this._syncAll }
                        >
                            { formatMessage({id: "LANG3958"}) }
                        </Button>
                    </div>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG638"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Button type="primary" onClick={ this._cleanLog }>{formatMessage({id: "LANG743"})}</Button>
                    </div>
                    <div>
                        <p > <span >
                            { spanLogList }
                        </span></p>
                    </div>
                </Form>
            </div>
        )
    }
}

DataSync.propTypes = {
}

export default injectIntl(DataSync)
