'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Button, Row, Col, Checkbox, Input, InputNumber, message, Popover, Select, Tabs } from 'antd'
const FormItem = Form.Item
import $ from 'jquery'
import api from "../../api/api"
import _ from 'underscore'
import UCMGUI from "../../api/ucmgui"
import DevicesList from "./devicesList"

class Devices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            zeroConfigSettings: UCMGUI.isExist.getList("getZeroConfigSettings")
        }
    }
    componentDidMount() {
        this._getAllDeviceExtensions()
    }
    componentWillUnmount() {

    }
    _getAllDeviceExtensions = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'getAllDeviceExtensions' 
            },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        getAllDeviceExtensions = res.getAllDeviceExtensions
                    // this.setState({
                    //     getAllDeviceExtensions: getAllDeviceExtensions
                    // })
                }
            }.bind(this)
        })  
    }
    _checkZeroConfigInvalidModels = () => {
        $.ajax({
            url: api.apiHost,
            method: "post",
            data: { 
                action: 'checkZeroConfigInvalidModels' 
            },
            type: 'json',
            error: function(e) {
                message.error(e.toString())
            },
            success: function(data) {
                var bool = UCMGUI.errorHandler(data, null, this.props.intl.formatMessage)

                if (bool) {
                    let res = data.response,
                        models = res.models
                    // this.setState({
                    //     models: models
                    // })
                }
            }.bind(this)
        })          
    }
    _handleChange = () => {

    }
    render() {
        const {formatMessage} = this.props.intl

        return (
            <div className="app-content-main" id="app-content-main">
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this._createSipVoipTrunk} >
                            {formatMessage({id: "LANG757"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG754"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG755"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG3866"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this._createIaxVoipTrunk} >
                            {formatMessage({id: "LANG2626"})}
                        </Button>
                        <label>{formatMessage({id: "LANG1288"}) + ":"}</label>
                        <Select 
                            style={{ width: '8%' }}
                            onChange={this._handleChange}
                            defaultValue='all'>
                            <Option value="all">{formatMessage({id: "LANG104"})}</Option>
                            <Option value="res">{formatMessage({id: "LANG1289"})}</Option>
                        </Select>
                    </div>
                    <DevicesList />
                </div>
            </div>
        )
    }
}

Devices.propTypes = {
}

export default injectIntl(Devices)