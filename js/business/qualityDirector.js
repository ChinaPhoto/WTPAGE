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
var processId, NonconformingFlowId;
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
            return '-';
        }
    } else if (field == 'professionalCheck') {
        if (rowData.professionalCheck == 1) {
            return '<span style="color:green" >' + boolConvertValue(rowData.qualityType, rowData.professionalCheckValue) + '</span>';
        } else if (rowData.professionalCheck == 0) {
            return '<span style="color:red" >' + boolConvertValue(rowData.qualityType, rowData.professionalCheckValue) + '</span>'
        } else {
            return '-';
        }
    }
}
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
    tempList.forEach(function(item) {
        var index = 0;
        tempList.forEach(function(it) {
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
        formatter: function(rowData, rowIndex, pagingIndex, field) {
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
        formatter: function(rowData, rowIndex, pagingIndex, field) {
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
var allcheckcolumn = clone(checkcolumn);

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
var allchecktitleRows = clone(checktitleRows);
var allcheckcolumn = clone(checkcolumn);
allcheckcolumn.push({
    width: 100,
    columnAlign: 'center',
    field: 'remark'
});
allchecktitleRows[0].push({ fields: ['remark'], title: '备注', titleAlign: 'center', rowspan: 2 });

// var orderState = $('#LoadParam').val(); //technology,quality
// var searchModelState = '';
// if (orderState === 'technology') {
//     searchModelState = '0';
// }
// if (orderState === 'quality') {
//     searchModelState = '1';
// }

// console.log(orderState)
var target = new Vue({
    el: '#mainDiv',
    data() {
        return {
            total: 0, //总条数
            baseModel: {
                fileId: '',
                taskId: '',
                remark: '',
                id: 0
            },    
            showImg: false,
            showImgFilepath: '',     
            loading: false, //菊花
            checkcolumn: checkcolumn,
            checktitleRows: checktitleRows,
            checkTableData:[],
            // state: orderState, //处理者
            allcheckcolumn: allcheckcolumn, //所有加工检验单
            allchecktitleRows: allchecktitleRows,
            allcheckTableData: [],
            processId:'',
            showAllEdit:false,
            saveState: true,
            searchModel: { //检索模型
                state: '0',
                process: '',
                batchNo: '',
                operator: '',
                checker: '',
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            }, 
            showEdit:false,
            failedShow:{  // 不合格产品弹窗数据          
                checkSuggest:'',  //检查建议
                technology: { //技术评审
                    state: '',
                    remark: '',
                    auditor: '',
                    auditorDate: ''
                },

            },
            failedShowData:{
                state : [
                    { required: true, message: '必选', trigger: 'change' }
                ]
            },
            panels: ['1', '2'], //检查单显示框
            searchListModel: {   //数据存储
                state: [{ 'k': '0', 'v': '未处理' }, { 'k': '1', 'v': '处理中' },{ 'k': '2', 'v': '处理完成' }],
                process: [],
                batchNo: [],
                operator: [],
                checker: []
            },
            columnData: [ //列
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
                        switch(params.row.status){
                            case 0:
                                return h('span', '未处理'); 
                                break;
                            case 1:
                                return h('span', '处理中'); 
                                break;
                            case 2:
                                return h('span', '处理完成'); 
                                break;
                        }
                    }
                },
                {
                    title: '操作',
                    align: 'center',
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
                                on: {
                                    click: () => {
                                        this.failedShow.technology.auditor = "";
                                        this.failedShow.technology.auditorDate = "";
                                        this.failedShow.technology.state = "";
                                        this.failedShow.technology.remark = "";
                                        this.showEdit = true;
                                        this.processId = params.row.processId;
                                        NonconformingFlowId = params.row.id;
                                        this.testItemData(params.row);
                                        if(params.row.status == 2){
                                            this.reviewInformation()
                                        }
                                     this.saveState = params.row.status == 2? true:false;
                                    }
                                }
                            }, params.row.status == 2? '查看':'编辑'),
                        ]);
                    }
                }
            ],
            tableData: {
                dataSource: [], //数据源
                tableHeight: 0,
                selectHeight: 0
            },
        }
    },
    created() {
        this.search();
        this.GetBatchNo();
        this.getProcess();
        this.GetSelectUser(1);
        this.GetSelectUser(2);
    },
    methods: {  
        //获取当前检验单信息
        testItemData (data){ 
            axios.get(webApiUrl + '/api/NonconformingFlow/GetCurrentCheckInfo',{
                params:{
                    ProcessGuid:data.processId,
                    NonconformingFlowId:data.id
                }
            })
            .then((res) =>{
              if(res.data.status){
                this.checkTableData = res.data.data;
                this.failedShow.checkSuggest = data.opinion;  
              }
            })
        },
        //获取工序
        getProcess: function() {
            var _ = this;
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetProcessBySkuId?random=' + Math.random())
                .then(function(response) {
                    if (response.data.status) {
                        _.searchListModel.process = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }, 
        // 获取检验信息
        reviewInformation(){
            axios.get(webApiUrl + '/api/NonconformingFlow/GetAuditInfoByNFID',{
                params:{
                    NFID :NonconformingFlowId,
                    auditType: 1
                }
            }).then((response)=>{
                if (response.data.status) {
                    var data = response.data.data;
                    this.failedShow.technology.state = data.result.toString();
                    this.failedShow.technology.remark = data.opinion;
                    this.failedShow.technology.auditor = data.createUserName;
                    this.failedShow.technology.auditorDate = basis.baseData(data.createTime, 4);
                }
            })
        },
        //获取炉号
        GetBatchNo: function() {
            var _ = this;
            axios.get(webApiUrl + '/api/NonconformingFlow/GetSelectBatchNo?random=' + Math.random())
                .then(function(response) {
                    if (response.data.status) {
                        _.searchListModel.batchNo = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // 获取 操作工 和检验员
        GetSelectUser: function(type) {
            var _ = this;
            axios.get(webApiUrl + '/api/NonconformingFlow/GetUsers?type=' + type)
                .then(function(response) {
                    if (response.data.status) {
                        if (type == 1) {
                            _.searchListModel.operator = response.data.data;
                        } else if (type == 2) {
                            _.searchListModel.checker = response.data.data;
                        }
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },  
        onSort(column, key, order) {
            this.searchModel.sort = column.key + " " + column.order;
            this.search();
        },
        search() {
            this.changePage(this.searchModel.pageIndex);
        },
        showAllEditClick(ev){
            var oEvent = ev || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            axios.get(webApiUrl + '/api/NonconformingFlow/GetAllCheckInfo',{
                params:{
                    NonconformingFlowId:NonconformingFlowId,
                    ProcessGuid:this.processId
                }
            }).then((res)=>{
                if(res.data.status){
                    CheckConvertData(res.data.data);
                    this.allcheckTableData = res.data.data;
                    this.showAllEdit = true;
                }
            })
        },
        changePage(pageIndex) {
            var _ = this;
            this.searchModel.search = [];
            _.searchModel.search.push({ Col: 'Status', Val: _.searchModel.state, Operation: '=' });
            _.searchModel.search.push({ Col: 'ProcessId', Val: _.searchModel.process, Operation: '=' });
            _.searchModel.search.push({ Col: 'BatchNo', Val: _.searchModel.batchNo, Operation: 'like' });
            _.searchModel.search.push({ Col: 'Operator', Val: _.searchModel.operator, Operation: '=' });
            _.searchModel.search.push({ Col: 'Checker',  Val: _.searchModel.checker, Operation: '=' });
            _.searchModel.search.push({ Col: 'Type',  Val: 1, Operation: '=' });
            _.searchModel.pageIndex = pageIndex;
            axios.post(webApiUrl + '/api/NonconformingFlow/GetPageLists', _.searchModel)
                .then(function(response) {
                    if (response.data.status) {
                        _.tableData.dataSource = response.data.data.items;
                        _.total = response.data.data.totalNum;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        save() {
            var _ = this;
            this.$refs['technologyEditForm'].validate((valid) => {
                if (valid) {            
                    let data = {
                        NFID: NonconformingFlowId,
                        AuditState:parseInt(this.failedShow.technology.state),
                        AuditRemark: this.failedShow.technology.remark,
                        AuditType: 1                         
                    }
                    axios.post(webApiUrl + '/api/NonconformingFlow/Audit',data).then(function(response) {
                            if (response.data.status) {
                                _.search();
                                _.$refs['technologyEditForm'].resetFields();
                                _.showEdit = false;
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
         close: function(model) {
            this[model] = false;
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
        // this.tableData.selectHeight = this.$refs.failedTable.$el.clientHeight;
        basis.tableHeightData(this.tableData)
    }
})