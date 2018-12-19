'use strict';

var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        return {
            uploadUrl: fileServerUrl + "/UploadFile?ran=" + Math.random(), // 上传路径
            downFile: true,
            batchNo: '',
            total: 0, //总条数
            baseModel: {
                fileId: '',
                taskId: '',
                remark: '',
                id: 0
            },
            baseRules: {},
            searchType: 'batchNo', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: false, //编辑窗
            uploadFile: false,
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            columnData: [//列
            {
                align: 'center',
                title: '任务号',
                sortable: 'custom',
                key: 'taskNo'
            }, {
                align: 'center',
                title: '炉号',
                sortable: 'custom',
                key: 'batchNo'
            }, {
                align: 'center',
                title: '产品',
                sortable: 'custom',
                key: 'productName'
            }, {
                align: 'center',
                title: '检验员',
                sortable: 'custom',
                key: 'userName'
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
                    var button = [];
                    if (params.row.state == 0) {
                        button.push(h('i-Button', {
                            props: {
                                type: 'ghost',
                                size: 'small',
                                icon: 'arrow-up-a'

                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: function click() {
                                    console.log(params);
                                    var _ = target;
                                    if (params.row.state == 0) {
                                        _.baseModel.taskId = params.row.id;
                                        _.baseModel.fileId = '';
                                        _.batchNo = params.row.batchNo;
                                        _.showEdit = true;
                                    } else {
                                        _.$Spin.show();
                                        axios.get(webApiUrl + '/api/Task/GetCMMByTaskId?random=' + Math.random(), {
                                            params: {
                                                taskId: params.row.id
                                            }
                                        }).then(function (response) {
                                            if (response.data.status) {
                                                _.downFile = false;
                                                _.baseModel.remark = response.data.data[0].remark;
                                                _.showEdit = true;
                                            } else {
                                                _.$Message.success(response.data.errorCode);
                                            }
                                            _.$Spin.hide();
                                        }).catch(function (error) {
                                            console.log(error);
                                            _.$Spin.hide();
                                        });
                                    }
                                }
                            }
                        }, '上传'));
                    }
                    if (params.row.state == 2) {
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
                                    var _ = target;
                                    _.$Spin.show();
                                    axios.get(webApiUrl + '/api/Task/GetCMMByTaskId?ran=' + Math.random(), {
                                        params: {
                                            taskId: params.row.id
                                        }
                                    }).then(function (response) {
                                        if (response.data.status) {
                                            window.open(fileServerUrl + '/GetFileStramById?fileID=' + response.data.data[0].fileId);
                                        } else {
                                            _.$Message.success(response.data.errorCode);
                                        }
                                        _.$Spin.hide();
                                    }).catch(function (error) {
                                        console.log(error);
                                        _.$Spin.hide();
                                    });
                                }
                            }
                        }, '下载三坐标'));
                    }
                    return h('div', button);
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
            this.showEdit = true;
            this.baseModel.id = 0;
        },
        onSort: function onSort(column, key, order) {
            this.searchModel.sort = column.key + " " + column.order;
            this.search();
        },
        beforeUpload: function beforeUpload(event) {
            if (event.name != this.batchNo + ".pdf" && event.name != this.batchNo + ".PDF") {
                this.$Notice.warning({
                    title: "文件格式错误",
                    desc: "请选择和炉号对应的PDF文件"
                });
                return false;
            }
        },
        uploading: function uploading(event, file, fileList) {
            this.$Spin.show();
        },
        handleFormatError: function handleFormatError(file) {
            this.$Notice.warning({
                title: "文件格式错误",
                desc: "请选择和炉号对应的PDF文件"
            });
            this.$Spin.hide();
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
            //window.open(this.downFile)
        },
        cancel: function cancel() {
            this.showEdit = false;
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
            axios.post(webApiUrl + '/api/Task/GetPageListDetailCMM?ran=' + Math.random(), _.searchModel).then(function (response) {
                _.$Spin.hide();
                if (response.data.status) {
                    _.tableData.dataSource = response.data.data.items;
                    _.total = response.data.data.totalNum;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        save: function save() {
            var _this = this;

            var _ = this;
            if (_.baseModel.fileId == '') {
                this.$Message.warning('请上传三坐标文件');
                return;
            }
            this.$refs['editForm'].validate(function (valid) {
                if (valid) {
                    _this.$Spin.show();
                    var url = webApiUrl + "/api/Task/AddCMM?ran=" + Math.random();
                    axios.post(url, _.baseModel).then(function (response) {
                        if (response.data.status) {
                            _.search();
                            _.$refs['editForm'].resetFields();
                            _.showEdit = false;
                            _.$Message.success('保存成功');
                        } else {
                            _.$Message.error(response.data.errorCode);
                        }
                        _.$Spin.hide();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    _this.$Message.error('保存失败');
                }
            });
        }
    },
    mounted: function mounted() {
        basis.tableHeightData(this.tableData);
    }
});