'use strict';

var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        return {
            uploadUrl: webApiUrl + '/api/Quality/upload?random=' + Math.random(), // 上传路径
            total: 0, //总条数
            baseModel: {
                id: 0,
                quality: '',
                tag: '',
                remark: '',
                imgFileId: '',
                createTime: '',
                createUser: ''
            },
            baseRules: {},
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
            columnData: [//列

            {
                align: 'center',
                title: '指标名',
                sortable: 'custom',
                key: 'quality'
            }, {
                align: 'center',
                title: '备注名',
                sortable: 'custom',
                key: 'tag'
            }, {
                align: 'center',
                title: '备注',
                sortable: 'custom',
                key: 'remark'
            }, {
                align: 'center',
                title: '文件ID',
                sortable: 'custom',
                key: 'imgFileId'
            }, {
                align: 'center',
                title: '创建时间',
                sortable: 'custom',
                key: 'createTime'
            }, {
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
                                _.baseModel.id = params.row.id;
                                _.baseModel.quality = params.row.quality;
                                _.baseModel.tag = params.row.tag;
                                _.baseModel.remark = params.row.remark;
                                _.baseModel.imgFileId = params.row.imgFileId;
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
            dataSource: [] //数据源
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
        uploading: function uploading(event, file, fileList) {
            this.loading = true;
        },
        handleFormatError: function handleFormatError(file) {
            this.$Notice.warning({
                title: "文件格式错误",
                desc: "请选择.xls或者.xlsx文件"
            });
            this.loading = false;
        },
        uploadDone: function uploadDone(response, file, fileList) {
            this.$Notice.success({
                title: "提示",
                desc: "文件上传成功"
            });
            this.loading = false;
            this.search();
        },
        download: function download() {
            var _ = this;
            this.loading = true;
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            axios.post(webApiUrl + '/api/Quality/Download?random=' + Math.random(), _.searchModel).then(function (response) {
                if (response.data.status) {
                    _.loading = false;
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
            axios.post(webApiUrl + '/api/Quality/GetPageList?random=' + Math.random(), _.searchModel).then(function (response) {
                if (response.data.status) {
                    _.dataSource = response.data.data.items;
                    _.total = response.data.data.totalNum;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        del: function del() {
            var _ = this;
            this.loading = true;
            axios.post(webApiUrl + "/api/Quality/delete?random=" + Math.random(), {
                id: _.baseModel.id
            }).then(function (res) {
                if (res.data.status) {
                    _.$Message.success("删除成功");
                    _.search();
                } else {
                    _.$Message.error(res.data.errorCode);
                }
                _.loading = false;
            });
        },
        save: function save() {
            var _this = this;

            var _ = this;
            this.$refs['editForm'].validate(function (valid) {
                if (valid) {
                    _this.loading = true;
                    var url = webApiUrl + "/api/Quality/insert?random=" + Math.random();
                    if (_.baseModel.id != 0) {
                        url = webApiUrl + "/api/Quality/update?random=" + Math.random();
                    }
                    axios.post(url, _.baseModel).then(function (response) {
                        if (response.data.status) {
                            _.search();
                            _.$refs['editForm'].resetFields();
                            _.showEdit = false;
                            _.$Message.success('保存成功');
                        } else {
                            _.$Message.error(response.data.errorCode);
                        }
                        _.loading = false;
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    _this.$Message.error('保存失败');
                }
            });
        }
    }
});