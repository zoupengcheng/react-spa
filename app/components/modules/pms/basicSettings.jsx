'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"

class basicSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <FormItem
                        ref="div_pms_protocol"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG5246" />}>
                                <span>{formatMessage({id: "LANG5246"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('pms_protocol', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Select>
                                <Option value="">{ formatMessage({id: "LANG2770"}) }</Option>
                                <Option value="hmobile">Hmobile</Option>
                                <Option value="mitel">Mitel</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_wakeup_prompt"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4859" />}>
                                <span>{formatMessage({id: "LANG4859"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('wakeup_prompt', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Select>
                            { /* <span onclick="link_prompt();" class="link" locale="LANG1484"></span> */ }
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_pms_addr"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4940" />}>
                                <span>{formatMessage({id: "LANG4860"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('pms_addr', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="127" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_ucm_port"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4934" />}>
                                <span>{formatMessage({id: "LANG4880"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('ucm_port', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="5" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_username"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG72" />}>
                                <span>{formatMessage({id: "LANG72"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('username', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_password"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG73" />}>
                                <span>{formatMessage({id: "LANG73"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('password', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
    }
}

basicSettings.propTypes = {
}

export default Form.create()(injectIntl(basicSettings))
