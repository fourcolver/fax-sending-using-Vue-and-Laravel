<template>
	<div class="page">
		<v-container justify-center>
			<v-form
			    ref="form"
			    v-model="valid"
			    lazy-validation
			>
				<v-card flat>
					<v-card-title>
						<v-container>
							<span class="headline">ALGEMENE INFORMATIE</span>
						</v-container>
					</v-card-title>
					<v-card-text>
						<v-container grid-list-md>
							<v-layout wrap>
								<v-flex xs12 sm12 md12>
									<h3>* Gaat het om een aanvraag of bezwaarschrift?</h3>
									<v-autocomplete
									v-model="generalForm.app_type"
									:items="app_types"
									persistent-hint
									return-object
									:rules="appRules"
                                    @change="selectAppType()"
									></v-autocomplete>
								</v-flex>
								<v-flex xs12 sm12 md12>
									<h3>* Kies hier wat er is aangevraagd?</h3>
									<v-autocomplete
									v-model="generalForm.app_data"
									:items="app_data"
									item-text="value"
									item-value="index"
									persistent-hint
									return-object
									:rules="appDataRules"
                                    @change="selectAppData()"
									></v-autocomplete>
								</v-flex>
								<v-flex xs12 sm12 md12>
									<h3>* {{this.title_request_date}}</h3>
									<v-menu
									lazy
									:close-on-content-click="false"
									v-model="menu_request_date"
									transition="scale-transition"
									offset-y
									:nudge-right="40"
									max-width="290px"
									min-width="290px"
									>
										<v-text-field
										slot="activator"
										v-model="generalForm.request_date"
										prepend-icon="event"
										:rules="dateRules"
										>
										</v-text-field>
										<v-date-picker v-model="date" @input="menu_request_date = false">
										</v-date-picker>
									</v-menu>
                                    <v-alert
                                        v-if="this.dateValidationMessage"
                                        :value="true"
                                        color="error"
                                        outline
                                        style="margin-bottom: 16px;"
                                        >
                                        {{this.dateValidationMessage}}
                                    </v-alert>
                                    <v-flex xs12 sm12 md12 v-if="this.dateEmailNotification" style="font-size: 14px; padding: 16px; background-color: #2196f3; color: white; margin-bottom: 16px">
                                        {{this.dateEmailNotification}}
                                        &nbsp;&nbsp;
                                        <input v-model="dateNotifyEmail" id="dateNotifyEmail" type="email" placeholder="Uw emailadres">
                                        <v-btn @click="onEmailSubmit" :loading="this.emailloading" style="font-size: 14px; margin: 0px 10px; width: 200px; height: 30px; color: #2196f3; background-color: white">VERZENDEN</v-btn>
                                    </v-flex>

								</v-flex>
								<v-flex xs12 sm12 md12>
									<h3>* Heeft u een brief ontvangen dat er later wordt belist?</h3>
									<v-radio-group
									v-model="generalForm.letter_received"
									row
									:rules="letterRules">
								      	<v-radio label="Ja" value="yes" @change="showAlert(1)"></v-radio>
								      	<v-radio label="Nee" value="no" @change="showAlert(0)"></v-radio>
								    </v-radio-group>
<!--								    <v-alert-->
<!--								    v-if="alertShow == true"-->
<!--								    :value="true"-->
<!--								    color="info"-->
<!--								    outline>-->
<!--								    	U kunt gewoon doorgaan. Neem gerust contact op met ons als u zeker wilt weten dat u de gemeente niet te vroeg in gebreke stelt.-->
<!--								    </v-alert>-->
                                    <v-flex xs12 sm12 md12 v-if="alertShow == true" style="font-size: 14px; padding: 16px; background-color: #2196f3; color: white; margin-bottom: 16px">
                                        Vul het aantal weken in dat later wordt beslist (de verdaging) :
                                        &nbsp;
                                        <input v-model="weeks" id="weeks" @keypress="changeWeekandDays">
                                        weken.
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        Of vul het aantal dagen in dat later wordt beslist:
                                        &nbsp;
                                        <input id="days" v-model="days" @keypress="changeWeekandDays">
                                        dagen.
                                    </v-flex>
								</v-flex>
								<v-flex xs12 sm12 md12>
									<h3>Wat is het kenmerk van uw aanvraag / of bezwaarschrift?</h3>
									<v-text-field
									v-model="generalForm.subject"
									>
									</v-text-field>
								</v-flex>
								<v-flex xs12 sm12 md12>
									<h3>* Selecteer hieronder de gemeente:</h3>
									<v-autocomplete
									v-model="generalForm.municipality"
									:items="municipality_items"
									persistent-hint
									:rules="municipalityRules"
									@change="getMunicipality()"
									>
									</v-autocomplete>
								</v-flex>
								<div v-if="municipality">
									Faxnumber: {{ this.municipality.faxnumber }}<br>
									Emailadres: {{ this.municipality.email }}<br>
									Address: {{ this.municipality.address }}, {{ this.municipality.postal }}, {{ this.municipality.city }}
								</div>
							</v-layout>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-container>
							<v-layout justify-end>
								<v-btn dark color="primary" @click="onSave" :loading="this.loading">VOLGENDE</v-btn>
							</v-layout>
						</v-container>
					</v-card-actions>
				</v-card>
			</v-form>
            <v-snackbar v-model="errorSnackbar" color="red lighten-2" :timeout="12000" :bottom="true" :multi-line="true">
                {{ err_msg }}
                <v-btn color="lightgrey" flat @click="errorSnackbar = false">
                    SLUITEN
                </v-btn>
            </v-snackbar>
            <v-snackbar v-model="successSnackbar" color="green lighten-2" :timeout="12000" :bottom="true" :multi-line="true">
                {{ success_msg }}
                <v-btn color="lightgrey" flat @click="successSnackbar = false">
                    SLUITEN
                </v-btn>
            </v-snackbar>
            <v-dialog v-model="dialog" max-width="290">
                <v-card>
                    <v-card-title class="headline">Systeem bericht</v-card-title>
                    <v-card-text v-html="err_dialog_content"></v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat="flat" @click="dialog = false">
                            OK
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
		</v-container>
	</div>
</template>

<script>
  	export default {
  		data () {
			return {
				valid: true,
				alertShow: false,
				date: '',
				menu_request_date: false,
                loading: false,
                emailloading: false,
                weeks: '',
                days: '',
                dateNotifyEmail: '',
                remain_days: '',
                generalForm: {
					app_type: '',
					app_data: '',
					request_date: '',
					letter_received: '',
					subject: '',
					municipality: ''
				},
				app_types: [
					"Aanvraag",
					"Bezwaarschrift",
                    "Bezwaarschift behandeld door een commissie"
				],
				app_data: [
					{
						index: 1,
                        period: 56,
						value: "Standaard beslistermijn aanvraag (8 weken)",
					},
					{
						index: 2,
                        period: 56,
						value: "Wmo voorziening",
					},
                    {
                        index: 3,
                        period: 56,
                        value: "Individuele inkomsentoeslag",
                    },
                    {
                        index: 4,
                        period: 56,
                        value: "Bijstandsuitkering (Participatiewet)",
                    },
                    {
                        index: 5,
                        period: 56,
                        value: "Bijzondere bijstand (Participatiewet)",
                    },
                    { divider: true },
                    {
                        index: 6,
                        period: 56,
                        value: "WIA uitkering (UWV)",
                    },
                    {
                        index: 7,
                        period: 28,
                        value: "WW uitkering (UWV)",
                    },
                    {
                        index: 8,
                        period: 28,
                        value: "ZW uitkering (UWV)",
                    },
                    { divider: true },
                    {
                        index: 9,
                        period: 35,
                        value: "Belastingdienst - Zorgtoeslag",
                    },
                    {
                        index: 10,
                        period: 35,
                        value: "Belastingdienst - Huurtoeslag",
                    },
                    {
                        index: 11,
                        period: 35,
                        value: "Belastingdienst - Kinderopvangtoeslag",
                    },
                    {
                        index: 12,
                        period: 35,
                        value: "Belastingdienst - Kindgebondenbudget",
                    },
                    { divider: true },
                    {
                        index: 13,
                        period: 56,
                        value: "Omgevingsvergunning (eenvoudige aanvraag)",
                    },
                    {
                        index: 14,
                        period: 56,
                        value: "Schuldhulpverlening",
                    }
				],
                title_request_date: 'Kies de datum van uw aanvraag:',
				municipalities: [],
				municipality: {},
				municipality_items: [],
                errorSnackbar: false,
                successSnackbar: false,
                err_msg : '',
                success_msg: '',
                dialog : false,
                err_dialog_content : '',
                dateValidationMessage: '',
                dateEmailNotification: '',
			    appRules: [
			        v => !!v || 'Dit is een verplicht veld.',
			    ],
			    appDataRules: [
			        v => !!v || 'Dit is een verplicht veld.',
			    ],
			    municipalityRules: [
			        v => !!v || 'Dit is een verplicht veld.',
			    ],
			    letterRules: [
			        v => !!v || 'Dit is een verplicht veld.',
			    ],
			}
		},
		computed: {
			dateRules() {
				const today = new Date();
				const rules = [];

				const rule =
					v => !!v || 'Dit is een verplicht veld.';
				rules.push(rule);
				if(this.generalForm.app_type && Object.keys(this.generalForm.app_data).length){
					var dateOrgString = this.generalForm.request_date;
					var dateString = dateOrgString.substring(6, 10)+'-'+dateOrgString.substring(3, 5)+'-'+dateOrgString.substring(0, 2);
					var selectedDate = new Date(dateString);
					var requiredDiff = 0;
					var dateDiff = 0;

					if(this.weeks){
                        requiredDiff = +this.generalForm.app_data.period + +7*this.weeks;
                    }
					else if(this.days){
                        requiredDiff = +this.generalForm.app_data.period + +this.days;
                    }
					else{
                        requiredDiff = this.generalForm.app_data.period;
                    }

					dateDiff = Math.ceil((today - selectedDate)/(1000 * 3600 * 24));
					// const rule =
					// 	v => (Math.ceil((today - selectedDate) /(1000 * 3600 * 24)) > requiredDiff) || `De beslistermijn is nog niet verstreken.`
					// rules.push(rule);
                    if(dateDiff <= requiredDiff){
                        this.remain_days = +requiredDiff - +dateDiff + 1;

                        this.dateValidationMessage =`De beslistermijn is nog niet verstreken. Over ${this.remain_days} dagen is de beslistermijn wel verstreken en kunt u de gemeente in gebreke stellen.`;
                        this.dateEmailNotification = `Vul uw emailadres in als u over ${this.remain_days} dagen een herinnering wilt ontvangen: `;
                    }
                    else{
                        this.dateValidationMessage = "";
                        this.dateEmailNotification = "";
                    }
				}
				return rules;
			}
		},
	    created(){
            this.init();
	    },
	    watch: {
	    	date: function(val, oldVal){
	    		this.generalForm.request_date = this.gettanggal(val);
	    	}
	    },
	    methods: {
	    	init(){
	    	    if(this.$route.params.token){
                    axios.get('/api/fax/general/token/' + this.$route.params.token)
                        .then(response => {
                            if(response.data.status === 'fail'){
                                this.errorSnackbar = true;
                                this.err_msg = response.data.message;
                            }
                            if(response.data.result === "block"){
                                this.dialog = true;
                                this.err_dialog_content = response.data.message;
                            }
                            if(response.data.app_type){
                                this.generalForm.app_type = response.data.app_type
                                this.selectAppType();
                            }
                            if(response.data.app_data) {
                                this.generalForm.app_data = parseInt(response.data.app_data);
                                this.setAppData();
                            }
                            if(response.data.request_date) {
                                this.generalForm.request_date = response.data.request_date;
                            }
                            if(response.data.letter_received)
                                this.generalForm.letter_received = response.data.letter_received;
                            if(response.data.subject)
                                this.generalForm.subject = response.data.subject;
                            if(response.data.municipality)
                                this.generalForm.municipality = response.data.municipality;
                            if(response.data.municipalities.municipalities)
                                this.municipalities = response.data.municipalities.municipalities;
                            let i;
                            for (i = 0; i < this.municipalities.length; i++) {
                                this.municipality_items.push(this.municipalities[i].name);
                            }
                            this.getMunicipality();
                        }).catch(response => {
                        console.log("error");
                    });
                }
	    	    else{
                    axios.get('/api/fax/general/get')
                        .then(response => {
                            if(response.data.result === "block"){
                                this.dialog = true;
                                this.err_dialog_content = response.data.message;
                            }
                            if(response.data.app_type) {
                                this.generalForm.app_type = response.data.app_type
                                this.selectAppType();
                            }
                            if(response.data.app_data) {
                                this.generalForm.app_data = parseInt(response.data.app_data);
                                this.setAppData();
                            }
                            if(response.data.request_date){
                                this.generalForm.request_date = response.data.request_date;
                            }
                            if(response.data.letter_received)
                                this.generalForm.letter_received = response.data.letter_received;
                            if(response.data.subject)
                                this.generalForm.subject = response.data.subject;
                            if(response.data.municipality)
                                this.generalForm.municipality = response.data.municipality;
                            if(response.data.municipalities.municipalities)
                                this.municipalities = response.data.municipalities.municipalities;
                            let i;
                            for (i = 0; i < this.municipalities.length; i++) {
                                this.municipality_items.push(this.municipalities[i].name);
                            }
                            this.getMunicipality();
                        }).catch(response => {
                        console.log("error");
                    });
                }
	    	},
	    	onSave(){
	    		// console.log(this.generalForm.app_data.index);
	    		// return false;
			    if (this.$refs.form.validate() && !this.dateValidationMessage && !this.err_dialog_content) {
			    	let generalForm = new FormData();
                    generalForm.append('app_type', this.generalForm.app_type);
                    generalForm.append('app_data', this.generalForm.app_data.index);
                    generalForm.append('request_date', this.generalForm.request_date);
                    generalForm.append('letter_received', this.generalForm.letter_received);
                    generalForm.append('subject', this.generalForm.subject);
                    generalForm.append('municipality', this.generalForm.municipality);
                    this.loading = true;
                    axios.post('/api/fax/general/save', generalForm)
                    .then(response =>  {
			    		this.$emit("changeStep", 2);
                        localStorage.setItem('government_name', this.generalForm.municipality);
			    		this.$router.push({
			    			name: 'client'
			    		})
                        this.loading = false;
                    }).catch(error => {
                        this.loading = false;
                    	// this.$message({
                     //        type: 'error',
                     //        message: response.data.message
                     //    });
                    });
		    	}
	    	},
            onEmailSubmit(){
	    	    if(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.dateNotifyEmail)){
                    this.loading = true;
                    let generalForm = new FormData();
                    generalForm.append('notify_email', this.dateNotifyEmail);
                    generalForm.append('days', this.remain_days);
                    axios.post('/api/fax/general/savenotifyemail', generalForm)
                        .then(response =>  {
                            this.loading = false;
                            if(response.data.result === 'success'){
                                this.successSnackbar = true;
                                this.success_msg = response.data.message;
                            }
                            else{
                                this.errorSnackbar = true;
                                this.err_msg = response.data.message;
                            }

                        }).catch(error => {
                        this.loading = false;
                        this.errorSnackbar = true;
                        this.err_msg = 'Er is helaas een fout opgetreden. Neem contact op met de Beslisapp voor een oplossing.';
                    });
                }
	    	    else{
                    this.errorSnackbar = true;
                    this.err_msg = 'Vul hier een geldig emailadres in.';
                }
            },
	    	showAlert(truthy){
	    		if(truthy == 1)
	    			this.alertShow = true;
	    		else if(truthy == 0)
	    			this.alertShow = false;
	    	},
            selectAppType(){
                this.generalForm.app_data = '';
	    	    if(this.generalForm.app_type === 'Aanvraag'){
	    	        this.title_request_date = 'Kies de datum van uw aanvraag:';
                    this.app_data = [
                        {
                            index: 1,
                            period: 56,
                            value: "Standaard beslistermijn aanvraag (8 weken)",
                        },
                        {
                            index: 2,
                            period: 56,
                            value: "Wmo voorziening",
                        },
                        {
                            index: 3,
                            period: 56,
                            value: "Individuele inkomsentoeslag",
                        },
                        {
                            index: 4,
                            period: 56,
                            value: "Bijstandsuitkering (Participatiewet)",
                        },
                        {
                            index: 5,
                            period: 56,
                            value: "Bijzondere bijstand (Participatiewet)",
                        },
                        { divider: true },
                        {
                            index: 6,
                            period: 56,
                            value: "WIA uitkering (UWV)",
                        },
                        {
                            index: 7,
                            period: 28,
                            value: "WW uitkering (UWV)",
                        },
                        {
                            index: 8,
                            period: 28,
                            value: "ZW uitkering (UWV)",
                        },
                        { divider: true },
                        {
                            index: 9,
                            period: 35,
                            value: "Belastingdienst - Zorgtoeslag",
                        },
                        {
                            index: 10,
                            period: 35,
                            value: "Belastingdienst - Huurtoeslag",
                        },
                        {
                            index: 11,
                            period: 35,
                            value: "Belastingdienst - Kinderopvangtoeslag",
                        },
                        {
                            index: 12,
                            period: 35,
                            value: "Belastingdienst - Kindgebondenbudget",
                        },
                        { divider: true },
                        {
                            index: 13,
                            period: 56,
                            value: "Omgevingsvergunning (eenvoudige aanvraag)",
                        },
                        {
                            index: 14,
                            period: 56,
                            value: "Schuldhulpverlening",
                        }
                    ];
                }
	    	    else if(this.generalForm.app_type === 'Bezwaarschrift'){
                    this.title_request_date = 'Op welke datum is op uw aanvraag beslist:';
                    this.app_data = [
                        {
                            index: 1,
                            period: 84,
                            value: "Standaard beslistermijn bezwaar (12 weken)",
                        },
                        {
                            index: 2,
                            period: 84,
                            value: "Wmo voorziening",
                        },
                        {
                            index: 3,
                            period: 84,
                            value: "Individuele inkomsentoeslag",
                        },
                        {
                            index: 4,
                            period: 84,
                            value: "Bijstandsuitkering (Participatiewet)",
                        },
                        {
                            index: 5,
                            period: 84,
                            value: "Bijzondere bijstand (Participatiewet)",
                        },
                        { divider: true },
                        {
                            index: 6,
                            period: 84,
                            value: "WIA uitkering (UWV)",
                        },
                        {
                            index: 7,
                            period: 91,
                            value: "WW uitkering (UWV)",
                        },
                        {
                            index: 8,
                            period: 91,
                            value: "ZW bezwaar tegen hoogte dagloon (UWV)",
                        },
                        {
                            index: 9,
                            period: 119,
                            value: "ZW met medisch onderzoek (UWV)",
                        },
                        { divider: true },
                        {
                            index: 10,
                            period: 84,
                            value: "Belastingdienst - Zorgtoeslag",
                        },
                        {
                            index: 11,
                            period: 84,
                            value: "Belastingdienst - Huurtoeslag",
                        },
                        {
                            index: 12,
                            period: 84,
                            value: "Belastingdienst - Kinderopvangtoeslag",
                        },
                        {
                            index: 13,
                            period: 84,
                            value: "Belastingdienst - Kindgebondenbudget",
                        }
                    ];
                }
	    	    else{
                    this.title_request_date = 'Op welke datum is op uw aanvraag beslist:';
                    this.app_data = [
                        {
                            index: 1,
                            period: 126,
                            value: "Standaard beslistermijn bezwaar commissie (18 weken)",
                        }
                    ];
                }
            },
            setAppData(){
                var data_index = this.generalForm.app_data;
                let arrMatch = this.app_data.filter(function(x){
                    return x.index == data_index;
                });
                this.generalForm.app_data = arrMatch[0];
            },
            selectAppData() {
                let data = this.generalForm.app_data;
                if(data.value.toLowerCase().indexOf('belastingdienst') !== -1){
                    let arrMatch = this.municipalities.filter(function(x){
                        return x.name.toLowerCase().indexOf("belastingdienst") !== -1;
                    });
                    this.municipality_items = [];
                    this.municipality_items = arrMatch.map(function (item) {
                        return item.name;
                    });
                    this.municipality = '';
                    this.generalForm.municipality = '';
                }
                else if(data.value.indexOf('UWV') !== -1){
                    let arrMatch = this.municipalities.filter(function(x){
                        return x.name.indexOf("UWV") !== -1;
                    });
                    this.municipality_items = [];
                    this.municipality_items = arrMatch.map(function (item) {
                        return item.name;
                    });
                    this.municipality = '';
                    this.generalForm.municipality = '';
                }
                else{
                    let i;
                    this.municipality_items = [];
                    this.municipality = '';
                    this.generalForm.municipality = '';
                    for (i = 0; i < this.municipalities.length; i++) {
                        this.municipality_items.push(this.municipalities[i].name);
                    }
                }
            },
	    	getMunicipality(){
	    		var name = this.generalForm.municipality;
	    		let arrMatch = this.municipalities.filter(function(x){
	    			return x.name == name;
	    		});
	    		this.municipality = arrMatch[0];
	    	},
	    	gettanggal(str) {
				if (str != null) {
					return str.substring(8, 10)+'-'+str.substring(5, 7)+'-'+str.substring(0, 4);
				}
				return '';
			},
            changeWeekandDays(e){
	    	    if(e.target.id === 'weeks'){
	    	        if(e.keyCode <= 47 || e.keyCode >= 58){
                        e.preventDefault();
                    }
	    	        else{
                        this.days = '';
                    }
                }
	    	    else {
                    if(e.keyCode <= 47 || e.keyCode >= 58){
                        e.preventDefault();
                    }
                    else{
                        this.weeks = '';
                    }
                }
            }
	    }
  	}
</script>
