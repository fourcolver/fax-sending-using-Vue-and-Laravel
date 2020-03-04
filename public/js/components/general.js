webpackJsonp([2],{

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}]],\"plugins\":[\"transform-object-rest-spread\",[\"transform-runtime\",{\"polyfill\":false,\"helpers\":false}],\"syntax-dynamic-import\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/js/views/general.vue":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
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
            app_types: ["Aanvraag", "Bezwaarschrift", "Bezwaarschift behandeld door een commissie"],
            app_data: [{
                index: 1,
                period: 56,
                value: "Standaard beslistermijn aanvraag (8 weken)"
            }, {
                index: 2,
                period: 56,
                value: "Wmo voorziening"
            }, {
                index: 3,
                period: 56,
                value: "Individuele inkomsentoeslag"
            }, {
                index: 4,
                period: 56,
                value: "Bijstandsuitkering (Participatiewet)"
            }, {
                index: 5,
                period: 56,
                value: "Bijzondere bijstand (Participatiewet)"
            }, { divider: true }, {
                index: 6,
                period: 56,
                value: "WIA uitkering (UWV)"
            }, {
                index: 7,
                period: 28,
                value: "WW uitkering (UWV)"
            }, {
                index: 8,
                period: 28,
                value: "ZW uitkering (UWV)"
            }, { divider: true }, {
                index: 9,
                period: 35,
                value: "Belastingdienst - Zorgtoeslag"
            }, {
                index: 10,
                period: 35,
                value: "Belastingdienst - Huurtoeslag"
            }, {
                index: 11,
                period: 35,
                value: "Belastingdienst - Kinderopvangtoeslag"
            }, {
                index: 12,
                period: 35,
                value: "Belastingdienst - Kindgebondenbudget"
            }, { divider: true }, {
                index: 13,
                period: 56,
                value: "Omgevingsvergunning (eenvoudige aanvraag)"
            }, {
                index: 14,
                period: 56,
                value: "Schuldhulpverlening"
            }],
            title_request_date: 'Kies de datum van uw aanvraag:',
            municipalities: [],
            municipality: {},
            municipality_items: [],
            errorSnackbar: false,
            successSnackbar: false,
            err_msg: '',
            success_msg: '',
            dialog: false,
            err_dialog_content: '',
            dateValidationMessage: '',
            dateEmailNotification: '',
            appRules: [function (v) {
                return !!v || 'Dit is een verplicht veld.';
            }],
            appDataRules: [function (v) {
                return !!v || 'Dit is een verplicht veld.';
            }],
            municipalityRules: [function (v) {
                return !!v || 'Dit is een verplicht veld.';
            }],
            letterRules: [function (v) {
                return !!v || 'Dit is een verplicht veld.';
            }]
        };
    },

    computed: {
        dateRules: function dateRules() {
            var today = new Date();
            var rules = [];

            var rule = function rule(v) {
                return !!v || 'Dit is een verplicht veld.';
            };
            rules.push(rule);
            if (this.generalForm.app_type && Object.keys(this.generalForm.app_data).length) {
                var dateOrgString = this.generalForm.request_date;
                var dateString = dateOrgString.substring(6, 10) + '-' + dateOrgString.substring(3, 5) + '-' + dateOrgString.substring(0, 2);
                var selectedDate = new Date(dateString);
                var requiredDiff = 0;
                var dateDiff = 0;

                if (this.weeks) {
                    requiredDiff = +this.generalForm.app_data.period + +7 * this.weeks;
                } else if (this.days) {
                    requiredDiff = +this.generalForm.app_data.period + +this.days;
                } else {
                    requiredDiff = this.generalForm.app_data.period;
                }

                dateDiff = Math.ceil((today - selectedDate) / (1000 * 3600 * 24));
                // const rule =
                // 	v => (Math.ceil((today - selectedDate) /(1000 * 3600 * 24)) > requiredDiff) || `De beslistermijn is nog niet verstreken.`
                // rules.push(rule);
                if (dateDiff <= requiredDiff) {
                    this.remain_days = +requiredDiff - +dateDiff + 1;

                    this.dateValidationMessage = 'De beslistermijn is nog niet verstreken. Over ' + this.remain_days + ' dagen is de beslistermijn wel verstreken en kunt u de gemeente in gebreke stellen.';
                    this.dateEmailNotification = 'Vul uw emailadres in als u over ' + this.remain_days + ' dagen een herinnering wilt ontvangen: ';
                } else {
                    this.dateValidationMessage = "";
                    this.dateEmailNotification = "";
                }
            }
            return rules;
        }
    },
    created: function created() {
        this.init();
    },

    watch: {
        date: function date(val, oldVal) {
            this.generalForm.request_date = this.gettanggal(val);
        }
    },
    methods: {
        init: function init() {
            var _this = this;

            if (this.$route.params.token) {
                axios.get('/api/fax/general/token/' + this.$route.params.token).then(function (response) {
                    if (response.data.status === 'fail') {
                        _this.errorSnackbar = true;
                        _this.err_msg = response.data.message;
                    }
                    if (response.data.result === "block") {
                        _this.dialog = true;
                        _this.err_dialog_content = response.data.message;
                    }
                    if (response.data.app_type) {
                        _this.generalForm.app_type = response.data.app_type;
                        _this.selectAppType();
                    }
                    if (response.data.app_data) {
                        _this.generalForm.app_data = parseInt(response.data.app_data);
                        _this.setAppData();
                    }
                    if (response.data.request_date) {
                        _this.generalForm.request_date = response.data.request_date;
                    }
                    if (response.data.letter_received) _this.generalForm.letter_received = response.data.letter_received;
                    if (response.data.subject) _this.generalForm.subject = response.data.subject;
                    if (response.data.municipality) _this.generalForm.municipality = response.data.municipality;
                    if (response.data.municipalities.municipalities) _this.municipalities = response.data.municipalities.municipalities;
                    var i = void 0;
                    for (i = 0; i < _this.municipalities.length; i++) {
                        _this.municipality_items.push(_this.municipalities[i].name);
                    }
                    _this.getMunicipality();
                }).catch(function (response) {
                    console.log("error");
                });
            } else {
                axios.get('/api/fax/general/get').then(function (response) {
                    if (response.data.result === "block") {
                        _this.dialog = true;
                        _this.err_dialog_content = response.data.message;
                    }
                    if (response.data.app_type) {
                        _this.generalForm.app_type = response.data.app_type;
                        _this.selectAppType();
                    }
                    if (response.data.app_data) {
                        _this.generalForm.app_data = parseInt(response.data.app_data);
                        _this.setAppData();
                    }
                    if (response.data.request_date) {
                        _this.generalForm.request_date = response.data.request_date;
                    }
                    if (response.data.letter_received) _this.generalForm.letter_received = response.data.letter_received;
                    if (response.data.subject) _this.generalForm.subject = response.data.subject;
                    if (response.data.municipality) _this.generalForm.municipality = response.data.municipality;
                    if (response.data.municipalities.municipalities) _this.municipalities = response.data.municipalities.municipalities;
                    var i = void 0;
                    for (i = 0; i < _this.municipalities.length; i++) {
                        _this.municipality_items.push(_this.municipalities[i].name);
                    }
                    _this.getMunicipality();
                }).catch(function (response) {
                    console.log("error");
                });
            }
        },
        onSave: function onSave() {
            var _this2 = this;

            // console.log(this.generalForm.app_data.index);
            // return false;
            if (this.$refs.form.validate() && !this.dateValidationMessage && !this.err_dialog_content) {
                var generalForm = new FormData();
                generalForm.append('app_type', this.generalForm.app_type);
                generalForm.append('app_data', this.generalForm.app_data.index);
                generalForm.append('request_date', this.generalForm.request_date);
                generalForm.append('letter_received', this.generalForm.letter_received);
                generalForm.append('subject', this.generalForm.subject);
                generalForm.append('municipality', this.generalForm.municipality);
                this.loading = true;
                axios.post('/api/fax/general/save', generalForm).then(function (response) {
                    _this2.$emit("changeStep", 2);
                    localStorage.setItem('government_name', _this2.generalForm.municipality);
                    _this2.$router.push({
                        name: 'client'
                    });
                    _this2.loading = false;
                }).catch(function (error) {
                    _this2.loading = false;
                    // this.$message({
                    //        type: 'error',
                    //        message: response.data.message
                    //    });
                });
            }
        },
        onEmailSubmit: function onEmailSubmit() {
            var _this3 = this;

            if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.dateNotifyEmail)) {
                this.loading = true;
                var generalForm = new FormData();
                generalForm.append('notify_email', this.dateNotifyEmail);
                generalForm.append('days', this.remain_days);
                axios.post('/api/fax/general/savenotifyemail', generalForm).then(function (response) {
                    _this3.loading = false;
                    if (response.data.result === 'success') {
                        _this3.successSnackbar = true;
                        _this3.success_msg = response.data.message;
                    } else {
                        _this3.errorSnackbar = true;
                        _this3.err_msg = response.data.message;
                    }
                }).catch(function (error) {
                    _this3.loading = false;
                    _this3.errorSnackbar = true;
                    _this3.err_msg = 'Er is helaas een fout opgetreden. Neem contact op met de Beslisapp voor een oplossing.';
                });
            } else {
                this.errorSnackbar = true;
                this.err_msg = 'Vul hier een geldig emailadres in.';
            }
        },
        showAlert: function showAlert(truthy) {
            if (truthy == 1) this.alertShow = true;else if (truthy == 0) this.alertShow = false;
        },
        selectAppType: function selectAppType() {
            this.generalForm.app_data = '';
            if (this.generalForm.app_type === 'Aanvraag') {
                this.title_request_date = 'Kies de datum van uw aanvraag:';
                this.app_data = [{
                    index: 1,
                    period: 56,
                    value: "Standaard beslistermijn aanvraag (8 weken)"
                }, {
                    index: 2,
                    period: 56,
                    value: "Wmo voorziening"
                }, {
                    index: 3,
                    period: 56,
                    value: "Individuele inkomsentoeslag"
                }, {
                    index: 4,
                    period: 56,
                    value: "Bijstandsuitkering (Participatiewet)"
                }, {
                    index: 5,
                    period: 56,
                    value: "Bijzondere bijstand (Participatiewet)"
                }, { divider: true }, {
                    index: 6,
                    period: 56,
                    value: "WIA uitkering (UWV)"
                }, {
                    index: 7,
                    period: 28,
                    value: "WW uitkering (UWV)"
                }, {
                    index: 8,
                    period: 28,
                    value: "ZW uitkering (UWV)"
                }, { divider: true }, {
                    index: 9,
                    period: 35,
                    value: "Belastingdienst - Zorgtoeslag"
                }, {
                    index: 10,
                    period: 35,
                    value: "Belastingdienst - Huurtoeslag"
                }, {
                    index: 11,
                    period: 35,
                    value: "Belastingdienst - Kinderopvangtoeslag"
                }, {
                    index: 12,
                    period: 35,
                    value: "Belastingdienst - Kindgebondenbudget"
                }, { divider: true }, {
                    index: 13,
                    period: 56,
                    value: "Omgevingsvergunning (eenvoudige aanvraag)"
                }, {
                    index: 14,
                    period: 56,
                    value: "Schuldhulpverlening"
                }];
            } else if (this.generalForm.app_type === 'Bezwaarschrift') {
                this.title_request_date = 'Op welke datum is op uw aanvraag beslist:';
                this.app_data = [{
                    index: 1,
                    period: 84,
                    value: "Standaard beslistermijn bezwaar (12 weken)"
                }, {
                    index: 2,
                    period: 84,
                    value: "Wmo voorziening"
                }, {
                    index: 3,
                    period: 84,
                    value: "Individuele inkomsentoeslag"
                }, {
                    index: 4,
                    period: 84,
                    value: "Bijstandsuitkering (Participatiewet)"
                }, {
                    index: 5,
                    period: 84,
                    value: "Bijzondere bijstand (Participatiewet)"
                }, { divider: true }, {
                    index: 6,
                    period: 84,
                    value: "WIA uitkering (UWV)"
                }, {
                    index: 7,
                    period: 91,
                    value: "WW uitkering (UWV)"
                }, {
                    index: 8,
                    period: 91,
                    value: "ZW bezwaar tegen hoogte dagloon (UWV)"
                }, {
                    index: 9,
                    period: 119,
                    value: "ZW met medisch onderzoek (UWV)"
                }, { divider: true }, {
                    index: 10,
                    period: 84,
                    value: "Belastingdienst - Zorgtoeslag"
                }, {
                    index: 11,
                    period: 84,
                    value: "Belastingdienst - Huurtoeslag"
                }, {
                    index: 12,
                    period: 84,
                    value: "Belastingdienst - Kinderopvangtoeslag"
                }, {
                    index: 13,
                    period: 84,
                    value: "Belastingdienst - Kindgebondenbudget"
                }];
            } else {
                this.title_request_date = 'Op welke datum is op uw aanvraag beslist:';
                this.app_data = [{
                    index: 1,
                    period: 126,
                    value: "Standaard beslistermijn bezwaar commissie (18 weken)"
                }];
            }
        },
        setAppData: function setAppData() {
            var data_index = this.generalForm.app_data;
            var arrMatch = this.app_data.filter(function (x) {
                return x.index == data_index;
            });
            this.generalForm.app_data = arrMatch[0];
        },
        selectAppData: function selectAppData() {
            var data = this.generalForm.app_data;
            if (data.value.toLowerCase().indexOf('belastingdienst') !== -1) {
                var arrMatch = this.municipalities.filter(function (x) {
                    return x.name.toLowerCase().indexOf("belastingdienst") !== -1;
                });
                this.municipality_items = [];
                this.municipality_items = arrMatch.map(function (item) {
                    return item.name;
                });
                this.municipality = '';
                this.generalForm.municipality = '';
            } else if (data.value.indexOf('UWV') !== -1) {
                var _arrMatch = this.municipalities.filter(function (x) {
                    return x.name.indexOf("UWV") !== -1;
                });
                this.municipality_items = [];
                this.municipality_items = _arrMatch.map(function (item) {
                    return item.name;
                });
                this.municipality = '';
                this.generalForm.municipality = '';
            } else {
                var i = void 0;
                this.municipality_items = [];
                this.municipality = '';
                this.generalForm.municipality = '';
                for (i = 0; i < this.municipalities.length; i++) {
                    this.municipality_items.push(this.municipalities[i].name);
                }
            }
        },
        getMunicipality: function getMunicipality() {
            var name = this.generalForm.municipality;
            var arrMatch = this.municipalities.filter(function (x) {
                return x.name == name;
            });
            this.municipality = arrMatch[0];
        },
        gettanggal: function gettanggal(str) {
            if (str != null) {
                return str.substring(8, 10) + '-' + str.substring(5, 7) + '-' + str.substring(0, 4);
            }
            return '';
        },
        changeWeekandDays: function changeWeekandDays(e) {
            if (e.target.id === 'weeks') {
                if (e.keyCode <= 47 || e.keyCode >= 58) {
                    e.preventDefault();
                } else {
                    this.days = '';
                }
            } else {
                if (e.keyCode <= 47 || e.keyCode >= 58) {
                    e.preventDefault();
                } else {
                    this.weeks = '';
                }
            }
        }
    }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-27cb7d8e\",\"hasScoped\":false,\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/js/views/general.vue":
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "page" },
    [
      _c(
        "v-container",
        { attrs: { "justify-center": "" } },
        [
          _c(
            "v-form",
            {
              ref: "form",
              attrs: { "lazy-validation": "" },
              model: {
                value: _vm.valid,
                callback: function($$v) {
                  _vm.valid = $$v
                },
                expression: "valid"
              }
            },
            [
              _c(
                "v-card",
                { attrs: { flat: "" } },
                [
                  _c(
                    "v-card-title",
                    [
                      _c("v-container", [
                        _c("span", { staticClass: "headline" }, [
                          _vm._v("ALGEMENE INFORMATIE")
                        ])
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-card-text",
                    [
                      _c(
                        "v-container",
                        { attrs: { "grid-list-md": "" } },
                        [
                          _c(
                            "v-layout",
                            { attrs: { wrap: "" } },
                            [
                              _c(
                                "v-flex",
                                { attrs: { xs12: "", sm12: "", md12: "" } },
                                [
                                  _c("h3", [
                                    _vm._v(
                                      "* Gaat het om een aanvraag of bezwaarschrift?"
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("v-autocomplete", {
                                    attrs: {
                                      items: _vm.app_types,
                                      "persistent-hint": "",
                                      "return-object": "",
                                      rules: _vm.appRules
                                    },
                                    on: {
                                      change: function($event) {
                                        _vm.selectAppType()
                                      }
                                    },
                                    model: {
                                      value: _vm.generalForm.app_type,
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.generalForm,
                                          "app_type",
                                          $$v
                                        )
                                      },
                                      expression: "generalForm.app_type"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs12: "", sm12: "", md12: "" } },
                                [
                                  _c("h3", [
                                    _vm._v("* Kies hier wat er is aangevraagd?")
                                  ]),
                                  _vm._v(" "),
                                  _c("v-autocomplete", {
                                    attrs: {
                                      items: _vm.app_data,
                                      "item-text": "value",
                                      "item-value": "index",
                                      "persistent-hint": "",
                                      "return-object": "",
                                      rules: _vm.appDataRules
                                    },
                                    on: {
                                      change: function($event) {
                                        _vm.selectAppData()
                                      }
                                    },
                                    model: {
                                      value: _vm.generalForm.app_data,
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.generalForm,
                                          "app_data",
                                          $$v
                                        )
                                      },
                                      expression: "generalForm.app_data"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs12: "", sm12: "", md12: "" } },
                                [
                                  _c("h3", [
                                    _vm._v(
                                      "* " + _vm._s(this.title_request_date)
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "v-menu",
                                    {
                                      attrs: {
                                        lazy: "",
                                        "close-on-content-click": false,
                                        transition: "scale-transition",
                                        "offset-y": "",
                                        "nudge-right": 40,
                                        "max-width": "290px",
                                        "min-width": "290px"
                                      },
                                      model: {
                                        value: _vm.menu_request_date,
                                        callback: function($$v) {
                                          _vm.menu_request_date = $$v
                                        },
                                        expression: "menu_request_date"
                                      }
                                    },
                                    [
                                      _c("v-text-field", {
                                        attrs: {
                                          slot: "activator",
                                          "prepend-icon": "event",
                                          rules: _vm.dateRules
                                        },
                                        slot: "activator",
                                        model: {
                                          value: _vm.generalForm.request_date,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.generalForm,
                                              "request_date",
                                              $$v
                                            )
                                          },
                                          expression: "generalForm.request_date"
                                        }
                                      }),
                                      _vm._v(" "),
                                      _c("v-date-picker", {
                                        on: {
                                          input: function($event) {
                                            _vm.menu_request_date = false
                                          }
                                        },
                                        model: {
                                          value: _vm.date,
                                          callback: function($$v) {
                                            _vm.date = $$v
                                          },
                                          expression: "date"
                                        }
                                      })
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  this.dateValidationMessage
                                    ? _c(
                                        "v-alert",
                                        {
                                          staticStyle: {
                                            "margin-bottom": "16px"
                                          },
                                          attrs: {
                                            value: true,
                                            color: "error",
                                            outline: ""
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        " +
                                              _vm._s(
                                                this.dateValidationMessage
                                              ) +
                                              "\n                                    "
                                          )
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  this.dateEmailNotification
                                    ? _c(
                                        "v-flex",
                                        {
                                          staticStyle: {
                                            "font-size": "14px",
                                            padding: "16px",
                                            "background-color": "#2196f3",
                                            color: "white",
                                            "margin-bottom": "16px"
                                          },
                                          attrs: {
                                            xs12: "",
                                            sm12: "",
                                            md12: ""
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        " +
                                              _vm._s(
                                                this.dateEmailNotification
                                              ) +
                                              "\n                                          \n                                        "
                                          ),
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.dateNotifyEmail,
                                                expression: "dateNotifyEmail"
                                              }
                                            ],
                                            attrs: {
                                              id: "dateNotifyEmail",
                                              type: "email",
                                              placeholder: "Uw emailadres"
                                            },
                                            domProps: {
                                              value: _vm.dateNotifyEmail
                                            },
                                            on: {
                                              input: function($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.dateNotifyEmail =
                                                  $event.target.value
                                              }
                                            }
                                          }),
                                          _vm._v(" "),
                                          _c(
                                            "v-btn",
                                            {
                                              staticStyle: {
                                                "font-size": "14px",
                                                margin: "0px 10px",
                                                width: "200px",
                                                height: "30px",
                                                color: "#2196f3",
                                                "background-color": "white"
                                              },
                                              attrs: {
                                                loading: this.emailloading
                                              },
                                              on: { click: _vm.onEmailSubmit }
                                            },
                                            [_vm._v("VERZENDEN")]
                                          )
                                        ],
                                        1
                                      )
                                    : _vm._e()
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs12: "", sm12: "", md12: "" } },
                                [
                                  _c("h3", [
                                    _vm._v(
                                      "* Heeft u een brief ontvangen dat er later wordt belist?"
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "v-radio-group",
                                    {
                                      attrs: {
                                        row: "",
                                        rules: _vm.letterRules
                                      },
                                      model: {
                                        value: _vm.generalForm.letter_received,
                                        callback: function($$v) {
                                          _vm.$set(
                                            _vm.generalForm,
                                            "letter_received",
                                            $$v
                                          )
                                        },
                                        expression:
                                          "generalForm.letter_received"
                                      }
                                    },
                                    [
                                      _c("v-radio", {
                                        attrs: { label: "Ja", value: "yes" },
                                        on: {
                                          change: function($event) {
                                            _vm.showAlert(1)
                                          }
                                        }
                                      }),
                                      _vm._v(" "),
                                      _c("v-radio", {
                                        attrs: { label: "Nee", value: "no" },
                                        on: {
                                          change: function($event) {
                                            _vm.showAlert(0)
                                          }
                                        }
                                      })
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _vm.alertShow == true
                                    ? _c(
                                        "v-flex",
                                        {
                                          staticStyle: {
                                            "font-size": "14px",
                                            padding: "16px",
                                            "background-color": "#2196f3",
                                            color: "white",
                                            "margin-bottom": "16px"
                                          },
                                          attrs: {
                                            xs12: "",
                                            sm12: "",
                                            md12: ""
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        Vul het aantal weken in dat later wordt beslist (de verdaging) :\n                                         \n                                        "
                                          ),
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.weeks,
                                                expression: "weeks"
                                              }
                                            ],
                                            attrs: { id: "weeks" },
                                            domProps: { value: _vm.weeks },
                                            on: {
                                              keypress: _vm.changeWeekandDays,
                                              input: function($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.weeks = $event.target.value
                                              }
                                            }
                                          }),
                                          _vm._v(
                                            "\n                                        weken.\n                                            \n                                        Of vul het aantal dagen in dat later wordt beslist:\n                                         \n                                        "
                                          ),
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.days,
                                                expression: "days"
                                              }
                                            ],
                                            attrs: { id: "days" },
                                            domProps: { value: _vm.days },
                                            on: {
                                              keypress: _vm.changeWeekandDays,
                                              input: function($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.days = $event.target.value
                                              }
                                            }
                                          }),
                                          _vm._v(
                                            "\n                                        dagen.\n                                    "
                                          )
                                        ]
                                      )
                                    : _vm._e()
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs12: "", sm12: "", md12: "" } },
                                [
                                  _c("h3", [
                                    _vm._v(
                                      "Wat is het kenmerk van uw aanvraag / of bezwaarschrift?"
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("v-text-field", {
                                    model: {
                                      value: _vm.generalForm.subject,
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.generalForm,
                                          "subject",
                                          $$v
                                        )
                                      },
                                      expression: "generalForm.subject"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-flex",
                                { attrs: { xs12: "", sm12: "", md12: "" } },
                                [
                                  _c("h3", [
                                    _vm._v("* Selecteer hieronder de gemeente:")
                                  ]),
                                  _vm._v(" "),
                                  _c("v-autocomplete", {
                                    attrs: {
                                      items: _vm.municipality_items,
                                      "persistent-hint": "",
                                      rules: _vm.municipalityRules
                                    },
                                    on: {
                                      change: function($event) {
                                        _vm.getMunicipality()
                                      }
                                    },
                                    model: {
                                      value: _vm.generalForm.municipality,
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.generalForm,
                                          "municipality",
                                          $$v
                                        )
                                      },
                                      expression: "generalForm.municipality"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _vm.municipality
                                ? _c("div", [
                                    _vm._v(
                                      "\n\t\t\t\t\t\t\t\t\tFaxnumber: " +
                                        _vm._s(this.municipality.faxnumber)
                                    ),
                                    _c("br"),
                                    _vm._v(
                                      "\n\t\t\t\t\t\t\t\t\tEmailadres: " +
                                        _vm._s(this.municipality.email)
                                    ),
                                    _c("br"),
                                    _vm._v(
                                      "\n\t\t\t\t\t\t\t\t\tAddress: " +
                                        _vm._s(this.municipality.address) +
                                        ", " +
                                        _vm._s(this.municipality.postal) +
                                        ", " +
                                        _vm._s(this.municipality.city) +
                                        "\n\t\t\t\t\t\t\t\t"
                                    )
                                  ])
                                : _vm._e()
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    [
                      _c(
                        "v-container",
                        [
                          _c(
                            "v-layout",
                            { attrs: { "justify-end": "" } },
                            [
                              _c(
                                "v-btn",
                                {
                                  attrs: {
                                    dark: "",
                                    color: "primary",
                                    loading: this.loading
                                  },
                                  on: { click: _vm.onSave }
                                },
                                [_vm._v("VOLGENDE")]
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-snackbar",
            {
              attrs: {
                color: "red lighten-2",
                timeout: 12000,
                bottom: true,
                "multi-line": true
              },
              model: {
                value: _vm.errorSnackbar,
                callback: function($$v) {
                  _vm.errorSnackbar = $$v
                },
                expression: "errorSnackbar"
              }
            },
            [
              _vm._v(
                "\n                " +
                  _vm._s(_vm.err_msg) +
                  "\n                "
              ),
              _c(
                "v-btn",
                {
                  attrs: { color: "lightgrey", flat: "" },
                  on: {
                    click: function($event) {
                      _vm.errorSnackbar = false
                    }
                  }
                },
                [_vm._v("\n                    SLUITEN\n                ")]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-snackbar",
            {
              attrs: {
                color: "green lighten-2",
                timeout: 12000,
                bottom: true,
                "multi-line": true
              },
              model: {
                value: _vm.successSnackbar,
                callback: function($$v) {
                  _vm.successSnackbar = $$v
                },
                expression: "successSnackbar"
              }
            },
            [
              _vm._v(
                "\n                " +
                  _vm._s(_vm.success_msg) +
                  "\n                "
              ),
              _c(
                "v-btn",
                {
                  attrs: { color: "lightgrey", flat: "" },
                  on: {
                    click: function($event) {
                      _vm.successSnackbar = false
                    }
                  }
                },
                [_vm._v("\n                    SLUITEN\n                ")]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-dialog",
            {
              attrs: { "max-width": "290" },
              model: {
                value: _vm.dialog,
                callback: function($$v) {
                  _vm.dialog = $$v
                },
                expression: "dialog"
              }
            },
            [
              _c(
                "v-card",
                [
                  _c("v-card-title", { staticClass: "headline" }, [
                    _vm._v("Systeem bericht")
                  ]),
                  _vm._v(" "),
                  _c("v-card-text", {
                    domProps: { innerHTML: _vm._s(_vm.err_dialog_content) }
                  }),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    [
                      _c("v-spacer"),
                      _vm._v(" "),
                      _c(
                        "v-btn",
                        {
                          attrs: { color: "green darken-1", flat: "flat" },
                          on: {
                            click: function($event) {
                              _vm.dialog = false
                            }
                          }
                        },
                        [
                          _vm._v(
                            "\n                            OK\n                        "
                          )
                        ]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-27cb7d8e", module.exports)
  }
}

/***/ }),

/***/ "./resources/js/views/general.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")
/* script */
var __vue_script__ = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}]],\"plugins\":[\"transform-object-rest-spread\",[\"transform-runtime\",{\"polyfill\":false,\"helpers\":false}],\"syntax-dynamic-import\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/js/views/general.vue")
/* template */
var __vue_template__ = __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-27cb7d8e\",\"hasScoped\":false,\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/js/views/general.vue")
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/js/views/general.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-27cb7d8e", Component.options)
  } else {
    hotAPI.reload("data-v-27cb7d8e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});