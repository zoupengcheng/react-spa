'use strict'

import Trunks from './trunks'
import {Row, Col } from 'antd'
import '../../../css/dashboard'
import PBXStatus from './pbxStatus'
import DiskCapacity from './diskCapacity'
import ResourceUsage from './resourceUsage'
import InterfaceStatus from './interfaceStatus'
import EquipmentCapacity from './equipmentCapacity'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG5261"})
        })
        return (
            <div className="dashboard">
                <div className="app-content-main" id="app-content-main">
                        <Row gutter={16}>
                            <Col className="gutter-row" sm={{ span: 12}} md={{ span: 9}} lg={{ span: 9}}>
                                <EquipmentCapacity />
                            </Col>
                            <Col className="gutter-row" sm={{ span: 12}} md={{ span: 10}} lg={{ span: 10}}>
                                <ResourceUsage />
                            </Col>                    
                            <Col className="gutter-row" sm={{ span: 12}} md={{ span: 5}} lg={{ span: 5}}>
                                <DiskCapacity />
                            </Col>
                            <Col className="gutter-row" sm={{ span: 12}} md={{ span: 9}} lg={{ span: 9}}>
                                <PBXStatus />
                            </Col>
                            <Col className="gutter-row" sm={{ span: 12}} md={{ span: 7}} lg={{ span: 7}}>
                                <InterfaceStatus />
                            </Col>
                            <Col className="gutter-row" sm={{ span: 12}} md={{ span: 8}} lg={{ span: 8}}>
                                <Trunks />
                            </Col>
                        </Row>
                </div>
            </div>
        )
    }
}

export default injectIntl(Dashboard)
