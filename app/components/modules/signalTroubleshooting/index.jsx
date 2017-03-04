'use strict'

import React, { Component, PropTypes } from 'react'
import { message, Tabs, Form } from 'antd'
import { FormattedMessage, injectIntl} from 'react-intl'
import $ from 'jquery'
import api from "../../api/api"
import UCMGUI from "../../api/ucmgui"
import _ from 'underscore'
import Title from '../../../views/title'

const TabPane = Tabs.TabPane

class SignalTroubleshooting extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount () {
        this._getInitData()
    }
    _getInitData = () => {
        
    }
    render() {
        const form = this.props.form
        const { formatMessage } = this.props.intl
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({
            id: "LANG584"
        }, {
            0: model_info.model_name, 
            1: formatMessage({id: "LANG5462"})
        })

        return (
            <div className="app-content-main">
                <Title 
                    headerTitle={ formatMessage({id: "LANG5462"}) }
                    isDisplay='hidden' />
                <Form className="form-contain-tab">
                    <Tabs defaultActiveKey="1">

                    </Tabs>
                </Form>
            </div>
        )
    }
}

export default Form.create()(injectIntl(SignalTroubleshooting))