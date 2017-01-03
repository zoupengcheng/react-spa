'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Modal, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'
import MusicOnHoldList from './musicOnHoldList'
import Validator from "../../api/validator"
import Title from '../../../views/title'

class MusicOnHold extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    _showModal = () => {
        this.setState({
            visible: true
        })
    }
    _handleOk = () => {
        this.setState({
            visible: false
        })
    }
    _handleCancel = () => {
        this.setState({
            visible: false
        })
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
                <Title headerTitle={ formatMessage({id: "LANG671"}) } isDisplay='hidden' />
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={formatMessage({id: "LANG1603"})}>
                                { getFieldDecorator('moh_classes', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select></Select>
                                )}
                                <span className="sprite sprite-edit" onClick={this._showModal}></span>
                            </FormItem>
                        </Col>
                        <Col span={12}> 
                        </Col>
                    </Row>
                </Form>
                <MusicOnHoldList cdrData={[]}/>
                <Modal 
                    title={formatMessage({id: "LANG774"})}
                    visible={this.state.visible}
                    onOk={this._handleOk} 
                    onCancel={this._handleCancel}
                    okText={formatMessage({id: "LANG728"})}
                    cancelText={formatMessage({id: "LANG726"})}>
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG1602"}) }>
                                    {formatMessage({id: "LANG135"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('moh_name', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Input maxLength="20" />
                            )}
                        </FormItem>
                        <FormItem
                            id="congestioncountfield"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG2507"}) }>
                                    {formatMessage({id: "LANG2507"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('sort', {
                                rules: [],
                                initialValue: "0"
                            })(
                                <Select>
                                    <Option value='0'>{formatMessage({id: "LANG2410"})}</Option>
                                    <Option value='1'>{formatMessage({id: "LANG2411"})}</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

MusicOnHold.propTypes = {
}

export default Form.create()(injectIntl(MusicOnHold))