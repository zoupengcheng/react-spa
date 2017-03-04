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
import { Checkbox, Col, Form, Input, message, Row, Tooltip, Modal, Button } from 'antd'

const FormItem = Form.Item

class PbxGeneralSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            generalPrefSettings: {},
            extensionPrefSettings: {},
            isDisplayLimitime: 'hidden',
            disableRange: false
        }
    }
    componentDidMount() {
        this._getInitData()
    }
    _getInitData = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getGeneralPrefSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response.general_pref_settings || {}

                this.setState({
                    generalPrefSettings: response,
                    isDisplayLimitime: response.limitime === null ? 'hidden' : 'display-block'
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'getExtenPrefSettings'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const response = res.response.extension_pref_settings || {}

                this.setState({
                    extensionPrefSettings: response,
                    disableRange: response.disable_extension_ranges === 'yes'
                })
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _handleLimitimeChange = (e) => {
        this.setState({
            isDisplayLimitime: e.target.checked ? 'display-block' : 'hidden'
        })
    }
    _handleDisableChange = (e) => {
        const {formatMessage} = this.props.intl,
            self = this

        this.setState({
            disableRange: e.target.checked
        })

        if (e.target.checked) {
            Modal.confirm({
                title: formatMessage({id: "LANG543" }),
                content: formatMessage({id: "LANG864"}),
                okText: formatMessage({id: "LANG727" }),
                cancelText: formatMessage({id: "LANG726" }),
                onOk() {
                    self.props.form.setFieldsValue({
                        disable_extension_ranges: true
                    })
                    self.setState({
                        disableRange: true
                    })
                },
                onCancel() {
                    self.props.form.setFieldsValue({
                        disable_extension_ranges: false
                    })
                    self.setState({
                        disableRange: false
                    })
                }
            })
        }
    }
    _handleCancel = () => {
        browserHistory.push('/pbx-settings/pbxGeneralSettings')
    }
    _handleSubmit = () => {
        let errorMessage = ''
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl
        const extensionId = this.props.params.id

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG826" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG4764" })}}></span>

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)

                message.loading(loadingMessage)

                let actionGeneralPre = {},
                    actionExtensionPre = {}

                actionGeneralPre.action = 'updateGeneralPrefSettings'
                actionExtensionPre.action = 'updateExtenPrefSettings'

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: actionGeneralPre,
                    type: 'json',
                    error: function(e) {
                        message.error(e.statusText)
                    },
                    success: function(data) {
                        var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                        if (bool) {
                            $.ajax({
                                url: api.apiHost,
                                method: "post",
                                data: actionExtensionPre,
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
                    }.bind(this)
                })
            }
        })
    }
    _resetRangesDefault = () => {
        this.props.form.setFieldsValue({
            ue_start: 1000,
            ue_end: 6299,
            pkue_start: 4000,
            pkue_end: 4999,
            zcue_start: 5000,
            zcue_end: 6299,
            mm_start: 6300,
            mm_end: 6399,
            vme_start: 7000,
            vme_end: 7100,
            rge_start: 6400,
            rge_end: 6499,
            qe_start: 6500,
            qe_end: 6599,
            vmg_start: 6600,
            vmg_end: 6699,
            directory_start: 7101,
            directory_end: 7199,
            fax_start: 7200,
            fax_end: 8200
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemLayoutExten = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        }

        let generalPrefSettings = this.state.generalPrefSettings
        let extensionPrefSettings = this.state.extensionPrefSettings
        let limitime, warningtime, repeattime

        if (generalPrefSettings.limitime !== null) {
            limitime = (generalPrefSettings.limitime ? generalPrefSettings.limitime / 1000 : '')
            warningtime = (generalPrefSettings.warningtime ? generalPrefSettings.warningtime / 1000 : '')
            repeattime = (generalPrefSettings.repeattime ? generalPrefSettings.repeattime / 1000 : '')
        }

        const title = formatMessage({id: "LANG3"})

        document.title = formatMessage({id: "LANG584"}, {
                    0: model_info.model_name,
                    1: title
                })

        return (
            <div className="app-content-main">
                <Title
                    headerTitle={ title }
                    onSubmit={ this._handleSubmit }
                    onCancel={ this._handleCancel }
                    isDisplay='display-block'/>
                <div className="content">
                    <Form>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG667"}) }</span>
                                </div>
                            </Col>
                        </Row>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1592" /> }>
                                    <span>{ formatMessage({id: "LANG1589"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('global_outboundcid', {
                                initialValue: generalPrefSettings.global_outboundcid
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1591" /> }>
                                    <span>{ formatMessage({id: "LANG1590"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('global_outboundcidname', {
                                initialValue: generalPrefSettings.global_outboundcidname
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1599" /> }>
                                    <span>{ formatMessage({id: "LANG1598"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('ringtime', {
                                initialValue: generalPrefSettings.ringtime
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3026" /> }>
                                    <span>{ formatMessage({id: "LANG3025"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('enable_out_limitime', {
                                valuePropName: 'checked',
                                initialValue: generalPrefSettings.limitime !== null
                            })(
                                <Checkbox onChange={ this._handleLimitimeChange } />
                            ) }
                        </FormItem>
                        <FormItem className={ this.state.isDisplayLimitime }
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3018" /> }>
                                    <span>{ formatMessage({id: "LANG3017"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('limitime', {
                                initialValue: limitime
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem className={ this.state.isDisplayLimitime }
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3020" /> }>
                                    <span>{ formatMessage({id: "LANG3019"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('warningtime', {
                                initialValue: warningtime
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem className={ this.state.isDisplayLimitime }
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3022" /> }>
                                    <span>{ formatMessage({id: "LANG3021"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('repeattime', {
                                initialValue: repeattime
                            })(
                                <Input />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2529" /> }>
                                    <span>{ formatMessage({id: "LANG2528"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('record_prompt', {
                                valuePropName: 'checked',
                                initialValue: generalPrefSettings.record_prompt === 'yes'
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <Row>
                            <Col span={ 24 }>
                                <div className="section-title">
                                    <span>{ formatMessage({id: "LANG668"}) }</span>
                                </div>
                            </Col>
                        </Row>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2634" /> }>
                                    <span>{ formatMessage({id: "LANG2633"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('weak_password', {
                                valuePropName: 'checked',
                                initialValue: extensionPrefSettings.weak_password === 'yes'
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1588" /> }>
                                    <span>{ formatMessage({id: "LANG1587"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('rand_password', {
                                valuePropName: 'checked',
                                initialValue: extensionPrefSettings.rand_password === 'yes'
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG4151" /> }>
                                    <span>{ formatMessage({id: "LANG4150"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('auto_email_to_user', {
                                valuePropName: 'checked',
                                initialValue: extensionPrefSettings.auto_email_to_user === 'yes'
                            })(
                                <Checkbox />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1586" /> }>
                                    <span>{ formatMessage({id: "LANG1586"}) }</span>
                                </Tooltip>
                            )}
                        >
                            { getFieldDecorator('disable_extension_ranges', {
                                valuePropName: 'checked',
                                initialValue: this.state.disableRange
                            })(
                                <Checkbox onChange={ this._handleDisableChange } />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG248" /> }>
                                    <span>{ formatMessage({id: "LANG248"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('ue_start', {
                                        initialValue: extensionPrefSettings.ue_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('ue_end', {
                                        initialValue: extensionPrefSettings.ue_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2919" /> }>
                                    <span>{ formatMessage({id: "LANG2919"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('pkue_start', {
                                        initialValue: extensionPrefSettings.pkue_start
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('pkue_end', {
                                        initialValue: extensionPrefSettings.pkue_end
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2918" /> }>
                                    <span>{ formatMessage({id: "LANG2918"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('zcue_start', {
                                        initialValue: extensionPrefSettings.zcue_start
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('zcue_end', {
                                        initialValue: extensionPrefSettings.zcue_end
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1585" /> }>
                                    <span>{ formatMessage({id: "LANG1585"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('mm_start', {
                                        initialValue: extensionPrefSettings.mm_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('mm_end', {
                                        initialValue: extensionPrefSettings.mm_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1597" /> }>
                                    <span>{ formatMessage({id: "LANG1597"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('rge_start', {
                                        initialValue: extensionPrefSettings.rge_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('rge_end', {
                                        initialValue: extensionPrefSettings.rge_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1596" /> }>
                                    <span>{ formatMessage({id: "LANG1596"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('qe_start', {
                                        initialValue: extensionPrefSettings.qe_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('qe_end', {
                                        initialValue: extensionPrefSettings.qe_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1569" /> }>
                                    <span>{ formatMessage({id: "LANG1569"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('vmg_start', {
                                        initialValue: extensionPrefSettings.vmg_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('vmg_end', {
                                        initialValue: extensionPrefSettings.vmg_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1593" /> }>
                                    <span>{ formatMessage({id: "LANG1593"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('vme_start', {
                                        initialValue: extensionPrefSettings.vme_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('vme_end', {
                                        initialValue: extensionPrefSettings.vme_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2897" /> }>
                                    <span>{ formatMessage({id: "LANG2897"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('directory_start', {
                                        initialValue: extensionPrefSettings.directory_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('directory_end', {
                                        initialValue: extensionPrefSettings.directory_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            { ...formItemLayoutExten }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2907" /> }>
                                    <span>{ formatMessage({id: "LANG2907"}) }</span>
                                </Tooltip>
                            )}>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('fax_start', {
                                        initialValue: extensionPrefSettings.ue_start
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                            <Col span={ 1 }>
                                <p className="ant-form-split">-</p>
                            </Col>
                            <Col span={ 3 }>
                                <FormItem>
                                    { getFieldDecorator('fax_end', {
                                        initialValue: extensionPrefSettings.ue_end
                                    })(
                                        <Input disabled={ this.state.disableRange } />
                                    ) }
                                </FormItem>
                            </Col>
                        </FormItem>
                        <div>
                            <Button type="primary" size="default" onClick={ this._resetRangesDefault }>
                                { formatMessage({id: "LANG773"}) }
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(injectIntl(PbxGeneralSettings))