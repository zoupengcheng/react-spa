'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"

const Option = Select.Option

const CustomizedForm = injectIntl(Form.create({
    onFieldsChange(props, changedFields) {
        // this.props.dataSource["form"] = this.props.form
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
            username: {
            }
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const basicSettings = props.dataSource
    const fileList = props.fileList
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <FormItem
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG5246" />}>
                                <span>{formatMessage({id: "LANG5246"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('pms_protocol', {
                            rules: [],
                            initialValue: basicSettings.pms_protocol
                        })(
                            <Select>
                                <Option value="disable">{ formatMessage({id: "LANG2770"}) }</Option>
                                <Option value="hmobile">Hmobile</Option>
                                <Option value="mitel">Mitel</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        className={ basicSettings.pms_protocol === "disable" || basicSettings.pms_protocol.value === "disable" ? "hidden" : "display-block" }
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4859" />}>
                                <span>{formatMessage({id: "LANG4859"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('wakeup_prompt', {
                            rules: [],
                            initialValue: basicSettings.wakeup_prompt
                        })(
                            <Select>
                                {
                                    fileList.map(function(item) {
                                        return <Option
                                                key={ item.text }
                                                value={ item.val }>
                                                { item.text }
                                            </Option>
                                        }
                                    ) 
                                }
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        className={ basicSettings.pms_protocol === "hmobile" || basicSettings.pms_protocol.value === "hmobile" ? "display-block" : "hidden" }
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4940" />}>
                                <span>{formatMessage({id: "LANG4860"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('pms_addr', {
                            rules: [{
                                required: true,
                                host: ['IP or URL'],
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: basicSettings.pms_addr
                        })(
                            <Input maxLength="127" />
                        ) }
                    </FormItem>
                    <FormItem
                        className={ basicSettings.pms_protocol === "disable" || basicSettings.pms_protocol.value === "disable" ? "hidden" : "display-block" }
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4934" />}>
                                <span>{formatMessage({id: "LANG4880"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('ucm_port', {
                            rules: [{
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: basicSettings.ucm_port
                        })(
                            <InputNumber min={1} max={65535} maxLength="6" />
                        ) }
                    </FormItem>
                    <FormItem
                        className={ basicSettings.pms_protocol === "hmobile" || basicSettings.pms_protocol.value === "hmobile" ? "display-block" : "hidden" }
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG72" />}>
                                <span>{formatMessage({id: "LANG72"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('username', {
                            rules: [{
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: basicSettings.username
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        className={ basicSettings.pms_protocol === "hmobile" || basicSettings.pms_protocol.value === "hmobile" ? "display-block" : "hidden" }
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG73" />}>
                                <span>{formatMessage({id: "LANG73"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('password', {
                            rules: [{
                                required: true, 
                                message: formatMessage({id: "LANG2150"})
                            }],
                            initialValue: basicSettings.password
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                </Form>
            </div>
        )
}))

class Basic extends Component {
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
        const {formatMessage} = this.props.intl
        let basicSettings = this.props.dataSource
        let fileList = this.props.fileList
 
        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={basicSettings} fileList={fileList} />
            </div>
        )
    }
}

Basic.propTypes = {
}

export default injectIntl(Basic)
