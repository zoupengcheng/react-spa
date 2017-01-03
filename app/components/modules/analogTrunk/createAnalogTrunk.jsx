'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Modal, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Tabs } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'
import Validator from "../../api/validator"
import Title from '../../../views/title'

class CreateTrunksAnalog extends Component {
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
                <Title headerTitle={ formatMessage({id: "LANG762"}) } isDisplay='display-block' />
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={formatMessage({id: "LANG1329"})}>
                                { getFieldDecorator('new_ATRNK_cls_container', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                className="hidden"
                                label={(
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1343" />}>
                                        <span>{formatMessage({id: "LANG1342"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('trunkgroup', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select></Select>
                                )}
                            </FormItem>                            
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1350" />}>
                                        {formatMessage({id: "LANG1351"})}
                                    </Tooltip>
                                }>
                                { getFieldDecorator('trunk_name', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>                        
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                { ...formItemLayout }
                                label={
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3219" />}>
                                        {formatMessage({id: "LANG3218"})}
                                    </Tooltip>
                                }>
                                { getFieldDecorator('trunkmode', {
                                    rules: [],
                                    valuePropName: 'checked',
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>                        
                        </Col>
                    </Row>
                    <div id="slaOptions">
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3221" />}>
                                            {formatMessage({id: "LANG3220"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('bargeallowed', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>                        
                            </Col>
                        </Row>  
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3223" />}>
                                            {formatMessage({id: "LANG3222"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('holdaccess', {
                                        rules: [],
                                        initialValue: "open"
                                    })(
                                        <Select style={{ width: 200 }}>
                                            <Option value="open">Open</Option>
                                            <Option value="private">Private</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>                        
                            </Col>
                        </Row>
                    </div>
                    <div className="section-title">
                        <span>{ formatMessage({id: "LANG229"}) }</span>
                    </div>
                    <div className="section-body">
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1341" />}>
                                            {formatMessage({id: "LANG1340"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('polarityswitch', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input maxLength="8" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1345"}) }>
                                            {formatMessage({id: "LANG1344"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('polarityonanswerdelay', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input maxLength="4" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1695" />}>
                                            {formatMessage({id: "LANG1694"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('enablecurrentdisconnectthreshold', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <span>
                                            <Checkbox />
                                            <Input id="currentdisconnectthreshold" />
                                        </span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1347"}) }>
                                            {formatMessage({id: "LANG1346"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('ringtimeout', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1695" />}>
                                            {formatMessage({id: "LANG1397"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('rxgain', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1400"}) }>
                                            {formatMessage({id: "LANG1399"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('txgain', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1352" />}>
                                            {formatMessage({id: "LANG1353"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('usecallerid', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            {/* <div if="fax_add_hide" className="hidden"> */}
                                <Col span={12} className="fax_add_hide hidden">
                                    <FormItem
                                        { ...formItemLayout }
                                        label={(
                                            <Tooltip title={ formatMessage({id: "LANG3555"}) }>
                                                {formatMessage({id: "LANG3871"})}
                                            </Tooltip>
                                        )}>
                                        { getFieldDecorator('faxmode', {
                                            rules: [],
                                            initialValue: ""
                                        })(
                                            <Select>
                                                <Option value='no'>{formatMessage({id: "LANG133"})}</Option>
                                                <Option value='detect'>{formatMessage({id: "LANG1135"})}</Option>
                                                <Option value='gateway'>{formatMessage({id: "LANG3554"})}</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            {/* </div> */}
                        </Row>
                        <Row id="detect_div" className="fax_add_hide hidden">
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1352" />}>
                                            {formatMessage({id: "LANG1353"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('fax_intelligent_route', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12} className="fax_add_hide hidden">
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG4380"}) }>
                                            {formatMessage({id: "LANG4379"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('fax_intelligent_route_destination', {
                                        rules: [],
                                        initialValue: "no"
                                    })(
                                        <Select>
                                            <Option value='no'>{formatMessage({id: "LANG133"})}</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2254" />}>
                                            {formatMessage({id: "LANG2275"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('cidmode', {
                                        rules: [],
                                        initialValue: "0"
                                    })(
                                    <Select>
                                        <Option value='0'>{formatMessage({id: "LANG2268"})}</Option>
                                        <Option value='1'>{formatMessage({id: "LANG2250"})}</Option>
                                        <Option value='2'>{formatMessage({id: "LANG2267"})}</Option>
                                        <Option value='3'>{formatMessage({id: "LANG2249"})}</Option>
                                        <Option value='4'>{formatMessage({id: "LANG2266"})}</Option>
                                        <Option value='5'>{formatMessage({id: "LANG2248"})}</Option>
                                        <Option value='6'>{formatMessage({id: "LANG2265"})}</Option>
                                        <Option value='7'>{formatMessage({id: "LANG2247"})}</Option>
                                        <Option value='8'>{formatMessage({id: "LANG2262"})}</Option>
                                        <Option value='9'>{formatMessage({id: "LANG2245"})}</Option>
                                        <Option value='10'>{formatMessage({id: "LANG5268"})}</Option>
                                        <Option value='11'>{formatMessage({id: "LANG2410"})}</Option>
                                    </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG3254"}) }>
                                            {formatMessage({id: "LANG3253"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('fxooutbandcalldialdelay', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG5266" />}>
                                            {formatMessage({id: "LANG2543"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('auto_record', {
                                        rules: [],
                                        initialValue: false
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG3480"}) }>
                                            {formatMessage({id: "LANG2757"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('out_of_service', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: false
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3533" />}>
                                            {formatMessage({id: "LANG3532"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('dahdilineselectmode', {
                                        rules: [],
                                        initialValue: "ascend"
                                    })(
                                        <Select>
                                            <Option value='ascend'>{formatMessage({id: "LANG3534"})}</Option>
                                            <Option value='poll'>{formatMessage({id: "LANG3535"})}</Option>
                                            <Option value='desend'>{formatMessage({id: "LANG3536"})}</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG3024"}) }>
                                            {formatMessage({id: "LANG3023"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('out_maxchans', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <div className="section-title">
                        <span>{ formatMessage({id: "LANG2387"}) }</span>
                    </div>
                    <div className="section-body">
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1324" />}>
                                            {formatMessage({id: "LANG1323"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('busydetect', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1322"}) }>
                                            {formatMessage({id: "LANG1321"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('busycount', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1335" />}>
                                            {formatMessage({id: "LANG1334"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('congestiondetect', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    id="congestioncountfield"
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1333"}) }>
                                            {formatMessage({id: "LANG1332"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('congestioncount', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    id="toneCountryField"
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1348" />}>
                                            {formatMessage({id: "LANG1349"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('countrytone', {
                                        rules: [],
                                        initialValue: "us"
                                    })(
                                        <Select></Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    id="congestioncountfield"
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1326"}) }>
                                            {formatMessage({id: "LANG1325"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('busy', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input className="tone-setting"/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    id="toneCountryField"
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1337" />}>
                                            {formatMessage({id: "LANG1336"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('congestion', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                {/* <input type="hidden" id="busypattern" name="busypattern" dfalt='500,500' />
                                <input type="hidden" id="congestionpattern" name="congestionpattern" dfalt='250,250' />
                                <input type="hidden" id="busyfrequencies" name="busyfrequencies" dfalt='480+620' />
                                <input type="hidden" id="congestionfrequencies" name="congestionfrequencies" dfalt='450+450' />
                                <input type="hidden" id="busylevels" name="busylevels" />
                                <input type="hidden" id="congestionlevels" name="congestionlevels" />
                                <input type="hidden" id="congestioncount" name="congestioncount" />
                                <input type="hidden" id="cidstart" name="cidstart" />
                                <input type="hidden" id="cidsignalling" name="cidsignalling" />
                                <input type="hidden" id="echocancel" name="echocancel" dfalt='128' value="128" /> */}
                                <FormItem
                                    id="congestioncountfield"
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG2348"}) }>
                                            {formatMessage({id: "LANG2347"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('busy', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Button onClick={this._showModal}>{formatMessage({id: "LANG2325"})}</Button>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <Modal 
                    title={formatMessage({id: "LANG2347"})}
                    visible={this.state.visible}
                    onOk={this._handleOk} 
                    onCancel={this._handleCancel}
                    okText={formatMessage({id: "LANG2325"})}
                    cancelText={formatMessage({id: "LANG726"})}>
                    <Form>
                        <FormItem
                            id="congestioncountfield"
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG2409"}) }>
                                    {formatMessage({id: "LANG2408"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('detect_model', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Select>
                                    <Option value='0'>{formatMessage({id: "LANG2410"})}</Option>
                                    <Option value='1'>{formatMessage({id: "LANG2411"})}</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG2327"}) }>
                                    {formatMessage({id: "LANG2326"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('src_channels', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Select></Select>
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            className="hidden"
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG2331"}) }>
                                    {formatMessage({id: "LANG2330"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('src_number', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Input maxLength="32" />
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG2329"}) }>
                                    {formatMessage({id: "LANG2328"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('des_channels', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Select></Select>
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG2333"}) }>
                                    {formatMessage({id: "LANG2332"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('des_number', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Input maxLength="32" />
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ formatMessage({id: "LANG5139"}) }>
                                    {formatMessage({id: "LANG5139"})}
                                </Tooltip>
                            )}>
                            { getFieldDecorator('is_save_record', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Checkbox />
                            )}
                        </FormItem>
                        <span>{formatMessage({id: "LANG2414"})}</span>
                    </Form>
                </Modal>
            </div>
        )
    }
}

CreateTrunksAnalog.propTypes = {
}

export default Form.create()(injectIntl(CreateTrunksAnalog))