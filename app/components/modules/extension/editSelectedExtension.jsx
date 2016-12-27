'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import * as Actions from './actions/'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

class Sysinfo extends Component {
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
            <div className="app-content-main" id="app-content-main">
                {"Edit Selected Extension"}
            </div>
        )
    }
}

Sysinfo.propTypes = {
}

const mapStateToProps = (state) => ({
   
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Sysinfo))