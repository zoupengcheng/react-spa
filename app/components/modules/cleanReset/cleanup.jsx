'use strict'

import $ from 'jquery'
import _ from 'underscore'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import Title from '../../../views/title'
import Validator from "../../api/validator"

import { browserHistory } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage, injectIntl } from 'react-intl'
import { Form, Input, Button, Row, Col, Checkbox, message, Tooltip, Select, Table, Popconfirm, Tree } from 'antd'

const FormItem = Form.Item
const TreeNode = Tree.TreeNode

function generateTreeNodes(treeNode) {
    const arr = []
    const key = treeNode.props.eventKey

    for (let i = 0; i < 3; i++) {
        arr.push({ name: `leaf ${key}-${i}`, key: `${key}-${i}` })
    }

    return arr
}

function setLeaf(treeData, curKey, level) {
    const loopLeaf = (data, lev) => {
        const l = lev - 1

        data.forEach((item) => {
            if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 : curKey.indexOf(item.key) !== 0) {
                return
            }

            if (item.children) {
                loopLeaf(item.children, l)
            } else if (l < 1) {
                item.isLeaf = true
            }
        })
    }

    loopLeaf(treeData, level + 1)
}

function getNewTreeData(treeData, curKey, child, level) {
    const loop = (data) => {
        if (level < 1 || curKey.length - 3 > level * 2) return

        data.forEach((item) => {
            if (curKey.indexOf(item.key) === 0) {
                if (item.children) {
                    loop(item.children)
                } else {
                    item.children = child
                }
            }
        })
    }

    loop(treeData)
    setLeaf(treeData, curKey, level)
}

class Cleanup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            SDName: [],
            USBDiskName: [],
            treeData: [],
            accountList: [],
            accountAryObj: {},
            selectedRowKeys: [],
            extensionGroups: []
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                treeData: [
                    { name: 'pNode 01', key: '0-0' },
                    { name: 'pNode 02', key: '0-1' },
                    { name: 'pNode 03', key: '0-2', isLeaf: true }
                ]
            })
        }, 100)

        this._getMediaFile()
        this._getExtensionGroups()
    }
    componentWillUnmount() {
    }
    _delete = (record) => {
        let loadingMessage = ''
        let successMessage = ''
        const { formatMessage } = this.props.intl

        loadingMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG877" })}}></span>
        successMessage = <span dangerouslySetInnerHTML={{__html: formatMessage({ id: "LANG816" })}}></span>

        message.loading(loadingMessage)

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                "action": "deleteExtensionGroup",
                "extension_group": record.group_id
            },
            type: 'json',
            async: true,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    message.destroy()
                    message.success(successMessage)

                    this._getExtensionGroups()
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getMediaFile = () => {
        let SDName = []
        let USBDiskName = []
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            async: false,
            method: 'post',
            url: api.apiHost,
            data: {
                page: 1,
                sidx: 'd',
                sord: 'desc',
                type: 'media',
                item_num: 20000,
                action: 'listFile'
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    let obj = {}
                    let media = res.response.media || []

                    _.map(media, (data, index) => {
                        let name = data.n

                        if (name.indexOf('mmcblk') !== -1) {
                            SDName.push(name)
                        } else if (name.indexOf('sd') !== -1) {
                            USBDiskName.push(name)
                        }
                    })

                    this.setState({
                        SDName: SDName,
                        USBDiskName: USBDiskName
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getExtensionGroups = () => {
        const { formatMessage } = this.props.intl

        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: {
                action: 'listExtensionGroup',
                sidx: 'group_id',
                sord: 'asc'
            },
            type: 'json',
            async: false,
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}
                    const extensionGroups = response.extension_group || []

                    this.setState({
                        extensionGroups: extensionGroups
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _onSelect = (info) => {
        console.log('selected', info)
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        // console.log('selectedRow changed: ', selectedRows)

        this.setState({ selectedRowKeys })
    }
    _onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const treeData = [...this.state.treeData]

                getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2)

                this.setState({ treeData })

                resolve()
            }, 1000)
        })
    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        const loop = data => data.map((item) => {
            if (item.children) {
                return <TreeNode
                            key={ item.key }
                            title={ item.name }
                        >
                            { loop(item.children) }
                        </TreeNode>
            }

            return <TreeNode
                        key={ item.key }
                        title={ item.name }
                        isLeaf={ item.isLeaf }
                        disabled={ item.key === '0-0-0' }
                    />
        })

        const treeNodes = loop(this.state.treeData)

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 6 }
        }

        const columns = [{
                key: 'group_name',
                dataIndex: 'group_name',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.group_name.length - b.group_name.length
            }, {
                key: 'members',
                dataIndex: 'members',
                title: formatMessage({id: "LANG128"}),
                render: (text, record, index) => {
                    return text
                }
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
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del"></span>
                            </Popconfirm>
                        </div>
                }
            }]

        const pagination = {
                total: this.state.extensionGroups.length,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        const rowSelection = {
                onChange: this._onSelectChange,
                selectedRowKeys: this.state.selectedRowKeys
            }

        return (
            <div className="app-content-main" id="app-content-main">
                <Form>
                    <Row>
                        <Col span={ 6 }>
                            <div
                                style={{
                                    'clear': 'both',
                                    'height': '400px',
                                    'marginRight': '10px',
                                    'border': '1px solid #b8bdcc'
                                }}
                            >
                                <Tree onSelect={ this._onSelect } loadData={ this._onLoadData }>
                                    { treeNodes }
                                </Tree>
                            </div>
                        </Col>
                        <Col span={ 18 }>
                            <div className="top-button">
                                <Button
                                    icon="delete"
                                    type="primary"
                                    size='default'
                                    onClick={ this._add }
                                >
                                    { formatMessage({id: "LANG739"}) }
                                </Button>
                            </div>
                            <Table
                                rowKey="group_id"
                                columns={ columns }
                                pagination={ pagination }
                                rowSelection={ rowSelection }
                                dataSource={ this.state.extensionGroups }
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

Cleanup.propTypes = {
}

export default Form.create()(injectIntl(Cleanup))