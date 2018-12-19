﻿    var target = new Vue({
        el: '#mainDiv',
        data() {
            return {
                uploadUrl: webApiUrl + '/api/FormGroupRelation/upload?random=' + Math.random(), // 上传路径
                total: 0, //总条数
                baseModel: {
                    formGroupId: 0,
                    formId: 0
                },
                baseRules: {

                },
                searchType: '', //搜索条件KEY
                searchKey: '', //检索值VALUE
                loading: false, //菊花
                showEdit: false, //编辑窗
                searchModel: { //检索模型
                    search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                    pageIndex: 1, //页码
                    pageSize: 50, //分页大小
                    sort: '' //排序
                },
                columnData: [ //列

                    {
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
                                            _.baseModel.formGroupId = params.row.formGroupId;
                                            _.baseModel.formId = params.row.formId;
                                            _.showEdit = true;
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
                                            _.baseModel.formGroupId = params.row.formGroupId;
                                            _.baseModel.formId = params.row.formId;
                                            _.del();
                                        }
                                    }
                                }, [h('i-button', { props: { type: 'ghost', size: 'small', icon: 'android-delete' } }, '删除')])
                            ]);
                        }
                    }
                ],
                dataSource: [] //数据源
            }
        },
        created() {
            this.search();
        },
        methods: {
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
                this.loading = true;
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: "文件格式错误",
                    desc: "请选择.xls或者.xlsx文件"
                });
                this.loading = false;
            },
            uploadDone(response, file, fileList) {
                this.$Notice.success({
                    title: "提示",
                    desc: "文件上传成功"
                });
                this.loading = false;
                this.search();
            },
            download() {
                var _ = this;
                this.loading = true;
                this.searchModel.search = [];
                if (this.searchType != '' && this.searchKey != '') {
                    this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
                }
                axios.post(webApiUrl + '/api/FormGroupRelation/Download?random=' + Math.random(), _.searchModel)
                    .then(function(response) {
                        if (response.data.status) {
                            _.loading = false;
                            //文件路径response.data.obj
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
                axios.post(webApiUrl + '/api/FormGroupRelation/GetPageList?random=' + Math.random(), _.searchModel)
                    .then(function(response) {
                        if (response.data.status) {
                            _.dataSource = response.data.data.items;
                            _.total = response.data.data.totalNum;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            del() {
                var _ = this;
                this.loading = true;
                axios.post(webApiUrl + "/api/FormGroupRelation/delete?random=" + Math.random(), {
                    id: _.baseModel.formId
                }).then(res => {
                    if (res.data.status) {
                        _.$Message.success("删除成功");
                        _.search();
                    } else {
                        _.$Message.error(res.data.errorCode);
                    }
                    _.loading = false;
                });
            },
            save() {
                var _ = this;
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        var url = webApiUrl + "/api/FormGroupRelation/insert?random=" + Math.random();
                        if (_.baseModel.formId != 0) {
                            url = webApiUrl + "/api/FormGroupRelation/update?random=" + Math.random();
                        }
                        axios.post(url, _.baseModel)
                            .then(function(response) {
                                if (response.data.status) {
                                    _.search();
                                    _.$refs['editForm'].resetFields();
                                    _.showEdit = false;
                                    _.$Message.success('保存成功');
                                } else {
                                    _.$Message.error(response.data.errorCode);
                                }
                                _.loading = false;
                            })
                            .catch(function(error) {
                                console.log(error);
                            });

                    } else {
                        this.$Message.error('保存失败');
                    }
                })
            }
        }
    })