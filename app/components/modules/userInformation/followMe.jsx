import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../../actions/'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import { Table, Card, Row, Col, Progress, Button } from 'antd'
import _ from 'underscore'

class FollowMe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    _jumpFollowMe = () => {
        browserHistory.push('/user-personal-data/userFollowMe')
    }
    render() {
        const {formatMessage} = this.props.intl

        let followMeData = this.props.followMeData || []

        return (
            <div className="followMe">
                <Card
                    title={ formatMessage({id: "LANG568"}) }
                    bordered={ true }
                >
                    <Row align="middle" justify="center" type="flex" style={{ marginBottom: 10 }}>
                        
                    </Row>
                </Card>
                <Card
                    title={ formatMessage({id: "LANG568"}) }
                    bordered={ true }
                >
                    <Row align="middle" justify="center" type="flex">
                        <Col className="gutter-row" style={{ marginTop: 30 }}>
                            <span className="sprite sprite-no-data"></span>
                        </Col>
                    </Row>
                    <Row align="middle" justify="center" type="flex" style={{ marginTop: 20, marginBottom: 20 }}>
                        <Col className="gutter-row">
                            { formatMessage({id: "LANG129"}, {0: formatMessage({id: "LANG568"})}) }
                        </Col>
                    </Row>
                    <Row align="middle" justify="center" type="flex">
                        <Col className="gutter-row">
                            <Button type="primary" onClick={ this._jumpFollowMe }>
                                { formatMessage({id: "LANG560"}) }
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default injectIntl(FollowMe)