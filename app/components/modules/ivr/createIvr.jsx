'use strict'

import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import Title from '../../../views/title'

class CreateTrunksAnalog extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    onChange(activeKey) {
        if (activeKey === "1") {

        } else {            
            
        }
    }
    render() {
        const {formatMessage} = this.props.intl
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Title headerTitle={ formatMessage({id: "LANG762"}) } isDisplay='display-block' />
                CreateTrunksAnalog
            </div>
        )
    }
}

CreateTrunksAnalog.propTypes = {
}

export default injectIntl(CreateTrunksAnalog)