'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { Form, Icon, Button, Table, Select } from 'antd'
import { browserHistory } from 'react-router'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'
import ExtensionList from './extensionList'
import * as Actions from './actions/'

const Option = Select.Option

class Extension extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    handleChange() {
        
    }
    createExtension() {
        browserHistory.push('/extension-trunk/extension/createExtension')
    }
    editExtension() {
        browserHistory.push('/extension-trunk/extension/editSelectedExtension')
    }
    render() {
        const {formatMessage} = this.props.intl
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG622"}) } isDisplay='hidden' />
                <div className="content">
                    <div className="top-button">
                        <Button type="primary" icon="" onClick={this.createExtension} >
                            {formatMessage({id: "LANG733"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this.editExtension}>
                            {formatMessage({id: "LANG734"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this.enterIconLoading}>
                            {formatMessage({id: "LANG735"})}
                        </Button>
                        <Button type="primary" icon="" onClick={this.enterIconLoading}>
                            {formatMessage({id: "LANG736"})}
                        </Button>
                        <Select defaultValue="import" style={{ width: 90 }} onChange={this.handleChange}>
                            <Option key="import" value="import">{formatMessage({id: "LANG2733"})}</Option>
                            <Option key="export" value="export">{formatMessage({id: "LANG2734"})}</Option>
                        </Select>
                        <Button type="primary" icon="" onClick={this.enterIconLoading}>
                            {formatMessage({id: "LANG3495"})}
                        </Button>
                    </div>
                    <ExtensionList />
                </div>
            </div>
        )
    }
}

Extension.defaultProps = {
}

export default injectIntl(Extension)