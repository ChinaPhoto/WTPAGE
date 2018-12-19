'use strict';

var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        var _this = this;

        return {
            uploadUrl: webApiUrl + '/api/Group/upload?random=' + Math.random(), // 上传路径
            total: 0, //总条数
            // deposit: '', // 计算数据暂存
            baseModel: {
                id: 0,
                groupName: '',
                sort: 0,
                createTime: new Date(),
                countTime: '',
                createUser: '',
                timeIsShow: true // 判断创建时间是否隐藏
                // 时间数据暂存
                // depositData: new Date()
            },
            windowHeight: document.documentElement.clientHeight,
            modalMaxHeight: {
                maxHeight: '110px',
                overflowX: 'hidden',
                overflowY: 'auto'
            },
            baseRules: {
                groupName: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }]
            },
            indexModel: { // 指标弹窗
                isShow: false,
                total: 0, //总调数
                pageIndex: 1,
                pageSize: 6,
                search: [], // 那个啥数据
                sort: '', // 排序 ...
                searchType: '', //搜索条件KEY
                searchKey: '', //检索值VALUE
                table: [{
                    title: '产品',
                    key: 'productName',
                    align: 'center'
                }, {
                    title: '工序',
                    key: 'processName',
                    align: 'center'
                }, {
                    title: '检测项目',
                    key: 'quality',
                    align: 'center'
                }, {
                    title: '备注',
                    key: 'remark',
                    align: 'center'
                }],
                tableData: []
            },
            bindIndexModel: { //绑定指标弹窗
                isShow: false,
                depositData: '', // 暂存的id
                treeData: [], // 树的集合
                guidData: [] // 选中的guid 的集合
            },
            searchType: 'groupName', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: {
                isShow: false
            }, //编辑窗
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            columnData: [//列

            {
                align: 'center',
                title: '组名',
                sortable: 'custom',
                key: 'groupName'
            }, {
                align: 'center',
                title: '创建时间',
                sortable: 'custom',
                key: 'createTime',
                render: function render(h, _ref) {
                    var row = _ref.row;

                    if (row.createTime) {
                        var time = row.createTime;
                        return h('div', basis.interceptionTime(time));
                    }
                }
            }, {
                align: 'center',
                title: '查看工序检测项',
                // key: 'sort'
                render: function render(h, _ref2) {
                    var row = _ref2.row;

                    return h('i-button', {
                        props: { type: 'ghost', icon: 'eye' },
                        on: {
                            click: function click() {
                                _this.indexModel.isShow = true;
                                _this.indexModel.searchKey = row.id;
                                _this.indexChangePage(1);
                            }
                        }
                    }, '工序检测项');
                }
            }, {
                align: 'center',
                title: '操作',
                key: 'action',
                render: function render(h, params) {
                    return h('div', [h('i-Button', {
                        props: {
                            type: 'ghost',
                            size: 'small',
                            icon: 'android-create'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: function click() {
                                var _ = target;
                                _this.$refs['editForm'].resetFields();
                                _.baseModel.id = params.row.id;
                                _.baseModel.groupName = params.row.groupName;
                                _.baseModel.sort = params.row.sort;
                                // _.baseModel.countTime = params.row.createTime;
                                _.baseModel.createUser = params.row.createUser;
                                _.showEdit.isShow = true;
                                _this.baseModel.timeIsShow = false;
                            }
                        }
                    }, '编辑'), h('Poptip', {
                        props: {
                            title: '确认要删除此条目？',
                            confirm: true,
                            transfer: true
                        },
                        on: {
                            'on-ok': function onOk() {
                                var _ = target;
                                _.baseModel.id = params.row.id;
                                _.del();
                            }
                        }
                    }, [h('i-button', { props: { type: 'ghost', size: 'small', icon: 'android-delete' } }, '删除')])]);
                }
            }],
            tableData: {
                dataSource: [], //数据源
                tableHeight: 0
            }
        };
    },
    created: function created() {
        this.search();
    },

    methods: {
        add: function add() {
            this.baseModel.timeIsShow = true;
            this.$refs['editForm'].resetFields();
            this.showEdit.isShow = true;
            this.baseModel.id = 0;
        },

        // 取消窗口
        cancel: function cancel(data) {
            data.isShow = false;
        },
        onSort: function onSort(column, key, order) {
            this.searchModel.sort = column.key + " " + column.order;
            this.search();
        },
        uploading: function uploading(event, file, fileList) {
            this.$Spin.show();
        },
        handleFormatError: function handleFormatError(file) {
            this.$Notice.warning({
                title: "文件格式错误",
                desc: "请选择.xls或者.xlsx文件"
            });
            this.$Spin.hide();
        },
        uploadDone: function uploadDone(response, file, fileList) {
            this.$Notice.success({
                title: "提示",
                desc: "文件上传成功"
            });
            this.$Spin.hide();
            this.search();
        },
        download: function download() {
            var _ = this;
            this.$Spin.show();
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            axios.post(webApiUrl + '/api/Group/Download?random=' + Math.random(), _.searchModel).then(function (response) {
                if (response.data.status) {
                    _.$Spin.hide();
                    //文件路径response.data.data
                    window.location.href = fileServerUrl + response.data.data;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        search: function search() {
            this.changePage(this.searchModel.pageIndex);
        },
        changePage: function changePage(pageIndex) {
            var _ = this;
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            _.searchModel.pageIndex = pageIndex;
            _.$Spin.show();
            axios.post(webApiUrl + '/api/Group/GetPageList?random=' + Math.random(), _.searchModel).then(function (response) {
                _.$Spin.hide();
                if (response.data.status) {
                    _.tableData.dataSource = response.data.data.items;
                    _.total = response.data.data.totalNum;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },

        // 指标翻页
        indexChangePage: function indexChangePage(index) {
            var _this2 = this;

            this.indexModel.search = [];
            var data = {
                pageIndex: index,
                pageSize: this.indexModel.pageSize,
                search: [{
                    Col: 'GroupId',
                    Val: this.indexModel.searchKey,
                    Operation: '='
                }],
                sort: ''
            };
            this.$Spin.show();
            axios.post(webApiUrl + '/api/Group/GetPageListDetail?random=' + Math.random(), data).then(function (res) {
                _this2.$Spin.hide();
                if (res.status) {
                    _this2.indexModel.tableData = res.data.data.items;
                    _this2.indexModel.total = res.data.data.totalNum;
                }
            });
        },
        del: function del() {
            var _ = this;
            this.$Spin.show();
            axios.post(webApiUrl + "/api/Group/delete?random=" + Math.random(), {
                id: _.baseModel.id
            }).then(function (res) {
                _.$Spin.hide();
                if (res.data.status) {
                    _.$Message.success("删除成功");
                    _.search();
                } else {
                    _.$Message.error(res.data.errorCode);
                }
            });
        },
        save: function save() {
            var _this3 = this;

            var _ = this;
            // console.log(_.baseModel.depositData)
            // _.baseModel.createTime = basis.interceptionTime(_.baseModel.depositData, 1);

            this.$refs['editForm'].validate(function (valid) {
                if (valid) {
                    _this3.$Spin.show();
                    var url = webApiUrl + "/api/Group/insert?random=" + Math.random();
                    if (_.baseModel.id != 0) {
                        url = webApiUrl + "/api/Group/update?random=" + Math.random();
                    }
                    axios.post(url, _.baseModel).then(function (response) {
                        if (response.data.status) {
                            _.search();
                            _.$refs['editForm'].resetFields();
                            _.showEdit.isShow = false;
                            _.$Message.success('保存成功');
                        } else {
                            _.$Message.error(response.data.errorCode);
                        }
                        _.$Spin.hide();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    _this3.$Message.error('保存失败');
                }
            });
        },


        // 数据请求
        bindData: function bindData() {
            var _this4 = this;

            this.bindIndexModel.isShow = true;
            var data = {
                Level: 1
            };
            var url = webApiUrl + "/api/Group/GetGroupQualityTreeByLevel?random=" + Math.random();
            axios.post(url, data).then(function (res) {
                var array = res.data.data;
                _this4.bindIndexModel.treeData = _this4.bindDataResolve(data, array);
            });
        },

        // 返回数据解析
        bindDataResolve: function bindDataResolve(data, arr) {
            var array = [];
            arr.forEach(function (val, index) {
                var obj = {};
                obj.title = val.ProductCode + '-' + val.title;
                obj.Id = val.Id;
                obj.index = val.Level;
                if (data.Level < 3) {
                    obj.loading = false;
                    obj.children = [];
                }
                array.push(obj);
            });
            return array;
        },


        // loading data 数据的异步加载
        loadData: function loadData(item, callback) {
            var _this5 = this;

            // console.log(item)
            var url = webApiUrl + "/api/Group/GetGroupQualityTreeByLevel?random=" + Math.random();
            if (item.index === 1) {
                this.bindIndexModel.depositData = item.Id;
            }
            var data = {
                Level: item.index + 1,
                ProductGuid: this.bindIndexModel.depositData
            };
            if (item.index === 2) {
                data.ProcessGuid = item.Id;
            }
            // console.log(data.ProcessGuid)
            axios.post(url, data).then(function (res) {
                var array = res.data.data;

                if (data.Level >= 2) {
                    _this5.bindIndexModel.treeData.forEach(function (val, index) {
                        if (val.Id === data.ProductGuid) {
                            if (data.Level == 2) {
                                val.children = _this5.bindDataResolve(data, array);
                                callback(val.children);
                            } else if (data.Level === 3) {
                                val.children.forEach(function (value) {
                                    if (value.Id === data.ProcessGuid) {
                                        value.children = _this5.bindDataResolve(data, array);
                                        callback(value.children);
                                    }
                                });
                            }
                        }
                    });
                } else if (data.Level === 3) {
                    _this5.bindIndexModel.treeData.forEach(function (val, index) {
                        if (val.Id === data.ProductGuid) {
                            val.children.forEach(function (value) {
                                if (value.Id === data.ProcessGuid) {
                                    value.children = _this5.bindDataResolve(data, array);
                                    callback(value.children);
                                }
                            });
                        }
                    });
                }
            });
        },

        // 选中数据处理
        treeSelect: function treeSelect(arr) {
            var _this6 = this;

            var array = [];
            this.bindIndexModel.guidData = [];
            arr.forEach(function (val, index) {
                if (val.index !== 1 && val.index !== 2) {
                    array.push(val);
                }
            });
            array.forEach(function (value, index) {
                _this6.bindIndexModel.guidData.push({ GroupId: _this6.indexModel.searchKey, QualityId: value.Id });
            });
        },

        //点击保存的返回的数据
        bingIndex: function bingIndex() {
            var _this7 = this;

            this.bindIndexModel.isShow = false;
            var data = this.bindIndexModel.guidData;
            axios.post(webApiUrl + "/api/Group/AddGroupQuality?random=" + Math.random(), data).then(function (res) {
                _this7.indexChangePage(1);
            });
        },
        moduleMaxHeight: function moduleMaxHeight() {
            this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px';
        }
    },
    mounted: function mounted() {
        this.moduleMaxHeight();
        basis.tableHeightData(this.tableData);
    }
});