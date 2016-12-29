'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Popover, Select, Tabs } from 'antd'
const FormItem = Form.Item
import _ from 'underscore'

class Globalpolicy extends Component {
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
        const {formatMessage} = this.props.intl
        let sipMiscSettings = this.props.dataSource

        return (
            <div className="app-content-main" id="app-content-main">
                {"Globalpolicy"}
            </div>
        )
    }
}

Globalpolicy.propTypes = {
}

export default injectIntl(Globalpolicy)