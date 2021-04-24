
//TODO bring pioneer in
let spec = 'http://127.0.0.1:9001/spec/swagger.json'

export default store => {
    store.subscribe((mutation) => {
        console.log('mutation called')
        if (mutation.type === 'Something') {
            console.log('something called')
        }
    })
    store.subscribeAction({
        after: (action) => {
            console.log('action called')
            if(action.type === 'load') {
                console.log('birds')
            }
        }
    })
}
