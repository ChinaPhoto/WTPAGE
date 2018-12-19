'use strict';

var datasData = new Vue({
    el: '#apps',
    data: function data() {
        return {
            products: [],
            snapName: '', // 暂存名字
            open: { // 现在打开的项
                activeName: ''
            },
            //面包屑数组
            current: [],
            fullHeight: window.innerHeight,

            // 动态设置 高度参数
            conHeight: {
                height: window.innerHeight - 111 + 'px',
                overflow: 'auto'
            },
            PageName: ''
        };
    },

    methods: {
        collapsedSider: function collapsedSider(name) {
            this.PageName = name;
            this.breadArray(name);
            console.log(name)
            if (name.indexOf('NonconformingFlow') >= 0) {
                var PageName = name.split('-')[0];
                var PageParams = name.split('-')[1];
                $(this.$refs.loadHtml).load('/pages/' + PageName + '.html?r=' + Math.random(), function() {
                    $('#ClCache').parent('div').css("display", "none");
                });
                $('#LoadParam').val(PageParams);
            } else {
                $(this.$refs.loadHtml).load('/pages/' + name + '.html?r=' + Math.random(), function() {
                    $('#ClCache').parent('div').css("display", "none");
                });
            }
        },

        // 面包屑数组填充
        breadArray: function breadArray(data) {
            var _this = this;
            _this.current = [];
            _this.products.forEach(function(value) {
                if (value.children) {
                    var childArr = value.children;
                    childArr.forEach(function(val) {
                        if (val.url === data) {
                            _this.current.push({ name: value.menuName });
                            _this.current.push({ name: val.menuName });
                        }
                    });
                } else {
                    if (value.url === data) {
                        _this.current.push({ name: value.menuName });
                    }
                }
            });
        },

        //菜单装填
        menuPadding: function menuPadding() {
            var _this2 = this;

            axios.get(webApiUrl + "/api/Form/GetPersonMenu", {
                params: {
                    url: 'CMM'
                }
            }).then(function(res) {
                if (res.data.status == 1) {
                    _this2.products = _this2.dataProcess(res.data.data);
                    _this2.products[0].children.push({ "menuName": "产品追溯", url: "ProductTraceability" });
                    // res.data.data.forEach((val, index) => {
                    //     if (val.url && this.open.activeName == '') {
                    //         this.open.activeName = val.url;
                    //     }
                    //     // this.breadArray(this.open.activeName)
                    // })
                    for (var i = 0; i < res.data.data.length; i++) {
                        if (res.data.data[i].url) {
                            _this2.open.activeName = res.data.data[i].url;
                            break;
                        }
                        _this2.breadArray(_this2.open.activeName);
                    }
                    _this2.collapsedSider(_this2.open.activeName);
                }
            });
        },
        dataProcess: function dataProcess(arr) {
            var arrData = [];
            arr.forEach(function(val, index) {
                if (val.parentId == arr[0].id) {
                    var ID = val.id;
                    val.children = [];
                    arrData.push(val);
                    var array = [];
                    arr.forEach(function(value, index) {
                        if (ID == value.parentId) {
                            array.push(value);
                        };
                    });
                    val.children = array;
                }
            });
            return arrData;
        },
        resizeHeight: function resizeHeight() {
            var _this3 = this;

            //监听高度
            window.onresize = function() {
                _this3.fullHeight = window.innerHeight;
            };
        }
    },
    mounted: function mounted() {
        this.menuPadding();
    }
});

//全局属性 改动 慎用
// iview.Modal.props.closable.default = false

//  babel business --out-dir lib
// 上面是 babel  转义指令
iview.Modal.props.maskClosable.default = false