'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Tabs } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'
import Validator from "../../api/validator"

class Misc extends Component {
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
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                
            }
        })
        _.extend(this.props.dataSource, changedFields)
    }
    render() {
        const {formatMessage} = this.props.intl
        let IAXRegSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange} dataSource={IAXRegSettings} />
            </div>
        )
    }
}

Misc.propTypes = {
}

const CustomizedForm = injectIntl(Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
        }
    }
})((props) => {
    const { getFieldDecorator } = props.form
    const { formatMessage } = props.intl
    const IAXRegSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }
    
    return (
        <Form>
            <div className="section-title">
                <span>{ formatMessage({id: "LANG681"}) }</span>
            </div>
            <div className="section-body">
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ <FormattedHTMLMessage id="LANG1662" /> }>
                                <span>{ formatMessage({id: "LANG1661"}) }</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('minregexpire', {
                        rules: [{ 
                            type: "integer",
                            message: formatMessage({id: "LANG2150"}) 
                        }],
                        initialValue: IAXRegSettings.minregexpire
                    })(
                        <InputNumber min={0} max={65535} maxLength="6" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ formatMessage({id: "LANG1664"}) }>
                                {formatMessage({id: "LANG1663"})}
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('maxregexpire', {
                        rules: [{ 
                            type: "integer",
                            message: formatMessage({id: "LANG2150"}) 
                        }],
                        initialValue: IAXRegSettings.maxregexpire
                    })(
                        <InputNumber min={0} max={65535} maxLength="6" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={
                        <Tooltip title={ formatMessage({id: "LANG1666"}) }>
                            {formatMessage({id: "LANG1665"})}
                        </Tooltip>
                    }>
                    { getFieldDecorator('iaxthreadcount', {
                        rules: [{ 
                            type: "integer",
                            message: formatMessage({id: "LANG2150"}) 
                        }],
                        initialValue: IAXRegSettings.iaxthreadcount
                    })(
                        <InputNumber min={0} max={65535} maxLength="6" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={
                        <Tooltip title={ formatMessage({id: "LANG1668"}) }>
                            {formatMessage({id: "LANG1667"})}
                        </Tooltip>
                    }>
                    { getFieldDecorator('iaxmaxthreadcount', {
                        rules: [{ 
                            type: "integer",
                            message: formatMessage({id: "LANG2150"}) 
                        }],
                        initialValue: IAXRegSettings.iaxmaxthreadcount
                    })(
                        <InputNumber min={0} max={65535} maxLength="6" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={
                        <Tooltip title={ formatMessage({id: "LANG1670"}) }>
                            {formatMessage({id: "LANG1669"})}
                        </Tooltip>
                    }>
                    { getFieldDecorator('autokill', {
                        rules: [],
                        initialValue: IAXRegSettings.autokill
                    })(
                        <Input maxLength="6" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ <FormattedHTMLMessage id="LANG1672" /> }>
                                <span>{ formatMessage({id: "LANG1671"}) }</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('authdebug', {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: IAXRegSettings.authdebug === "yes" ? true : false
                    })(
                        <Checkbox />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ <FormattedHTMLMessage id="LANG1674" /> }>
                                <span>{ formatMessage({id: "LANG1673"}) }</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('codecpriority', {
                        rules: [],
                        initialValue: IAXRegSettings.codecpriority
                    })(
                        <Select style={{ width: 200 }}>
                            <Option value='caller'>{formatMessage({id: "LANG75"})}</Option>
                            <Option value='disabled'>{formatMessage({id: "LANG76"})}</Option>
                            <Option value='reqonly'>{formatMessage({id: "LANG77"})}</Option>
                        </Select>
                    ) }
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ <FormattedHTMLMessage id="LANG1676" /> }>
                                <span>{ formatMessage({id: "LANG1675"}) }</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('tos', {
                        rules: [],
                        initialValue: IAXRegSettings.tos
                    })(
                        <Select style={{ width: 200 }}>
                            <option value='ef'>EF</option>
                            <option value='cs0'>CS0</option>
                            <option value='cs1'>CS1</option>
                            <option value='cs2'>CS2</option>
                            <option value='cs3'>CS3</option>
                            <option value='cs4'>CS4</option>
                            <option value='cs5'>CS5</option>
                            <option value='cs6'>CS6</option>
                            <option value='cs7'>CS7</option>
                            <option value='af11'>AF11</option>
                            <option value='af12'>AF12</option>
                            <option value='af13'>AF13</option>
                            <option value='af21'>AF21</option>
                            <option value='af22'>AF22</option>
                            <option value='af23'>AF23</option>
                            <option value='af31'>AF31</option>
                            <option value='af32'>AF32</option>
                            <option value='af33'>AF33</option>
                            <option value='af41'>AF41</option>
                            <option value='af42'>AF42</option>
                            <option value='af43'>AF43</option>
                        </Select>
                    ) }
                </FormItem>
            </div>
            <div className="section-title">
                <span>{ formatMessage({id: "LANG682"}) }</span>
            </div>
            <div className="section-body">
                <FormItem
                    { ...formItemLayout }
                    label={
                        <Tooltip title={ formatMessage({id: "LANG1678"}) }>
                            {formatMessage({id: "LANG1677"})}
                        </Tooltip>
                    }>
                    { getFieldDecorator('trunkfreq', {
                        rules: [{ 
                            type: "integer",
                            message: formatMessage({id: "LANG2150"}) 
                        }],
                        initialValue: IAXRegSettings.trunkfreq
                    })(
                        <InputNumber min={0} max={65535} maxLength="6" />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Tooltip title={ <FormattedHTMLMessage id="LANG1680" /> }>
                                <span>{ formatMessage({id: "LANG1679"}) }</span>
                            </Tooltip>
                        </span>
                    )}>
                    { getFieldDecorator('trunktimestamps', {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: IAXRegSettings.trunktimestamps === "yes" ? true : false
                    })(
                        <Checkbox />
                    )}
                </FormItem>
            </div>
        </Form>
    )
}))

export default Form.create()(injectIntl(Misc))
