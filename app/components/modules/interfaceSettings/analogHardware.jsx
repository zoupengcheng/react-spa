'use strict'

import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import { Form, Row, Col, Icon, message, Button } from 'antd'
const FormItem = Form.Item

class AnalogHardware extends Component {
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

        return (
            <div className="content">
                <div className="top-button">
                    <Button icon="settings" type="primary" size="default">
                        { formatMessage({id: "LANG542"}) }
                    </Button>
                </div>
            </div>
        )
    }
}

module.exports = Form.create()(injectIntl(AnalogHardware))