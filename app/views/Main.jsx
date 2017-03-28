'use strict'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../actions/'
import React from 'react'
import SideBar from './sidebar'
import Header from './header'
import Footer from './footer'
import Container from './container'
import { injectIntl} from 'react-intl'
import { Icon, Spin } from 'antd'
import menusData from './../locales/menusData.json'

let Home = React.createClass({
    render() {
        return (
            <div className="home-page">
                <div className="home-logo"><Icon type="home" /></div>
                <div className="f14">new Date()</div>
                <div className="f16">{ this.props.username }，Welcome to Grandstream.</div>
            </div>
        )
    }
})

let App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            collapse: false,
            loading: false
        }
    },
    handleCollapseChange() {
        this.setState({
            collapse: !this.state.collapse
        })
    },
    componentDidMount() {
        this.props.setSpinLoading({loading: false})
    },
    renderChild() {
        const { children } = this.props

        if (children) {
            return (
                <div>
                    { children }
                </div>
            )
        }

        return (
            <div>
                <Home username={ "hi" } />
            </div>
        )
    },
    render() {
        const { formatMessage } = this.props.intl
        const collapse = this.state.collapse
        let subMenus = menusData.subMenus
        let SideBarShow = window.location.pathname === '/setup-wizard'

        if (localStorage.getItem('role') === 'privilege_3') {
            subMenus = menusData.userPortalMenus
        }

        let containerSub = ''
        if (!SideBarShow) {
            containerSub = (
                <div className="app-container">
                    <Header />
                    <SideBar className={SideBarShow} subMenus={subMenus} collapse={this.state.collapse} onChangeCollpase={ this.handleCollapseChange } />
                    <div className="app-main">
                        <Container>
                            { this.renderChild() }
                        </Container>
                    </div>
                </div>
                )
        } else {
            containerSub = (
                <div className="app-container">
                    <Header />
                    <div className="">
                        <Container>
                            { this.renderChild() }
                        </Container>
                    </div>
                </div>
                )
        }
        
        const container = (
            <div className={ collapse ? "app-wrapper app-wrapper-collapse" : "app-wrapper" }>
                { containerSub }
                <Footer />
            </div>
        )
        let tip = this.props.spinLoading.tip
        let loading = this.props.spinLoading.loading

        return (
            <Spin spinning={loading ? loading : false} tip={tip ? tip : formatMessage({id: "LANG904"})}>{container}</Spin>
        )
    }
})

const mapStateToProps = (state) => ({
    spinLoading: state.spinLoading
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(App))