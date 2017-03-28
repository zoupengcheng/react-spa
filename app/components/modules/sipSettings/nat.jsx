'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import Validator from "../../api/validator"
import { Form, Input, Button, Row, Col, Checkbox, message, Tooltip, Select, Icon, Table, Popconfirm } from 'antd'
const FormItem = Form.Item

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
    const natList = props.natList || []
    const permitIP = props.permitIP
    const permitMask = props.permitMask
    const addIP = props.addIP
    const editNat = props.editNat
    const deleteNat = props.deleteNat
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 6 }
    }
    const formItemRowLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 }
    }
    const columns = [{
            key: 'rowid',
            dataIndex: 'rowid',
            className: 'hidden',
            title: '',
            sorter: (a, b) => a.rowid - b.rowid
            }, {
            key: 'localnetaddr',
            dataIndex: 'localnetaddr',
            title: formatMessage({id: "LANG1845"}),
            sorter: (a, b) => a.localnetaddr.length - b.localnetaddr.length
        }, {
            key: 'localnetlen',
            dataIndex: 'localnetlen',
            title: formatMessage({id: "LANG3051"}),
            sorter: (a, b) => a.localnetlen - b.localnetlen
        }, {
            key: 'options',
            dataIndex: 'options',
            title: formatMessage({id: "LANG74"}),
            render: (text, record, index) => {
                return <div>
                        <Popconfirm
                            title={ formatMessage({id: "LANG841"}) }
                            okText={ formatMessage({id: "LANG727"}) }
                            cancelText={ formatMessage({id: "LANG726"}) }
                            onConfirm={ deleteNat.bind(this, record) }
                        >
                            <span className="sprite sprite-del"></span>
                        </Popconfirm>
                    </div>
            }
        }]
    const pagination = {
          showSizeChanger: true,
          total: natList.length,
          onShowSizeChange: (current, pageSize) => {
              console.log('Current: ', current, '; PageSize: ', pageSize)
          },
          onChange: (current) => {
              console.log('Current: ', current)
          }
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
            <FormItem
                { ...formItemLayout }
                label={(
                    <span>
                        <Tooltip title={ <FormattedHTMLMessage id="LANG1845" /> }>
                            <span>{ formatMessage({id: "LANG1845"}) }</span>
                        </Tooltip>
                    </span>
                )}
            >
                <Col span="16">
                    <FormItem>
                        {getFieldDecorator("permitIP", {
                            rules: [{
                                required: true,
                                message: formatMessage({id: "LANG2150"})
                            }, {
                                validator: (data, value, callback) => {
                                    Validator.ipAddress(data, value, callback, formatMessage)
                                }
                            }],
                            initialValue: permitIP
                            })(
                                <Input placeholder={ formatMessage({id: "LANG1915"}) } />
                        )}
                    </FormItem>
                </Col>
                <Col span="1">
                    <p className="ant-form-split">/</p>
                </Col>
                <Col span="5" style={{ marginRight: 10 }}>
                    <FormItem>
                          { getFieldDecorator('permitMask', {
                              rules: [],
                              initialValue: permitMask
                          })(
                              <Select>
                                <option value="32">32</option>
                                <option value="31">31</option>
                                <option value="30">30</option>
                                <option value="29">29</option>
                                <option value="28">28</option>
                                <option value="27">27</option>
                                <option value="26">26</option>
                                <option value="25">25</option>
                                <option value="24">24</option>
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
                              </Select>
                          ) }
                      </FormItem>
                </Col>
                <Icon
                    type="plus-circle-o"
                    style={{
                        'top': '7px',
                        'right': '-30px',
                        'fontSize': '20px',
                        'cursor': 'pointer',
                        'position': 'absolute'
                    }}
                    onClick={ addIP }
                />
            </FormItem>
            <FormItem
                { ...formItemRowLayout }
                label={(
                    <span>
                    </span>
                )}
            >
                <Table
                    rowKey="rowid"
                    columns={ columns }
                    pagination={ pagination }
                    dataSource={ natList }
                />
            </FormItem>
        </Form>
    )
}))

class Nat extends Component {
    constructor(props) {
        super(props)
        this.state = {
          natList: [],
          permitIP: "",
          permitMask: "24"
        }
    }
    componentDidMount() {
          this._getNatlist()
    }
    componentWillUnmount() {

    }
    _handleFormChange = (changedFields) => {
        _.extend(this.props.dataSource, changedFields)

        for (let tmp in changedFields) {
          if (tmp === "permitIP") {
             this.state["permitIP"] = changedFields[tmp].value     
          }
        }
    }
    _getNatlist = () => {
        let natList = []
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            method: 'post',
            url: api.apiHost,
            data: {
                sord: 'asc',
                sidx: 'localnetaddr',
                action: 'listSipNetAddrSettings',
                item_num: 10000,
                page: 1
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    natList = response.sip_nat_addr || []

                    natList = _.map(natList, function(data, index) {
                        data.key = index

                        return data
                    })

                    this.setState({
                        natList: natList
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _addIP = (e) => {
        // e.preventDefault()
        let sipNatSettings = this.props.dataSource
        let loadingMessage = ''
        let successMessage = ''
        let me = this
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG826" }) }}></span>
        successMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG844" }) }}></span>

        message.loading(loadingMessage)

        let action = {
            localnetaddr: this.state.permitIP,
            localnetlen: this.state.permitMask,
            action: 'addSipNetAddrSettings'
        }

        $.ajax({
            data: action,
            type: 'json',
            method: "post",
            url: api.apiHost,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    me.setState({
                        permitIP: '',
                        permitMask: "24"
                    })

                    me._getNatlist()
                }
            }.bind(this)
        })
    }
    _editNat = (e) => {
        // e.preventDefault()
        let sipNatSettings = this.props.dataSource
        let loadingMessage = ''
        let successMessage = ''
        let me = this
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG826" }) }}></span>
        successMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG844" }) }}></span>

        message.loading(loadingMessage)

        let action = {
            rowid: e.rowid,
            localnetaddr: e.permitIP,
            localnetlen: e.permitMask,
            action: 'updateSipNetAddrSettings'
        }

        $.ajax({
            data: action,
            type: 'json',
            method: "post",
            url: api.apiHost,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                    me._getNatlist()
                }
            }.bind(this)
        })
    }
    _deleteNat = (e) => {
        // e.preventDefault()
        let sipNatSettings = this.props.dataSource
        let loadingMessage = ''
        let successMessage = ''
        let me = this
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG816" }) }}></span>
        successMessage = <span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG844" }) }}></span>

        message.loading(loadingMessage)

        let action = {
            rowid: e.rowid,
            action: 'deleteSipNetAddrSettings'
        }

        $.ajax({
            data: action,
            type: 'json',
            method: "post",
            url: api.apiHost,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)
                    me._getNatlist()
                }
            }.bind(this)
        })
    }
    render() {
        const {formatMessage} = this.props.intl
        let sipNatSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                <CustomizedForm onChange={ this._handleFormChange.bind(this) }
                  dataSource={sipNatSettings}
                  natList={this.state.natList}
                  addIP={this._addIP}
                  editNat={this._editNat}
                  deleteNat={this._deleteNat}
                />
            </div>
        )
    }
}

Nat.propTypes = {
}

export default injectIntl(Nat)