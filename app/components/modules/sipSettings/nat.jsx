'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
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
    const sipNatSettings = props.dataSource
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 6 }
    }

    return (
        <Form>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1836" /> }>
                            <span>{ formatMessage({id: "LANG1837"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('externhost', {
                    rules: [],
                    initialValue: sipNatSettings.externhost
                })(
                    <Input maxLength="60" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG4485" /> }>
                            <span>{ formatMessage({id: "LANG4484"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('ip_in_sdp_connection', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: sipNatSettings.ip_in_sdp_connection === "yes" ? true : false
                })(
                    <Checkbox />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG4778" /> }>
                            <span>{ formatMessage({id: "LANG4777"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('externudpport', {
                    rules: [],
                    initialValue: sipNatSettings.externudpport
                })(
                    <Input maxLength="60" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1842" /> }>
                            <span>{ formatMessage({id: "LANG1841"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('externtcpport', {
                    rules: [],
                    initialValue: sipNatSettings.externtcpport
                })(
                    <Input maxLength="6" />
                )}
            </FormItem>
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1844" /> }>
                            <span>{ formatMessage({id: "LANG1843"}) }</span>
                        </Tooltip>
                    </span>
                )}>
                { getFieldDecorator('externtlsport', {
                    rules: [],
                    initialValue: sipNatSettings.externtlsport
                })(
                    <Input maxLength="6" />
                )}
            </FormItem>
            {/* <div class="field-cell">
                  <div class="field-label" gLabel="@LANG1845" tooltip="@LANG1845"></div>
                  <div class="field-content">
                      <input type="text" id="localnetaddr" name="localnetaddr" maxlength="32" autocomplete="off" />
                  </div>
              </div>
              <div class="field-cell">
                  <div class="field-label" gLabel="@LANG3051" tooltip="@LANG3051"></div>
                  <div class="field-content">
                      <select id="localnetlen" name="localnetlen">
                          <option value="32">32</option>
                          <option value="31">31</option>
                          <option value="30">30</option>
                          <option value="29">29</option>
                          <option value="28">28</option>
                          <option value="27">27</option>
                          <option value="26">26</option>
                          <option value="25">25</option>
                          <option value="24" selected="true">24</option>
                          <option value="23">23</option>
                          <option value="22">22</option>
                          <option value="21">21</option>
                          <option value="20">20</option>
                          <option value="19">19</option>
                          <option value="18">18</option>
                          <option value="17">17</option>
                          <option value="16">16</option>
                          <option value="15">15</option>
                          <option value="14">14</option>
                          <option value="13">13</option>
                          <option value="12">12</option>
                          <option value="11">11</option>
                          <option value="10">10</option>
                          <option value="9">9</option>
                          <option value="8">8</option>
                          <option value="7">7</option>
                          <option value="6">6</option>
                          <option value="5">5</option>
                          <option value="4">4</option>
                          <option value="3">3</option>
                          <option value="2">2</option>
                          <option value="1">1</option>
                      </select>
                  </div>
              </div> */}
        </Form>
    )
}))

class Nat extends Component {
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
        let sipNatSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) } dataSource={sipNatSettings} />
            </div>
        )
    }
}

Nat.propTypes = {
}

export default injectIntl(Nat)