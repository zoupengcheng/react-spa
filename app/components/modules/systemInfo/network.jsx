'use strict'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React, { Component, PropTypes } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import { Form, Row, Col, Icon, Popover, message } from 'antd'
import * as Actions from './actions/getNetworkInformation'
import _ from 'underscore'
const FormItem = Form.Item
import $ from 'jquery'
import api from "../../api/api"

class Network extends Component {
    constructor(props) {
        super(props)
        this.state = {
            VPNTitle: "VPN",
            VPN1Title: "WebRTC VPN"
        }
    }
    componentDidMount() {
        const {formatMessage} = this.props.intl

        let networkInformation = this.props.networkInformation,
            vpn = networkInformation.vpn || {},
            vpn1 = networkInformation.vpn1 || {}

        let hasVPN = !_.isEmpty(vpn),
            hasWebRTCVPN = !_.isEmpty(vpn1)

            if (hasVPN || hasWebRTCVPN) {
                let content = ""

                if (hasVPN && hasWebRTCVPN) {
                    content = formatMessage({id: "LANG4133"}, { 0: "VPN && WebRTC VPN" })
                } else if (hasVPN) {
                    content = formatMessage({id: "LANG4133"}, { 0: "VPN" })
                } else {
                    content = formatMessage({id: "LANG4133"}, { 0: "WebRTC VPN" })                   
                }

                message.loading(content, 30)
                if (hasVPN) {
                    this.checkVPNConnect()
                }

                if (hasWebRTCVPN) {
                    this.checkWebRTCVPNConnect()
                }
            }    
    }
    componentWillUnmount() {

    }
    convertToMAC(mac) {
        if (mac) {
            var macArr = mac.split('')
            return (mac[0] + mac[1] + ":" + mac[2] + mac[3] + ":" + mac[4] + mac[5] + ":" + mac[6] + mac[7] + ":" + mac[8] + mac[9] + ":" + mac[10] + mac[11])
        }
    }
    isUndefined(val) {
        return _.isUndefined(val) ? "hidden" : "display-block"
    }
    isEmpty(val) {
        return _.isEmpty(val) ? "hidden" : "display-block"
    }
    checkVPNConnect() {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'checkVPNConnect' },
            type: 'json',
            async: true,
            success: function(res) {
                const {formatMessage} = this.props.intl
                let data = res

                if (data.status === 0) {
                    message.destroy()
                    message.success("VPN: " + formatMessage({id: "LANG1302"}))
                    
                    this.setState({
                        VPNTitle: (<div style={{marginLeft: "10px", color: "green"}} dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG1302"})}} />)
                    })
                } else {
                    message.destroy()
                    message.success("WebRTC VPN: " + formatMessage({id: "LANG4441"}))
                    
                    this.setState({
                        VPNTitle: (<div style={{marginLeft: "10px", color: "#ef8700"}} dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4441"})}} />)
                    })
                }
            }.bind(this),
            error: function(e) {
                console.log(e.toString())
            }
        })
    }
    checkWebRTCVPNConnect() {
        $.ajax({
            url: api.apiHost,
            method: 'post',
            data: { action: 'checkWebRTCVPNConnect' },
            type: 'json',
            async: true,
            success: function(res) {
                const {formatMessage} = this.props.intl
                let data = res

                if (data.status === 0) {
                    message.destroy()
                    message.success("WebRTC VPN: " + formatMessage({id: "LANG1302"}))
                    
                    this.setState({
                        VPN1Title: (<div style={{marginLeft: "10px", color: "green"}} dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG1302"})}} />)
                    })
                } else {
                    message.destroy()
                    message.success("WebRTC VPN: " + formatMessage({id: "LANG4441"}))
                    
                    this.setState({
                        VPN1Title: (<div style={{marginLeft: "10px", color: "#ef8700"}} dangerouslySetInnerHTML={{__html: formatMessage({id: "LANG4441"})}} />)
                    })
                }
            }.bind(this),
            error: function(e) {
                console.log(e.toString())
            }
        })
    }
    render() {
        const {formatMessage} = this.props.intl
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 14 }
        }

        let networkInformation = this.props.networkInformation,
            wan = networkInformation.wan || {},
            lan = networkInformation.lan || {},
            lan1 = networkInformation.lan1 || {},
            lan2 = networkInformation.lan2 || {},
            vpn = networkInformation.vpn || {},
            vpn1 = networkInformation.vpn1 || {},
            hdlc1 = networkInformation.hdlc1 || {}

        return (
            <div className="app-content-main" id="app-content-main">
                <Form horizontal={true}>
                    <div ref="wan" className={this.isEmpty(wan)}>
                        <div class="section-title">{formatMessage({id: "LANG49"})}</div>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label = {formatMessage({id: "LANG154"})}
                            >
                                <div className="content" ref="wan_mac">
                                    {this.convertToMAC(wan["mac"])}
                                </div>
                            </FormItem>
                            <div className={this.isUndefined(wan["ip"])}>                                
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5195"})}
                                >
                                    <div className="content" ref="wan_ip">
                                        {wan["ip"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(wan["ipv6"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5130"})}
                                >
                                    <div className="content" ref="wan_ipv6">
                                        {wan["ipv6"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(wan["ipv6_link"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5131"})}
                                >
                                    <div className="content" ref="wan_ipv6_link">
                                        {wan["ipv6_link"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(wan["gateway"])}>
                            <FormItem
                                {...formItemLayout}
                                label={formatMessage({id: "LANG156"})}
                            >
                                <div className="content" ref="wan_gateway">
                                    {wan["gateway"]}
                                </div>
                            </FormItem>
                            </div>
                            <div className={this.isUndefined(wan["mask"])}>
                            <FormItem
                                {...formItemLayout}
                                label={formatMessage({id: "LANG157"})}
                            >
                                <div className="content" ref="wan_mask">
                                    {wan["mask"]}
                                </div>
                            </FormItem>
                            </div>
                            <div className={this.isUndefined(wan["dns"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG579"})}
                                >
                                    <div className="content" ref="wan_dns">
                                        {wan["dns"]}
                                    </div>
                                </FormItem>
                            </div>
                        </Row>
                    </div>
                    <div ref="lan" className={this.isEmpty(lan)}>
                        <div class="section-title">{formatMessage({id: "LANG50"})}</div>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label = {formatMessage({id: "LANG154"})}
                            >
                                <div className="content" ref="lan_mac">
                                    {this.convertToMAC(lan["mac"])}
                                </div>
                            </FormItem>
                            <div className={this.isUndefined(lan["ipv6"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5130"})}
                                >
                                    <div className="content" ref="lan_ipv6">
                                        {lan["ipv6"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan["ipv6_link"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5131"})}
                                >
                                    <div className="content" ref="lan_ipv6_link">
                                        {lan["ipv6_link"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan["gateway"])}>
                            <FormItem
                                {...formItemLayout}
                                label={formatMessage({id: "LANG156"})}
                            >
                                <div className="content" ref="lan_gateway">
                                    {lan["gateway"]}
                                </div>
                            </FormItem>
                            </div>
                            <div className={this.isUndefined(lan["mask"])}>
                            <FormItem
                                {...formItemLayout}
                                label={formatMessage({id: "LANG157"})}
                            >
                                <div className="content" ref="lan_mask">
                                    {lan["mask"]}
                                </div>
                            </FormItem>
                            </div>
                            <div className={this.isUndefined(lan["dns"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG579"})}
                                >
                                    <div className="content" ref="lan_dns">
                                        {lan["dns"]}
                                    </div>
                                </FormItem>
                            </div>
                        </Row>
                    </div>
                    <div ref="lan1" className={this.isEmpty(lan1)}>
                        <div class="section-title">{"LAN 1"}</div>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label = {formatMessage({id: "LANG154"})}
                            >
                                <div className="content" ref="lan1_mac">
                                    {this.convertToMAC(lan1["mac"])}
                                </div>
                            </FormItem>
                            <div className={this.isUndefined(lan1["ip"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5195"})}
                                >
                                    <div className="content" ref="lan1_ip">
                                        {lan1["ip"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan1["ipv6"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5130"})}
                                >
                                    <div className="content" ref="lan1_ipv6">
                                        {lan1["ipv6"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan1["ipv6_link"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5131"})}
                                >
                                    <div className="content" ref="lan1_ipv6_link">
                                        {lan1["ipv6_link"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan1["gateway"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG156"})}
                                >
                                    <div className="content" ref="lan1_gateway">
                                        {lan1["gateway"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan1["mask"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG157"})}
                                >
                                    <div className="content" ref="lan1_mask">
                                        {lan1["mask"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan1["dns"])}>
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG579"})}
                                >
                                    <div className="content" ref="lan1_dns">
                                        {lan1["dns"]}
                                    </div>
                                </FormItem>
                            </div>
                        </Row>
                    </div>
                    <div ref="lan2" className={this.isEmpty(lan2)}>
                        <div class="section-title">{formatMessage({id: "LANG586"})}</div>
                        <Row>
                            <FormItem
                                {...formItemLayout}
                                label = {formatMessage({id: "LANG154"})}
                            >
                                <div className="content" ref="lan2_mac">
                                    {this.convertToMAC(lan2["mac"])}
                                </div>
                            </FormItem>
                            <div className={this.isUndefined(lan2["ip"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5195"})}
                                >
                                    <div className="content" ref="lan2_ip">
                                        {lan2["ip"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan2["ipv6"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG146"})}
                                >
                                    <div className="content" ref="lan2_ipv6">
                                        {lan2["ipv6"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan2["ipv6_link"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5131"})}
                                >
                                    <div className="content" ref="lan2_ipv6_link">
                                        {lan2["ipv6_link"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(lan2["gateway"])}> 
                            <FormItem
                                {...formItemLayout}
                                label={formatMessage({id: "LANG156"})}
                            >
                                <div className="content" ref="lan2_gateway">
                                    {lan2["gateway"]}
                                </div>
                            </FormItem>
                            </div>
                            <div className={this.isUndefined(lan2["mask"])}> 
                            <FormItem
                                {...formItemLayout}
                                label={formatMessage({id: "LANG157"})}
                            >
                                <div className="content" ref="lan2_mask">
                                    {lan2["mask"]}
                                </div>
                            </FormItem>
                            </div>
                            <div className={this.isUndefined(lan2["dns"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG579"})}
                                >
                                    <div className="content" ref="lan2_dns">
                                        {lan2["dns"]}
                                    </div>
                                </FormItem>
                            </div>
                        </Row>
                    </div>
                    <div ref="vpn" className={this.isEmpty(vpn)}>
                        <div ref="VPNTitle" class="section-title">{this.state.VPNTitle}</div>
                        <Row>
                            <div className={this.isUndefined(vpn["ip"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5195"})}
                                >
                                    <div className="content" ref="vpn_ip">
                                        {vpn["ip"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn["route"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG550"})}
                                >
                                    <div className="content" ref="vpn_route">
                                        {vpn["route"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn["mask"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG157"})}
                                >
                                    <div className="content" ref="vpn_mask">
                                        {vpn["mask"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn["ptp"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG4009"})}
                                >
                                    <div className="content" ref="vpn_ptp">
                                        {vpn["ptp"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn["dns"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG579"})}
                                >
                                    <div className="content" ref="LANG579">
                                        {vpn["dns"]}
                                    </div>
                                </FormItem>
                            </div>
                        </Row>
                    </div>
                    <div ref="vpn1" className={this.isEmpty(vpn1)}>
                        <div ref="VPN1Title" class="section-title">{this.state.VPN1Title}</div>
                        <Row>
                            <div className={this.isUndefined(vpn1["ip"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5195"})}
                                >
                                    <div className="content" ref="vpn1_ip">
                                        {vpn1["ip"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn1["route"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG550"})}
                                >
                                    <div className="content" ref="vpn1_route">
                                        {vpn1["route"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn1["mask"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG157"})}
                                >
                                    <div className="content" ref="vpn1_mask">
                                        {vpn1["mask"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn1["ptp"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG4009"})}
                                >
                                    <div className="content" ref="vpn1_ptp">
                                        {vpn1["ptp"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(vpn1["dns"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG579"})}
                                >
                                    <div className="content" ref="vpn1_dns">
                                        {vpn1["dns"]}
                                    </div>
                                </FormItem>
                            </div>
                        </Row>
                    </div>
                    <div ref="hdlc1" className={this.isEmpty(hdlc1)}>
                        <div class="section-title">{formatMessage({id: "LANG3572"})}</div>
                        <Row>
                            <div className={this.isUndefined(hdlc1["ip"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG5195"})}
                                >
                                    <div className="content" ref="hdlc1_ip">
                                        {hdlc1["ip"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(hdlc1["gateway"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG156"})}
                                >
                                    <div className="content" ref="hdlc1_gateway">
                                        {hdlc1["gateway"]}
                                    </div>
                                </FormItem>
                            </div>
                             <div className={this.isUndefined(hdlc1["mask"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG157"})}
                                >
                                    <div className="content" ref="hdlc1_mask">
                                        {hdlc1["mask"]}
                                    </div>
                                </FormItem>
                            </div>
                            <div className={this.isUndefined(hdlc1["dns"])}> 
                                <FormItem
                                    {...formItemLayout}
                                    label={formatMessage({id: "LANG579"})}
                                >
                                    <div className="content" ref="hdlc1_dns">
                                        {hdlc1["dns"]}
                                    </div>
                                </FormItem>
                            </div>
                        </Row>
                    </div>
                </Form>
            </div>
        )
    }
}

Network.propTypes = {
  networkInformation: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
   networkInformation: state.systemInfo
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(injectIntl(Network)))

