'use strict'

import $ from 'jquery'
import _ from 'underscore'
import cookie from 'react-cookie'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl, FormattedHTMLMessage, formatMessage } from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Popover, Select, Tabs, Modal, Tooltip, Table, Popconfirm } from 'antd'
import api from "../../api/api"
import Validator from "../../api/validator"
import UCMGUI from "../../api/ucmgui"

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

const zeroconfigErr = {
    "1": "LANG918",
    "2": "LANG919",
    "3": "LANG920",
    "4": "LANG2538",
    "5": "LANG4389"
}

let checkInterval = null

class Devices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            zeroConfigSettings: UCMGUI.isExist.getList("getZeroConfigSettings"),
            deviceList: [],
            filter: this.props.filter ? this.props.filter : "all",
            selectedRowKeys: [],
            selectedRows: [],
            autoDiscoverVisible: false,
            modalType: null,
            zcScanProgress: false,
            broadcastDiscover: false,
            networkInfo: {
                LANAddr: null,
                netSegFromAddr: null,
                netSegToAddr: null
            }            
        }
    }
    componentDidMount() {
        // this._getAllDeviceExtensions()
        this._listZeroConfig()
    }
    componentWillUnmount() {

    }
    _getAllDeviceExtensions = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'getAllDeviceExtensions' 
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        getAllDeviceExtensions = res.getAllDeviceExtensions
                    // this.setState({
                    //     getAllDeviceExtensions: getAllDeviceExtensions
                    // })
                }
            }.bind(this)
        })  
    }
    _checkZeroConfigInvalidModels = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'checkZeroConfigInvalidModels' 
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        models = res.models
                    // this.setState({
                    //     models: models
                    // })
                }
            }.bind(this)
        })          
    }
    
    _listZeroConfig = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'listZeroConfig',
                "options": "mac,ip,members,version,vendor,model,state,last_access",
                "filter": this.state.filter
            },
            type: 'json',
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        deviceList = res.zeroconfig
                    this.setState({
                        deviceList: deviceList
                    })
                }
            }.bind(this)
        })         
    }
    _handleFilterChange = (e) => {
        this.setState({
            filter: e
        })
        this._listZeroConfig()
    }
    /**                          
    *   Handle Auto Discover Modal    
    */    
    _showAutoDiscoverModal = () => {   
        const { formatMessage } = this.props.intl
        const _this = this
        this._checkInfo().done(data => {
            message.destroy()
            if (data && data.status === 0) {
                const zcScanProgress = data.response.zc_scan_progress
                _this.setState({
                    zcScanProgress: zcScanProgress
                })
                if (zcScanProgress === '1') {
                    message.error(formatMessage({id: "LANG920"}))
                } else {
                    $.ajax({
                        url: api.apiHost + 'action=getNetworkInformation',
                        method: 'GET',
                        type: 'json',
                        async: true,
                        error: function(e) {
                            message.error(e.statusText)
                        },
                        success: function(data) {
                            if (data.status === 0) {
                                const LIST = ["wan", "lan", "lan1", "lan2"]
                                
                                for (let i = 3; i >= 0; i--) {
                                    const mode = data.response[LIST[i]]
                                    // ZeroConfig AutoDiscover only available for lan/lan1
                                    if (mode && mode.ip && mode.mask && LIST[i] !== 'wan' && LIST[i] !== 'lan2') {
                                        _this._processNetRange(mode.ip, mode.mask)
                                        break                           
                                    }
                                }                    
                            }
                        }
                    }) 
                }
            }
        })             
    }
    _processNetRange = (ipStr, maskStr) => {
        const ipArray = ipStr.split(".")
        const netMaskArray = maskStr.split(".")
        let rangeFromArray = []
        let rangeToArray = []
        if (ipArray.length !== 4 || netMaskArray.length !== 4) {
            return false
        }

        for (let i = 0; i < 4; i++) {
            const ip_octet = Number(ipArray[i])
            const mask_octet = Number(netMaskArray[i])
            const re_cidr = 8 - this._calculateCIDR(mask_octet)
            rangeFromArray.push(ip_octet & mask_octet)
            rangeToArray.push((ip_octet >> re_cidr) + Math.pow(2, re_cidr) - 1)
        }

        this.setState({
            autoDiscoverVisible: true,
            modalType: "autoDiscover",
            networkInfo: {
                LANAddr: ipStr,
                netSegFromAddr: rangeFromArray.join("."),
                netSegToAddr: rangeToArray.join(".")
            }
        })
    }
    _calculateCIDR = (mask) => {
        let count = 0,
        cidr = 0

        if (mask === 0) {
            return cidr
        }
        while (!(mask & 0x1)) {
            mask = mask >> 1
            count++
        }
        if (count < 8) {
            cidr = 8 - count
        }

        return cidr
    }
    _handleAutoDiscover = () => {
        const { formatMessage } = this.props.intl
        const { setFieldValue } = this.props.form
        const _this = this
        let scan_cgi = (action) => {
            this.setState({
                autoDiscoverVisible: false,
                modalType: null
            })
            $.ajax({
                url: api.apiHost + action,
                method: 'GET',
                type: 'json',
                async: true,
                error: function(e) {
                    message.error(e.statusText)
                },
                success: function(data) {
                    message.destroy()
                    if (data.status === 0) {                        
                        const res = data.response.scanDevices
                        if (res === "Scanning Device") {
                            if (_this.state.broadcastDiscover) {
                                message.success(formatMessage({id: "LANG3768"}))
                                UCMGUI.triggerCheckInfo(formatMessage)
                            } else {
                                message.loading(formatMessage({id: "LANG3769"}))
                               
                                // check whether single ip scanning has done per second.
                                checkInterval = setInterval(function() {
                                    IntervalForSingleIP()
                                }, 1000)
                            }                            
                            _this.setState({
                                zcScanProgress: '1'
                            })
                        } else {
                            const num = res.slice("ZCERROR_".length)
                            if (zeroconfigErr.hasOwnProperty(num)) {
                                message.error(formatMessage({id: zeroconfigErr[num]}))
                            }
                        }
                    } else {
                        message.error(formatMessage({id: "LANG909"}))
                    }
                }
            }) 
        }

        let IntervalForSingleIP = () => {
            this._checkInfo().done(data => {
                message.destroy()
                if (data && data.status === 0) {
                    let zcScanProgress = data.response.zc_scan_progress
                    if (zcScanProgress === '0') {
                        clearInterval(checkInterval)
                        checkInterval = null
                        _this.setState({
                            zcScanProgress: zcScanProgress
                        })
                        confirm({
                            title: '',
                            content: formatMessage({ id: "LANG917" }, { 0: formatMessage({id: "LANG3"}) }),
                            okText: formatMessage({id: "LANG727" }),
                            cancelText: formatMessage({id: "LANG726" }),
                            onOk() {
                                _this.setState({
                                    filter: "res"
                                })
                                _this._listZeroConfig()
                            },
                            onCancel() {}
                        })                             
                    }
                }
            })
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                let username = cookie.load("username")

                let action = `action=scanDevices&username=${username}&method=${values.method}&ip=${values.targetAddr}&interface=1`
                if (values.targetAddr === this.state.networkInfo.netSegToAddr) {
                    let confirmContent = `<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG2221" })}}></span>`
                    confirm({
                        title: '',
                        content: formatMessage({ id: "LANG2221" }),
                        okText: formatMessage({id: "LANG727" }),
                        cancelText: formatMessage({id: "LANG726" }),
                        onOk() {
                            _this.setState({
                                broadcastDiscover: true
                            })
                            scan_cgi(action)
                        },
                        onCancel() {}
                    })
                } else {
                    scan_cgi(action)
                }  
            }
        })
    }
    _handleCancel = () => {
        this.setState({
            autoDiscoverVisible: false,
            modalType: null
        })
    }
    _checkInfo = () => {
        let username = cookie.load("username")

        if (username) {
            return $.ajax({
                method: "post",
                url: api.apiHost,
                data: {
                    action: 'checkInfo',
                    user: username
                },
                async: false
            })
        }
    }
    /**
    */
    _edit = (record) => {

    }
    _delete = (record) => {
        const { formatMessage } = this.props.intl
        const action = {
            "action": "deleteZeroConfig",
            "mac": record.mac,
            "original_ip": record.ip
        }

        $.ajax({
            url: api.apiHost,
            method: "post",
            data: action,
            success: function (data) {
                const bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(formatMessage({id: "LANG4763"}))

                    this._listZeroConfig()

                    /* this.setState({
                        selectedRowKeys: _.without(this.state.selectedRowKeys, record.extension),
                        selectedRows: this.state.selectedRows.filter(function(item) { return item.extension !== record.extension })
                    }) */
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _batchDelete = () => {
        const { formatMessage } = this.props.intl
        const selectedRowKeys = this.state.selectedRowKeys
        const _this = this
        if (selectedRowKeys.length === 0) {
            message.error(formatMessage({id: "LANG848"}))
            return
        }            
        const macList = selectedRowKeys.join(',')
        confirm({
            title: `<span dangerouslySetInnerHTML={{ __html: formatMessage({ id: "LANG818" }, { 0: ${macList} }) }}></span>`,
            content: formatMessage({ id: "LANG917" }, { 0: formatMessage({id: "LANG3"}) }),
            okText: formatMessage({id: "LANG727" }),
            cancelText: formatMessage({id: "LANG726" }),
            onOk() {
                const action = {
                    "action": "deleteZeroConfig",
                    "mac": macList
                }

                $.ajax({
                    url: api.apiHost,
                    method: "post",
                    data: action,
                    success: function (data) {
                        const bool = UCMGUI.errorHandler(data, null, formatMessage)

                        if (bool) {
                            message.destroy()
                            message.success(formatMessage({id: "LANG4763"}))

                            _this._listZeroConfig()

                            /* this.setState({
                                selectedRowKeys: _.without(this.state.selectedRowKeys, record.extension),
                                selectedRows: this.state.selectedRows.filter(function(item) { return item.extension !== record.extension })
                            }) */
                        }
                    },
                    error: function(e) {
                        message.error(e.statusText)
                    }
                })
            },
            onCancel() {}
        }) 
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator, setFieldValue } = this.props.form
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        }
        const filter = this.state.filter
        const networkInfo = this.state.networkInfo

        const columns = [
            {
                title: formatMessage({id: "LANG1293"}),
                dataIndex: 'mac'
            }, {
                title: formatMessage({id: "LANG1291"}),
                dataIndex: 'ip'
            }, {
                title: formatMessage({id: "LANG85"}),
                dataIndex: 'members'
            }, {
                title: formatMessage({id: "LANG1298"}),
                dataIndex: 'version'
            }, {
                title: formatMessage({id: "LANG1299"}),
                dataIndex: 'vendor'
            }, {
                title: formatMessage({id: "LANG1295"}),
                dataIndex: 'model'
            }, {
                title: formatMessage({id: "LANG1301"}),
                dataIndex: 'state'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => (
                    <span>
                        <span className="sprite sprite-edit" onClick={this._edit.bind(this, record)}></span>
                        <Popconfirm
                            placement="left"
                            title={ <span dangerouslySetInnerHTML=
                                        {{ __html: formatMessage({ id: "LANG818" }, { 0: record.mac }) }}
                                    ></span> }
                            okText={ formatMessage({id: "LANG727"}) }
                            cancelText={ formatMessage({id: "LANG726"}) }
                            onConfirm={ this._delete.bind(this, record) }
                        >
                            <span className="sprite sprite-del"></span>
                        </Popconfirm>
                    </span>
                ) 
            }
        ]
        
        const pagination = {
            total: this.state.deviceList.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange(current) {
                console.log('Current: ', current)
            }
        }
        
        // rowSelection object indicates the need for row selection
        /* const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                this.setState({
                    selectedRowKeys: selectedRowKeys,
                    selectedRows: selectedRows
                })
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            },
            onSelect(record, selected, selectedRows) {
                console.log(record, selected, selectedRows)
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows)
            }
        } */
        const rowSelection = {
            onChange: this._onSelectChange,
            selectedRowKeys: this.state.selectedRowKeys
        }
        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this._showAutoDiscoverModal} >
                            {formatMessage({id: "LANG757"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG754"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._batchDelete} >
                            {formatMessage({id: "LANG755"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG3866"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG2626"})}
                        </Button>
                        <label>{formatMessage({id: "LANG1288"}) + ":"}</label>
                        <Select 
                            style={{ width: 200 }}
                            onChange={this._handleFilterChange}
                            value={filter}>
                            <Option value="all">{formatMessage({id: "LANG104"})}</Option>
                            <Option value="res">{formatMessage({id: "LANG1289"})}</Option>
                        </Select>
                    </div>
                    <div>
                        <Table 
                        rowKey="mac"
                        rowSelection={rowSelection} 
                        columns={columns} 
                        dataSource={this.state.deviceList} 
                        pagination={pagination} />
                    </div>
                    <Modal 
                        title={ formatMessage({id: "LANG757"}) }
                        visible={this.state.autoDiscoverVisible}
                        onOk={this._handleAutoDiscover} 
                        onCancel={this._handleCancel}
                        okText={formatMessage({id: "LANG727"})}
                        cancelText={formatMessage({id: "LANG726"})}>
                        <Form>
                            <div className="lite-desc">
                                { formatMessage({id: "LANG1316"}) }
                            </div>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4817" /> }>
                                        <span>{formatMessage({id: "LANG4816"})}</span>
                                    </Tooltip>
                                )}>
                                <span>                            
                                    {networkInfo.LANAddr}
                                </span>
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4819" /> }>
                                        <span>{formatMessage({id: "LANG4818"})}</span>
                                    </Tooltip>
                                )}>
                                <span>                            
                                    {networkInfo.netSegFromAddr} - {networkInfo.netSegToAddr}
                                </span>
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG4821" /> }>
                                        <span>{formatMessage({id: "LANG4820"})}</span>
                                    </Tooltip>
                                )}>
                                <span>                            
                                    {networkInfo.netSegToAddr}
                                </span>
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1320" /> }>
                                        <span>{formatMessage({id: "LANG1319"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('method', {
                                    initialValue: 'Ping'
                                })(
                                    <Select 
                                        style={{ width: 200 }}
                                        >
                                        <Option value="Ping">Ping</Option>
                                        <Option value="ARP">ARP</Option>
                                        <Option value="SipMsg">SIP-Message</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                { ...formItemLayout }
                                label={(
                                    <Tooltip title={ <FormattedHTMLMessage id="LANG1318" /> }>
                                        <span>{formatMessage({id: "LANG1317"})}</span>
                                    </Tooltip>
                                )}>
                                { getFieldDecorator('targetAddr', {
                                    rules: [{
                                        required: true,
                                        message: formatMessage({id: "LANG2150"})
                                    }, { 
                                        validator: (data, value, callback) => {
                                            // Validator.ipAddress(data, value, callback, formatMessage)
                                            if (!value || /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/i.test(value)) {
                                                callback()
                                            } else {
                                                callback(formatMessage({id: "LANG2195"}))
                                            }
                                        }
                                    }, { 
                                        validator: (data, value, callback) => {
                                            let errMsg = formatMessage({id: "LANG2176"})

                                            if (!value) {
                                                callback()
                                            }
                                            const targetAddrArry = value.split(".")
                                            const fromAddrArry = networkInfo.netSegFromAddr.split(".")
                                            const toAddrArry = networkInfo.netSegToAddr.split(".")
                                            let ret = true
                                            if (targetAddrArry.length === 4) {
                                                for (let i = 0; i < 4; i++) {
                                                    const target = Number(targetAddrArry[i]),
                                                          min = Number(fromAddrArry[i]),
                                                          max = Number(toAddrArry[i])
                                                    if (target < min || target > max) {
                                                        ret = false
                                                        break
                                                    }
                                                }
                                            } else {
                                                ret = false
                                            }
                                            if (ret) {
                                                callback()
                                            } else {
                                                callback(errMsg)
                                            }                                            
                                        }
                                    }, { 
                                        validator: (data, value, callback) => {
                                            let errMsg = formatMessage({id: "LANG4822"})

                                            if (!value) {
                                                callback()
                                            }

                                            if (value !== networkInfo.netSegFromAddr) {
                                                callback()
                                            } else {
                                                callback(errMsg)
                                            }
                                        }
                                    }, { 
                                        validator: (data, value, callback) => {
                                            let errMsg = formatMessage({id: "LANG4823"})

                                            if (!value) {
                                                callback()
                                            }

                                            if (value !== networkInfo.LANAddr) {
                                                callback()
                                            } else {
                                                callback(errMsg)
                                            }
                                        }
                                    }]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}

Devices.propTypes = {
}

export default Form.create()(injectIntl(Devices))