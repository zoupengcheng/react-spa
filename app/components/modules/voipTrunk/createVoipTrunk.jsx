'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'
import $ from 'jquery'
import Title from '../../../views/title'

class CreateVoipTrunk extends Component {
    constructor(props) {
        super(props)
        this.state = {
            trunkType: "peer",
            telUri: "disabled",
            enableCc: false
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _handleSubmit = (e) => {
        // this.state.basicSettings.form.validateFields(() => {
        //     console.log("hi") 
        // })
        console.log("hi")
    }
    _onChangeTrunkType = (val) => {
        this.setState({
            trunkType: val
        })      
    }
    _onChangeTelUri = (val) => {
        this.setState({
            telUri: val
        })  
    }
    _onChangeEnableCc = (val) => {
        this.setState({
            enableCc: val
        })  
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        let type = this.props.params.type

        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG2908"}) } onSubmit={ this._handleSubmit.bind(this) } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form tab={formatMessage({id: "LANG2217"})} key="1">
                    <FormItem
                        ref="div_trunktype"
                        { ...formItemLayout }
                        label={ formatMessage({id: "LANG84"}) }>
                        {(() => {
                            switch (type) {
                                case "addSip": 
                                    return (
                                        <Select ref="trunk_type" defaultValue="peer" onChange={this._onChangeTrunkType}>
                                            <Option value="peer">{ formatMessage({id: "LANG233"}) }</Option>
                                            <Option value="register">{ formatMessage({id: "LANG234"}) }</Option>
                                        </Select>
                                    )
                                case "addIax": 
                                    return (
                                        <Select ref="trunk_type" defaultValue="peer" onChange={this._onChangeTrunkType}>
                                            <Option value="peer">{ formatMessage({id: "LANG235"}) }</Option>
                                            <Option value="register">{ formatMessage({id: "LANG236"}) }</Option>
                                        </Select>
                                    )
                                default: return
                            }
                        })()}
                    </FormItem>
                    <FormItem
                        ref="div_trunktype"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1383" />}>
                                <span>{formatMessage({id: "LANG1382"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('trunk_name', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="16" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_hostname"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1374" />}>
                                <span>{formatMessage({id: "LANG1373"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('host', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="60" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_transport"
                        className="hidden"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1391" />}>
                                <span>{formatMessage({id: "LANG1392"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('transport', {
                            rules: [],
                            initialValue: "udp"
                        })(
                            <Select id="transport" name="transport" dfalt="udp,tcp,tls" mSelect="true">
                                 <Option value="udp">{formatMessage({id: "LANG1401"})}</Option>
                                 <Option value="tcp">{formatMessage({id: "LANG1402"})}</Option>
                                 <Option value="tls">{formatMessage({id: "LANG1403"})}</Option>
                                 {/* <Option value="udp,tcp,tls" locale="LANG1404">All - UDP Primary</Option>
                                 <Option value="tcp,udp,tls" locale="LANG1405">All - TCP Primary</Option>
                                 <Option value="tls,udp,tcp" locale="LANG1406">All - TLS Primary</Option> */}
                             </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_keep_org_cid"
                        className={type === "addIax" ? "hidden" : "display-block"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4109" />}>
                                <span>{formatMessage({id: "LANG4108"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('keeporgcid', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="60" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_keep_cid"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2319" />}>
                                <span>{formatMessage({id: "LANG2318"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('keepcid', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: (this.state.trunkType === "register" && type === "addSip") ? true : false
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_nat"
                        className={type === "addIax" ? "hidden" : "display-block"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1093" />}>
                                {"NAT"}
                            </Tooltip>
                        }>
                        { getFieldDecorator('nat', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: ""
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_out_of_service"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG3480" />}>
                                <span>{formatMessage({id: "LANG2757"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('out_of_service', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: ""
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_tel_uri"
                        className={type === "addIax" ? "hidden" : "display-block"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2769" />}>
                                <span>{formatMessage({id: "LANG2768"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('tel_uri', {
                            rules: [],
                            initialValue: "disabled"
                        })(
                            <Select onChange={ this._onChangeTelUri}>
                                <Option value='disabled'>{formatMessage({id: "LANG2770"})}</Option>
                                <Option value='user_phone'>{formatMessage({id: "LANG2771"})}</Option>
                                <Option value='enabled'>{formatMessage({id: "LANG2772"})}</Option>
                            </Select>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="need_register_div"
                        className={ (this.state.trunkType === "register" && type === "addSip") ? "display-block" : "hidden"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG3016" />}>
                                <span>{formatMessage({id: "LANG3015"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('need_register', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: (this.state.trunkType === "register" && type === "addSip") ? true : false
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="allow_outgoing_calls_if_reg_failed_div"
                        className={ (this.state.trunkType === "register" && type === "addSip") ? "display-block" : "hidden"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG5070" />}>
                                <span>{formatMessage({id: "LANG5069"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('allow_outgoing_calls_if_reg_failed', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: ""
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_callerid"
                        className={this.state.trunkType === "peer" ? "display-block" : "hidden"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1360" />}>
                                <span>{formatMessage({id: "LANG1359"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('cidnumber', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_callername"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1362" />}>
                                <span>{formatMessage({id: "LANG1361"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('cidname', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_fromdomain"
                        className="hidden"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1370" />}>
                                <span>{formatMessage({id: "LANG1369"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('fromdomain', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="60" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_fromuser"
                        className="hidden"
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1372" />}>
                                <span>{formatMessage({id: "LANG1371"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('fromuser', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_username"
                        className={ this.state.trunkType === "register" ? "display-block" : "hidden"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG1393" />}>
                                <span>{formatMessage({id: "LANG72"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('user_name', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="div_password"
                        className={ this.state.trunkType === "register" ? "display-block" : "hidden"}
                        { ...formItemLayout }
                        label={formatMessage({id: "LANG73"})}>
                        { getFieldDecorator('password', {
                            rules: [],
                            initialValue: ""
                        })(
                            <div>
                            <Input type="text" style={{display: "none"}} />
                            <Input type="password" maxLength="64" autocomplete="off" />
                            </div>
                        ) }
                    </FormItem>
                    <FormItem
                        ref="authid_field"
                        className={ (this.state.trunkType === "register" && type === "addSip") ? "display-block" : "hidden"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG2488" />}>
                                <span>{formatMessage({id: "LANG2487"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('authid', {
                            rules: [],
                            initialValue: ""
                        })(
                            <Input maxLength="64" />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="auth_trunk_field"
                        className={ (this.state.trunkType === "register" && type === "addSip") ? "display-block" : "hidden" }
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG4262" />}>
                                <span>{formatMessage({id: "LANG4261"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('auth_trunk', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: ""
                        })(
                            <Checkbox />
                        ) }
                    </FormItem>
                    <FormItem
                        ref="auto_record_field"
                        className={type === "addIax" ? "hidden" : "display-block"}
                        { ...formItemLayout }
                        label={                            
                            <Tooltip title={<FormattedHTMLMessage id="LANG5266" />}>
                                <span>{formatMessage({id: "LANG2543"})}</span>
                            </Tooltip>
                        }>
                        { getFieldDecorator('auto_recording', {
                            rules: [],
                            valuePropName: "checked",
                            initialValue: ""
                        })(
                            <Checkbox />
                        ) }
                        </FormItem>
                        <div className="hidden">
                            <FormItem
                                ref="outboundproxy_field"
                                className={ (this.state.trunkType === "register" && type === "addSip") ? "display-block" : "hidden"}
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1379" />}>
                                        <span>{formatMessage({id: "LANG1378"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('outboundproxy', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                            <FormItem
                                id="rmvObpFromRoute_field"
                                className={ (this.state.trunkType === "register" && type === "addSip") ? "display-block" : "hidden"}
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG5030" />}>
                                        <span>{formatMessage({id: "LANG5029"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('rmv_obp_from_route', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input disabled={ this.state.telUri !== "disabled" ? true : false } />
                                ) }
                            </FormItem>
                        </div>
                    {/*  ccss for trunk  */}
                    <div id="ccss" className="hidden">
                        <div className='section-title'>{ formatMessage({id: "LANG3725"}) }</div>
                        <FormItem
                            { ...formItemLayout }
                            label={                            
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3727" /> }>
                                    <span>{ formatMessage({id: "LANG3726"}) }</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('enable_cc', {
                                rules: [],
                                valuePropName: "checked",
                                initialValue: ""
                            })(
                                <Checkbox onChange={this._onChangeEnableCc} />
                            ) }
                        </FormItem>
                        <FormItem
                            ref="cc-max-agents"
                            className={ this.state.enableCc === true ? "display-block" : "hidden" }
                            { ...formItemLayout }
                            label={                            
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3734" /> }>
                                    <span>{ formatMessage({id: "LANG3733"}) }</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('cc_max_agents', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Input maxLength="10" />
                            ) }
                        </FormItem>
                        <FormItem
                            id="cc-max-monitors"
                            className={ this.state.enableCc === true ? "display-block" : "hidden" }
                            { ...formItemLayout }
                            label={                            
                                <Tooltip title={ <FormattedHTMLMessage id="LANG3740" /> }>
                                    <span>{ formatMessage({id: "LANG3739"}) }</span>
                                </Tooltip>
                            }>
                            { getFieldDecorator('cc_max_monitors', {
                                rules: [],
                                initialValue: ""
                            })(
                                <Input maxLength="10" />
                            ) }
                        </FormItem>
                    </div>      
                    {/* ended of  ccss for trunk */} 
                </Form>
            </div>
        )
    }
}

CreateVoipTrunk.propTypes = {
}

export default Form.create()(injectIntl(CreateVoipTrunk))