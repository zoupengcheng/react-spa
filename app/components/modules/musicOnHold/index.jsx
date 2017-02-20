'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Modal, Button, Row, Col, Checkbox, Input, InputNumber, message, Tooltip, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import _ from 'underscore'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import MusicOnHoldList from './musicOnHoldList'
import Validator from "../../api/validator"
import Title from '../../../views/title'

const host = api.apiHost

let mohsuggest = "",
    mohinterpret = "",
    siptosSettings = {}

class MusicOnHold extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classData: [],
            mohList: [],
            mohClass: "",
            extensionList: [],
            extensionLen: 0,
            mohNameList: [],
            moh: {},
            delStyle: "sprite sprite-del"
        }
    }
    componentDidMount() {
        this._getNameList("first")
        this._getMohInfo()
        let extension = UCMGUI.isExist.getList("getAccountList")

        this.setState({
            extensionList: this._transData(extension),
            extensionLen: extension.length
        })
    }
    componentWillUnmount() {

    }
    _transData = (res, cb) => {
        const { formatMessage } = this.props.intl

        let arr = []

        for (let i = 0; i < res.length; i++) {
            let obj = {},
                extension = res[i].extension,
                fullname = res[i].fullname,
                disabled = res[i].out_of_service

            obj["val"] = extension

            if (disabled === 'yes') {
                obj["class"] = 'disabledExtOrTrunk'
                obj["text"] = extension + (fullname ? ' "' + fullname + '"' : '') + ' <' + formatMessage({ id: 'LANG273'}) + '>'
                obj["locale"] = '' + extension + (fullname ? ' "' + fullname + '"' : '') + ' <'
                obj["disable"] = true // disabled extension
            } else {
                obj["text"] = extension + (fullname ? ' "' + fullname + '"' : '')
            }

            arr.push(obj)
        }

        if (cb && typeof cb === "function") {
            cb(arr)
        }

        return arr
    }
    _getMohInfo() {
        const { formatMessage } = this.props.intl

        let action = {
            "action": "getMoh",
            "moh": this.state.mohClass ? this.state.mohClass.split("guimohdir_")[1] : "default"
        }

        $.ajax({
            type: "post",
            url: api.apiHost,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    let moh = data.response.moh

                    this.setState({
                        moh: moh
                    })
                }
            }.bind(this)
        })
    }
    _getNameList(flag) {
        const { form } = this.props

        let mohNameList = UCMGUI.isExist.getList("getMohNameList")

        let opts = this._transClassData(mohNameList)

        this.setState({
            mohNameList: mohNameList,
            classData: opts
        })

        if (flag === "first") {
            form.setFieldsValue({
                moh_classes: "default"
            })

            // bindListEvent()
        }
        this._getMohList() 
        // else if (flag == "del") {
        //     createTable()

        //     bindListEvent()
        // } else {
        //     $("#moh_classes").val("guimohdir_" + flag).trigger("change")
        // }

        // if ($('#moh_classes :selected').text().toLowerCase() == "default") {
        //     $("#mohclass_deleteButton").attr('disabled', true).addClass('disabled')
        // } else {
        //     $("#mohclass_deleteButton").attr('disabled', false).removeClass('disabled')
        // }

        // initUpload()
    }
    _transClassData = (res) => {
        let arr = []

        for (let i = 0; i < res.length; i++) {
            let obj = {}

            if (res[i] === "default") {
                obj["text"] = res[i]
                obj["val"] = "default"
            } else {
                obj["text"] = res[i]
                obj["val"] = "guimohdir_" + res[i]
            }

            arr.push(obj)
        }

        return arr
    }
    _onChange = (value) => {
        // let value = $('#moh_classes :selected').text().toLowerCase()

        // if ((value == "default") || (value == "ringbacktone_default")) {
        //     $("#mohclass_deleteButton").attr('disabled', true).addClass('disabled')
        // } else {
        //     $("#mohclass_deleteButton").attr('disabled', false).removeClass('disabled')
        // }

        // createTable()
        const me = this

        setTimeout(() => {
            me._getMohList()
        }, 200)

        // bindListEvent()

        // initUpload()
    }
    _getMohList = () => {
        const { form } = this.props

        let mohClass = form.getFieldValue("moh_classes")

        if (mohClass === "default") {
            mohClass = ""
        }

        $.ajax({
            url: host,
            data: {
                action: "listFile",
                type: "moh",
                filter: JSON.stringify({
                    "list_dir": 0,
                    "list_file": 1,
                    "file_suffix": ["mp3", "wav", "gsm", "ulaw", "alaw"]
                }),
                data: mohClass,
                sidx: "n",
                sord: "asc"
            },
            type: 'POST',
            dataType: 'json',
            async: true,
            error: function(e) {
                message.error(e.statusText)
            },
            success: function(res) {
                let moh = res.response.moh || []

                for (let i = 0; i <= moh.length - 1; i++) {
                    moh[i]["key"] = i
                }
                if (mohClass === "") {
                    this.setState({
                        mohList: moh,
                        mohClass: mohClass,
                        delStyle: "sprite sprite-del sprite-del-disabled"
                    })
                } else {
                    this.setState({
                        mohList: moh,
                        mohClass: mohClass
                    })
                }
            }.bind(this)
        })
        this._getMohInfo()
    }
    _generateDownloadAllName = () => {
        let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
            today = new Date(),
            year = today.getFullYear(),
            // month = months[today.getMonth()],
            month = (today.getMonth() + 1),
            day = UCMGUI.addZero(today.getDate()),
            hour = UCMGUI.addZero(today.getHours()),
            minute = UCMGUI.addZero(today.getMinutes()),
            seconds = UCMGUI.addZero(today.getSeconds())

        // if (mode == "downloadAll") {
        //     downloadAllName = "prompt_" + year + month + day + "_" + hour + minute + seconds
        // } else if (mode == "downloadAllMOH") {
        //    downloadAllName = "moh_" + year + month + day + "_" + hour + minute + seconds
        // }

        return "moh_" + year + month + day + "_" + hour + minute + seconds
    }
    _showModal = (type) => {
        if (type !== "downloadAllMOH") {
            this.setState({
                visible: true,
                type: type
            })
        } else {
            this.setState({
                visible: true,
                type: type,
                downloadAllName: this._generateDownloadAllName()
            })
        }
    }
    _add = () => {
        this._showModal("add")
    }
    _addMOH = () => {
        const { formatMessage } = this.props.intl

        // if (mode == "add") {
        //     action["moh_name"] = mohNameLowerCase

        // } else {
        //     action["moh"] = mohName;

        //     this._updateOrAddMohInfo(action)
        // }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err.moh_name || this.state.type === "edit") {
                this.setState({
                    visible: false
                })
                console.log('Received values of form: ', values)

                let action = {}

                action["sort"] = values.sort
                action["action"] = this.state.type === "add" ? 'addMoh' : "updateMoh"

                if (this.state.type === "add") {
                    action["moh_name"] = values.moh_name

                    let mkDirAction = {
                        action: "mkDir",
                        type: "moh",
                        data: "guimohdir_" + values.moh_name
                    }

                    $.ajax({
                        type: "post",
                        url: host,
                        data: mkDirAction,
                        error: function(jqXHR, textStatus, errorThrown) {
                        },
                        success: function(data) {
                            const bool = UCMGUI.errorHandler(data, null, formatMessage)

                            if (bool) {
                                this._updateOrAddMohInfo(action)
                            }
                        }.bind(this)
                    })
                } else {
                    action["moh"] = values.moh_name
                    this._updateOrAddMohInfo(action)
                }
            }
        })        
    }
    _updateOrAddMohInfo(action) {
        const { formatMessage } = this.props.intl

        $.ajax({
            type: "post",
            url: host,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(data) {
                const bool = UCMGUI.errorHandler(data, null, formatMessage)

                if (bool) {
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                    this._getNameList()
                }
            }.bind(this)
        })
    }
    _download = () => {
        this._showModal("downloadAllMOH")        
    }
    _downloadFile = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        let downloadAllName = form.getFieldValue("downloadAll_name") + '.tar',
            encodeFileName = encodeURIComponent(downloadAllName)

        message.loading(formatMessage({id: "LANG5391"}))

        $.ajax({
            type: "post",
            url: host,
            data: {
                'action': 'packFile',
                'type': "moh",
                'data': downloadAllName
            },
            error: function(jqXHR, textStatus, errorThrown) {
                message.destroy()
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, formatMessage)

                if (bool) {
                    window.open("/cgi?action=downloadFile&type=moh" + "&data=" + encodeFileName, '_self')

                    message.destroy()
                }
            }
        })
    }
    _edit = () => {
        this._showModal("edit") 
    }
    _delete = () => {
        const { formatMessage } = this.props.intl
        const { form } = this.props

        let mohClass = form.getFieldValue("moh_classes")

        if (mohClass === "default") {
            mohClass = ""
            return
        }

        let action = {
            action: "removeFile",
            type: "moh",
            data: mohClass
        }

        let mohName = mohClass.split("guimohdir_")[1]

        $.ajax({
            type: "post",
            url: host,
            data: action,
            error: function(jqXHR, textStatus, errorThrown) {
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, formatMessage)

                if (bool) {
                    $.ajax({
                        type: "post",
                        url: host,
                        data: {
                            "action": "deleteMoh",
                            "moh": mohName
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                        },
                        success: function(res) {
                            const bool = UCMGUI.errorHandler(res, null, formatMessage)

                            if (bool) {
                                message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>)

                                this._getNameList()
                                // judgeIfMohDel(mohName)

                                // getNameList("del")
                            }
                        }.bind(this)
                    })
                }
            }.bind(this)
        })
    }
    _handleOk = () => {
        let type = this.state.type

        if (type === "downloadAllMOH") {
            this.setState({
                visible: false
            })
            this._downloadFile()
        } else if (type === "add" || type === "edit") {
            this._addMOH()
        }
    }
    _handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    _renderModalTitle = () => {
        const { formatMessage } = this.props.intl
        let type = this.state.type

        if (type === "add") {
            return formatMessage({id: "LANG774"})
        } else if (type === "downloadAllMOH") {
            return formatMessage({
                id: "LANG741"
            }, {
                0: formatMessage({id: "LANG27"})
            })
        } else {
            return formatMessage({id: "LANG2505"})
        }
    }
    _mohNameIsExist = (rule, value, callback, errMsg) => {
        if (_.find(this.state.mohNameList, function (num) { 
            return num === value
        })) {
            callback(errMsg)
        }
        callback()
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))

        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG671"})
        })

        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG671"}) } isDisplay='hidden' />
                <div className="content">
                    <div className="top-button">
                        <Button 
                            type="primary" 
                            icon="create" 
                            size='default' 
                            onClick={ this._add }>
                            { formatMessage({id: "LANG774" }) }
                        </Button>
                        <Button 
                            type="primary" 
                            icon="download" 
                            size='default' 
                            onClick={ this._download }>
                            { formatMessage({id: "LANG741"}, {0: formatMessage({id: "LANG27"})}) }
                        </Button>
                    </div>
                    <Form>
                        <Row>
                            <Col span={16}>
                                <FormItem
                                    id="moh_classes"
                                    { ...formItemLayout }
                                    label={formatMessage({id: "LANG1603"})}>
                                    { getFieldDecorator('moh_classes', {
                                        rules: [],
                                        initialValue: this.state.classData[0] ? this.state.classData[0].val : "default"
                                    })(
                                        <Select style={{ width: '60%', marginRight: 8 }} onSelect={this._onChange} >
                                            {
                                               this.state.classData.map(function(it) {
                                                const val = it.val
                                                const text = it.text

                                                return <Option key={ val } value={ val }>
                                                       { text ? text : val }
                                                    </Option>
                                                })
                                           }
                                        </Select>
                                    )}
                                    <span className="sprite sprite-edit" style={{position: "relative", top: "5px"}} onClick={this._edit}></span>
                                    <span className={ this.state.delStyle } style={{position: "relative", top: "5px"}} onClick={this._delete}></span>
                                </FormItem>
                            </Col>
                            <Col span={8}> 
                            </Col>
                        </Row>
                    </Form>
                    <MusicOnHoldList 
                        mohList={ this.state.mohList } 
                        mohClass={ this.state.mohClass } 
                        getMohList={ this._getMohList }
                        extensionList = { this.state.extensionList } 
                    />
                    <Modal 
                        title={ this._renderModalTitle() }
                        visible={this.state.visible}
                        onOk={this._handleOk} 
                        onCancel={this._handleCancel}
                        okText={this.state.type !== "downloadAllMOH" ? formatMessage({id: "LANG728"}) : formatMessage({id: "LANG759"})}
                        cancelText={formatMessage({id: "LANG726"})}>
                        <Form>
                            <div ref="add_edit_content" className={ this.state.type !== "downloadAllMOH" ? "display-block" : "hidden" }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={(
                                        <Tooltip title={ formatMessage({id: "LANG1602"}) }>
                                            {formatMessage({id: "LANG135"})}
                                        </Tooltip>
                                    )}>
                                    { getFieldDecorator('moh_name', {
                                        rules: [{ 
                                            required: true, 
                                            message: formatMessage({id: "LANG2150"})
                                        }, { 
                                            validator: (data, value, callback) => {
                                                Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                            }
                                        }, { 
                                            validator: (data, value, callback) => {
                                                let errMsg = formatMessage({
                                                    id: "LANG270"
                                                }, {
                                                    0: formatMessage({id: "LANG1603"})
                                                })
                                                this._mohNameIsExist(data, value, callback, errMsg)
                                            }
                                        }],
                                        initialValue: this.state.type === "add" ? "" : (this.state.mohClass === "" ? "default" : this.state.mohClass.split("guimohdir_")[1])
                                    })(
                                        <Input minLength="2" maxLength="20" disabled={ this.state.type === "add" ? false : true } />
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
                                        initialValue: this.state.type === "add" ? "random" : this.state.moh.sort
                                    })(
                                        <Select>
                                            <Option value='random'>{formatMessage({id: "LANG2410"})}</Option>
                                            <Option value='alpha'>{formatMessage({id: "LANG2411"})}</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                            <div ref="downloadAll_content" className={ this.state.type === "downloadAllMOH" ? "display-block" : "hidden" }>
                                <FormItem
                                    { ...formItemLayout }
                                    label={formatMessage({id: "LANG572"})}>
                                    { getFieldDecorator('downloadAll_name', {
                                        rules: [{ 
                                            required: true, 
                                            message: formatMessage({id: "LANG2150"})
                                        }, { 
                                            validator: (data, value, callback) => {
                                                Validator.letterDigitUndHyphen(data, value, callback, formatMessage)
                                            }
                                        }],
                                        initialValue: this.state.downloadAllName
                                    })(
                                        <Input maxLength="32" />
                                    )}
                                </FormItem>
                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}

MusicOnHold.propTypes = {
}

export default Form.create()(injectIntl(MusicOnHold))