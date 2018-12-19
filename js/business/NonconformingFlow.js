var state = {
    0: "未处理",
    1: "处理中",
    2: "处理完成"
};
var processId, NonconformingFlowId;
var datacolumn = [ //列
    {
        title: '工序名称',
        align: 'center',
        key: 'processName'
    },
    {
        align: 'center',
        title: '炉号',
        sortable: 'custom',
        key: 'batchNo'
    },
    {
        align: 'center',
        title: '子件',
        sortable: 'custom',
        key: 'productCode'
    },
    {
        align: 'center',
        title: '子件名称',
        sortable: 'custom',
        key: 'productName'
    },
    {
        align: 'center',
        title: '班组',
        sortable: 'custom',
        key: 'teamName'
    },
    {
        align: 'center',
        title: '操作工',
        sortable: 'custom',
        key: 'operatorName'
    },
    {
        align: 'center',
        title: '检验员',
        sortable: 'custom',
        key: 'checkerName'
    },
    {
        align: 'center',
        title: '提交时间',
        sortable: 'custom',
        key: 'submitTime',
        render: (h, params, v) => {
            return h('span', basis.baseData(params.row.submitTime, 4));
        }
    },
    {
        align: 'center',
        title: '状态',
        sortable: 'custom',
        key: 'status',
        render: (h, params, v) => {
            return h('span', state[params.row.status]);
        }
    },
    {
        title: '操作',
        key: 'action',
        width: 80,
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
                            _.$refs['qualityEditForm'].resetFields();
                            _.$refs['technologyEditForm'].resetFields();
                            _.technology.auditor = "";
                            _.technology.auditorDate = "";
                            _.quality.auditor = "";
                            _.quality.auditorDate = "";

                            processId = params.row.processId;
                            NonconformingFlowId = params.row.id;
                            _.baseModel.batchNo = params.row.batchNo;
                            _.baseModel.productCode = params.row.productCode;
                            _.baseModel.productName = params.row.productName;
                            _.baseModel.status = params.row.status;
                            //获取单个当前检验项信息
                            axios.get(webApiUrl + '/api/NonconformingFlow/GetCurrentCheckInfo?ProcessGuid=' + params.row.processId + '&NonconformingFlowId=' + NonconformingFlowId)
                                .then(function (response) {
                                    if (response.data.status) {
                                        CheckConvertData(response.data.data);
                                        _.checkTableData = response.data.data;
                                        _.checkSuggest = params.row.opinion;
                                        _.showEdit = true;
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            axios.get(webApiUrl + '/api/NonconformingFlow/GetAuditInfoByNFID?NFID=' + NonconformingFlowId + "&auditType=" + 0)
                                .then(function (response) {
                                    if (response.data.status) {
                                        var data = response.data.data;
                                        _.technology.state = data.result.toString();
                                        _.technology.remark = data.opinion;
                                        _.technology.auditor = data.createUserName;
                                        _.technology.auditorDate = basis.baseData(data.createTime, 4);
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            axios.get(webApiUrl + '/api/NonconformingFlow/GetAuditInfoByNFID?NFID=' + NonconformingFlowId + "&auditType=" + 1)
                                .then(function (response) {
                                    if (response.data.status) {
                                        var data = response.data.data;
                                        _.quality.state = data.result.toString();
                                        _.quality.remark = data.opinion;
                                        _.quality.auditor = data.createUserName;
                                        _.quality.auditorDate = basis.baseData(data.createTime, 4);
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            target.saveState = !ValidateEdit(target, params);
                        }
                    }
                }, ValidateEdit(target, params) ? '编辑' : '查看'),
            ]);
        }
    }
]

function ValidateEdit(target, params) {
    if (target.state == 'technology') {
        if (params.row.status > 0) {
            return false;
        }
    } else {
        if (params.row.status > 1 || params.row.status == 0) {
            return false;
        }
    }
    return true;
}

function checkFormatter(rowData, rowIndex, pagingIndex, field) {
    if (rowData.qualityType == 3) {
        if (field == 'myCheck' && !rowData.myCheckValue) {
            return '-';
        }
        if (field != 'myCheck' && !rowData.professionalCheckValue) {
            return '-';
        }
        return "<a onclick='view(\"" + (field == 'myCheck' ? rowData.myCheckValue : rowData.professionalCheckValue) + "\")'>查 看</a>";
    }
    if (field == 'myCheck') {
        if (rowData.myCheck == 1) {
            return '<span style="color:green" >' + boolConvertValue(rowData.qualityType, rowData.myCheckValue) + '</span>';
        } else if (rowData.myCheck == 0) {
            return '<span style="color:red" >' + boolConvertValue(rowData.qualityType, rowData.myCheckValue) + '</span>'
        } else {
            return (!rowData.myCheckValue) ? '-' : rowData.myCheckValue;
        }
    } else if (field == 'professionalCheck') {
        if (rowData.professionalCheck == 1) {
            return '<span style="color:green" >' + boolConvertValue(rowData.qualityType, rowData.professionalCheckValue) + '</span>';
        } else if (rowData.professionalCheck == 0) {
            return '<span style="color:red" >' + boolConvertValue(rowData.qualityType, rowData.professionalCheckValue) + '</span>'
        } else {
            return (!rowData.professionalCheck) ? '-' : rowData.myCheckValue;;
        }
    }
}

function boolConvertValue(type, value) {
    if (type == '2') {
        return value == "true" ? '是' : '否';
    } else {
        return value == null ? '-' : value;
    }
}

function view(id) {
    target.showImgFilepath = fileServerUrl + "/GetFileStramById?fileID=" + id;
    target.showImg = true;
}
var checkcolumn = [ //列
    {
        width: 100,
        columnAlign: 'center',
        field: 'processName'
    },
    {
        width: 100,
        columnAlign: 'center',
        field: 'qualityName',
        formatter: function (rowData, rowIndex, pagingIndex, field) {
            if (rowData.qualityImg) {
                return "<img style='width:95px;height:39px' src='" + fileServerUrl + "/GetFileStramById?fileID=" + rowData.qualityImg + "'></img>";
            } else {
                return rowData.qualityName;
            }
        }
    },
    {
        width: 100,
        columnAlign: 'center',
        field: 'evaluation'
    },
    {
        width: 80,
        columnAlign: 'center',
        field: 'myCheck',
        formatter: checkFormatter
    },
    {
        width: 80,
        columnAlign: 'center',
        field: 'professionalCheck',
        formatter: checkFormatter
    },
    {
        width: 100,
        columnAlign: 'center',
        field: 'standard',
        formatter: function (rowData, rowIndex, pagingIndex, field) {
            if (rowData.qualityType == 3) {
                return "";
            } else {
                return rowData.standard;
            }
        }
    },
    {
        width: 100,
        columnAlign: 'center',
        field: 'cmmFileId'
    }
]
var checktitleRows = [
    [
        { fields: ['processName'], title: '工序名称', titleAlign: 'center', rowspan: 2 },
        { fields: ['qualityName'], title: '检测项目', titleAlign: 'center', rowspan: 2 },
        { fields: ['evaluation'], title: '评价测量技术', titleAlign: 'center', rowspan: 2 },
        { fields: ['myCheck', 'professionalCheck'], title: '实测数据', titleAlign: 'center', colspan: 2, },
        { fields: ['standard'], title: '检测标准', titleAlign: 'center', rowspan: 2 },
        { fields: ['cmmFileId'], title: '三坐标文件', titleAlign: 'center', rowspan: 2 },
    ],
    [
        { fields: ['myCheck'], title: '自检', titleAlign: 'center' },
        { fields: ['professionalCheck'], title: '专检', titleAlign: 'center' },
    ]
]
var allcheckcolumn = clone(checkcolumn);
allcheckcolumn.push({
    width: 100,
    columnAlign: 'center',
    field: 'remark'
});
var allchecktitleRows = clone(checktitleRows);
allchecktitleRows[0].push({ fields: ['remark'], title: '备注', titleAlign: 'center', rowspan: 2 });
var orderState = $('#LoadParam').val(); //technology,quality
var searchModelState = '';
if (orderState === 'technology') {
    searchModelState = '0';
}
if (orderState === 'quality') {
    searchModelState = '1';
}
var target = new Vue({
    el: '#mainDiv',
    data() {
        return {
            uploadUrl: webApiUrl + '/api/Quality/upload?random=' + Math.random(), // 上传路径
            total: 0, //总条数
            panels: ['1', '2', '3'], //检查单显示框
            baseModel: Object.assign({}, {}, {
                processName: '',
                productCode: '', //产品编号(子件)
                productName: '', //产品名称(子件)
                batchNo: '', //炉号
                teamName: '', //班组名称
                operatorName: '', //操作员名称
                checkerName: '', //检验员名称
                submitTime: '', //提交时间
                status: 0 //状态
            }),
            showImg: false,
            showImgFilepath: '',
            state: orderState, //处理者
            saveState: true,
            technology: { //技术评审
                state: '',
                remark: '',
                auditor: '',
                auditorDate: ''
            },
            Rules: {
                state: [{
                    required: true,
                    message: '建议必填',
                    trigger: 'change'
                }],
            },
            quality: { //质量评审
                state: '',
                remark: '',
                auditor: '',
                auditorDate: ''
            },
            checkSuggest: '', //检查建议
            searchModel: { //搜索选择的结果值
                state: searchModelState,
                process: '',
                batchNo: '',
                operator: '',
                checker: '',
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            searchListModel: {
                state: [{ 'k': '0', 'v': '未处理' }, { 'k': '1', 'v': '处理中' }, { 'k': '2', 'v': '处理完成' }],
                process: [],
                batchNo: [],
                operator: [],
                checker: []
            },
            searchType: '', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: false, //编辑窗

            showAllEdit: false, //所有检验信息编辑窗
            columnData: datacolumn,
            checkcolumn: checkcolumn,

            checktitleRows: checktitleRows,
            checkTableData: [],

            allcheckcolumn: allcheckcolumn, //所有加工检验单
            allchecktitleRows: allchecktitleRows,
            allcheckTableData: [],

            tableData: {
                dataSource: [], //数据源
                tableHeight: 0,
                selectHeight: 0
            },


        }
    },
    created() {
        this.init();
    },
    methods: {
        init: function () {
            this.search();
            this.getProcess();
            this.GetBatchNo();
            this.GetSelectUser(1);
            this.GetSelectUser(2);
        },
        //获取工序
        getProcess: function () {
            var _ = this;
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetProcessBySkuId?random=' + Math.random())
                .then(function (response) {
                    if (response.data.status) {
                        _.searchListModel.process = response.data.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        GetBatchNo: function () {
            var _ = this;
            axios.get(webApiUrl + '/api/NonconformingFlow/GetSelectBatchNo?random=' + Math.random())
                .then(function (response) {
                    if (response.data.status) {
                        _.searchListModel.batchNo = response.data.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        GetSelectUser: function (type) {
            var _ = this;
            axios.get(webApiUrl + '/api/NonconformingFlow/GetUsers?type=' + type)
                .then(function (response) {
                    if (response.data.status) {
                        if (type == 1) {
                            _.searchListModel.operator = response.data.data;
                        } else if (type == 2) {
                            _.searchListModel.checker = response.data.data;
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        onSort(column, key, order) {
            this.searchModel.sort = column.key + " " + column.order;
            this.search();
        },
        close: function (model) {
            this[model] = false;
        },
        showAllEditClick: function (ev) {
            var oEvent = ev || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            var _ = this;
            //获取当前工序前检验项信息
            axios.get(webApiUrl + '/api/NonconformingFlow/GetAllCheckInfo?NonconformingFlowId=' + NonconformingFlowId + "&ProcessGuid=" + processId)
                .then(function (response) {
                    if (response.data.status) {
                        CheckConvertData(response.data.data);
                        _.allcheckTableData = response.data.data;
                        _.showAllEdit = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        search() {
            this.changePage(this.searchModel.pageIndex);
        },
        changePage(pageIndex) {

            var _ = this;
            this.searchModel.search = [];
            _.searchModel.search.push({ Col: 'Status', Val: _.searchModel.state, Operation: '=' });
            _.searchModel.search.push({ Col: 'ProcessId', Val: _.searchModel.process, Operation: '=' });
            _.searchModel.search.push({ Col: 'BatchNo', Val: _.searchModel.batchNo, Operation: 'like' });
            _.searchModel.search.push({ Col: 'Operator', Val: _.searchModel.operator, Operation: '=' });
            _.searchModel.search.push({ Col: 'Checker', Val: _.searchModel.checker, Operation: '=' });
            _.searchModel.search.push({ Col: 'Type', Val: 0, Operation: '=' });
            _.searchModel.pageIndex = pageIndex;
            axios.post(webApiUrl + '/api/NonconformingFlow/GetPageLists', _.searchModel)
                .then(function (response) {
                    if (response.data.status) {
                        _.tableData.dataSource = response.data.data.items;
                        _.total = response.data.data.totalNum;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        save() {
            var _ = this;
            _.$refs[_.state + 'EditForm'].validate((valid) => {
                if (valid) {
                    axios.post(webApiUrl + '/api/NonconformingFlow/Audit', {
                        NFID: NonconformingFlowId,
                        AuditState: parseInt(_[_.state].state),
                        AuditRemark: _[_.state].remark,
                        AuditType: _.state == 'technology' ? 0 : 1
                    }).then(function (response) {
                        if (response.data.status) {
                            _.search();
                            _.showEdit = false;
                            _.$Message.success('保存成功');
                        } else {
                            _.$Message.success('保存失败');
                        }
                    })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            });
        },
        cellMerge(rowIndex, rowData, field) {
            if (field === 'processName' && rowData.Count > 0) {
                return {
                    colSpan: 1,
                    rowSpan: rowData.Count,
                    content: '<span >' + rowData.processName + '</span>',
                    componentName: ''
                }
            }
            if (field === 'cmmFileId' && rowData.Count > 0) {
                return {
                    colSpan: 1,
                    rowSpan: rowData.Count,
                    content: rowData.cmmFileId ? '<a href="' + fileServerUrl + '/GetFileStramById?fileID=' + rowData.cmmFileId + '">下载</a>' : '无',
                    componentName: ''
                }
            }
        }
    },
    mounted() {
        this.tableData.selectHeight = this.$refs.failedTable.$el.clientHeight;
        basis.tableHeightData(this.tableData);
    }
});

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
}

function CheckConvertData(tempList) {
    var map = {};
    tempList.forEach(function (item) {
        var index = 0;
        tempList.forEach(function (it) {
            if (it.processName === item.processName) {
                index++;
            }
        });
        if (!map[item.processName]) {
            item.Count = index;
        } else {
            item.Count = 0;
        }
        map[item.processName] = index;
    });
}