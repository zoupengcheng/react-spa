'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Transfer, Tabs } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'
import Title from '../../../views/title'
const TabPane = Tabs.TabPane

class EditVoipTrunk extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    _onChange = (activeKey) => {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    _handleSubmit = (e) => {
        // this.state.basicSettings.form.validateFields(() => {
        //     console.log("hi") 
        // })
        console.log("hi")
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
                <Title headerTitle={ formatMessage({id: "LANG2908"}) } onSubmit={ this._handleSubmit.bind(this) } onCancel={ this._handleCancel } isDisplay='display-block' />
                <Form>
                    <Tabs defaultActiveKey="1" onChange={this._onChange}>
                        <TabPane tab={formatMessage({id: "LANG2217"})} key="1">
                            <FormItem
                                id="div_trunktype"
                                { ...formItemLayout }
                                label={formatMessage({id: "LANG84"})}>
                                { getFieldDecorator('trunk_type', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select style={{ width: 200 }}>
                                    </Select>
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_trunktype"
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
                                id="div_hostname"
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
                                id="div_transport"
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
                                id="div_keep_org_cid"
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
                                id="div_keep_cid"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2319" />}>
                                        <span>{formatMessage({id: "LANG2318"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('keepcid', {
                                    rules: [],
                                    valuePropName: "checked",
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_nat"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1093" />}>
                                        {"NAT:"}
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
                                id="div_out_of_service"
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
                                id="div_tel_uri"
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
                                    <Select>
                                        <Option value='disabled'>{formatMessage({id: "LANG2770"})}</Option>
                                        <Option value='user_phone'>{formatMessage({id: "LANG2771"})}</Option>
                                        <Option value='enabled'>{formatMessage({id: "LANG2772"})}</Option>
                                    </Select>
                                ) }
                            </FormItem>
                            <FormItem
                                id="need_register_div"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3016" />}>
                                        <span>{formatMessage({id: "LANG3015"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('need_register', {
                                    rules: [],
                                    valuePropName: "checked",
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                            <FormItem
                                id="allow_outgoing_calls_if_reg_failed_div"
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
                                id="div_callerid"
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
                                id="div_callername"
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
                                id="div_fromdomain"
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
                                id="div_fromuser"
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
                                id="div_username"
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
                                id="div_password"
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
                                id="authid_field"
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
                                id="auth_trunk_field"
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
                                id="auto_record_field"
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
                        </TabPane>
                        <TabPane tab={formatMessage({id: "LANG542"})} key="2">
                            {/* <Transfer
                                id="div_codecs"
                                dataSource={mockData}
                                titles={['Source', 'Target']}
                                targetKeys={state.targetKeys}
                                selectedKeys={state.selectedKeys}
                                onChange={this.handleChange}
                                onSelectChange={this.handleSelectChange}
                                render={item => item.title}
                              /> */}
                            <FormItem
                                id="div_send_ppi"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3901" />}>
                                        <span>{formatMessage({id: "LANG3900"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('send_ppi', {
                                    rules: [],
                                    valuePropName: "checked",
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_use_dod_in_ppi"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG5322" />}>
                                        <span>{formatMessage({id: "LANG5321"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('use_dod_in_ppi', {
                                    rules: [],
                                    valuePropName: "checked",
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_send_pai"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3989" />}>
                                        <span>{formatMessage({id: "LANG3988"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('send_pai', {
                                    rules: [],
                                    valuePropName: "checked",
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_send_pai"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG5320" />}>
                                        <span>{formatMessage({id: "LANG5319"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('pai_number', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <InputNumber />
                                ) }
                            </FormItem>
                            <FormItem
                                id="is_outboundproxy_field"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1381" />}>
                                        <span>{formatMessage({id: "LANG1380"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('chkOutboundproxy', {
                                    rules: [],
                                    valuePropName: "checked",
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                            <FormItem
                                id="outboundproxy_field"
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
                                    <Input />
                                ) }
                            </FormItem>
                            <FormItem
                                id="didmode_field"
                                className="hidden"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG2649" />}>
                                        <span>{formatMessage({id: "LANG2648"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('did_mode', {
                                    rules: [],
                                    initialValue: "request-line"
                                })(
                                    <Select id='did_mode' >
                                        <Option value='request-line'>{formatMessage({id: "LANG2650"})}</Option>
                                        <Option value='to-header'>{formatMessage({id: "LANG2651"})}</Option>
                                    </Select>
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_dtmfmode"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1786" />}>
                                        <span>{formatMessage({id: "LANG1097"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('dtmfmode', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Select id="dtmfmode">
                                        <Option value=''>{formatMessage({id: "LANG257"})}</Option>
                                        <Option value='rfc2833'>RFC2833</Option>
                                        <Option value='info'>{formatMessage({id: "LANG1099"})}</Option>
                                        <Option value='inband'>{formatMessage({id: "LANG1100"})}</Option>
                                        <Option value='auto'>{formatMessage({id: "LANG138"})}</Option>
                                    </Select>
                                ) }
                            </FormItem>
                            <FormItem
                                id="editTrunk_Field_qualify"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1367" />}>
                                        <span>{formatMessage({id: "LANG1366"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('enable_qualify', {
                                    rules: [],
                                    valuePropName: "checked",
                                    initialValue: ""
                                })(
                                    <Checkbox />
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_qualifyfreq"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1385" />}>
                                        <span>{formatMessage({id: "LANG1384"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('qualifyfreq', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input maxLength="4" />
                                ) }
                            </FormItem>
                            <FormItem
                                id="div_out_maxchans"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG3024" />}>
                                        <span>{formatMessage({id: "LANG3023"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('out_maxchans', {
                                    rules: [],
                                    initialValue: ""
                                })(
                                    <Input />
                                ) }
                            </FormItem>
                            <FormItem
                                id="editTrunk_Field_faxmode"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG4199" />}>
                                        <span>{formatMessage({id: "LANG3871"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('faxmode', {
                                    rules: [],
                                    initialValue: "no"
                                })(
                                    <Select>
                                        <Option value='no'>{formatMessage({id: "LANG133"})}</Option>
                                        <Option value='detect'>{formatMessage({id: "LANG1135"})}</Option>
                                        {/* <option value='gateway' locale="LANG3554"></option> */}
                                    </Select>
                                ) }
                            </FormItem>
                            <div id="detect_div">
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4380" />}>
                                            <span>{formatMessage({id: "LANG4379"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('fax_intelligent_route', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                                <FormItem
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG4382" />}>
                                            <span>{formatMessage({id: "LANG4381"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('fax_intelligent_route_destination', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Select>
                                            <Option value=''>{formatMessage({id: "LANG133"})}</Option>
                                        </Select>
                                    ) }
                                </FormItem>
                            </div>
                            <FormItem
                                id="div_srtp"
                                { ...formItemLayout }
                                label={                            
                                    <Tooltip title={<FormattedHTMLMessage id="LANG1390" />}>
                                        <span>{formatMessage({id: "LANG1389"})}</span>
                                    </Tooltip>
                                }>
                                { getFieldDecorator('encryption', {
                                    rules: [],
                                    initialValue: "no"
                                })(
                                    <Select>
                                        <Option value="no">{formatMessage({id: "LANG4377"})}</Option>
                                        <Option value="support">{formatMessage({id: "LANG4376"})}</Option>
                                        <Option value="yes">{formatMessage({id: "LANG4375"})}</Option>
                                    </Select>
                                ) }
                            </FormItem>
                            {/* ldap for trunk */}
                            <div id="ldapDiv">
                                <FormItem
                                    id="div_ldap_sync_enable"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2497" />}>
                                            <span>{formatMessage({id: "LANG2493"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ldap_sync_enable', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: ""
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                                <FormItem
                                    id="div_ldap_sync_passwd"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2498" />}>
                                            <span>{formatMessage({id: "LANG2494"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ldap_sync_passwd', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input maxlength="64" />
                                    ) }
                                </FormItem>
                                <FormItem
                                    id="div_ldap_sync_port"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2499" />}>
                                            <span>{formatMessage({id: "LANG2495"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ldap_sync_port', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                                <FormItem
                                    id="div_ldap_default_outrt"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2500" />}>
                                            <span>{formatMessage({id: "LANG2496"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ldap_default_outrt', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Select></Select>
                                    ) }
                                </FormItem>
                                <FormItem
                                    id="div_ldap_default_outrt_prefix"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2499" />}>
                                            <span>{formatMessage({id: "LANG2518"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('ldap_outrt_prefix', {
                                        rules: [],
                                        initialValue: ""
                                    })(
                                        <Input />
                                    ) }
                                </FormItem>
                                <FormItem
                                    id="div_ldap_last_sync_date"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={ <FormattedHTMLMessage id="LANG2653" /> }>
                                            <span>{ formatMessage({id: "LANG2652"}) }</span>
                                        </Tooltip>
                                    }>
                                    { <div id="label_ldap_last_sync_date"></div> }
                                </FormItem>
                            </div>
                            {/*  ended of  ldap for trunk  */}
                            {/*  ccss for trunk  */}
                            <div id="ccss">
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
                                        <Checkbox />
                                    ) }
                                </FormItem>
                                <FormItem
                                    id="cc-max-agents"
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
                        </TabPane>
                    </Tabs>
                </Form>
            </div>
        )
    }
}

EditVoipTrunk.propTypes = {
}

export default Form.create()(injectIntl(EditVoipTrunk))