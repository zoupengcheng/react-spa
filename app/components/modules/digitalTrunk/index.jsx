'use strict'

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Table, Button, message, Modal, Menu, Dropdown, Popconfirm } from 'antd'
import { FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'
import Title from '../../../views/title'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'

const baseServerURl = api.apiHost

class VoipTrunksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voipTrunk: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            sort: {
                field: "trunk_name",
                order: "asc"
            },
            loading: false
        }
    }
    componentDidMount() {
        this._listVoipTrunk()
    }
    _showTotal = (total) => {
        const { formatMessage } = this.props.intl

        return formatMessage({ id: "LANG115" }) + total
    }
    _handleTableChange = (pagination, filters, sorter) => {
        const pager = this.state.pagination

        pager.current = pagination.current

        this.setState({
            pagination: pager,
            sorter: sorter
        })

        this._listVoipTrunk({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field,
            sord: sorter.order === "ascend" ? "asc" : "desc",
            ...filters
        })
    }
    _listVoipTrunk = (
        params = {                
            item_num: 10,
            sidx: "trunk_name",
            sord: "asc",
            page: 1 
        }) => {
        this.setState({ loading: true })

        $.ajax({
            url: baseServerURl,
            method: 'post',
            data: {
                action: 'listVoIPTrunk',
                options: "trunk_index,trunk_name,host,trunk_type,username,technology,ldap_sync_enable",
                ...params
            },
            type: 'json',
            async: true,
            success: function(res) {
                let voipTrunk = res.response.voip_trunk
                const pagination = this.state.pagination
                // Read total count from server
                pagination.total = res.response.total_item

                this.setState({
                    loading: false,
                    voipTrunk: voipTrunk,
                    pagination
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
            url: baseServerURl,
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
            url: baseServerURl,
            method: 'post',
            data: action,
            type: 'json',
            async: true,
            success: function(res) {
                let bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>)
                    let pagination = this.state.pagination,
                        sorter = this.state.sorter
                        
                    this._listVoipTrunk({
                        item_num: pagination.pageSize,
                        page: pagination.current,
                        sidx: sorter.field,
                        sord: sorter.order === "ascend" ? "asc" : "desc"
                    })
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
    _editVoipTrunk = (record) => {
        let trunkId = record.trunk_index,
            technology = record.technology,
            trunkType = record.trunk_type,
            trunkName = record.trunk_name

        browserHistory.push('/extension-trunk/voipTrunk/editVoipTrunk/' + trunkId + "/" + technology + "/" + trunkType + "/" + trunkName)
    }
    _dodTrunksList = (record) => {
        browserHistory.push('/extension-trunk/voipTrunk/dodTrunksList/' + record.trunk_index)
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
                dataIndex: 'trunk_name',
                sorter: true
            }, {
                title: formatMessage({id: "LANG623"}),
                dataIndex: 'technology',
                sorter: true
            }, {
                title: formatMessage({id: "LANG84"}),
                dataIndex: 'trunk_type',
                sorter: true
            }, {
                title: formatMessage({id: "LANG1395"}),
                dataIndex: 'host',
                sorter: true
            }, {
                title: formatMessage({id: "LANG72"}),
                dataIndex: 'username',
                sorter: true
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => {
                    let ldapCls = "sprite sprite-ldap"

                    if (record.ldap_sync_enable !== "yes") {
                        ldapCls = "sprite sprite-ldap-disabled"
                    }

                    return <span>
                        <span className="sprite sprite-edit" title={ formatMessage({ id: "LANG738"})} onClick={this._editVoipTrunk.bind(this, record)}></span>
                        <span className="sprite sprite-dod" title={ formatMessage({ id: "LANG2677"})} onClick={this._dodTrunksList.bind(this, record)}></span>
                        <Popconfirm title={
                            <FormattedHTMLMessage
                                id='LANG4471'
                                values={{
                                    0: record.trunk_name
                                }}
                            />} 
                            onConfirm={() => this._deleteTrunk(record)}>
                            <span className="sprite sprite-del" title={ formatMessage({ id: "LANG739"})} ></span>
                        </Popconfirm>
                    </span>
                } 
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

        return (
            <div className="app-content-main" id="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG3141"}) }  
                    isDisplay='hidden' 
                />
                <div className="content">
                    <div className="top-button">
                        <Button icon="plus" type="primary" size="default" onClick={ this._createSipVoipTrunk }>
                            { formatMessage({id: "LANG3142"}) }
                        </Button>
                    </div>
                    <Table
                        rowSelection={ false } 
                        columns={ columns }
                        rowKey={ record => record.trunk_index }
                        dataSource={ this.state.voipTrunk }
                        pagination={ this.state.pagination }
                        loading={ this.state.loading}
                        onChange={ this._handleTableChange }
                    />
                </div>
            </div>
        )
    }
}

VoipTrunksList.defaultProps = {
    
}

export default injectIntl(VoipTrunksList)