webpackJsonp([1],{

/***/ "./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}]],\"plugins\":[\"transform-object-rest-spread\",[\"transform-runtime\",{\"polyfill\":false,\"helpers\":false}],\"syntax-dynamic-import\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/js/views/sign.vue":
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

/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            sign_mode: 0,
            sign_img: '',
            bank_number: '',
            government_name: '',
            err_msg: '',
            loading: false,
            image_loading: false,
            createAccount: '',
            createOptions: ['Ja', 'Nee']
        };
    },
    created: function created() {
        this.init();
    },
    mounted: function mounted() {
        if (!localStorage.bank_number && !localStorage.government_name) {
            this.$router.push({
                name: 'general'
            });
        }
        if (localStorage.bank_number) {
            this.bank_number = localStorage.bank_number;
        }
        if (localStorage.government_name) {
            this.government_name = localStorage.government_name;
        }
    },

    methods: {
        init: function init() {},
        onPrev: function onPrev() {
            this.$router.push({
                name: 'client'
            });
        },
        previewMedia: function previewMedia(e) {
            var _this = this;

            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            var signForm = new FormData();
            signForm.append('mode', 2);
            signForm.append('media', $('#media')[0].files[0]);
            this.image_loading = true;
            axios.post('/api/fax/uploadSign', signForm).then(function (response) {
                _this.sign_img = "/assets/signatures/" + response.data.name;
                _this.image_loading = false;
            }).catch(function (error) {
                _this.image_loading = false;
            });
        },
        removeImg: function removeImg() {
            this.sign_img = '';
        },
        resetSign: function resetSign() {
            this.$refs.signaturePad.clearSignature();
        },
        selectMode: function selectMode(mode) {
            this.err_msg = '';
            this.sign_mode = mode;
            if (mode === 2) {
                this.$refs.media.click();
            }
        },
        selectCreateAccount: function selectCreateAccount() {
            console.log(this.createAccount);
        },
        onSave: function onSave() {
            var _this2 = this;

            if (this.sign_mode == 1) {
                var _$refs$signaturePad$s = this.$refs.signaturePad.saveSignature(),
                    isEmpty = _$refs$signaturePad$s.isEmpty,
                    data = _$refs$signaturePad$s.data;

                if (isEmpty) {
                    this.err_msg = 'Please draw your signature.';
                    return false;
                }
                var signForm = new FormData();
                signForm.append('mode', this.sign_mode);
                signForm.append('sign', data);
                signForm.append('create_account', this.createAccount);
                this.loading = true;
                axios.post('/api/fax/publish', signForm).then(function (response) {
                    localStorage.removeItem('bank_number');
                    localStorage.removeItem('government_name');
                    if (response.data.result == "success") {
                        _this2.$emit("changeStep", 4);
                        _this2.$router.push({
                            name: 'thanks'
                        });
                    } else if (response.data.result == "fail") {
                        _this2.$emit("changeStep", 1);
                        _this2.$router.push({
                            name: 'general'
                        });
                    }
                    _this2.loading = false;
                }).catch(function (error) {
                    _this2.loading = false;
                });
            } else if (this.sign_mode == 2) {
                if (this.sign_img == '') {
                    this.err_msg = 'image not found.';
                    return false;
                }
                var _signForm = new FormData();
                _signForm.append('mode', 2);
                _signForm.append('media', $('#media')[0].files[0]);
                _signForm.append('create_account', this.createAccount);
                this.loading = true;
                axios.post('/api/fax/publish', _signForm).then(function (response) {
                    localStorage.removeItem('bank_number');
                    localStorage.removeItem('government_name');
                    if (response.data.result == "success") {
                        _this2.$emit("changeStep", 4);
                        _this2.$router.push({
                            name: 'thanks'
                        });
                    } else if (response.data.result == "fail") {
                        _this2.$emit("changeStep", 1);
                        _this2.$router.push({
                            name: 'general'
                        });
                    }
                    _this2.loading = false;
                }).catch(function (error) {
                    _this2.loading = false;
                });
            } else {
                this.err_msg = 'Plaats hier uw handtekening.';
            }
        }
    }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-0c6f9a88\",\"hasScoped\":false,\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/js/views/sign.vue":
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
                      _vm._v("HANDTEKENING")
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
                              _c(
                                "p",
                                {
                                  staticStyle: {
                                    "font-size": "18px",
                                    padding: "20px",
                                    "background-color": "#eee"
                                  }
                                },
                                [
                                  _vm._v(
                                    "\n                                    Hierbij machtigt u Beslisapp.nl om de " +
                                      _vm._s(this.government_name) +
                                      " in gebreke te stellen. Als de gemeente " +
                                      _vm._s(this.government_name) +
                                      ' niet binnen vijftien dagen een besluit neemt op uw aanvraag of bezwaarschrift is een dwangsom verschuldigd.\n                                    De hoogte van de dwangsom is: 20,- euro per dag voor de eerste 14 dagen. 30,- euro per dag voor de 14 dagen daarna en 40,- euro per dag voor de 14 dagen daarna. De totale dwangsom bedraagt maximaal ".EURO." 1260,-.'
                                  ),
                                  _c("br"),
                                  _c("br"),
                                  _vm._v(
                                    '\n                                    De kosten voor het in gebreke stellen bedragen 30 procent van de uit te betalen dwangsom. De beslisapp incasseert de dwangsom bij de gemeente.\n                                    Zeventig procent van de ontvangen dwangsom wordt binnen twee weken na ontvangst overgemaakt op uw rekeningnummer "' +
                                      _vm._s(this.bank_number) +
                                      '".\n                                '
                                  )
                                ]
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { xs12: "", sm12: "", md12: "" } },
                            [
                              _c("v-select", {
                                staticStyle: { width: "300px" },
                                attrs: {
                                  items: _vm.createOptions,
                                  placeholder: "MAAK EEN ACCOUNT VOOR ME AAN",
                                  "background-color": "primary",
                                  dark: ""
                                },
                                on: {
                                  change: function($event) {
                                    _vm.selectCreateAccount()
                                  }
                                },
                                model: {
                                  value: _vm.createAccount,
                                  callback: function($$v) {
                                    _vm.createAccount = $$v
                                  },
                                  expression: "createAccount"
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
                              _c(
                                "v-btn",
                                {
                                  staticStyle: { "margin-left": "0" },
                                  attrs: {
                                    color: "success",
                                    outline: _vm.sign_mode == 2
                                  },
                                  on: {
                                    click: function($event) {
                                      _vm.selectMode(1)
                                    }
                                  }
                                },
                                [_vm._v("HANDTEKENING MET DE MUIS OF VINGER")]
                              ),
                              _vm._v(" "),
                              _c(
                                "v-btn",
                                {
                                  attrs: {
                                    color: "success",
                                    outline: _vm.sign_mode == 1,
                                    loading: this.image_loading
                                  },
                                  on: {
                                    click: function($event) {
                                      _vm.selectMode(2)
                                    }
                                  }
                                },
                                [
                                  _vm._v(
                                    "UPLOAD EEN AFBEELDING MET UW HANDTEKENING"
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c("input", {
                                ref: "media",
                                staticStyle: { display: "none" },
                                attrs: {
                                  type: "file",
                                  name: "media",
                                  id: "media"
                                },
                                on: { change: _vm.previewMedia }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          this.err_msg
                            ? _c(
                                "v-flex",
                                { attrs: { xs12: "", sm12: "", md12: "" } },
                                [
                                  _c("label", { staticClass: "error--text" }, [
                                    _vm._v(_vm._s(this.err_msg))
                                  ])
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _c(
                            "v-flex",
                            { attrs: { xs12: "", sm12: "", md12: "" } },
                            [
                              _vm.sign_mode == 1
                                ? _c(
                                    "div",
                                    {
                                      staticStyle: {
                                        border: "solid 1px gray",
                                        height: "300px"
                                      }
                                    },
                                    [
                                      _c("VueSignaturePad", {
                                        ref: "signaturePad",
                                        attrs: { height: "300px" }
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "v-btn",
                                        {
                                          staticStyle: {
                                            "margin-left": "0",
                                            "margin-top": "28px"
                                          },
                                          attrs: { color: "" },
                                          on: {
                                            click: function($event) {
                                              _vm.resetSign()
                                            }
                                          }
                                        },
                                        [
                                          _vm._v(
                                            "HANDTEKENING OPNIEUW PLAATSEN"
                                          )
                                        ]
                                      )
                                    ],
                                    1
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _vm.sign_mode == 2
                                ? _c(
                                    "div",
                                    {
                                      staticStyle: {
                                        border: "solid 1px gray",
                                        height: "300px"
                                      }
                                    },
                                    [
                                      _vm.sign_mode == 2
                                        ? [
                                            _c("img", {
                                              staticClass: "img-responsive",
                                              staticStyle: {
                                                "max-width": "200px",
                                                "max-height": "280px"
                                              },
                                              attrs: { src: _vm.sign_img }
                                            })
                                          ]
                                        : _vm._e()
                                    ],
                                    2
                                  )
                                : _vm._e()
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
                                outline: ""
                              },
                              on: { click: _vm.onPrev }
                            },
                            [_vm._v("Terug")]
                          ),
                          _vm._v(" "),
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
                            [_vm._v("VERZENDEN")]
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
    require("vue-hot-reload-api")      .rerender("data-v-0c6f9a88", module.exports)
  }
}

/***/ }),

/***/ "./resources/js/views/sign.vue":
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__("./node_modules/vue-loader/lib/component-normalizer.js")
/* script */
var __vue_script__ = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"cacheDirectory\":true,\"presets\":[[\"env\",{\"modules\":false,\"targets\":{\"browsers\":[\"> 2%\"],\"uglify\":true}}]],\"plugins\":[\"transform-object-rest-spread\",[\"transform-runtime\",{\"polyfill\":false,\"helpers\":false}],\"syntax-dynamic-import\"]}!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./resources/js/views/sign.vue")
/* template */
var __vue_template__ = __webpack_require__("./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-0c6f9a88\",\"hasScoped\":false,\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./resources/js/views/sign.vue")
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
Component.options.__file = "resources/js/views/sign.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0c6f9a88", Component.options)
  } else {
    hotAPI.reload("data-v-0c6f9a88", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});