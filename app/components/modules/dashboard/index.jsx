'use strict'

import React, { Component, PropTypes } from 'react'
import {Row, Col } from 'antd'

import EquipmentCapacity from './equipmentCapacity'
import ResourceUsage from './resourceUsage'
import DiskCapacity from './diskCapacity'
import PBXStatus from './pbxStatus'
import InterfaceStatus from './interfaceStatus'
import Trunks from './trunks'

import '../../../css/dashboard'

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

export default Dashboard
