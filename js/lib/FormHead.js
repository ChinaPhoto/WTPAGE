'use strict';

var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        var _this = this;

        var validateformHead = function validateformHead(rule, value, callback) {
            if (!value) {
                return callback(new Error('必填'));
            }

            axios.post(webApiUrl + '/api/FormHead/IsFormHead?random=' + Math.random(), _this.baseModel).then(function (response) {
                if (response.data.status) {

                    callback();
                } else {
                    return callback(new Error(response.data.errorCode));
                }
            }).catch(function (error) {

                callback(new Error(error));
            });
        };
        return {
            uploadUrl: fileServerUrl + "/UploadFile", // 上传路径
            total: 0, //总条数
            baseModel: {
                id: 0,
                content: '',
                fileId: '',
                createTime: new Date(),
                createUser: ''
            },
            baseRules: {
                content: [{ required: true, validator: validateformHead, trigger: 'blur' }]
            },
            searchType: 'content', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: false, //编辑窗
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            columnData: [//列

            {
                align: 'center',
                title: '产品检验单表头',
                sortable: 'custom',
                key: 'content'
            }, {
                align: 'center',
                title: '图片',
                key: 'fileId',
                render: function render(h, params) {
                    if (params.row.fileId) {
                        var button = [];
                        button.push(h('i-Button', {
                            props: {
                                type: 'info',
                                size: 'small',
                                icon: 'arrow-down-a'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: function click() {
                                    window.open(fileServerUrl + '/GetFileStramById?fileID=' + params.row.fileId);
                                }
                            }
                        }, '下载图片'));
                        return h('div', button);
                    } else {
                        return h('div', '');
                    }
                }
            }, {
                align: 'center',
                title: '创建时间',
                sortable: 'custom',
                key: 'createTime',
                render: function render(h, params) {
                    var ctime = params.row.createTime;
                    if (ctime.length > 19) {
                        ctime = ctime.substr(0, 19).replace('T', ' ');
                    } else {
                        ctime = ctime.replace('T', ' ');
                    }
                    return h('div', ctime);
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
                                _.baseModel.content = params.row.content;
                                _.baseModel.fileId = params.row.fileId;
                                _.baseModel.createTime = params.row.createTime;
                                _.baseModel.createUser = params.row.createUser;
                                _.showEdit = true;
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
            this.$refs['editForm'].resetFields();
            this.baseModel.fileId = '';
            this.showEdit = true;
            this.baseModel.id = 0;
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
                desc: "请选择.bmp .jpg .png .svg .gif 图片"
            });
            this.$Spin.hide();
        },
        cancel: function cancel() {
            this.showEdit = false;
        },
        uploadDone: function uploadDone(response, file, fileList) {
            this.$Notice.success({
                title: "提示",
                desc: "文件上传成功"
            });
            this.$Spin.hide();
            this.baseModel.fileId = response.Data;
            this.search();
        },
        download: function download() {
            var _ = this;
            this.$Spin.show();
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            axios.post(webApiUrl + '/api/FormHead/Download?random=' + Math.random(), _.searchModel).then(function (response) {
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
            axios.post(webApiUrl + '/api/FormHead/GetPageList?random=' + Math.random(), _.searchModel).then(function (response) {
                _.$Spin.hide();
                if (response.data.status) {
                    _.tableData.dataSource = response.data.data.items;
                    _.total = response.data.data.totalNum;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        del: function del() {
            var _ = this;
            this.$Spin.show();
            axios.post(webApiUrl + "/api/FormHead/delete?random=" + Math.random(), {
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
            var _this2 = this;

            var _ = this;
            this.$refs['editForm'].validate(function (valid) {
                if (valid) {
                    _this2.$Spin.show();
                    var url = webApiUrl + "/api/FormHead/insert?random=" + Math.random();
                    if (_.baseModel.id != 0) {
                        url = webApiUrl + "/api/FormHead/update?random=" + Math.random();
                    }

                    axios.post(url, _.baseModel).then(function (response) {
                        if (response.data.status) {
                            _.search();
                            _.showEdit = false;
                            _.$refs['editForm'].resetFields();
                            _.$Message.success('保存成功');
                        } else {
                            _.$Message.error(response.data.errorCode);
                        }
                        _.$Spin.hide();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    _this2.$Message.error('验证失败');
                }
            });
        }
    },

    mounted: function mounted() {
        basis.tableHeightData(this.tableData);
    }
});