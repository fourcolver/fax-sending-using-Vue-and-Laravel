<style scoped>
	.router-anim-enter-active {
        animation: coming 1s;
        animation-delay: 1s;
        opacity: 0;
    }

    .router-anim-leave-active {
        animation: going 1s;
    }

    @keyframes going {
        from{
            transform: translateX(0px);
        }
        to {
            transform: translateX(-50px);
            opacity: 0;
        }
    }

    @keyframes coming {
        from{
            transform: translateX(-50px);
            opacity: 0;
        }
        to {
            transform: translateX(0px);
            opacity: 1;
        }
    }
</style>

<template>
	<v-app>
        <v-container style="padding: 10px 24px;">
            <v-flex xs12 sm12 md12 >&nbsp;
                <v-btn dark color="primary" id="btn_login" @click="onLogin" :loading="this.loading" style="">INLOGGEN</v-btn>
                <input v-model="userPassword" id="userPassword" type="password" placeholder="Password" style="">
                <input v-model="userEmail" id="userEmail" type="email" placeholder="Uw emailadres" style="">
                <v-btn dark color="primary" id="btn_activate"  @click="onLogin" :loading="this.loading" style="float:right">Activate a User</v-btn>
            </v-flex>
        </v-container>

        <stepper-component :step="curr_step"></stepper-component>
        <transition name="router-anim">
            <router-view @changeStep="onStepChange" />
        </transition>
	</v-app>
</template>

<script>
    export default {
        data () {
            return {
                curr_step: 1,
                userPassword: '',
                userEmail: '',
                loading: false
            }
        },
        methods :{
            onStepChange(step){
                this.curr_step = step;
            },
            onLogin(){
                if(this.userEmail && this.userPassword){
                    alert(this.userEmail);
                }
            }
        },
        components: {
        },
        mounted() {
        }
    }
</script>
