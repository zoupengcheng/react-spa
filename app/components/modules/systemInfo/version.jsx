'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import {injectIntl} from 'react-intl'
import { Form, Row, Col, Icon, Input, Popover, message } from 'antd'
import * as Actions from './actions/getNetworkInformation'
const FormItem = Form.Item

class Version extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    convertToTime(second) {
        const {formatMessage} = this.props.intl
        let days,
            vtime = ""

        if (!isNaN(second)) {
            // return (new Date).clearTime().addSeconds(second).toString('HH:mm:ss');
            var time = ''

            if (second >= 24 * 3600) {
                days = parseInt(second / (24 * 3600))
                time += days + formatMessage({id: "LANG2392"}) + " "
                second %= (24 * 3600)
            }

            if (second >= 3600) {
                var tmp = parseInt(second / 3600)

                time += (((tmp < 10) ? "0" + tmp : tmp) + ":")
                vtime += (((tmp < 10) ? "0" + tmp : tmp) + ":")
                second %= 3600
            } else {
                time += "00:"
                vtime += "00:"
            }

            if (second >= 60) {
                let tmp = parseInt(second / 60)

                time += (((tmp < 10) ? "0" + tmp : tmp) + ":")
                vtime += (((tmp < 10) ? "0" + tmp : tmp) + ":")
                second %= 60
            } else {
                time += "00:"
                vtime += "00:"
            }

            if (second > 0) {
                let tmp = parseInt(second)

                time += (tmp < 10) ? "0" + tmp : tmp
                vtime += (tmp < 10) ? "0" + tmp : tmp
            } else {
                time += "00"
                vtime += "00"
            }

            if (days) {
                return formatMessage({id: "LANG2406"}, { 0: days, 1: vtime })
            } else {
                return vtime
            }
        } else {
            return second
        }
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    render() {
        const {formatMessage} = this.props.intl
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 14 }
        }
        let systemGeneralStatus = this.props.systemGeneralStatus
        let systemStatus = this.props.systemStatus

        if (systemGeneralStatus === undefined) {
            systemGeneralStatus = {}
        }

        if (systemStatus === undefined) {
            systemStatus = {}
        }
        const model_info = JSON.parse(localStorage.getItem('model_info'))
        document.title = formatMessage({id: "LANG584"}, {0: model_info.model_name, 1: formatMessage({id: "LANG586"})})
        
        return (
            <div className="app-content-main" id="app-content-main">
                <Form horizontal>
                    <div class="section-title">{formatMessage({id: "LANG586"})}</div>
                    <Row>
                        <FormItem
                            {...formItemLayout}
                            label = {formatMessage({id: "LANG144"})}
                        >
                            <div className="content" ref="product-model">
                                {systemGeneralStatus["product-model"]}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={formatMessage({id: "LANG145"})}
                        >
                            <div className="content" ref="part-number">
                                {systemStatus["part-number"]}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={formatMessage({id: "LANG146"})}
                        >
                            <div className="content" ref="system-time">
                                {systemStatus["system-time"]}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={formatMessage({id: "LANG147"})}
                        >
                            <div className="content" ref="up-time">
                                {this.convertToTime(systemStatus["up-time"])}
                            </div>
                        </FormItem>
                        <div style={{display: "none"}}>
                            <FormItem
                                {...formItemLayout}
                                label={formatMessage({id: "LANG148"})}
                            >
                                <div className="content" ref="idle-time">
                                    {this.convertToTime(systemStatus["idle-time"])}
                                </div>
                            </FormItem>
                        </div>
                    </Row>
                    <div class="section-title">{formatMessage({id: "LANG588"})}</div>
                    <Row>
                        <FormItem
                            {...formItemLayout}
                            label = {formatMessage({id: "LANG149"})}
                        >
                            <div className="content" ref="boot-version">
                                {systemGeneralStatus["boot-version"]}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={formatMessage({id: "LANG150"})}
                        >
                            <div className="content" ref="base-version">
                                {systemGeneralStatus["base-version"]}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={formatMessage({id: "LANG4482"})}
                        >
                            <div className="content" ref="lang-version">
                               {systemGeneralStatus["lang-version"]} 
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={formatMessage({id: "LANG152"})}
                        >
                            <div className="content" ref="prog-version">
                                {systemGeneralStatus["prog-version"]}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={formatMessage({id: "LANG153"})}
                        >
                            <div className="content" ref="rcvr-version">
                                {systemGeneralStatus["rcvr-version"]}
                            </div>
                        </FormItem>
                    </Row>
                </Form>
            </div>
        )
    }
}

Version.defaultProps = {
    systemGeneralStatus: PropTypes.object.isRequired,
    systemStatus: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
   systemGeneralStatus: state.systemGeneralStatus,
   systemStatus: state.systemStatus
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(injectIntl(Version)))