import _ from 'underscore'
import SubscribeEvent from './subscribeEvent'

export const handleRequest = (msg, store) => {
    const interPageSubscribeEvent = SubscribeEvent[window.LEAVEPAGE]

    if (window.LEAVEPAGE) {
        let action = msg.action,
            eventBody = msg.eventbody,
            state = store.getState()
            
        if (msg.eventname === "ResourceUsageStatus") {
            // SubscribeEvent[window.LEAVEPAGE].eventnamesForAction[msg.eventname]
            store.dispatch({type: 'DIFF_RESOURCEUSAGE', resourceUsage: eventBody})
        } else if (msg.eventname === "TrunkStatus") {
            
        } else if (msg.eventname === "InterfaceStatus") {

        } else if (msg.eventname === "EquipmentCapacityStatus") {

        } else if (msg.eventname === "CallQueueStatus") {
            let callQueueList = state.callQueueList

            if (eventBody.length) {
                callQueueList = _.filter(callQueueList, function(item) {
                        return (item.extension !== eventBody[0].extension)
                    })

                callQueueList.push(eventBody[0])

                callQueueList = _.sortBy(callQueueList, function(item) { return item.extension })
            }

            store.dispatch({type: 'GET_QUEUEBYCHAIRMAN', callQueueList: callQueueList})
        } else if (msg.eventname === "CallQueueMemberStatus" || msg.eventname === "CallQueueMemberAddedStatus") {
            let currentQueue = state.currentQueue
            let queueMembers = state.queueMembers

            if (eventBody.length && (currentQueue === eventBody[0].extension)) {
                queueMembers = _.filter(queueMembers, function(item) {
                        return (item.member_extension !== eventBody[0].member_extension)
                    })

                queueMembers.push(eventBody[0])

                queueMembers = _.sortBy(queueMembers, function(item) { return item.member_extension })
            }

            store.dispatch({type: 'GET_QUEUEMEMBERS', queueMembers: queueMembers})
        } else if (msg.eventname === "CallQueueCallersStatus") {
            let currentQueue = state.currentQueue
            let waitingCallings = state.waitingCallings

            if (eventBody.length && (currentQueue === eventBody[0].extension)) {
                waitingCallings = _.filter(waitingCallings, function(item) {
                        return (item.callerid !== eventBody[0].callerid)
                    })

                waitingCallings.push(eventBody[0])

                waitingCallings = _.sortBy(waitingCallings, function(item) { return item.position })
            }

            store.dispatch({type: 'GET_QUEUECALLINGWAITING', waitingCallings: waitingCallings})
        } else if (msg.eventname === "CallQueueCallerLeaveStatus") {
            let currentQueue = state.currentQueue
            let answerCallings = state.answerCallings

            if (eventBody.length &&
                eventBody[0].channel1 &&
                eventBody[0].channel2 &&
                (currentQueue === eventBody[0].extension)) {
                answerCallings = _.filter(answerCallings, function(item) {
                        return (item.channel1 !== eventBody[0].channel1 &&
                                item.channel2 !== eventBody[0].channel2)
                    })

                answerCallings.push(eventBody[0])

                answerCallings = _.sortBy(answerCallings, function(item) { return item.channel1 })
            }

            store.dispatch({type: 'GET_QUEUECALLINGANSWERED', answerCallings: answerCallings})
        } else if (msg.eventname === "CallQueueCallersHangupStatus") {
            let currentQueue = state.currentQueue
            let answerCallings = state.answerCallings
            let waitingCallings = state.waitingCallings

            if (eventBody.length && (currentQueue === eventBody[0].extension)) {
                answerCallings = _.filter(answerCallings, function(item) {
                        return (item.channel1 !== eventBody[0].channel1)
                    })
            }

            store.dispatch({type: 'GET_QUEUECALLINGANSWERED', answerCallings: answerCallings})
        } else if (msg.eventname === "CallQueueMemberRemovedStatus") {
            let currentQueue = state.currentQueue
            let queueMembers = state.queueMembers

            if (eventBody.length && (currentQueue === eventBody[0].extension)) {
                queueMembers = _.filter(queueMembers, function(item) {
                        return (item.member_extension !== eventBody[0].member_extension)
                    })
            }

            store.dispatch({type: 'GET_QUEUEMEMBERS', queueMembers: queueMembers})
        }
    }
}

export const handleResponse = (msg, store) => {
  
}