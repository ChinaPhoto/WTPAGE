    var target = new Vue({
        el: '#mainDiv',
        data() {
            return {
                uploadUrl: webApiUrl + '/api/Task/upload?random=' + Math.random(), // 上传路径
                total: 0, //总条数
                baseModel: {
                    batchNo: '',
                    productID: '',
                    productName: '',
                    userName: '', //自动补全数据
                    checkUser: '',
                    taskNo: '',
                    createTime: '',
                    id: 0,
                    CompletionValue: [] //自动补全数据返回数据
                },
                Temporary: '',
                searchType: 'batchNo', //搜索条件KEY
                searchKey: '', //检索值VALUE
                loading: false, //菊花
                showEdit: false, //编辑窗
                searchModel: { //检索模型
                    search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                    pageIndex: 1, //页码
                    pageSize: 50, //分页大小
                    sort: '' //排序
                },
                baseRules: {
                    userName: [{
                        required: true,
                        message: '必填',
                        trigger: 'change'
                    }]
                },
                columnData: [ //列

                    {
                        align: 'center',
                        title: '炉号',
                        sortable: 'custom',
                        key: 'batchNo'
                    },
                    {
                        align: 'center',
                        title: '产品',
                        sortable: 'custom',
                        key: 'productName'
                    },
                    {
                        align: 'center',
                        title: '检验员',
                        sortable: 'custom',
                        key: 'userName'
                    },
                    {
                        align: 'center',
                        title: '任务号',
                        sortable: 'custom',
                        key: 'taskNo'
                    },
                    {
                        align: 'center',
                        title: '工序检验单名称',
                        sortable: 'custom',
                        key: 'formTitle'
                    },
                    {
                        align: 'center',
                        title: '创建时间',
                        sortable: 'custom',
                        key: 'createTime',
                        render: (h, params) => {
                            var ctime = params.row.createTime;
                            if (ctime.length > 19) {
                                ctime = ctime.substr(0, 19).replace('T', ' ');
                            } else {
                                ctime = ctime.replace('T', ' ');
                            }
                            return h('div', ctime)
                        }
                    },
                    {
                        align: 'center',
                        title: '操作',
                        key: 'action',
                        render: (h, { row }) => {
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
                                            this.baseModel.CompletionValue = [];
                                            _.baseModel.batchNo = row.batchNo;
                                            _.baseModel.productName = row.productName;
                                            _.baseModel.checkUser = row.checkUser;
                                            _.baseModel.userName = row.userName;
                                            _.baseModel.taskNo = row.taskNo;
                                            _.baseModel.createTime = row.createTime;
                                            _.baseModel.id = row.id;
                                            _.showEdit = true;
                                            _.Temporary = row.productID;
                                            _.baseModel.productID = row.productID;
                                        }
                                    }
                                }, '编辑')
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
            // 检验员自动补全
            completeReq(value) {
                if (value) {
                    let data = this.baseModel.userName,
                        url = webApiUrl + '/api/Task/GetUserByName?random=' + Math.random();
                    axios.get(url, {
                        params: { userName: data }
                    }).then((res) => {
                        this.baseModel.CompletionValue = res.data.data;
                    }).catch()
                } else {
                    this.baseModel.productID = ''
                }

            },
            // 筛选区分大小写
            filterMethod(value, option) {
                return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
            },
            add() {
                this.$refs['editForm'].resetFields();
                this.showEdit = true;
                this.baseModel.id = 0;
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
            // 选中产品guid 
            projectGuidReq(value) {
                if (value) {
                    let valueData = value.split('-')[1];

                    this.baseModel.CompletionValue.forEach((val, index) => {
                        if (val.UserName === valueData) {
                            this.baseModel.productID = val.Id
                        }
                    })
                }
            },
            download() {
                var _ = this;
                this.$Spin.show();
                this.searchModel.search = [];
                if (this.searchType != '' && this.searchKey != '') {
                    this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
                }
                axios.post(webApiUrl + '/api/Task/Download?random=' + Math.random(), _.searchModel)
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
                axios.post(webApiUrl + '/api/Task/GetPageListDetail?random=' + Math.random(), _.searchModel)
                    .then(function(response) {
                        _.$Spin.hide();
                        _.tableData.dataSource = [];
                        if (response.data.status) {
                            let data = response.data.data.items;
                            data.forEach((value, index) => {
                                let obj = {
                                    batchNo: value.batchNo,
                                    productName: value.productName,
                                    userName: value.loginAccount + '-' + value.userName,
                                    taskNo: value.taskNo,
                                    formTitle: value.formTitle,
                                    createTime: value.createTime,
                                    id: value.id,
                                    productID: value.productID
                                }
                                _.tableData.dataSource.push(obj)
                            })
                            _.total = response.data.data.totalNum;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            cancel() {
                this.showEdit = false
            },
            del() {
                var _ = this;
                this.$Spin.show();
                axios.post(webApiUrl + "/api/Task/delete?random=" + Math.random(), {
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
                if (this.Temporary !== this.baseModel.productID) {
                    let data = {
                        Id: this.baseModel.id,
                        CheckUser: this.baseModel.productID
                    };
                    let url = webApiUrl + "/api/Task/UpdateCheckUser?random=" + Math.random()
                    this.$refs['editForm'].validate((valid) => {

                        if (valid) {
                            if (this.baseModel.productID) {

                                this.$Spin.show();
                                axios.post(url, data).then(
                                    (res) => {
                                        if (res.data.status) {
                                            this.search();
                                            this.showEdit = false;
                                            this.$Spin.hide();
                                            this.$Message.success('保存成功');
                                        } else {
                                            this.$Message.error(res.data.msg);
                                        }
                                    }
                                ).catch(function(error) {
                                    console.log(error);
                                });
                            } else {
                                this.$Message.error('保存失败');
                                this.$Message.warning('请选择正确的检验员');
                                _.$Spin.hide();
                            }

                        } else {
                            this.$Message.error('验证失败');
                        }
                    })
                } else {
                    this.showEdit = false;
                }

            }

        },
        mounted() {
            basis.tableHeightData(this.tableData)
        }
    });