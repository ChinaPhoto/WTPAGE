    var target = new Vue({
        el: '#mainDiv',
        data() {
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
                    timeIsShow: true, // 判断创建时间是否隐藏
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
                        align: 'center',
                    }, {
                        title: '工序',
                        key: 'processName',
                        align: 'center',
                    }, {
                        title: '检测项目',
                        key: 'quality',
                        align: 'center',
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
                columnData: [ //列

                    {
                        align: 'center',
                        title: '组名',
                        sortable: 'custom',
                        key: 'groupName'
                    },

                    {
                        align: 'center',
                        title: '创建时间',
                        sortable: 'custom',
                        key: 'createTime',
                        render: (h, { row }) => {
                            if (row.createTime) {
                                let time = row.createTime;
                                return h('div', basis.interceptionTime(time))
                            }
                        }
                    },
                    {
                        align: 'center',
                        title: '查看工序检测项',
                        // key: 'sort'
                        render: (h, { row }) => {
                            return h('i-button', {
                                props: { type: 'ghost', icon: 'eye' },
                                on: {
                                    click: () => {
                                        this.indexModel.isShow = true;
                                        this.indexModel.searchKey = row.id
                                        this.indexChangePage(1)
                                    }
                                }
                            }, '工序检测项')
                        }
                    },
                    {
                        align: 'center',
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('i-Button', {
                                    props: {
                                        type: 'ghost',
                                        size: 'small',
                                        icon: 'android-create'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            var _ = target;
                                            this.$refs['editForm'].resetFields();
                                            _.baseModel.id = params.row.id;
                                            _.baseModel.groupName = params.row.groupName;
                                            _.baseModel.sort = params.row.sort;
                                            // _.baseModel.countTime = params.row.createTime;
                                            _.baseModel.createUser = params.row.createUser;
                                            _.showEdit.isShow = true;
                                            this.baseModel.timeIsShow = false;

                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        title: '确认要删除此条目？',
                                        confirm: true,
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            var _ = target;
                                            _.baseModel.id = params.row.id;
                                            _.del();
                                        }
                                    }
                                }, [h('i-button', { props: { type: 'ghost', size: 'small', icon: 'android-delete' } }, '删除')])
                            ]);
                        }
                    }
                ],
                tableData: {
                    dataSource: [], //数据源
                    tableHeight: 0
                },
            }
        },
        created() {
            this.search();
        },
        methods: {
            add() {
                this.baseModel.timeIsShow = true;
                this.$refs['editForm'].resetFields();
                this.showEdit.isShow = true;
                this.baseModel.id = 0;
            },
            // 取消窗口
            cancel(data) {
                data.isShow = false;
            },
            onSort(column, key, order) {
                this.searchModel.sort = column.key + " " + column.order;
                this.search();
            },
            uploading(event, file, fileList) {
                this.$Spin.show();
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: "文件格式错误",
                    desc: "请选择.xls或者.xlsx文件"
                });
                this.$Spin.hide();
            },
            uploadDone(response, file, fileList) {
                this.$Notice.success({
                    title: "提示",
                    desc: "文件上传成功"
                });
                this.$Spin.hide();
                this.search();
            },
            download() {
                var _ = this;
                this.$Spin.show();
                this.searchModel.search = [];
                if (this.searchType != '' && this.searchKey != '') {
                    this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
                }
                axios.post(webApiUrl + '/api/Group/Download?random=' + Math.random(), _.searchModel)
                    .then(function(response) {
                        if (response.data.status) {
                            _.$Spin.hide();
                            //文件路径response.data.data
                            window.location.href = fileServerUrl + response.data.data;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            search() {
                this.changePage(this.searchModel.pageIndex);
            },
            changePage(pageIndex) {
                var _ = this;
                this.searchModel.search = [];
                if (this.searchType != '' && this.searchKey != '') {
                    this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
                }
                _.searchModel.pageIndex = pageIndex;
                _.$Spin.show();
                axios.post(webApiUrl + '/api/Group/GetPageList?random=' + Math.random(), _.searchModel)
                    .then(function(response) {
                        _.$Spin.hide();
                        if (response.data.status) {
                            _.tableData.dataSource = response.data.data.items;
                            _.total = response.data.data.totalNum;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            // 指标翻页
            indexChangePage(index) {
                this.indexModel.search = [];
                let data = {
                    pageIndex: index,
                    pageSize: this.indexModel.pageSize,
                    search: [{
                        Col: 'GroupId',
                        Val: this.indexModel.searchKey,
                        Operation: '='
                    }],
                    sort: ''
                };
                this.$Spin.show()
                axios.post(webApiUrl + '/api/Group/GetPageListDetail?random=' + Math.random(), data).then((res) => {
                    this.$Spin.hide();
                    if (res.status) {
                        this.indexModel.tableData = res.data.data.items
                        this.indexModel.total = res.data.data.totalNum
                    }
                })
            },
            del() {
                var _ = this;
                this.$Spin.show();
                axios.post(webApiUrl + "/api/Group/delete?random=" + Math.random(), {
                    id: _.baseModel.id
                }).then(res => {
                    _.$Spin.hide();
                    if (res.data.status) {
                        _.$Message.success("删除成功");
                        _.search();
                    } else {
                        _.$Message.error(res.data.errorCode);
                    }

                });
            },
            save() {
                var _ = this;
                // console.log(_.baseModel.depositData)
                // _.baseModel.createTime = basis.interceptionTime(_.baseModel.depositData, 1);

                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        this.$Spin.show();
                        var url = webApiUrl + "/api/Group/insert?random=" + Math.random();
                        if (_.baseModel.id != 0) {
                            url = webApiUrl + "/api/Group/update?random=" + Math.random();
                        }
                        axios.post(url, _.baseModel)
                            .then(function(response) {
                                if (response.data.status) {
                                    _.search();
                                    _.$refs['editForm'].resetFields();
                                    _.showEdit.isShow = false;
                                    _.$Message.success('保存成功');
                                } else {
                                    _.$Message.error(response.data.errorCode);
                                }
                                _.$Spin.hide();
                            })
                            .catch(function(error) {
                                console.log(error);
                            });

                    } else {
                        this.$Message.error('保存失败');
                    }
                })
            },



            // 数据请求
            bindData() {
                this.bindIndexModel.isShow = true;
                let data = {
                    Level: 1
                }
                let url = webApiUrl + "/api/Group/GetGroupQualityTreeByLevel?random=" + Math.random();
                axios.post(url, data).then((res) => {
                    let array = res.data.data;
                    this.bindIndexModel.treeData = this.bindDataResolve(data, array)
                })
            },
            // 返回数据解析
            bindDataResolve(data, arr) {
                let array = [];
                arr.forEach((val, index) => {
                    let obj = {};
                    obj.title = val.ProductCode + '-' + val.title;
                    obj.Id = val.Id;
                    obj.index = val.Level;
                    if (data.Level < 3) {
                        obj.loading = false;
                        obj.children = []
                    }
                    array.push(obj)
                })
                return array
            },


            // loading data 数据的异步加载
            loadData(item, callback) {
                // console.log(item)
                let url = webApiUrl + "/api/Group/GetGroupQualityTreeByLevel?random=" + Math.random();
                if (item.index === 1) {
                    this.bindIndexModel.depositData = item.Id
                }
                let data = {
                    Level: item.index + 1,
                    ProductGuid: this.bindIndexModel.depositData
                }
                if (item.index === 2) {
                    data.ProcessGuid = item.Id;
                }
                // console.log(data.ProcessGuid)
                axios.post(url, data).then((res) => {
                    let array = res.data.data;

                    if (data.Level >= 2) {
                        this.bindIndexModel.treeData.forEach((val, index) => {
                            if (val.Id === data.ProductGuid) {
                                if (data.Level == 2) {
                                    val.children = this.bindDataResolve(data, array)
                                    callback(val.children)
                                } else if (data.Level === 3) {
                                    val.children.forEach((value) => {
                                        if (value.Id === data.ProcessGuid) {
                                            value.children = this.bindDataResolve(data, array)
                                            callback(value.children)
                                        }
                                    })
                                }
                            }
                        })
                    } else if (data.Level === 3) {
                        this.bindIndexModel.treeData.forEach((val, index) => {
                            if (val.Id === data.ProductGuid) {
                                val.children.forEach((value) => {
                                    if (value.Id === data.ProcessGuid) {
                                        value.children = this.bindDataResolve(data, array)
                                        callback(value.children)
                                    }
                                })
                            }
                        })
                    }
                })

            },
            // 选中数据处理
            treeSelect(arr) {
                let array = [];
                this.bindIndexModel.guidData = [];
                arr.forEach((val, index) => {
                    if (val.index !== 1 && val.index !== 2) {
                        array.push(val)
                    }
                })
                array.forEach((value, index) => {
                    this.bindIndexModel.guidData.push({ GroupId: this.indexModel.searchKey, QualityId: value.Id })
                })

            },
            //点击保存的返回的数据
            bingIndex() {
                this.bindIndexModel.isShow = false
                let data = this.bindIndexModel.guidData
                axios.post(webApiUrl + "/api/Group/AddGroupQuality?random=" + Math.random(), data)
                    .then((res) => {
                        this.indexChangePage(1)
                    })
            },
            moduleMaxHeight() {
                this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px'
            }


        },
        mounted() {
            this.moduleMaxHeight()
            basis.tableHeightData(this.tableData)
        }
    })