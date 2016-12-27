'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Select, Button, Row, Col, Input, Popover, Tabs, Checkbox } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

class FeatureMisc extends Component {
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
                    <Col span={3}>
                        <Popover content={formatMessage({id: "LANG1234"})} title={formatMessage({id: "LANG1234"})}><span>{formatMessage({id: "LANG1234"})}</span></Popover>
                    </Col>
                    <Col span={6}>
                        {getFieldDecorator('featuredigittimeout', {initialValue: '1000'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={2}></Col>
                    <Col span={3}>
                        <Popover content={formatMessage({id: "LANG1244"})} title={formatMessage({id: "LANG1244"})}><span>{formatMessage({id: "LANG1244"})}</span></Popover>
                    </Col>
                    <Col span={6}>
                        {getFieldDecorator('parkext', {initialValue: '700'})(
                            <Input />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={3}>
                        <Popover content={formatMessage({id: "LANG1242"})} title={formatMessage({id: "LANG1242"})}><span>{formatMessage({id: "LANG1242"})}</span></Popover>
                    </Col>
                    <Col span={6}>
                        {getFieldDecorator('parkpos', {initialValue: '701-720'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={2}></Col>
                    <Col span={3}>
                        <Popover content={formatMessage({id: "LANG3982"})} title={formatMessage({id: "LANG3982"})}><span>{formatMessage({id: "LANG3982"})}</span></Popover>
                    </Col>
                    <Col span={6}>
                        {getFieldDecorator('park_as_extension')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={3}>
                        <Popover content={formatMessage({id: "LANG1250"})} title={formatMessage({id: "LANG1250"})}><span>{formatMessage({id: "LANG1250"})}</span></Popover>
                    </Col>
                    <Col span={6}>
                        {getFieldDecorator('parkingtime', {initialValue: '300'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={2}></Col>
                    <Col span={3}>
                        <Popover content={formatMessage({id: "LANG1603"})} title={formatMessage({id: "LANG1603"})}><span>{formatMessage({id: "LANG1603"})}</span></Popover>
                    </Col>
                    <Col span={6}>
                        {getFieldDecorator('parkedmusicclass')(
                            <Select></Select>
                        )}
                    </Col>
                </FormItem>
            </Form>
        )
    }
}

module.exports = Form.create()(injectIntl(FeatureMisc))