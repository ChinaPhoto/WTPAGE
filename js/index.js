let datasData = new Vue({
    el: '#apps',
    data() {
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
            PageName: '',
        }
    },
    methods: {
        collapsedSider(name) {
            this.PageName = name
            this.breadArray(name)
            if (name.indexOf('NonconformingFlow') >= 0) {
                var PageName = name.split('-')[0];
                var PageParams = name.split('-')[1];
                $(this.$refs.loadHtml).load('/pages/' + PageName + '.html?r=' + Math.random(), function() {
                    $('#ClCache').parent('div').css("display", "none")
                });
                $('#LoadParam').val(PageParams);
            } else {
                $(this.$refs.loadHtml).load('/pages/' + name + '.html?r=' + Math.random(), function() {
                    $('#ClCache').parent('div').css("display", "none")
                });
            }

        },
        // 面包屑数组填充
        breadArray(data) {
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
                    })
                } else {
                    if (value.url === data) {
                        _this.current.push({ name: value.menuName })
                    }

                }
            })
        },
        //菜单装填
        menuPadding() {
            axios.get(webApiUrl + "/api/Form/GetPersonMenu", {
                params: {
                    url: 'CMM'
                }
            }).then((res) => {
                if (res.data.status == 1) {
                    this.products = this.dataProcess(res.data.data);
                    for (let i = 0; i < res.data.data.length; i++) {
                        if (res.data.data[i].url) {
                            this.open.activeName = res.data.data[i].url;
                            break;
                        }
                        this.breadArray(this.open.activeName)
                    }
                    this.collapsedSider(this.open.activeName)
                }
            })

        },
        dataProcess(arr) {
            let arrData = [];
            arr.forEach((val, index) => {
                if (val.parentId == arr[0].id) {
                    let ID = val.id
                    val.children = [];
                    arrData.push(val);
                    let array = []
                    arr.forEach((value, index) => {
                        if (ID == value.parentId) {
                            array.push(value)

                        };
                    })
                    val.children = array;
                }
            })
            return arrData
        },
        resizeHeight() { //监听高度
            window.onresize = () => {
                this.fullHeight = window.innerHeight;
            }
        }
    },
    mounted() {
        this.menuPadding();
    }
})


//全局属性 改动 慎用
// iview.Modal.props.closable.default = false
// 上面是 babel  转义指令
//  babel business --out-dir lib 

iview.Modal.props.maskClosable.default = false