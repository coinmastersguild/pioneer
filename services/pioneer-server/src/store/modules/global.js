
const state = {
    queryKey: "",
    username: "",
}

const getters = {
    getMasterEth: (state) => state.masterEth
}


const mutations = {
    initPioneer(state, address) {
        state.masterEth = address
    },
    subscribeInvocation(state, address) {
        state.masterEth = address
    },
    showModal(state, componentName) {
        state.modalVisible = componentName ? true : false
        state.modalComponent = componentName
    },
    hideModal(state) {
        state.modalVisible = false
    },
}

export default {
    state,
    getters,
    mutations
}
