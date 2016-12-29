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

        }
    }
}

export const handleResponse = (msg, store) => {
  
}