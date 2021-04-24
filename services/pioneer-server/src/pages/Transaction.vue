<template>
    <div class="q-pa-md fixed-center" style="max-width:750px">
        <h5>Transaction Status page</h5>
        <small>Invocation: {{ $route.params.id }}</small>
        <q-stepper
                v-model="step"
                ref="stepper"
                alternative-labels
                color="primary"
                animated
        >
            <q-step
                    :name="1"
                    title="Reviewed and Signed"
                    icon="settings"
                    :done="step > 1"
            >
                Review Transaction

                sign:
            </q-step>

            <q-step
                    :name="2"
                    title="Pending Transactions"
                    caption="(broadcast)"
                    icon="create_new_folder"
                    :done="step > 2"
            >
                Fee levels:
                <br/>
                Time till next block:
                <br/>
                estimated time till confirmation:
                <br/>
                Rebuild/replace transaction:
            </q-step>

            <template v-slot:navigation>
                <q-stepper-navigation>
                    <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
                    <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                </q-stepper-navigation>
            </template>
        </q-stepper>
    </div>
</template>

<script>
    import { mapMutations, mapGetters, mapActions } from 'vuex'
    export default {
        name: "Transaction",
        data () {
            return {
                status:"online",
                step: 1
            }
        },
        computed: {
            ...mapGetters(['getWalletSendInfo'])
        },
        async mounted() {
            try{
                //subscribe to invocation lifecycles
                let invocationId = this.$route.params.id
                console.log("invocationId: ",invocationId)

            }catch(e){
                console.error(e)
            }
        },
        methods: {
            ...mapMutations(['showModal', 'hideModal']),
            ...mapActions(['addTx']),
            async update () {
                //get info on invocation

            },
        }
    }
</script>

<style scoped>

</style>
