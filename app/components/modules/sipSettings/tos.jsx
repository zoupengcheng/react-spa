'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'

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
    const sipTosSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    return (
        <Form>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1817" /> }>
                                    <span>{ formatMessage({id: "LANG1818"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('tos_sip', {
                            rules: [],
                            initialValue: sipTosSettings.tos_sip
                        })(
                            <Select style={{ width: 200 }}>
                                <Option value='none'>{formatMessage({id: "LANG133"})}</Option>
                                <Option value='ef'>EF</Option>
                                <Option value='CS0'>CS0</Option>
                                <Option value='CS1'>CS1</Option>
                                <Option value='CS2'>CS2</Option>
                                <Option value='CS3'>CS3</Option>
                                <Option value='CS4'>CS4</Option>
                                <Option value='CS5'>CS5</Option>
                                <Option value='CS6'>CS6</Option>
                                <Option value='CS7'>CS7</Option>
                                <Option value='AF11'>AF11</Option>
                                <Option value='AF12'>AF12</Option>
                                <Option value='AF13'>AF13</Option>
                                <Option value='AF21'>AF21</Option>
                                <Option value='AF22'>AF22</Option>
                                <Option value='AF23'>AF23</Option>
                                <Option value='AF31'>AF31</Option>
                                <Option value='AF32'>AF32</Option>
                                <Option value='AF33'>AF33</Option>
                                <Option value='AF41'>AF41</Option>
                                <Option value='AF42'>AF42</Option>
                                <Option value='AF43'>AF43</Option>
                            </Select>
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1813" /> }>
                                    <span>{ formatMessage({id: "LANG1814"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('tos_audio', {
                            rules: [],
                            initialValue: sipTosSettings.tos_audio
                        })(
                            <Select style={{ width: 200 }}>
                                <Option value='none'>{formatMessage({id: "LANG133"})}</Option>
                                <Option value='ef'>EF</Option>
                                <Option value='CS0'>CS0</Option>
                                <Option value='CS1'>CS1</Option>
                                <Option value='CS2'>CS2</Option>
                                <Option value='CS3'>CS3</Option>
                                <Option value='CS4'>CS4</Option>
                                <Option value='CS5'>CS5</Option>
                                <Option value='CS6'>CS6</Option>
                                <Option value='CS7'>CS7</Option>
                                <Option value='AF11'>AF11</Option>
                                <Option value='AF12'>AF12</Option>
                                <Option value='AF13'>AF13</Option>
                                <Option value='AF21'>AF21</Option>
                                <Option value='AF22'>AF22</Option>
                                <Option value='AF23'>AF23</Option>
                                <Option value='AF31'>AF31</Option>
                                <Option value='AF32'>AF32</Option>
                                <Option value='AF33'>AF33</Option>
                                <Option value='AF41'>AF41</Option>
                                <Option value='AF42'>AF42</Option>
                                <Option value='AF43'>AF43</Option>
                            </Select>
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1815" /> }>
                                    <span>{ formatMessage({id: "LANG1816"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('tos_video', {
                            rules: [],
                            initialValue: sipTosSettings.tos_video
                        })(
                            <Select style={{ width: 200 }}>
                                <Option value='none'>{formatMessage({id: "LANG133"})}</Option>
                                <Option value='ef'>EF</Option>
                                <Option value='CS0'>CS0</Option>
                                <Option value='CS1'>CS1</Option>
                                <Option value='CS2'>CS2</Option>
                                <Option value='CS3'>CS3</Option>
                                <Option value='CS4'>CS4</Option>
                                <Option value='CS5'>CS5</Option>
                                <Option value='CS6'>CS6</Option>
                                <Option value='CS7'>CS7</Option>
                                <Option value='AF11'>AF11</Option>
                                <Option value='AF12'>AF12</Option>
                                <Option value='AF13'>AF13</Option>
                                <Option value='AF21'>AF21</Option>
                                <Option value='AF22'>AF22</Option>
                                <Option value='AF23'>AF23</Option>
                                <Option value='AF31'>AF31</Option>
                                <Option value='AF32'>AF32</Option>
                                <Option value='AF33'>AF33</Option>
                                <Option value='AF41'>AF41</Option>
                                <Option value='AF42'>AF42</Option>
                                <Option value='AF43'>AF43</Option>
                            </Select>
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1784" /> }>
                                    <span>{ formatMessage({id: "LANG1783"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('defaultexpiry', {
                            rules: [],
                            initialValue: sipTosSettings.defaultexpiry
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1792" /> }>
                                    <span>{ formatMessage({id: "LANG1791"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('maxexpiry', {
                            rules: [],
                            initialValue: sipTosSettings.maxexpiry
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1794" /> }>
                                    <span>{ formatMessage({id: "LANG1793"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('minexpiry', {
                            rules: [],
                            initialValue: sipTosSettings.minexpiry
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LA8G1788" /> }>
                                    <span>{ formatMessage({id: "LANG1787"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('relaxdtmf', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: sipTosSettings.relaxdtmf
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG11098" /> }>
                                    <span>{ formatMessage({id: "LANG1097"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('dtmfmode', {
                            rules: [],
                            initialValue: sipTosSettings.dtmfmode
                        })(
                            <Select style={{ width: 200 }}>
                                <Option value='rfc2833'>RFC2833</Option>
                                <Option value='info'>{formatMessage({id: "LANG1099"})}</Option>
                                <Option value='inband'>{formatMessage({id: "LANG1100"})}</Option>
                                <Option value='auto'>{formatMessage({id: "LANG138"})}</Option>
                            </Select>
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1804" /> }>
                                    <span>{ formatMessage({id: "LANG1803"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('rtptimeout', {
                            rules: [],
                            initialValue: sipTosSettings.rtptimeout
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG1802" /> }>
                                    <span>{ formatMessage({id: "LANG1801"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('rtpholdtimeout', {
                            rules: [],
                            initialValue: sipTosSettings.rtpholdtimeout
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5265" /> }>
                                    <span>{ formatMessage({id: "LANG5264"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('rtpkeepalive', {
                            rules: [],
                            initialValue: sipTosSettings.rtpkeepalive
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG4216" /> }>
                                    <span>{ formatMessage({id: "LANG4215"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('p100rel', {
                            rules: [],
                            initialValue: sipTosSettings.p100rel
                        })(
                            <Select style={{ width: 200 }}>
                                <option value='no'>{formatMessage({id: "LANG137"})}</option>
                                <option value='yes'>{formatMessage({id: "LANG136"})}</option>
                                <option value='required'>{formatMessage({id: "LANG4214"})}</option>
                            </Select>
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5265" /> }>
                                    <span>{ formatMessage({id: "LANG5264"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('rtpkeepalive', {
                            rules: [],
                            initialValue: sipTosSettings.rtpkeepalive
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG4216" /> }>
                                    <span>{ formatMessage({id: "LANG4215"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('p100rel', {
                            rules: [],
                            initialValue: sipTosSettings.p100rel
                        })(
                            <Select style={{ width: 200 }}>
                                <option value='no'>{formatMessage({id: "LANG137"})}</option>
                                <option value='yes'>{formatMessage({id: "LANG136"})}</option>
                                <option value='required'>{formatMessage({id: "LANG4214"})}</option>
                            </Select>
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5265" /> }>
                                    <span>{ formatMessage({id: "LANG5264"}) }</span>
                                </Tooltip>
                        )}>
                        { getFieldDecorator('rtpkeepalive', {
                            rules: [],
                            initialValue: sipTosSettings.rtpkeepalive
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG4216" /> }>
                                    <span>{ formatMessage({id: "LANG4215"}) }</span>
                                </Tooltip>
                        )}>
                        { getFieldDecorator('p100rel', {
                            rules: [],
                            initialValue: sipTosSettings.p100rel
                        })(
                            <Select style={{ width: 200 }}>
                                <option value='no'>{formatMessage({id: "LANG137"})}</option>
                                <option value='yes'>{formatMessage({id: "LANG136"})}</option>
                                <option value='required'>{formatMessage({id: "LANG4214"})}</option>
                            </Select>
                        ) }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        { ...formItemLayout }
                        label={(
                            <span>
                                <Tooltip title={ <FormattedHTMLMessage id="LANG5265" /> }>
                                    <span>{ formatMessage({id: "LANG5264"}) }</span>
                                </Tooltip>
                            </span>
                        )}>
                        { getFieldDecorator('rtpkeepalive', {
                            rules: [],
                            initialValue: sipTosSettings.rtpkeepalive
                        })(
                            <Input maxLength="4" />
                        ) }
                    </FormItem>
                </Col>
                <Col span={12}>
                </Col>
            </Row>
        </Form>
    )
}))

class Tos extends Component {
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
        let sipTcpSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={sipTcpSettings} />
            </div>
        )
    }
}

Tos.propTypes = {
}

export default injectIntl(Tos)