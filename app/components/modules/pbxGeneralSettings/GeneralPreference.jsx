'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import { Form, Select, Button, Col, Input, Popover, Checkbox, message } from 'antd'

const FormItem = Form.Item

class GeneralPreference extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    _onRecordEnableChange = (e) => {
        this.setState({
            record_prompt: e.target.checked
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        let general = this.props.general,
            generalPrefSettings = general.generalPrefSettings,
            enable_out_limitime = general.enable_out_limitime,
            record_prompt = (general.record_prompt === 'yes'),
            limitime = generalPrefSettings.limitime,
            isDisplay = (limitime !== null ? 'display-block' : 'hidden'),
            warningtime,
            repeattime

        if (limitime !== null) {
            limitime = generalPrefSettings.limitime / 1000
            warningtime = (generalPrefSettings.warningtime ? generalPrefSettings.warningtime / 1000 : '')
            repeattime = (generalPrefSettings.repeattime ? generalPrefSettings.repeattime / 1000 : '')
        }

        return (
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={ formatMessage({id: "LANG1592"})} title={formatMessage({id: "LANG1589"})}>
                                <span>{formatMessage({id: "LANG1589"}) }</span>
                            </Popover>
                        </span>
                    )}
                >
                    { getFieldDecorator('global_outboundcid', { initialValue: generalPrefSettings.global_outboundcid})(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={ formatMessage({id: "LANG1591"}) } title={ formatMessage({id: "LANG1590"}) }>
                                <span>{ formatMessage({id: "LANG1590"}) }</span>
                            </Popover>
                        </span>
                    )}
                >
                    { getFieldDecorator('global_outboundcidname', { initialValue: generalPrefSettings.global_outboundcidname })(
                        <Input />
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={ formatMessage({id: "LANG3026"}) } title={ formatMessage({id: "LANG3025"}) }>
                                <span>{ formatMessage({id: "LANG3025"}) }</span>
                            </Popover>
                        </span>
                    )}
                >
                    { getFieldDecorator('enable_out_limitime')(
                        <Checkbox checked={ enable_out_limitime } onChange={ this.props._onLimitimeEnableChange.bind(this) } />
                    ) }
                </FormItem>
                <div className={ isDisplay }>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover content={ formatMessage({id: "LANG3018"}) } title={ formatMessage({id: "LANG3017"}) }>
                                    <span>{ formatMessage({id: "LANG3017"}) }</span>
                                </Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('limitime', {initialValue: limitime})(
                            <Input />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover content={ formatMessage({id: "LANG3020"}) } title={ formatMessage({id: "LANG3019"}) }>
                                    <span>{ formatMessage({id: "LANG3019"}) }</span>
                                </Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('warningtime', {initialValue: warningtime})(
                            <Input />
                        ) }
                    </FormItem>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Popover content={ formatMessage({id: "LANG3022"}) } title={ formatMessage({id: "LANG3021"}) }>
                                    <span>{ formatMessage({id: "LANG3021"}) }</span>
                                </Popover>
                            </span>
                        )}
                    >
                        { getFieldDecorator('repeattime', {initialValue: repeattime})(
                            <Input />
                        ) }
                    </FormItem>
                </div>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={ formatMessage({id: "LANG2529"}) } title={ formatMessage({id: "LANG2528"}) }>
                                <span>{ formatMessage({id: "LANG2528"}) }</span>
                            </Popover>
                        </span>
                    )}
                >
                    {getFieldDecorator('record_prompt')(
                        <Checkbox checked={ record_prompt } onChange={ this._onRecordEnableChange } />
                    )}
                </FormItem>
            </Form>
        )
    }
}

module.exports = Form.create()(injectIntl(GeneralPreference))