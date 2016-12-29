'use strict'

import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Table } from 'antd'

class TotalInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { formatMessage } = this.props.intl
        const infoColumns = [{
                title: formatMessage({id: "LANG135"}),
                dataIndex: 'name',
                key: 'name'
            }, {
                title: formatMessage({id: "LANG3485"}),
                dataIndex: 'value',
                key: 'value'
            }]
        const pagination = {
                total: this.props.QueueStatTotal.length,
                defaultPageSize: 5,
                pageSizeOptions: ['5', '10'],
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                    console.log('Current: ', current, '; PageSize: ', pageSize)
                },
                onChange: (current) => {
                    console.log('Current: ', current)
                }
            }

        return (
            <Table
                columns={ infoColumns }
                pagination={ pagination }
                dataSource={ this.props.QueueStatTotal }
            />
        )
    }
}

module.exports = injectIntl(TotalInfo)