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

class Cleaner extends Component {
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
            url: "/cgi?action=getCleanerValue",
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, formatMessage)

                let data = {}

                if (bool) {
                    const response = res.response || {}

                     _.each(response, function(num, key) {
                        if (key === 'Phour_clean_cdr' || key === 'Pclean_cdr_interval' || key === 'Pclean_record_threshold' || key === 'Phour_clean_vr' || key === 'Pclean_record_interval') {
                            data[key] = num
                        } else {
                            data[key] = num === "1" ? true : false
                        }
                    })

                    this.setState({
                        data: data
                    })
                }
            }.bind(this)
        })
        // this._readLog()
    }
    _readLog = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        $.ajax({
            type: "GET",
            url: api.imageHost + "/html/userdefined/cleaner_results",
            dataType: "json",
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
            url: "../cgi?action=reloadCleanerLog&cleanerlog=",
            dataType: "json",
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.success(formatMessage({ id: "LANG4831"}))

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
    _onChangeCDR = (e) => {
        let data = this.state.data

        data.Pen_auto_clean_cdr = e.target.checked

        this.setState({
            data: data
        })
    }
     _onChangeFile = (e) => {
        let data = this.state.data

        data.Pen_auto_clean_vr = e.target.checked

        this.setState({
            data: data
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <div className="lite-desc">
                        { formatMessage({id: "LANG1430"}) }
                    </div>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG644"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1432" />}>
                                <span>{formatMessage({id: "LANG1431"})}</span>
                            </Tooltip>
                        }
                    >
                        { getFieldDecorator('Pen_auto_clean_cdr', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: this.state.data.Pen_auto_clean_cdr
                        })(
                            <Checkbox onChange={ this._onChangeCDR } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1434" />}>
                                <span>{formatMessage({id: "LANG1433"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Phour_clean_cdr', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: this.state.data.Phour_clean_cdr
                        })(
                            <Input min={ 0 } max={ 23 } disabled={ !this.state.data.Pen_auto_clean_cdr } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1436" />}>
                                <span>{formatMessage({id: "LANG1435"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Pclean_cdr_interval', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: this.state.data.Pclean_cdr_interval
                        })(
                            <Input min={ 1 } max={ 30 } disabled={ !this.state.data.Pen_auto_clean_cdr } />
                        ) }
                    </FormItem>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG645"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1438" />}>
                                <span>{formatMessage({id: "LANG1437"})}</span>
                            </Tooltip>
                        }
                    >
                        { getFieldDecorator('Pen_auto_clean_vr', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: this.state.data.Pen_auto_clean_vr
                        })(
                            <Checkbox onChange={ this._onChangeFile } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <Tooltip title={<FormattedHTMLMessage id="LANG3487" />}>
                                <span>{formatMessage({id: "LANG3486"})}</span>
                            </Tooltip>
                        )}
                    >
                        <Col span={ 2 }>
                            { getFieldDecorator('Pen_auto_clean_monitor', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Pen_auto_clean_monitor
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_clean_vr } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG4772"}, { 0: formatMessage({id: 'LANG4771'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('Pen_auto_clean_meetme', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Pen_auto_clean_meetme
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_clean_vr } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG4772"}, { 0: formatMessage({id: 'LANG18'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('Pen_auto_clean_queue', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Pen_auto_clean_queue
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_clean_vr } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG4772"}, { 0: formatMessage({id: 'LANG24'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('Pen_auto_clean_vm', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Pen_auto_clean_vm
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_clean_vr } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG4773"}, { 0: formatMessage({id: 'LANG20'}) })}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('Pen_auto_clean_fax', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Pen_auto_clean_fax
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_clean_vr } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG2375"})}</Col>
                        <Col span={ 2 }>
                            { getFieldDecorator('Pen_auto_clean_backup', {
                                rules: [],
                                valuePropName: 'checked',
                                initialValue: this.state.data.Pen_auto_clean_backup
                            })(
                                    <Checkbox disabled={ !this.state.data.Pen_auto_clean_vr } />
                            ) }
                        </Col>
                        <Col span={ 10 }>{formatMessage({id: "LANG4773"}, { 0: formatMessage({id: 'LANG62'}) })}</Col>
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1440" />}>
                                <span>{formatMessage({id: "LANG1439"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Pclean_record_threshold', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: this.state.data.Pclean_record_threshold
                        })(
                            <Input min={ 1 } max={ 99 } disabled={ !this.state.data.Pen_auto_clean_vr } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1442" />}>
                                <span>{formatMessage({id: "LANG1441"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Phour_clean_vr', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: this.state.data.Phour_clean_vr
                        })(
                            <Input min={ 0 } max={ 23 } disabled={ !this.state.data.Pen_auto_clean_vr } />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1444" />}>
                                <span>{formatMessage({id: "LANG1443"})}</span>
                            </Tooltip>
                        )}
                    >
                        { getFieldDecorator('Pclean_record_interval', {
                            rules: [
                                { /* type: 'integer', */ required: true, message: formatMessage({id: "LANG2150"}) }
                            ],
                            initialValue: this.state.data.Pclean_record_interval
                        })(
                            <Input min={ 1 } max={ 30 } disabled={ !this.state.data.Pen_auto_clean_vr } />
                        ) }
                    </FormItem>
                    <Row>
                        <Col span={ 24 }>
                            <div className="section-title">
                                <span>{ formatMessage({id: "LANG646"}) }</span>
                            </div>
                        </Col>
                    </Row>
                    <div>
                        <Button type="primary" onClick={ this._cleanLog }>{formatMessage({id: "LANG743"})}</Button>
                    </div>
                    <div>
                        <p>
                            <span>
                                { this.state.log }
                            </span>
                        </p>
                    </div>
                </Form>
            </div>
        )
    }
}

Cleaner.propTypes = {
}

export default injectIntl(Cleaner)