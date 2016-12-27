'use strict'

import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Table } from 'antd'

class ReportInfo extends Component {
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

        return (
            <Table
                pagination={ false }
                columns={ infoColumns }
                dataSource={ this.props.QueueReport }
            />
        )
    }
}

module.exports = injectIntl(ReportInfo)