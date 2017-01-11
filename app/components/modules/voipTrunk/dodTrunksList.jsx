'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Button, Row, Col, Table, Checkbox, Input, Modal, InputNumber, Popconfirm, Transfer, message, Tooltip, Select } from 'antd'
import { FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'
const FormItem = Form.Item

class DodTrunksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            record: {},
            visible: false,
            voipTrunk: [],
            dodExtList: [],
            membersArr: []
        }
    }
    componentDidMount() {
        this._listDODVoIPTrunk()
        this._getList()
    }
    _listDODVoIPTrunk = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { 
                action: 'listDODVoIPTrunk',
                trunk: this.props.params.trunkId,
                options: "number,add_extension,members,members_ldap"
            },
            type: 'json',
            async: true,
            success: function(res) {
                let dod = res.response.dod
                this.setState({
                    dod: dod
                })
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _deleteTrunk = (data) => {
        const { formatMessage } = this.props.intl

        let trunkIndex = data.trunk_index,
            technology = data.technology,
            action = {}

        if (technology.toLowerCase() === "sip") {
            action = {
                "action": "deleteSIPTrunk",
                "trunk": trunkIndex
            }
        } else {
            action = {
                "action": "deleteIAXTrunk",
                "trunk": trunkIndex
            }
        }
        message.loading(formatMessage({ id: "LANG825" }, {0: "LANG11"}), 0)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: action,
            type: 'json',
            async: true,
            success: function(res) {
                var bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>)
                    this._listDodTrunk()
                }
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _createDODTrunk = () => {
        browserHistory.push('/extension-trunk/voipTrunk/createEditDodTrunk/add')
    }
    _editDODTrunk = (record) => {
        let trunkId = record.trunk_index
        browserHistory.push('/extension-trunk/voipTrunk/createEditDodTrunk/edit' + trunkId)
    }
    _showModal(type, record) {
        const {formatMessage} = this.props.intl

        let obj = {
        },
        membersArr = []

        if (type === "add") {
            obj = {
                type: "add",
                title: formatMessage({id: "LANG5433"}),
                visible: true,
                record: {}
            }
        } else {
            let members = (record.members ? record.members.split(",") : []),
                members_ldap = (record.members_ldap ? record.members_ldap.split("|") : [])

            $.each(members, function(index, item) {
                membersArr.push(item)
            })

            $.each(members_ldap, function(index, item) {
                membersArr.push(item)
            })

            this.setState({
                membersArr: membersArr
            })

            obj = {
                type: "edit",
                title: formatMessage({id: "LANG2675"}),
                visible: true,
                record: record
            }
        }

        this.setState(obj)
    }
    _handleOk() {
        const { formatMessage } = this.props.intl
        let trunkId = this.props.params.trunkId,
            action = {}

        if (this.state.type === "add") {
            action["action"] = "addDODVoIPTrunk"
        } else if (this.state.type === "edit") {
            action["action"] = "updateDODVoIPTrunk"
        } 

        action["trunk"] = trunkId

        this.props.form.validateFieldsAndScroll((err, values) => {
            let me = this

            for (let key in values) {
                if (values.hasOwnProperty(key)) {
                    if (me.refs["div_" + key] && 
                        me.refs["div_" + key].props &&
                        ((me.refs["div_" + key].props.className &&
                        me.refs["div_" + key].props.className.indexOf("hidden") === -1) ||
                        typeof me.refs["div_" + key].props.className === "undefined")) {
                        if (!err || (err && typeof err[key] === "undefined")) {
                            action[key] = UCMGUI.transCheckboxVal(values[key])   
                        } else {
                            return
                        }
                    }
                }
            }

            console.log('Received values of form: ', values)

            message.loading(formatMessage({ id: "LANG826" }), 0)

            $.ajax({
                url: api.apiHost,
                method: "post",
                data: action,
                type: 'json',
                error: function(e) {
                    message.error(e.statusText)
                },
                success: function(data) {
                    var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                    if (bool) {
                        message.destroy()
                        message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG815" })}}></span>)
                        browserHistory.push('/extension-trunk/voipTrunk')
                    }
                }.bind(this)
            })
            this.setState({
                record: {},
                membersArr: [],
                visible: false
            })
        })
    }
    _handleCancel(e) {
        this.setState({
            record: {},
            visible: false,
            membersArr: []
        })
    }
    _handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ 
            membersArr: nextTargetKeys 
        })

        console.log('targetKeys: ', this.state.targetKeys)
        console.log('direction: ', direction)
        console.log('moveKeys: ', moveKeys)
    }
    _handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] })

        console.log('sourceSelectedKeys: ', sourceSelectedKeys)
        console.log('targetSelectedKeys: ', targetSelectedKeys)
    }
    _getList = () => {
        let dodExtList = this._transAccountVoicemailData(UCMGUI.isExist.getList("getAccountList"))

        // Only VoIP Trunks
        // if (!signalling) {
            $.ajax({
                async: false,
                type: "post",
                url: api.apiHost,
                data: {
                    "action": "getPhonebookListDnAndMembers"
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // top.dialog.dialogMessage({
                    //     type: 'error',
                    //     content: errorThrown
                    // });
                },
                success: function(data) {
                    let bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                    if (bool) {
                        let memberLDAP = data.response.extension

                        for (let i = 0; i < memberLDAP.length; i++) {
                            let phonebook = memberLDAP[i]["phonebook_dn"]

                            if (phonebook && (phonebook !== "ou=pbx,dc=pbx,dc=com")) {
                                let members = memberLDAP[i]["members"] ? memberLDAP[i]["members"].split('|') : []

                                for (let j = 0, length = members.length; j < length; j++) {
                                    let text = '',
                                        value = '',
                                        extension = members[j]

                                    if (extension) {
                                        text = extension + '(' + phonebook.split(',')[0] + ')'
                                        value = extension + '#' + phonebook

                                        dodExtList.push({
                                            'key': value,
                                            'description': 'LDAP',
                                            'title': text
                                        })
                                    }
                                }

                                this.setState({
                                    dodExtList: dodExtList
                                })
                            }
                        }
                    }
                }.bind(this)
            })
        // }

        // $.ajax({
        //     type: "post",
        //     url: api.apiHost,
        //     data: {
        //         'action': "listDODVoIPTrunk",
        //         'trunk': this.props.params.trunkId,
        //         'options': "members,members_ldap"
        //     },
        //     error: function(jqXHR, textStatus, errorThrown) {
        //     },
        //     success: function(data) {
        //         var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

        //         if (bool) {
        //             let dod = data.response.dod,
        //                 membersArr = []

        //             $.each(dod, function(index, item) {
        //                 var members = (item.members ? item.members.split(",") : []),
        //                     members_ldap = (item.members_ldap ? item.members_ldap.split("|") : [])

        //                 $.each(members, function(index, item) {
        //                     membersArr.push(item)
        //                 })

        //                 $.each(members_ldap, function(index, item) {
        //                     membersArr.push(item)
        //                 })
        //             })

        //             this.setState({
        //                 membersArr: membersArr
        //             })
        //         }
        //     }.bind(this)
        // })
    }
    _transAccountVoicemailData = (res, cb) => {
        const {formatMessage} = this.props.intl

        let arr = [],
            dodExt = []

        for (var i = 0; i < res.length; i++) {
            var obj = {},
                extension = res[i].extension,
                fullname = res[i].fullname,
                disabled = res[i].out_of_service

            obj["key"] = extension

            if (disabled === 'yes') {
                obj["title"] = extension + (fullname ? (' "' + fullname + '"') : '') + ' <' + formatMessage({id: "LANG273"}) + '>'
                obj["disable"] = true // disabled extension
            } else {
                obj["title"] = extension + (fullname ? (' "' + fullname + '"') : '')
            }

            dodExt.push(extension)

            arr.push(obj)
        }

        if (cb && typeof cb === "function") {
            cb(arr)
        }

        return arr
    }
    render() {
        const {formatMessage, formatHTMLMessage} = this.props.intl
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        const columns = [
            {
                title: formatMessage({id: "LANG2677"}),
                dataIndex: 'number'
            }, {
                title: formatMessage({id: "LANG87"}),
                dataIndex: 'members'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => (
                    <span>
                        <span className="sprite sprite-edit" onClick={this._showModal.bind(this, "edit", record)}></span>
                        <span className="" onClick={this._deleteTrunk.bind(this, record)}></span>
                        <Popconfirm title={
                            <FormattedHTMLMessage
                                id='LANG4471'
                                values={{
                                    0: record.number
                                }}
                            />} 
                        onConfirm={() => this._deleteTrunk(record)}>
                            <span className="sprite sprite-del" ></span>
                        </Popconfirm>
                    </span>
                ) 
            }
        ]
        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows)
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User'    // Column configuration not to be checked
            })
        }
        const pagination = {
            total: this.state.voipTrunk.length,
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                console.log('Current: ', current, '; PageSize: ', pageSize)
            },
            onChange(current) {
                console.log('Current: ', current)
            }
        }

        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button icon="plus" type="primary" size="default" onClick={ this._showModal.bind(this, "add") }>
                            { formatMessage({id: "LANG2676"}) }
                        </Button>
                        <Modal 
                            title={this.state.title} 
                            visible={this.state.visible}
                            onOk={this._handleOk.bind(this)} 
                            onCancel={this._handleCancel.bind(this)}
                            okText={formatMessage({id: "LANG728"})}
                            cancelText={formatMessage({id: "LANG726"})}
                        >
                            <Form tab={formatMessage({id: "LANG2217"})} key="1">
                                <FormItem
                                    ref="div_number"
                                    { ...formItemLayout }
                                    label={formatMessage({id: "LANG2680"})} >
                                    { getFieldDecorator('number', {
                                        rules: [],
                                        initialValue: this.state.record.number
                                    })(
                                        <Input maxLength="32" />
                                    ) }
                                </FormItem>
                                <FormItem
                                    ref="div_add_extension"
                                    { ...formItemLayout }
                                    label={                            
                                        <Tooltip title={<FormattedHTMLMessage id="LANG5185" />}>
                                            <span>{formatMessage({id: "LANG5184"})}</span>
                                        </Tooltip>
                                    }>
                                    { getFieldDecorator('add_extension', {
                                        rules: [],
                                        valuePropName: "checked",
                                        initialValue: this.state.record.add_extension === "yes" ? true : false
                                    })(
                                        <Checkbox />
                                    ) }
                                </FormItem>
                                <Transfer
                                    dataSource={this.state.dodExtList}
                                    titles={[formatMessage({id: "LANG2484"}), formatMessage({id: "LANG2483"})]}
                                    targetKeys={this.state.membersArr}
                                    onChange={this._handleChange}
                                    onSelectChange={this._handleSelectChange}
                                    render={item => item.title}
                                />
                            </Form>
                        </Modal>
                    </div>
                    <Table rowSelection={false} columns={columns} dataSource={this.state.dod} pagination={pagination} />
                </div>
            </div>
        )
    }
}

DodTrunksList.defaultProps = {
    
}

export default Form.create()(injectIntl(DodTrunksList))