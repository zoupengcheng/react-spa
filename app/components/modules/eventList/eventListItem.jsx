'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Modal, Button, Row, Col, Checkbox, message, Tooltip, Select, Tabs, Spin, Transfer } from 'antd'
import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import Validator from "../../api/validator"
import Title from '../../../views/title'
import UCMGUI from "../../api/ucmgui"

const FormItem = Form.Item
const Option = Select.Option
const baseServerURl = api.apiHost

class EventListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            firstLoad: true,
            eventlist: {},
            localeExtList: [],
            remoteExtList: [],
            curentLocaleMembersArr: [],
            curentRemoteMembersArr: [],
            unknownMembersArr: []
        }
    }
    componentDidMount() {
        const form = this.props.form 
        let mode = this.props.route.path,
            params = this.props.params

        this._initForm()
        if (mode.indexOf('edit') === 0) {
            this._getEventlistInfo()
        }
    }
    componentWillUnmount() {
    }
    _initForm = () => {
        const { formatMessage } = this.props.intl

        let locationState = this.props.location.state,
            arr = [],
            extgroupList = locationState.extgroupList,
            eventlistExtList = locationState.eventlistExtList,
            phonebookDnArr = locationState.phonebookDnArr

        for (let i = 0; i < extgroupList.length; i++) {
            let obj = {}
            obj["key"] = extgroupList[i]["group_id"]
            obj["title"] = formatMessage({ id: "LANG2714" }) + "--" + extgroupList[i]["group_name"]
            arr.push(obj)
        }

        eventlistExtList = eventlistExtList.concat(arr)

        this.setState({
            localeExtList: eventlistExtList,
            remoteExtList: phonebookDnArr
        })
    }
    _getEventlistInfo = () => {
        const { formatMessage } = this.props.intl

        let locationState = this.props.location.state,
            record = locationState.record,
            action = {
            "action": "getEventList",
            "eventlist": record.uri
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
                    let eventlist = data.response.eventlist
                    let localExtension = eventlist.local_extension ? eventlist.local_extension : ""
                    let remoteExtension = eventlist.remote_extension ? eventlist.remote_extension : ""
                    let specialExtension = eventlist.special_extension ? eventlist.special_extension : ""
                    let localMembersArr = localExtension ? localExtension.split(",") : []
                    let remoteMembersArr = remoteExtension ? remoteExtension.split(",") : []
                    let unknownMembersArr = specialExtension ? specialExtension.split(",") : []
                    let eventlistExt = locationState.eventlistExt,
                        phonebookExtArr = locationState.phonebookExtArr,
                        phonebookExtObj = locationState.phonebookExtObj,
                        tmpEventlistExt = [],
                        tmpRemoteMembersArr = []

                    let remoteRightphonebookExt = []

                    _.map(remoteMembersArr, function(item, index) {
                        let phonebookExtObjItem = phonebookExtObj[item]

                        if (phonebookExtObjItem) {
                            remoteRightphonebookExt.push(phonebookExtObjItem.key)
                        } else {
                            let itemMatch = item ? item.split(":")[1] : ""
                            if (itemMatch) {
                                unknownMembersArr.push(itemMatch)
                            }
                        }
                    })

                    this.setState({
                        curentLocaleMembersArr: localMembersArr,
                        curentRemoteMembersArr: remoteRightphonebookExt,
                        unknownMembersArr: unknownMembersArr,
                        eventlist: eventlist
                    })
                }
            }.bind(this)
        })
    } 
    _handleSubmit = (e) => {
        const { formatMessage } = this.props.intl
        const form = this.props.form 

        let state = this.state,
            locationState = this.props.location.state,
            action = {},
            members = [],
            mode = this.props.route.path,
            isEdit = (mode.indexOf('edit') === 0),
            isAdd = (mode.indexOf('add') === 0)

        this.props.form.validateFieldsAndScroll((err, values) => {
            let me = this
            let refs = this.refs

            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    let divKey = refs["div_" + key]

                    if (!err || (err && typeof err[key] === "undefined")) {
                        action[key] = values[key]  
                    } else {
                        return
                    }
                }
            }

            delete action.edit_ext
            delete action.uri

            message.loading(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG904" })}}></span>, 0)

            let extensionBaseIndex = 1

            action["action"] = (isEdit ? "updateEventList" : "addEventList")
            action[(isEdit ? "eventlist" : "uri")] = form.getFieldValue("uri")

            state.curentLocaleMembersArr.map(function (it) {
                members.push({
                    local_extension: it
                })
            })

            state.curentRemoteMembersArr.map(function (it) {
                let obj = {
                        remote_extension: it
                    },
                    isFind = _.find(locationState.eventlistExt, function(num) { 
                        return it === num 
                    })

                if (typeof isFind !== "undefined") {
                    obj = {
                        local_extension: it
                    }
                }
                members.push(obj)
            })

            let editExtVal = form.getFieldValue("edit_ext")

            if (editExtVal) {
                let editExtValArr = editExtVal ? editExtVal.split(",") : [],
                    phonebookExtArr = locationState.phonebookExtArr,
                    phonebookExtObj = locationState.phonebookExtObj

                for (let i = 0; i < editExtValArr.length; i++) {
                    let val = editExtValArr[i],
                        obj = {
                            special_extension: val
                        }

                    let isFind = _.find(locationState.eventlistExt, function(num) { 
                        return val === num 
                    })

                    if (typeof isFind !== "undefined") {
                        obj = {
                            local_extension: val
                        }

                        members.push(obj)

                        continue
                    }

                    for (let j = 0; j < phonebookExtArr.length; j++) {
                        let index = phonebookExtArr[j],
                            match = index.match(/\d+$/),
                            ext = match ? match[0] : ""

                        if (val === ext) {
                            obj = {
                                remote_extension: phonebookExtObj[index].attr + ":" + val
                            }
                        }
                    }

                    members.push(obj)
                }
            }

            if (members.length !== 0) {
                action["members"] = JSON.stringify(members)
            }
            this._updateOrAddEventlistInfo(action)
        })
    }
    _updateOrAddEventlistInfo = (action) => {
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
                    browserHistory.push('/call-features/eventList')
                }
            }.bind(this)
        })
    }
    _extensionIsExist = (rule, value, callback, errMsg) => {
        const form = this.props.form 

        let mode = this.props.route.path,
            locationState = this.props.location.state,
            isEdit = (mode.indexOf('edit') === 0),
            isAdd = (mode.indexOf('add') === 0)

        let uri = form.getFieldValue("uri"),
            isFind = _.find(locationState.numberList, function(num) { 
                if (isEdit) {
                    return (num === value && locationState && locationState.record && locationState.record.uri !== value)
                } else if (isAdd) {
                    return num === value
                }
            })
        if (typeof isFind !== "undefined") {
            callback(errMsg)
        }
        callback()
    }
    _uriIsExist = (rule, value, callback, errMsg) => {
        let mode = this.props.route.path,
            locationState = this.props.location.state,
            isEdit = (mode.indexOf('edit') === 0),
            isAdd = (mode.indexOf('add') === 0)

        if (value && value.length >= 2) {
            if (_.find(this.props.location.state.uriList, function (num) { 
                if (isEdit) {
                    return (num === value && locationState && locationState.record && locationState.record.uri !== value)
                } else if (isAdd) {
                    return num === value
                }
            })) {
                callback(errMsg)
            }
            callback()
        }
        callback()
    }
    _handleLocaleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ 
            curentLocaleMembersArr: nextTargetKeys 
        })
    }
    _handleLocaleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
    }
    _handleRemoteChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ 
            curentRemoteMembersArr: nextTargetKeys 
        })
    }
    _handleRemoteSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        const { formatMessage } = this.props.intl
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 }
        }
        const customFormItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 4 }
        }

        let state = this.state,
            eventlist = state.eventlist,
            locationState = this.props.location.state,
            record = locationState.record,
            mode = this.props.route.path,
            isEdit = (mode.indexOf('edit') === 0)
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ isEdit ? formatMessage({
                            id: "LANG222"
                        }, {
                            0: formatMessage({id: "LANG2474"}), 
                            1: locationState.uri
                        }) : formatMessage({id: "LANG2475"})
                    }
                    onSubmit={ this._handleSubmit.bind(this) } 
                    onCancel={ this._handleCancel }  
                    isDisplay='display-block' 
                />
                <Spin spinning={state.loading}>
                    <Form>
                        <FormItem
                            { ...customFormItemLayout }
                            label={
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2481" /> }>
                                    { formatMessage({id: "LANG2478"}) }
                                </Tooltip>
                            }>
                            { getFieldDecorator('uri', {
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
                                                let errMsg = formatMessage({id: "LANG2527"})
                                                this._extensionIsExist(data, value, callback, errMsg)
                                            }
                                        }, { 
                                            validator: (data, value, callback) => {
                                                let errMsg = formatMessage({id: "LANG2173"})
                                                this._uriIsExist(data, value, callback, errMsg)
                                            }
                                        }],
                                initialValue: record ? record.uri : ""
                            })(
                                <Input maxLength="20" />
                            ) }
                        </FormItem>
                        <FormItem
                            { ...customFormItemLayout }
                            label={
                                <Tooltip title={<FormattedHTMLMessage id="LANG5464" />}>
                                    {formatMessage({id: "LANG5463"})}
                                </Tooltip>
                            }>
                            { getFieldDecorator('event', {
                                rules: [],
                                initialValue: eventlist["event"] || "dialog"
                            })(
                                <Select disabled={ isEdit ? true : false }>
                                    <Option value="dialog">{ "Dialog" }</Option>
                                    <Option value="presence">{ "Presence" }</Option>
                                </Select>
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={
                                <Tooltip title={<FormattedHTMLMessage id="LANG2530" />}>
                                    { formatMessage({id: "LANG2479"}) }
                                </Tooltip>
                            }>
                            <Transfer
                                dataSource={ state.localeExtList }
                                titles={[formatMessage({id: "LANG2701"}), formatMessage({id: "LANG2702"})]}
                                targetKeys={ state.curentLocaleMembersArr }
                                onChange={ this._handleLocaleChange }
                                onSelectChange={ this._handleLocaleSelectChange }
                                render={item => item.title}
                            />
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2531" /> }>
                                    <span>{ formatMessage({id: "LANG2480"}) }</span>
                                </Tooltip>
                            )}>
                            <Transfer
                                dataSource={ state.remoteExtList }
                                titles={ [formatMessage({id: "LANG2484"}), formatMessage({id: "LANG2483"})] }
                                targetKeys={ state.curentRemoteMembersArr }
                                onChange={ this._handleRemoteChange }
                                onSelectChange={ this._handleRemoteSelectChange }
                                render={item => item.title}
                            />
                        </FormItem>
                        <FormItem
                            { ...customFormItemLayout }
                            label={(
                                <Tooltip title={ <FormattedHTMLMessage id="LANG2486" /> }>
                                    <span>{ formatMessage({id: "LANG2485"}) }</span>
                                </Tooltip>
                            )}>
                            { getFieldDecorator('edit_ext', {
                                rules: [],
                                initialValue: state.unknownMembersArr ? state.unknownMembersArr.join(",") : ""
                            })(
                                <Input type="textarea" rows={4} />
                            ) }
                        </FormItem>                             
                    </Form>
                </Spin>
            </div>
        )
    }
}

EventListItem.defaultProps = {
}

EventListItem.propTypes = {
}

export default Form.create()(injectIntl(EventListItem))