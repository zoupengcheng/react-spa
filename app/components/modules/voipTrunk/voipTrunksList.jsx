'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Table, Button, message, Modal, Menu, Dropdown, Popconfirm } from 'antd'
import { FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'

class VoipTrunksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voipTrunk: []
        }
    }
    componentDidMount() {
        this._listVoipTrunk()
    }
    _listVoipTrunk = () => {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { 
                action: 'listVoIPTrunk',
                options: "trunk_index,trunk_name,host,trunk_type,username,technology,ldap_sync_enable,trunks.out_of_service"
            },
            type: 'json',
            async: true,
            success: function(res) {
                let voipTrunk = res.response.voip_trunk
                this.setState({
                    voipTrunk: voipTrunk
                })
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _delAstdb = (trunk) => {
        let action = {
            action: "DBDel",
            Family: "TRUNK_" + trunk + "/DOD"
        }

        $.ajax({
            type: "post",
            url: api.apiHost,
            data: action,
            async: false
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
                    this._listVoipTrunk()
                    this._delAstdb(trunkIndex)
                }
            }.bind(this),
            error: function(e) {
                console.log(e.statusText)
            }
        })
    }
    _createSipVoipTrunk = () => {
        browserHistory.push('/extension-trunk/voipTrunk/createVoipTrunk/addSip')
    }
    _createIaxVoipTrunk = () => {
        browserHistory.push('/extension-trunk/voipTrunk/createVoipTrunk/addIax')
    }
    _editVoipTrunk = (record) => {
        let trunkId = record.trunk_index,
            technology = record.technology,
            trunkType = record.trunk_type,
            trunkName = record.trunk_name

        browserHistory.push('/extension-trunk/voipTrunk/editVoipTrunk/' + trunkId + "/" + technology + "/" + trunkType + "/" + trunkName)
    }
    _dodTrunksList = () => {
        browserHistory.push('/extension-trunk/voipTrunk/dodTrunksList')
    }
    _syncLdap = () => {
        // browserHistory.push('/extension-trunk/voipTrunk/dodTrunksList')
    }
    render() {
        const {formatMessage, formatHTMLMessage} = this.props.intl

        const menu = (
          <Menu>
            <Menu.Item>
              <span onClick={this._createSipVoipTrunk} >{formatMessage({id: "LANG2908"})}</span>
            </Menu.Item>
            <Menu.Item>
              <span onClick={this._createIaxVoipTrunk} >{formatMessage({id: "LANG2909"})}</span>
            </Menu.Item>
          </Menu>
        )
        const columns = [
            {
                title: formatMessage({id: "LANG1382"}),
                dataIndex: 'trunk_name'
            }, {
                title: formatMessage({id: "LANG273"}),
                dataIndex: 'out_of_service',
                sorter: (a, b) => a.age - b.age
            }, {
                title: formatMessage({id: "LANG623"}),
                dataIndex: 'technology'
            }, {
                title: formatMessage({id: "LANG84"}),
                dataIndex: 'trunk_type'
            }, {
                title: formatMessage({id: "LANG1395"}),
                dataIndex: 'host'
            }, {
                title: formatMessage({id: "LANG72"}),
                dataIndex: 'username'
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => (
                    <span>
                        <span className="sprite sprite-edit" onClick={this._editVoipTrunk.bind(this, record)}></span>
                        <span className="" onClick={this._dodTrunksList.bind(this, record)}>DOD</span>
                        <span className="" onClick={this._syncLdap.bind(this, record)}>LDAP</span>
                        <Popconfirm title={
                            <FormattedHTMLMessage
                                id='LANG4471'
                                values={{
                                    0: record.trunk_name
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
            <div className="content">
                <div className="top-button">
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="#">
                        Create Voip Trunk<Icon type="down" />
                        </a>
                    </Dropdown>
                    {/* <Button type="primary" icon="" onClick={this._deleteVoipTrunk} >
                        {formatMessage({id: "LANG739"})}
                    </Button> */}
                </div>
                <Table rowSelection={false} columns={columns} dataSource={this.state.voipTrunk} pagination={pagination} />
            </div>
        )
    }
}

VoipTrunksList.defaultProps = {
    
}

export default injectIntl(VoipTrunksList)