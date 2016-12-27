'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import { Form, Select, Button, Col, Input, Popover, Checkbox, message } from 'antd'

const FormItem = Form.Item

class ExtensionPreference extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weak_password: false,
            rand_password: false,
            auto_email_to_user: false,
            disable_extension_ranges: false
        }
    }
    componentDidMount() {
        let extensionPrefSettings = this.props.extensionPrefSettings

        this.setState({
            weak_password: extensionPrefSettings.weak_password === 'yes',
            rand_password: extensionPrefSettings.rand_password === 'yes',
            auto_email_to_user: extensionPrefSettings.auto_email_to_user === 'yes',
            disable_extension_ranges: extensionPrefSettings.disable_extension_ranges === 'yes'
        })
    }
    _onWeakPasswordEnableChange = (e) => {
        this.setState({
            weak_password: e.target.checked
        })
    }
    _onRandPasswordEnableChange = (e) => {
        this.setState({
            rand_password: e.target.checked
        })
    }
    _onAtuoEmailPasswordEnableChange = (e) => {
        this.setState({
            auto_email_to_user: e.target.checked
        })
    }
    _onDisableExtenEnableChange = (e) => {
        this.setState({
            disable_extension_ranges: e.target.checked
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 }
        }

        const formItemLayout2 = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        }

        let extensionPrefSettings = this.props.extensionPrefSettings

        return (
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={formatMessage({id: "LANG2634"})} title={formatMessage({id: "LANG2633"})}>
                                <span>{formatMessage({id: "LANG2633"})}</span>
                            </Popover>
                        </span>
                    )}
                >
                    {getFieldDecorator('weak_password')(
                        <Checkbox checked={ this.state.weak_password } onChange={ this._onWeakPasswordEnableChange } />
                    )}
                </FormItem>

                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={formatMessage({id: "LANG1588"})} title={formatMessage({id: "LANG1587"})}>
                                <span>{formatMessage({id: "LANG1587"})}</span>
                            </Popover>
                        </span>
                    )}
                >
                    {getFieldDecorator('rand_password')(
                        <Checkbox checked={ this.state.rand_password } onChange={ this._onRandPasswordEnableChange } />
                    )}
                </FormItem>

                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={formatMessage({id: "LANG4151"})} title={formatMessage({id: "LANG4150"})}>
                                <span>{formatMessage({id: "LANG4150"})}</span>
                            </Popover>
                        </span>
                    )}
                >
                    {getFieldDecorator('auto_email_to_user')(
                        <Checkbox checked={ this.state.auto_email_to_user } onChange={ this._onAtuoEmailPasswordEnableChange } />
                    )}
                </FormItem>

                <FormItem
                    { ...formItemLayout }
                    label={(
                        <span>
                            <Popover content={formatMessage({id: "LANG1586"})} title={formatMessage({id: "LANG1586"})}>
                                <span>{formatMessage({id: "LANG1586"})}</span>
                            </Popover>
                        </span>
                    )}
                >
                    {getFieldDecorator('disable_extension_ranges')(
                        <Checkbox checked={ this.state.disable_extension_ranges } onChange={ this._onDisableExtenEnableChange } />
                    )}
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG248"})} title={formatMessage({id: "LANG248"})}>
                                        <span>{formatMessage({id: "LANG248"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('ue_start', { initialValue: extensionPrefSettings.ue_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('ue_end', { initialValue: extensionPrefSettings.ue_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG2919"})} title={formatMessage({id: "LANG2919"})}>
                                        <span>{formatMessage({id: "LANG2919"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('pkue_start', { initialValue: extensionPrefSettings.pkue_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('pkue_end', { initialValue: extensionPrefSettings.pkue_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG2918"})} title={formatMessage({id: "LANG2918"})}>
                                        <span>{formatMessage({id: "LANG2918"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('zcue_start', { initialValue: extensionPrefSettings.zcue_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('zcue_end', { initialValue: extensionPrefSettings.zcue_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG1585"})} title={formatMessage({id: "LANG1585"})}>
                                        <span>{formatMessage({id: "LANG1585"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('mm_start', { initialValue: extensionPrefSettings.mm_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('mm_end', { initialValue: extensionPrefSettings.mm_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG1597"})} title={formatMessage({id: "LANG1597"})}>
                                        <span>{formatMessage({id: "LANG1597"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('rge_start', { initialValue: extensionPrefSettings.rge_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('rge_end', { initialValue: extensionPrefSettings.rge_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG1596"})} title={formatMessage({id: "LANG1596"})}>
                                        <span>{formatMessage({id: "LANG1596"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('qe_start', { initialValue: extensionPrefSettings.qe_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('qe_end', { initialValue: extensionPrefSettings.qe_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG1569"})} title={formatMessage({id: "LANG1569"})}>
                                        <span>{formatMessage({id: "LANG1569"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('vmg_start', { initialValue: extensionPrefSettings.vmg_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('vmg_end', { initialValue: extensionPrefSettings.vmg_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG1593"})} title={formatMessage({id: "LANG1593"})}>
                                        <span>{formatMessage({id: "LANG1593"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('vme_start', { initialValue: extensionPrefSettings.vme_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('vme_end', { initialValue: extensionPrefSettings.vme_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG2897"})} title={formatMessage({id: "LANG2897"})}>
                                        <span>{formatMessage({id: "LANG2897"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('directory_start', { initialValue: extensionPrefSettings.directory_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('directory_end', { initialValue: extensionPrefSettings.directory_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem className="formItemLayout2">
                    <Col span={6}>
                        <FormItem
                            { ...formItemLayout2 }
                            label={(
                                <span>
                                    <Popover content={formatMessage({id: "LANG2907"})} title={formatMessage({id: "LANG2907"})}>
                                        <span>{formatMessage({id: "LANG2907"})}</span>
                                    </Popover>
                                </span>
                            )}
                        >
                            {getFieldDecorator('fax_start', { initialValue: extensionPrefSettings.fax_start })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <p className="ant-form-split">-</p>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            {getFieldDecorator('fax_end', { initialValue: extensionPrefSettings.fax_end })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                </FormItem>   
            </Form>
        )
    }
}

module.exports = Form.create()(injectIntl(ExtensionPreference))