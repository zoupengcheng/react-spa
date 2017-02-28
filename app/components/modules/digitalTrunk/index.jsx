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

class DigitalTrunksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            digitalTrunk: [],
            pagination: {
                showTotal: this._showTotal,
                showSizeChanger: true,
                showQuickJumper: true
            },
            sorter: {
                field: "trunk_name",
                order: "asc"
            },
            loading: false
        }
    }
    componentDidMount() {
        this._listDigitalTrunk()
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

        this._listDigitalTrunk({
            item_num: pagination.pageSize,
            page: pagination.current,
            sidx: sorter.field,
            sord: sorter.order === "ascend" ? "asc" : "desc",
            ...filters
        })
    }
    _listDigitalTrunk = (
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
                action: 'listDigitalTrunk',
                options: "trunk_name,type,trunk_index,span,channel,out_of_service",
                ...params
            },
            type: 'json',
            async: true,
            success: function(res) {
                let digitalTrunk = res.response.digital_trunks
                const pagination = this.state.pagination
                // Read total count from server
                pagination.total = res.response.total_item

                this.setState({
                    loading: false,
                    digitalTrunk: digitalTrunk,
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
            action = {}

        action = {
                "action": "deleteDigitalTrunk",
                "trunk": trunkIndex
        }

        message.loading(formatMessage({ id: "LANG825" }, {0: "LANG11"}), 0)

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
                    message.success(<span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>)
                    let pagination = this.state.pagination,
                        sorter = this.state.sorter
                        
                    this._listDigitalTrunk({
                        item_num: pagination.pageSize,
                        page: pagination.current,
                        sidx: sorter.field,
                        sord: sorter.order === "ascend" ? "asc" : "desc"
                    })
                    this._delAstdb(trunkIndex)
                }
            }.bind(this)
        })
    }
    _createDigitalTrunk = () => {
        browserHistory.push('/extension-trunk/digitalTrunk/add')
    }
    _editDigitalTrunk = (record) => {
        let trunkId = record.trunk_index,
            trunkType = record.type,
            trunkName = record.trunk_name

        browserHistory.push('/extension-trunk/digitalTrunk/edit/' + trunkId + "/" + trunkType + "/" + trunkName)
    }
    _dodTrunksList = (record) => {
        let signalling = this._transSignallingType(record.type)
        browserHistory.push('/extension-trunk/voipTrunk/dodTrunksList/' + record.trunk_index + "/" + signalling)
    }
    _transSignallingType = (type) => {
        if (!type || !type.contains) {
            return false
        }

        let result

        if (type.contains('NET') || type.contains('CPE')) {
            result = 'PRI'
        } else if (type.contains('SS7')) {
            result = 'SS7'
        } else if (type.contains('MFC/R2')) {
            result = 'MFC/R2'
        }

        return result
    }
    render() {
        const {formatMessage, formatHTMLMessage} = this.props.intl

        const menu = (
          <Menu>
            <Menu.Item>
              <span onClick={this._createDigitalTrunk} >{formatMessage({id: "LANG2908"})}</span>
            </Menu.Item>
            <Menu.Item>
              <span onClick={this._createIaxDigitalTrunk} >{formatMessage({id: "LANG2909"})}</span>
            </Menu.Item>
          </Menu>
        )
        const columns = [
            {
                title: formatMessage({id: "LANG3141"}),
                dataIndex: 'trunk_name',
                sorter: true
            }, {
                title: formatMessage({id: "LANG1486"}),
                dataIndex: 'type',
                sorter: true
            }, {
                title: formatMessage({id: "LANG2986"}),
                dataIndex: 'channel',
                sorter: true
            }, { 
                title: formatMessage({id: "LANG74"}), 
                dataIndex: '', 
                key: 'x', 
                render: (text, record, index) => {
                    return <span>
                        <span className="sprite sprite-edit" title={ formatMessage({ id: "LANG738"})} onClick={this._editDigitalTrunk.bind(this, record)}></span>
                        <span className="sprite sprite-dod" title={ formatMessage({ id: "LANG2677"})} onClick={this._dodTrunksList.bind(this, record)}></span>
                        <Popconfirm title={
                            <FormattedHTMLMessage
                                id='LANG818'
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
                        <Button icon="plus" type="primary" size="default" onClick={ this._createDigitalTrunk }>
                            { formatMessage({id: "LANG3142"}) }
                        </Button>
                    </div>
                    <Table
                        rowSelection={ false } 
                        columns={ columns }
                        rowKey={ record => record.trunk_index }
                        dataSource={ this.state.digitalTrunk }
                        pagination={ this.state.pagination }
                        loading={ this.state.loading}
                        onChange={ this._handleTableChange }
                    />
                </div>
            </div>
        )
    }
}

DigitalTrunksList.defaultProps = {
    
}

export default injectIntl(DigitalTrunksList)