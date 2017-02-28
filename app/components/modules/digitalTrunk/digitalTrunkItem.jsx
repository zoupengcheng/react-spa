'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Modal, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select, Tabs, Spin } from 'antd'
import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import Validator from "../../api/validator"
import Title from '../../../views/title'
import UCMGUI from "../../api/ucmgui"

const FormItem = Form.Item
const Option = Select.Option
const baseServerURl = api.apiHost

class DigitalTrunkItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            firstLoad: true,
            digitaltrunk: {},
            digitalGroupList: [],
            faxIntelligentRouteDestinationOpts: []
        }
    }
    componentDidMount() {
        const form = this.props.form 
        let mode = this.props.route.path,
            params = this.props.params

        this._tectFax()

        if (mode.indexOf('edit') === 0) {
            let trunkType = params.trunkType,
                trunkId = params.trunkId

            this._hideCallee(trunkType)
            this._getDigitalTrunk(trunkId)
        } else {
            this._optionIsDisabled()
            this._getDigitalHardwareSettings()
        }
    }
    componentWillUnmount() {
    }
    componentDidUpdate() {
        const form = this.props.form 

        let digitaltrunk = this.state.digitaltrunk

        if (this.state.firstLoad && !_.isEmpty(digitaltrunk)) {
            
        }
    }
    _optionIsDisabled = (groupIndex) => {
        // let groupNameList = mWindow.groupNameList,
        //     groupIndexDom = $("#group_index"),
        //     options = groupIndexDom.children(),
        //     flag = true;

        // for (let i = 0; i < options.length; i++) {
        //     let optionsIndex = options.eq(i);

        //     if (UCMGUI.inArray(optionsIndex.val(), groupNameList)) {
        //         optionsIndex.attr("disabled", true);
        //     } else if (flag && mode == "add") {
        //         flag = false
        //         groupIndexDom.get(0).selectedIndex = i
        //     }

        //     if (groupIndex && groupIndex == optionsIndex.val()) {
        //         optionsIndex.attr("disabled", false)
        //     }
        // }
        // if (options.not(":disabled").length == 0) {
        //     groupIndexDom.get(0).selectedIndex = -1
        // }
    }
    _hideCallee = (trunkType) => {
        if (trunkType.match(/em/i)) {
            this.setState({
                div_hide_callee_style: false
            })
        }
    }
    _tectFax = () => {
        const { formatMessage } = this.props.intl

        let accountList = UCMGUI.isExist.getList("listAccount").account,
            faxList = UCMGUI.isExist.getList("listFax").fax,
            arr = [{
                value: "",
                text: formatMessage({id: "LANG133"})
            }],
            obj = {}

        for (let i = 0; i < accountList.length; i++) {
            obj = accountList[i]

            if (obj.account_type.match(/FXS/i)) {
                arr.push({
                    value: obj.extension
                })
            }
        }
        for (let i = 0; i < faxList.length; i++) {
            obj = faxList[i]

            arr.push({
                value: obj.extension
            })
        }

        this.setState({
            faxIntelligentRouteDestinationOpts: arr
        })
    }
    _getDigitalHardwareSettings = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            type: "GET",
            url: baseServerURl + "action=getDigitalHardwareSettings",
            dataType: 'json',
            async: false,
            error: function(jqXHR, textStatus, errorThrown) {
                message.error(errorThrown)
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    let sDigitalType = data.response.digital_driver_settings[0].signalling

                    this._hideCallee(sDigitalType)
                }
            }.bind(this)
        })
    }
    _getNameList = () => {
        const { formatMessage } = this.props.intl

        let allTrunkList = UCMGUI.isExist.getList("getTrunkList")

        let trunkNameList = this._transData(allTrunkList)

        $.ajax({
            url: baseServerURl,
            type: "POST",
            dataType: "json",
            async: true,
            data: {
                "action": "listDigitalTrunk",
                "options": "trunk_name,group_index"
            },
            success: function(data) {
                let res = data.response

                if (res && data.status === 0) {
                    let digitalTrunks = res.digital_trunks

                    let groupNameList = []

                    for (let i = 0; i < digitalTrunks.length; i++) {
                        let digitalTrunksIndex = digitalTrunks[i]
                        groupNameList.push(String(digitalTrunksIndex.group_index))
                    }
                    this._listDataTrunk(groupNameList)
                }
            }.bind(this)
        })

        this._listDigitalGroup(trunkNameList)
    }
    _listDigitalGroup = (trunkNameList) => {
        $.ajax({
            url: baseServerURl,
            type: "POST",
            dataType: "json",
            data: {
                action: "listDigitalGroup",
                options: "group_name,group_index"
            },
            success: function(data) {
                if (data && data.status === 0) {
                    let res = data.response

                    if (res) {
                        let digitalGroup = res.digital_group
                        let arr = []

                        for (let i = 0; i < digitalGroup.length; i++) {
                            let digitalGroupIndex = digitalGroup[i]
                            let obj = {}

                            obj["text"] = digitalGroupIndex.group_name
                            obj["val"] = digitalGroupIndex.group_index
                            obj["disabled"] = false
                            arr.push(obj)
                        }
                        this.setState({
                            digitalGroupList: arr,
                            trunkNameList: trunkNameList
                        })
                    }
                }
            }.bind(this)
        })
    }
    _listDataTrunk = (groupNameList) => {
        $.ajax({
            url: baseServerURl,
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                action: "listDataTrunk"
            },
            success: function(data) {
                if (data.status === 0) {
                    let netHDLCSettings = data.response.nethdlc_settings

                    if (netHDLCSettings) {
                        groupNameList.push(String(netHDLCSettings[0].group_index))
                    }
                    this.setState({
                        groupNameList: groupNameList
                    })
                }
            }.bind(this)
        })
    }
    _transData(res, cb) {
        let arr = []

        for (let i = 0; i < res.length; i++) {
            arr.push(res[i]["trunk_name"])
        }
        if (cb && typeof cb === "function") {
            cb(arr)
        }

        return arr
    }
    _getDigitalTrunk = (trunkId) => {
        const { formatMessage } = this.props.intl
        const form = this.props.form 

        let action = {
            "action": "getDigitalTrunk",
            "Digitaltrunk": trunkId
        }

        $.ajax({
            type: "post",
            url: baseServerURl,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
                message.destroy()
                message.error(errorThrown)
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    let digitaltrunk = data.response.trunk

                    if (digitaltrunk.fax_intelligent_route_destination === "") {
                        form.setFieldsValue({
                            fax_intelligent_route_destination: "no"
                        })
                    }

                    let groupIndex = digitaltrunk.group_index

                    this._onChangeFaxdetect(digitaltrunk.faxdetect)
                    this._optionIsDisabled(groupIndex)

                    this.setState({
                        digitaltrunk: digitaltrunk
                    })
                }
            }.bind(this)
        })
    }
    _onChangeFaxdetect = (e) => {
        let isChecked = false

        if (_.isString(e)) {
            isChecked = (e === "yes" ? true : false)
        } else {
            isChecked = e.target.checked
        }

        if (isChecked) {
            this.setState({
                div_detect_style: true
            })
        } else {
            this.setState({
                div_detect_style: false
            })
        }
    }
    _onChangefaxIntelligentRoute = (e) => {
        let isChecked = e.target.checked

        if (isChecked) {
            this.setState({
                fax_intelligent_route: true
            })
        } else {
            this.setState({
                fax_intelligent_route: false
            })
        }        
    }
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        const form = this.props.form 

        let trunkId = this.props.params.trunkId,
            action = {},
            mode = this.props.route.path,
            isEdit = (mode.indexOf('edit') === 0),
            isAdd = (mode.indexOf('add') === 0)

        this.props.form.validateFieldsAndScroll((err, values) => {
            let me = this
            let refs = this.refs

            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    let divKey = refs["div_" + key]
                    if (divKey && 
                       divKey.props &&
                        ((divKey.props.className &&
                        divKey.props.className.indexOf("hidden") === -1) ||
                        typeof divKey.props.className === "undefined")) {
                        if (!err || (err && typeof err[key] === "undefined")) {
                            action[key] = UCMGUI.transCheckboxVal(values[key])   
                        } else {
                            return
                        }
                    } else if (typeof divKey === "undefined") {
                        if (!err || (err && typeof err[key] === "undefined")) {
                            action[key] = UCMGUI.transCheckboxVal(values[key])   
                        } else {
                            return
                        }
                    }
                }
            }
            message.loading(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG904" })}}></span>, 0)

            if (isAdd) {
                action["technology"] = "PRI"
            } else if (isEdit) {
               action["trunk"] = trunkId 
            }
            action["action"] = (mode === 'edit' ? "updateDigitalTrunk" : "addDigitalTrunk")
        })
    }
    _updateOrAddTrunkInfo = (action) => {
        const { formatMessage } = this.props.intl

        $.ajax({
            type: "post",
            url: baseServerURl,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
                message.destroy()
                message.error(errorThrown)
            },
            success: function(data) {
                let bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                    browserHistory.push('/extension-trunk/digitalTrunk')
                }
            }.bind(this)
        })
    }
    _trunkNameIsExist = (rule, value, callback, errMsg) => {
        let _this = this,
            mode = this.props.route.path,
            params = this.props.params,
            isEdit = (mode.indexOf('edit') === 0),
            isAdd = (mode.indexOf('add') === 0)

        if (value && value.length >= 2) {
            if (this.state.checkedChansList.length !== 0) {
                if (_.find(this.state.trunkNameList, function (num) { 
                    if (isEdit) {
                        return (num === value && params && params.trunkName !== value)
                    } else if (isAdd) {
                        return num === value
                    }
                })) {
                    callback(errMsg)
                }
                callback()
            } else {
                callback(errMsg)
            }
        }
        callback()
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        let state = this.state,
            digitaltrunk = state.digitaltrunk,
            params = this.props.params,
            mode = this.props.route.path,
            isEdit = (mode.indexOf('edit') === 0),
            isAdd = (mode.indexOf('add') === 0),
            headerTitle = formatMessage({id: "LANG3142"})
        
        if (isEdit) {
            headerTitle = formatMessage({
                id: "LANG642"
            }, {
                0: formatMessage({id: "LANG3143"}), 
                1: params.trunkName
            })
        }
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ headerTitle }
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel }  
                    isDisplay='display-block' 
                />
                <Spin spinning={this.state.loading}>
                    <Form>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3144" />}>
                                            {formatMessage({id: "LANG1351"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('trunk_name', {
                                        rules: [{ 
                                            required: true, 
                                            message: formatMessage({id: "LANG2150"})
                                        }, { 
                                            validator: (data, value, callback) => {
                                                Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                            }
                                        }, { 
                                            validator: (data, value, callback) => {
                                                Validator.minlength(data, value, callback, formatMessage, 2)
                                            }
                                        }, { 
                                            validator: (data, value, callback) => {
                                                let errMsg = formatMessage({id: "LANG2137"}, {0: 1, 1: formatMessage({id: "LANG1329"})})
                                                this._trunkNameIsExist(data, value, callback, errMsg)
                                            }
                                        }],
                                        initialValue: digitaltrunk.trunk_name || ""
                                    })(
                                        <Input maxLength="16" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3145" />}>
                                            <span>{formatMessage({id: "LANG3162"})}</span>
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('group_index', {
                                        rules: [{ 
                                            required: true, 
                                            message: formatMessage({id: "LANG2150"}) 
                                        }],
                                        initialValue: digitaltrunk.group_index || ""
                                    })(
                                        <Select>
                                        {
                                            state.digitalGroupList.map(function(it) {
                                                let val = it.val,
                                                    text = it.text,
                                                    disabled = it.disabled

                                                return <Option key={ val } value={ val } disabled={ disabled }>
                                                       { text ? text : val }
                                                    </Option>
                                            })
                                        }
                                        </Select>
                                    )}
                                </FormItem>                            
                            </Col>
                        </Row>
                        <div ref="div_hide_callee" className={ state.div_hide_callee_style === false ? "hidden" : "display-block" }>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        ref="div_hidecallerid"
                                        className={ state.div_hide_callee_style === false ? "hidden" : "display-block" }
                                        { ...formItemLayout }
                                        label={
                                            <Tooltip title={<FormattedHTMLMessage id="LANG3147" />}>
                                                {formatMessage({id: "LANG3146"})}
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('hidecallerid', {
                                            rules: [],
                                            valuePropName: 'checked',
                                            initialValue: digitaltrunk.hidecallerid === "yes" ? true : false
                                        })(
                                            <Checkbox />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        ref="div_keepcid"
                                        className={ state.div_hide_callee_style === false ? "hidden" : "display-block" }
                                        { ...formItemLayout }
                                        label={
                                            <Tooltip title={<FormattedHTMLMessage id="LANG2319" />}>
                                                {formatMessage({id: "LANG2318"})}
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('keepcid', {
                                            rules: [],
                                            valuePropName: 'checked',
                                            initialValue: digitaltrunk.keepcid === "yes" ? true : false
                                        })(
                                            <Checkbox />
                                        )}
                                    </FormItem>                            
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        ref="div_callerid"
                                        className={ state.div_hide_callee_style === false ? "hidden" : "display-block" }
                                        { ...formItemLayout }
                                        label={(
                                            <Tooltip title={<FormattedHTMLMessage id="LANG3389" />}>
                                                {formatMessage({id: "LANG1359"})}
                                            </Tooltip>
                                        )}>
                                        { getFieldDecorator('callerid', {
                                            rules: [{ 
                                                type: "integer", 
                                                required: true, 
                                                message: formatMessage({id: "LANG2150"}) 
                                            }],
                                            initialValue: digitaltrunk.callerid || 0
                                        })(
                                            <InputNumber maxLength="32" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        ref="div_cidname"
                                        className={ state.div_hide_callee_style === false ? "hidden" : "display-block" }
                                        { ...formItemLayout }
                                        label={(
                                            <Tooltip title={ formatMessage({id: "LANG3390"}) }>
                                                {formatMessage({id: "LANG1361"})}
                                            </Tooltip>
                                        )}>
                                        { getFieldDecorator('cidname', {
                                            rules: [{ 
                                                validator: (data, value, callback) => {
                                                    Validator.minlength(data, value, callback, formatMessage, 2)
                                                }
                                            }, { 
                                                validator: (data, value, callback) => {
                                                    Validator.alphanumeric(data, value, callback, formatMessage)
                                                }
                                            }],
                                            initialValue: digitaltrunk.cidname || ""
                                        })(
                                            <Input maxLength="64" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG2544" />}>
                                            {formatMessage({id: "LANG2543"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('auto_recording', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: digitaltrunk.auto_recording === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG1136" />}>
                                            {formatMessage({id: "LANG1135"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('faxdetect', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: digitaltrunk.faxdetect === "yes" ? true : false
                                    })(
                                        <Checkbox onChange={ this._onChangeFaxdetect }/>
                                    )}
                                </FormItem>                            
                            </Col>
                        </Row>
                        <div ref="div_detect" className={ state.div_detect_style === true ? "display" : "hidden"}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={
                                            <Tooltip title={<FormattedHTMLMessage id="LANG4380" />}>
                                                {formatMessage({id: "LANG4379"})}
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('fax_intelligent_route', {
                                            rules: [],
                                            valuePropName: 'checked',
                                            initialValue: digitaltrunk.fax_intelligent_route === "yes" ? true : false
                                        })(
                                            <Checkbox onChange={ this._onChangefaxIntelligentRoute }/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        { ...formItemLayout }
                                        label={
                                            <Tooltip title={<FormattedHTMLMessage id="LANG4382" />}>
                                                {formatMessage({id: "LANG4381"})}
                                            </Tooltip>
                                        }>
                                        { getFieldDecorator('fax_intelligent_route_destination', {
                                            rules: [],
                                            initialValue: digitaltrunk.fax_intelligent_route_destination || ""
                                        })(
                                            <Select disabled={ digitaltrunk.fax_intelligent_route === "yes" ? false : true }>
                                            {
                                                state.faxIntelligentRouteDestinationOpts.map(function(it) {
                                                    let val = it.val,
                                                        text = it.text

                                                    return <Option key={ val } value={ val }>
                                                           { text ? text : val }
                                                        </Option>
                                                })
                                            }
                                            </Select>
                                        )}
                                    </FormItem>                            
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    ref="div_pulsedial"
                                    className={ this.div_pulsedial_style === true ? "display-block" : "hidden"}
                                    { ...formItemLayout }
                                    label={
                                        <Tooltip title={<FormattedHTMLMessage id="LANG3149" />}>
                                            {formatMessage({id: "LANG3148"})}
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('pulsedial', {
                                        rules: [],
                                        valuePropName: 'checked',
                                        initialValue: digitaltrunk.pulsedial === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>                          
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </div>
        )
    }
}

DigitalTrunkItem.defaultProps = {
}

DigitalTrunkItem.propTypes = {
}

export default Form.create()(injectIntl(DigitalTrunkItem))