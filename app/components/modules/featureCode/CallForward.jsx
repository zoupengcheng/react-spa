'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Select, Button, Row, Col, Input, Popover, Tabs, Checkbox } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

class CallForward extends Component {
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        return (
            <Form>
                <div className="btn_div">
                    <Button type="primary">{formatMessage({id: "LANG751"})}</Button>
                    <Button type="primary">{formatMessage({id: "LANG749"})}</Button>
                </div>
                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1238"})} title={formatMessage({id: "LANG1238"})}><span>{formatMessage({id: "LANG1238"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_dnd_on', {initialValue: '*77'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_dnd_on')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1240"})} title={formatMessage({id: "LANG1240"})}><span>{formatMessage({id: "LANG1240"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_dnd_off', {initialValue: '*78'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_dnd_off')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1220"})} title={formatMessage({id: "LANG1220"})}><span>{formatMessage({id: "LANG1220"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cfb_on', {initialValue: '*90'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cfb_on')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1222"})} title={formatMessage({id: "LANG1222"})}><span>{formatMessage({id: "LANG1222"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cfb_off', {initialValue: '*91'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cfb_off')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1224"})} title={formatMessage({id: "LANG1224"})}><span>{formatMessage({id: "LANG1224"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cfn_on', {initialValue: '*92'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cfn_on')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1226"})} title={formatMessage({id: "LANG1226"})}><span>{formatMessage({id: "LANG1226"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cfn_off', {initialValue: '*93'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cfn_off')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1228"})} title={formatMessage({id: "LANG1228"})}><span>{formatMessage({id: "LANG1228"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cfu_on', {initialValue: '*72'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cfu_on')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1230"})} title={formatMessage({id: "LANG1230"})}><span>{formatMessage({id: "LANG1230"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cfu_off', {initialValue: '*73'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cfu_off')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>
            </Form>
        )
    }
}

module.exports = Form.create()(injectIntl(CallForward))