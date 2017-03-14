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
            treeData: [],
            fileList: [],
            selectedRows: [],
            deviceNameList: [],
            selectedRowKeys: [],
            expandedTreeKeys: [],
            selectedTreeKeys: []
        }
    }
    componentDidMount() {
        this._getMediaFile()
    }
    componentWillUnmount() {
    }
    _batchDelete = () => {
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
        let treeData = []
        let fileList = []
        let directoryList = []
        let deviceNameList = []
        let defaultShowNode = []
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
                    let SDName = 0
                    let USBDiskName = 0
                    let media = res.response.media || []

                    media = _.sortBy(media, (data) => {
                        return data.n.length
                    })

                    _.map(media, (data, index) => {
                        let name = data.n

                        if (name.indexOf('mmcblk') !== -1) {
                            SDName++
                            deviceNameList.push(name)

                            treeData.push({
                                key: name,
                                name: formatMessage({id: "LANG262"}) + ' -- ' + name
                            })
                        } else if (name.indexOf('sd') !== -1) {
                            USBDiskName++
                            deviceNameList.push(name)

                            treeData.push({
                                key: name,
                                name: formatMessage({id: "LANG263"}) + ' -- ' + name
                            })
                        }
                    })

                    if (deviceNameList.length) {
                        // Get All Directory
                        let responseData = this._getFileList(deviceNameList[0])

                        if (responseData.fileList.length) {
                            fileList = responseData.fileList
                        }

                        if (responseData.directoryList.length) {
                            treeData[0].children = responseData.directoryList
                        }

                        if (!SDName) {
                            treeData.push({
                                key: 'nosd',
                                isLeaf: true,
                                name: formatMessage({id: "LANG998"})
                            })
                        } else if (!USBDiskName) {
                            treeData.push({
                                key: 'nousb',
                                isLeaf: true,
                                name: formatMessage({id: "LANG1000"})
                            })
                        }

                        defaultShowNode = [deviceNameList[0]]
                    } else {
                        treeData = [{
                            key: 'nosd',
                            isLeaf: true,
                            name: formatMessage({id: "LANG998"})
                        }, {
                            key: 'nousb',
                            isLeaf: true,
                            name: formatMessage({id: "LANG1000"})
                        }]

                        fileList = []

                        defaultShowNode = []
                    }

                    this.setState({
                        treeData: treeData,
                        fileList: fileList,
                        deviceNameList: deviceNameList,
                        expandedTreeKeys: defaultShowNode,
                        selectedTreeKeys: defaultShowNode
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })
    }
    _getFileList = (path) => {
        let fileList = []
        let directoryList = []
        const { formatMessage } = this.props.intl

        $.ajax({
            type: 'json',
            async: false,
            method: 'post',
            url: api.apiHost,
            data: {
                sidx: 'd',
                data: path,
                sord: 'desc',
                type: 'media',
                action: 'listFile',
                filter: JSON.stringify({
                    'list_dir': 1,
                    'list_file': 1
                })
            },
            success: function(res) {
                const bool = UCMGUI.errorHandler(res, null, this.props.intl.formatMessage)

                if (bool) {
                    const response = res.response || {}

                    fileList = response.media || []

                    _.map(fileList, (data, index) => {
                        if (data.t === 'directory') {
                            directoryList.push({
                                name: data.n,
                                key: path + '/' + data.n
                            })
                        }
                    })
                }
            }.bind(this),
            error: function(e) {
                message.error(e.statusText)
            }
        })

        return {
                fileList: fileList,
                directoryList: directoryList
            }
    }
    _onExpand = (expandedKeys) => {
        console.log('expanded', expandedKeys)

        this.setState({
            expandedTreeKeys: expandedKeys
        })
    }
    _onSelect = (selectedKeys) => {
        console.log('selected', selectedKeys)

        this.setState({
            selectedTreeKeys: selectedKeys
        })
    }
    _onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRows changed: ', selectedRows)
        console.log('selectedRowKeys changed: ', selectedRowKeys)

        this.setState({
            selectedRows: selectedRows,
            selectedRowKeys: selectedRowKeys
        })
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

        const columns = [{
                key: 'n',
                dataIndex: 'n',
                title: formatMessage({id: "LANG135"}),
                sorter: (a, b) => a.n.length - b.n.length
            }, {
                key: 't',
                dataIndex: 't',
                title: formatMessage({id: "LANG1950"}),
                sorter: (a, b) => a.t.length - b.t.length,
                render: (text, record, index) => {
                    let type

                    if (text === 'directory') {
                        type = <span>{ formatMessage({id: 'LANG5146'}) }</span>
                    } else if (text === 'file') {
                        type = <span>{ formatMessage({id: 'LANG3652'}) }</span>
                    } else {
                        type = <span>{ formatMessage({id: 'LANG2403'}) }</span>
                    }

                    return type
                }
            }, {
                key: 'd',
                dataIndex: 'd',
                title: formatMessage({id: "LANG203"}),
                sorter: (a, b) => a.d.length - b.d.length
            }, {
                key: 's',
                dataIndex: 's',
                title: formatMessage({id: "LANG2257"}),
                sorter: (a, b) => a.s - b.s,
                render: (text, record, index) => {
                    return UCMGUI.tranSize(text)
                }
            }, {
                key: 'options',
                dataIndex: 'options',
                title: formatMessage({id: "LANG74"}),
                render: (text, record, index) => {
                    let del
                    let filename = record.n

                    if (filename && filename.indexOf('PBX_') === 0) {
                        del = <span
                                    className="sprite sprite-del-disabled"
                                ></span>
                    } else {
                        del = <Popconfirm
                                title={ formatMessage({id: "LANG841"}) }
                                okText={ formatMessage({id: "LANG727"}) }
                                cancelText={ formatMessage({id: "LANG726"}) }
                                onConfirm={ this._delete.bind(this, record) }
                            >
                                <span className="sprite sprite-del"></span>
                            </Popconfirm>
                    }

                    return del
                }
            }]

        const pagination = {
                total: this.state.fileList.length,
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
                                    'height': '514px',
                                    'overflowY': 'auto',
                                    'marginRight': '10px',
                                    'border': '1px solid #b8bdcc'
                                }}
                            >
                                <Tree
                                    onExpand={ this._onExpand }
                                    onSelect={ this._onSelect }
                                    loadData={ this._onLoadData }
                                    expandedKeys={ this.state.expandedTreeKeys }
                                    selectedKeys={ this.state.selectedTreeKeys }
                                >
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
                                    onClick={ this._batchDelete }
                                    disabled={ !this.state.selectedRows.length }
                                >
                                    { formatMessage({id: "LANG739"}) }
                                </Button>
                            </div>
                            <Table
                                rowKey="n"
                                columns={ columns }
                                pagination={ pagination }
                                rowSelection={ rowSelection }
                                dataSource={ this.state.fileList }
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