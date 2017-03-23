import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions/'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import { Table, Card, Row, Col, Progress } from 'antd'
import _ from 'underscore'

class ConferenceSchedule extends Component {
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

        let gutter = 20,
            push = 0
            
        return (
            <div className="pbx-status">
                <Card title="PBX Status" bordered={true}>
                    voicemail                
                </Card>
            </div>
        )
    }
}

export default injectIntl(ConferenceSchedule)