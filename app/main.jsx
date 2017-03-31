'use strict'

import $ from 'jquery'
import api from "./components/api/api"
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import routes from './routes'
import { Provider } from 'react-redux'
import createStore from './store'
import { IntlProvider, FormattedMessage, addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import es from 'react-intl/locale-data/es'
import fr from 'react-intl/locale-data/fr'
import it from 'react-intl/locale-data/it'
import localeData from './locales/data.json'
addLocaleData([...en, ...zh, ...es, ...fr, ...it])
import Socketjs from './socket.js' 
import 'antd/dist/antd.less'
import './css/index'
import cookie from 'react-cookie'
const store = createStore()
import { handleResponse, handleRequest } from './components/api/handleMessage'
import actions from './actions/'
// import zc from './components/modules/zeroConfig/parser/ZCNss.jsx'

// window.zc = zc
window.jQuery = $
// window.jQuery = jQuery

const chooseLocale = () => {
    // Try full locale, try locale without region code, fallback to 'en'
    return localeData[language]

    // Render our root component into the div with id "root"
    // We select the messages to pass to IntlProvider based on the user's locale
}

// Get Basic Info
(() => {
    let countryArr = [{
            languages: "zh-CN",
            localName: "简体中文"
        }, {
            languages: "en-US",
            localName: "English"
        }]
    let countryObj
    let model_info

    $.ajax({
        url: "/locale/country2lang.json",
        dataType: "json",
        method: 'GET',
        type: 'json',
        async: false,
        success: function(res) {
            countryObj = res
        },
        error: function(e) {
            console.log(e.statusText)
        }
    })

    $.ajax({
        url: api.apiHost,
        method: 'post',
        data: { action: 'getInfo' },
        type: 'json',
        async: false,
        success: function(res) {
            if (res.status === 0) {
                let numPri
                
                model_info = res.response
                numPri = model_info.num_pri
                // modelName = model_info.model_name

                numPri = numPri ? Number(numPri) : 0
                
                model_info.num_pri = numPri

                // if (numPri <= 0) {
                //     if (modelName && modelName.toLowerCase() && modelName.toLowerCase().indexOf("ucm62") != -1) {
                //         localStorage.setItem('maxExtension', 800)
                //     } else {
                //         localStorage.setItem('maxExtension', 500)
                //     }
                // } else {
                //     localStorage.setItem('maxExtension', 2000)
                // }

                if (model_info.country) {
                    let langObj = countryObj[model_info.country.toUpperCase()]
                    let arr = []

                    if (!localStorage.getItem('locale') && langObj) {
                        localStorage.setItem('locale', langObj.languages)
                    }

                    for (let item in countryObj) {
                        if (countryObj.hasOwnProperty(item)) {
                            arr.push({
                                languages: countryObj[item].languages,
                                localName: countryObj[item].localName
                            })
                        }
                    }

                    countryArr = arr

                    // if (this.isMounted()) {
                    //     this.setState({
                    //         countryObj: countryObj,
                    //         model_info: model_info,
                    //         countryArr: arr
                    //     })
                    // }
                    // return {locale: langObj.languages}
                }

                // if (model_info.prog_version) {
                //     version = model_info.prog_version.split(".").join("") || Math.random()
                // }

                // if (model_info.num_fxs) {
                //     var length = parseInt(model_info.num_fxs),
                //         fxoPortsLength = model_info.num_fxo ? parseInt(model_info.num_fxo) : 0,
                //         i = 1

                //     for (i; i <= length; i++) {
                //         fxsPorts.push((fxoPortsLength + i) + '')
                //     }
                // }

                // for (let item in model_info) {
                //     if (model_info.hasOwnProperty(item) &&
                //         (item !== 'copyright') && (item !== 'logo')) {
                //         localStorage.setItem(item, model_info[item])
                //     }
                // }

                localStorage.setItem('countryObj', JSON.stringify(countryObj))
                localStorage.setItem('model_info', JSON.stringify(model_info))
                localStorage.setItem('countryArr', JSON.stringify(countryArr))
            }
        },
        error: function(e) {
            console.log(e.statusText)
        }
    })
})()

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them

// localStorage.setItem('locale', "en-US")
let language = localStorage.getItem("locale")

if (!language || !localeData[language]) {
    language = "en-US"
    localStorage.setItem("locale", language)
}

let currentLocaleData = chooseLocale()
window.currentLocale = language
window.currentLocaleData = currentLocaleData

const startSocket = () => {
    // make sure socket.js is supported
    if (Socketjs.isSupported()) {
        // connect to the server
        const socket = Socketjs.connect("192.168.124.151:7681")
        // const socket = Socketjs.connect(`${location.hostname}:7681`)
        window.socket = socket
        let LEAVEPAGE = "login",
            ISREFRESHPAGE = false

        window.LEAVEPAGE = LEAVEPAGE
        window.ISREFRESHPAGE = ISREFRESHPAGE
        // log messages as they arrive
        socket.receive('response', function(msg) {
            handleResponse(msg, store)
            // store.dispatch(actions.addResponse(msg))
        })
        socket.receive('request', function(msg) {
            handleRequest(msg, store)
            console.log(JSON.stringify(msg))
        })
        // log a message if we get disconnected
        socket.disconnect(function() {
          console.log('Temporarily disconnected.')
        })
        // log a message when we reconnect
        socket.reconnect(function() {
          console.log('Reconnected.')
          // whatever we return here is sent back to the server
          return 'reconnected'
        })
        // if the server disconnects, stop sending messages to it
        socket.close(function() {
          console.log('Connection closed.')
        })
    } else {
        // let the user know that socket.js is not supported
        alert('Your browser does not support WebSockets.')
    }    
}

startSocket()

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={ language } messages={ currentLocaleData }>
            <Router history={ browserHistory }>
                { routes(store.getState(), currentLocaleData) }
            </Router>
        </IntlProvider>
    </Provider>,
    document.getElementById('app-root')
)