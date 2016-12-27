'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Select, Button, Row, Col, Input, Popover, Tabs, Checkbox } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

class FeatureCodes extends Component {
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
                        <Popover content={formatMessage({id: "LANG1233"})} title={formatMessage({id: "LANG1232"})}><span>{formatMessage({id: "LANG1232"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_dialvm', {initialValue: '*98'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_dialvm')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1253"})} title={formatMessage({id: "LANG1253"})}><span>{formatMessage({id: "LANG1253"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_vmmain', {initialValue: '*97'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_vmmain')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1204"})} title={formatMessage({id: "LANG1204"})}><span>{formatMessage({id: "LANG1204"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_agentpause', {initialValue: '*83'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_agentpause')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1206"})} title={formatMessage({id: "LANG1206"})}><span>{formatMessage({id: "LANG1206"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_agentunpause', {initialValue: '*84'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_agentunpause')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1248"})} title={formatMessage({id: "LANG1248"})}><span>{formatMessage({id: "LANG1248"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_paging_prefix', {initialValue: '*81'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_paging_prefix')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1246"})} title={formatMessage({id: "LANG1246"})}><span>{formatMessage({id: "LANG1246"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_intercom_prefix', {initialValue: '*80'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_intercom_prefix')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG2282"})} title={formatMessage({id: "LANG2282"})}><span>{formatMessage({id: "LANG2282"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_blacklist_add', {initialValue: '*40'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_blacklist_add')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG2281"})} title={formatMessage({id: "LANG2281"})}><span>{formatMessage({id: "LANG2281"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_blacklist_remove', {initialValue: '*41'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_blacklist_remove')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG1218"})} title={formatMessage({id: "LANG1218"})}><span>{formatMessage({id: "LANG1218"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_pickup', {initialValue: '**'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_pickup')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG5154"})} title={formatMessage({id: "LANG5154"})}><span>{formatMessage({id: "LANG5154"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('number_seamless_transfer', {initialValue: '*45'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_number_seamless_transfer')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG2516"})} title={formatMessage({id: "LANG2516"})}><span>{formatMessage({id: "LANG2516"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fgeneral_pickupexten', {initialValue: '*8'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fgeneral_pickupexten')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG2638"})} title={formatMessage({id: "LANG2638"})}><span>{formatMessage({id: "LANG2638"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_direct_vm', {initialValue: '*'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_direct_vm')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG5095"})} title={formatMessage({id: "LANG5095"})}><span>{formatMessage({id: "LANG5095"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_direct_phonenumber', {initialValue: '*88'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_direct_phonenumber')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG3721"})} title={formatMessage({id: "LANG3721"})}><span>{formatMessage({id: "LANG3721"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cc_request', {initialValue: '*11'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cc_request')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG3723"})} title={formatMessage({id: "LANG3723"})}><span>{formatMessage({id: "LANG3723"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_cc_cancel', {initialValue: '*12'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_cc_cancel')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4018"})} title={formatMessage({id: "LANG4018"})}><span>{formatMessage({id: "LANG4018"})}</span></Popover>
                    </Col>
                    <Col span={6}> 
                        {getFieldDecorator('barge_enable')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4012"})} title={formatMessage({id: "LANG4012"})}><span>{formatMessage({id: "LANG4012"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_barge_listen', {initialValue: '*54'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={9}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4014"})} title={formatMessage({id: "LANG4014"})}><span>{formatMessage({id: "LANG4014"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_barge_whisper', {initialValue: '*55'})(
                            <Input />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4016"})} title={formatMessage({id: "LANG4016"})}><span>{formatMessage({id: "LANG4016"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_barge_barge', {initialValue: '*56'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={9}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4295"})} title={formatMessage({id: "LANG4295"})}><span>{formatMessage({id: "LANG4295"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_inboud_multi_mode')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4541"})} title={formatMessage({id: "LANG4541"})}><span>{formatMessage({id: "LANG4541"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_barge_barge', {initialValue: '*61'})(
                            <Select>
                                <Option value="0">{formatMessage({id: "LANG3940"})}</Option>
                                <Option value="1">{formatMessage({id: "LANG4540"})}</Option>
                            </Select>
                        )}
                    </Col>
                    <Col span={9}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4296"})} title={formatMessage({id: "LANG4296"})}><span>{formatMessage({id: "LANG4296"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_inbound_mode_zero')(
                            <Input />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4297"})} title={formatMessage({id: "LANG4297"})}><span>{formatMessage({id: "LANG4297"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_inbound_mode_one', {initialValue: '*62'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={9}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4858"})} title={formatMessage({id: "LANG4858"})}><span>{formatMessage({id: "LANG4858"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_ucm_wakeup', {initialValue: '*36'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_ucm_wakeup')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>

                <FormItem>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG5166"})} title={formatMessage({id: "LANG5166"})}><span>{formatMessage({id: "LANG5166"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_wakeup', {initialValue: '*35'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_wakeup')(
                            <Checkbox />
                        )}
                    </Col>
                    <Col span={5}></Col>
                    <Col span={2}>
                        <Popover content={formatMessage({id: "LANG4885"})} title={formatMessage({id: "LANG4885"})}><span>{formatMessage({id: "LANG4885"})}</span></Popover>
                    </Col>
                    <Col span={3}>
                        {getFieldDecorator('fcode_pms_status', {initialValue: '*23'})(
                            <Input />
                        )}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        {getFieldDecorator('enable_fcode_pms_status')(
                            <Checkbox />
                        )}
                    </Col>
                </FormItem>
            </Form>
        )
    }
}

module.exports = Form.create()(injectIntl(FeatureCodes))