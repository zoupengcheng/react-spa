export const GET_STORAGEUSAGE = 'GET_STORAGEUSAGE'
export const GET_RESOURCEUSAGE = 'GET_RESOURCEUSAGE'
export const DIFF_RESOURCEUSAGE = 'DIFF_RESOURCEUSAGE'
export const GET_PBXSTATUS = 'GET_PBXSTATUS'
export const LISTAllTRUNK = 'LISTAllTRUNK'
export const GET_INTERFACESTATUS = 'GET_INTERFACESTATUS'

import $ from 'jquery'
import api from "../components/api/api"

export const getStorageUsage = () => (dispatch) => {
    $.ajax({
        url: api.apiHost,
        method: 'post',
        data: { 
            action: 'getStorageUsage' 
        },
        type: 'json',
        async: true,
        success: function(res) {
            let storageUsage = res.response
            let storageUsageData = storageUsage.body

            if (storageUsageData) {
                let cfgObj = {
                        space: {},
                        inode: {}
                    },
                    dataObj = {
                        space: {},
                        inode: {}
                    },
                    sdaObj = {
                        space: {
                            usage: 0,
                            total: 0
                        }
                    },
                    usbObj = {
                        space: {
                            usage: 0,
                            total: 0
                        }
                    }

                for (var temp in storageUsageData) {
                    if (storageUsageData.hasOwnProperty(temp)) {
                        let storageUsageDataIndex = storageUsageData[temp]

                        for (var i = storageUsageDataIndex.length - 1; i >= 0; i--) {
                            if (temp === "disk-avail") {
                                    if (storageUsageDataIndex[i].diskname === "cfg") {
                                        cfgObj.space["avail"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname === "data") {
                                        dataObj.space["avail"] = storageUsageDataIndex[i].value
                                    } 
                                    if (storageUsageDataIndex[i].diskname.indexOf("sda") >= 0) {
                                        usbObj.space["avail"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname.indexOf("mmcblk") >= 0) {
                                        sdaObj.space["avail"] = storageUsageDataIndex[i].value
                                    }   
                                }
                                if (temp === "disk-total") {
                                    if (storageUsageDataIndex[i].diskname === "cfg") {
                                        cfgObj.space["total"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname === "data") {
                                        dataObj.space["total"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname.indexOf("sda") >= 0) {
                                        usbObj.space["total"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname.indexOf("mmcblk") >= 0) {
                                        sdaObj.space["total"] = storageUsageDataIndex[i].value
                                    }     
                                }
                                if (temp === "disk-usage") {
                                    if (storageUsageDataIndex[i].diskname === "cfg") {
                                        cfgObj.space["usage"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname === "data") {
                                        dataObj.space["usage"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname.indexOf("sda") >= 0) {
                                        usbObj.space["usage"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname.indexOf("mmcblk") >= 0) {
                                        sdaObj.space["usage"] = storageUsageDataIndex[i].value
                                    }    
                                }
                                if (temp === "inode-avail") {
                                    if (storageUsageDataIndex[i].diskname === "cfg") {
                                        cfgObj.inode["avail"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname === "data") {
                                        dataObj.inode["avail"] = storageUsageDataIndex[i].value
                                    }   
                                }
                                if (temp === "inode-total") {
                                    if (storageUsageDataIndex[i].diskname === "cfg") {
                                        cfgObj.inode["total"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname === "data") {
                                        dataObj.inode["total"] = storageUsageDataIndex[i].value
                                    }   
                                }
                                if (temp === "inode-usage") {
                                    if (storageUsageDataIndex[i].diskname === "cfg") {
                                        cfgObj.inode["usage"] = storageUsageDataIndex[i].value
                                    }
                                    if (storageUsageDataIndex[i].diskname === "data") {
                                        dataObj.inode["usage"] = storageUsageDataIndex[i].value
                                    }   
                                }  
                        }  
                    }                      
                }

                let storageUsage = {
                    cfgPartition: cfgObj,
                    dataPartition: dataObj,
                    sdPartition: sdaObj,
                    usbPartition: usbObj
                }
                dispatch({type: 'GET_STORAGEUSAGE', storageUsage: storageUsage}) 
            }
        }.bind(this),
        error: function(e) {
            console.log(e.statusText)
        }
    })  
}

export const getResourceUsage = () => (dispatch) => {
    $.ajax({
        url: api.apiHost,
        method: 'post',
        data: { 
            action: 'getResourceUsage' 
        },
        type: 'json',
        async: true,
        success: function(res) {
            let data = res.response

            if (data) {
                let resourceUsage = data.body
                dispatch({type: 'GET_RESOURCEUSAGE', resourceUsage: resourceUsage}) 
            }
        }.bind(this),
        error: function(e) {
            console.log(e.statusText)
        }
    })  
}

export const getPbxStatus = () => (dispatch) => {
    $.ajax({
        url: api.apiHost,
        method: 'post',
        data: { 
            action: 'getPbxStatus' 
        },
        type: 'json',
        async: true,
        success: function(res) {
            let data = res.response

            if (data) {
                let pbxStatus = data.pbx_status
                dispatch({type: 'GET_PBXSTATUS', pbxStatus: pbxStatus}) 
            }
        }.bind(this),
        error: function(e) {
            console.log(e.statusText)
        }
    })  
}

export const listAllTrunk = () => (dispatch) => {
    $.ajax({
        url: api.apiHost,
        method: 'post',
        data: { action: 'listAllTrunk' },
        type: 'json',
        async: true,
        success: function(res) {
            let trunksData = res.response
            dispatch({type: 'LISTAllTRUNK', trunksData: trunksData}) 
        },
        error: function(e) {
            console.log(e.statusText)
        }
    })
}

export const getInterfaceStatus = () => (dispatch) => {
    $.ajax({
        url: api.apiHost,
        method: 'post',
        data: { action: 'getInterfaceStatus' },
        type: 'json',
        async: true,
        success: function(res) {
            let interfaceStatus = res.response
            dispatch({type: 'GET_INTERFACESTATUS', interfaceStatus: interfaceStatus}) 
        },
        error: function(e) {
            console.log(e.statusText)
        }
    })
}