'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Select, Button, Row, Col, Input, Popover, Tabs, Checkbox } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

class FeatureMap extends Component {
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
                        <Popover content={formatMessage({id: "LANG1214"})} title={formatMessage({id: "LANG1214"})}><span>{formatMessage({id: "LANG1214"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('blindxfer', {initialValue: '#1'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('blindxfer_allow', {initialValue: ''})(
                            <Select>
                                <Option value="">{formatMessage({id: "LANG1254"})}</Option>
                                <Option value="T">{formatMessage({id: "LANG1255"})}</Option>
                                <Option value="t">{formatMessage({id: "LANG1256"})}</Option>
                                <Option value="tT">{formatMessage({id: "LANG1257"})}</Option>
                            </Select>
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1208"})} title={formatMessage({id: "LANG1208"})}><span>{formatMessage({id: "LANG1208"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('atxfer', {initialValue: '*2'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('share_dial', {initialValue: ''})(
                            <Select>
                                <Option value="">{formatMessage({id: "LANG1254"})}</Option>
                                <Option value="T">{formatMessage({id: "LANG1255"})}</Option>
                                <Option value="t">{formatMessage({id: "LANG1256"})}</Option>
                                <Option value="tT">{formatMessage({id: "LANG1257"})}</Option>
                            </Select>
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG5153"})} title={formatMessage({id: "LANG5153"})}><span>{formatMessage({id: "LANG5153"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_seamless_transfer', {initialValue: '*44'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_seamless_transfer')(
                             <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1236"})} title={formatMessage({id: "LANG1236"})}><span>{formatMessage({id: "LANG1236"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('disconnect', {initialValue: '*0'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('disconnect_allow', {initialValue: ''})(
                            <Select>
                                <Option value="">{formatMessage({id: "LANG1254"})}</Option>
                                <Option value="T">{formatMessage({id: "LANG1255"})}</Option>
                                <Option value="t">{formatMessage({id: "LANG1256"})}</Option>
                                <Option value="tT">{formatMessage({id: "LANG1257"})}</Option>
                            </Select>
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1216"})} title={formatMessage({id: "LANG1216"})}><span>{formatMessage({id: "LANG1216"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('parkcall', {initialValue: '#72'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('parkcall_allow', {initialValue: ''})(
                            <Select>
                                <Option value="">{formatMessage({id: "LANG1254"})}</Option>
                                <Option value="T">{formatMessage({id: "LANG1255"})}</Option>
                                <Option value="t">{formatMessage({id: "LANG1256"})}</Option>
                                <Option value="tT">{formatMessage({id: "LANG1257"})}</Option>
                            </Select>
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1210"})} title={formatMessage({id: "LANG1210"})}><span>{formatMessage({id: "LANG1210"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('automixmon', {initialValue: '*3'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('automixmon_allow', {initialValue: ''})(
                            <Select>
                                <Option value="">{formatMessage({id: "LANG1254"})}</Option>
                                <Option value="T">{formatMessage({id: "LANG1255"})}</Option>
                                <Option value="t">{formatMessage({id: "LANG1256"})}</Option>
                                <Option value="tT">{formatMessage({id: "LANG1257"})}</Option>
                            </Select>
                        )}
                    </Col>
                </FormItem>
            </Form>
        )
    }
}

module.exports = Form.create()(injectIntl(FeatureMap))