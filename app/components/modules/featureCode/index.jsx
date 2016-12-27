'use strict'

import React, { Component, PropTypes } from 'react'
import { Form, Select, Button, Row, Col, Input, Popover, Tabs } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import FeatureMap from './FeatureMap'
import CallForward from './CallForward'
import FeatureMisc from './FeatureMisc'
import FeatureCodes from './FeatureCodes'
import Title from '../../../views/title'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

class FeatureCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount () {

    }
    render() {
        const { formatMessage } = this.props.intl
        const { getFieldDecorator } = this.props.form

        return (
            <div className="app-content-main">
                <Title headerTitle="Feature Code" isDisplay='display-block' /> 
                <Tabs type="card">
                    <TabPane tab={formatMessage({id: "LANG612"})} key="1">
                        <FeatureMap />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG611"})} key="2">
                        <CallForward />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG613"})} key="3">
                        <FeatureMisc />
                    </TabPane>
                    <TabPane tab={formatMessage({id: "LANG610"})} key="4">
                        <FeatureCodes />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

FeatureCode.propTypes = {}
FeatureCode.defaultProps = {}

module.exports = Form.create()(injectIntl(FeatureCode))