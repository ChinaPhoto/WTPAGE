'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var frequencyType = {
    0: '全检',
    1: '每班首检'
};
var searchDemo_summaryInfoListColumns = [{
    type: 'selection',
    width: 50,
    align: 'center'
}, {
    type: 'expand',
    align: 'center',
    title: '展开',
    width: 150,
    render: function render(h, params) {
        return h("checkInfoComponent", {
            props: {
                productionInfo: target.searchInfoMoudle[params.row.batchNo].productionInfo,
                checkInfo: target.searchInfoMoudle[params.row.batchNo].checkInfo,
                isAllCheck: target.isAllCheck,
                resize: target.doPrintRandom
            }
        });
    }
}, { key: 'productNo', title: '成品号', align: 'center' }, { key: 'productName', title: '成品名称', align: 'center' }, { key: 'subPartsNo', title: '子件号', align: 'center' }, { key: 'subPartsName', title: '子件名称', align: 'center' }, { key: 'batchNo', title: '炉号', align: 'center' }, { key: 'batchId', title: '流水号', align: 'center' }, {
    key: 'warehousing',
    title: '入库时间',
    align: 'center',
    render: function render(h, params) {
        return h('span', basis.baseData(new Date(params.row.warehousing.replace('T', ' ')), 4));
    }
}];
var searchDemo_productionInfoListColumns = [{ field: 'processName', title: '工序名称', columnAlign: 'center', titleAlign: 'center', width: 100, isResize: true }, { field: 'orderNo', title: '工单号', columnAlign: 'center', titleAlign: 'center', width: 100, isResize: true }, { field: 'equipmentName', title: '生产设备', columnAlign: 'center', titleAlign: 'center', width: 100, isResize: true }, { field: 'operatorUserName', title: '操作员', columnAlign: 'center', titleAlign: 'center', width: 100, isResize: true }, {
        field: 'submitTime',
        title: '提交时间',
        columnAlign: 'center',
        titleAlign: 'center',
        width: 100,
        isResize: true,
        formatter: function formatter(rowData, rowIndex, pagingIndex, field) {
            return "<span>" + basis.baseData(new Date(rowData.submitTime.replace('T', ' ')), 4) + "</span>";
        }
    }],
    searchDemo_checkInfoListColumns = [{ width: 130, columnAlign: 'center', field: 'processName', isResize: true }, //工序名称
        {
            width: 100,
            columnAlign: 'center',
            field: 'batchNo',
            isResize: true,
            formatter: function formatter(rowData, rowIndex, pagingIndex, field) {
                if (rowData.frequency === 1) {
                    return '<div style="color: white;font-weight: bold;height: 35px;background-color: #2d8cf0;width: 80%;margin-left: 10%;border-radius: 5px;line-height: 35px;margin-top: 5px;" onClick="target.showAbout(\'' + rowData.batchNo + '\')">' + '关联的炉号' + '</div>';
                }
            }
        }, //关联信息
        { width: 130, columnAlign: 'center', field: 'orderNo', isResize: true }, // 工单号
        {
            width: 120,
            columnAlign: 'center',
            field: 'qualityName',
            isResize: true,
            formatter: function formatter(rowData, rowIndex, pagingIndex, field) {
                if (rowData.qualityImg) {
                    return "<img style='width:95px;height:39px' src='" + fileServerUrl + "/GetFileStramById?fileID=" + rowData.qualityImg + "'></img>";
                } else {
                    return rowData.qualityName;
                }
            }
        }, //工序检测项
        { width: 100, columnAlign: 'center', field: 'evaluation', isResize: true }, //评价测量技术
        {
            width: 50,
            columnAlign: 'center',
            field: 'frequency',
            isResize: true,
            formatter: function formatter(rowData, rowIndex, pagingIndex, field) {
                return frequencyType[rowData.frequency];
            }
        }, //检测频率
        { width: 50, columnAlign: 'center', field: 'myCheck', isResize: true, formatter: checkFormatter }, //自检
        { width: 50, columnAlign: 'center', field: 'professionalCheck', isResize: true, formatter: checkFormatter }, //专检
        { width: 50, columnAlign: 'center', field: 'operatorUserName', isResize: true }, //操作员
        { width: 50, columnAlign: 'center', field: 'checkUserName', isResize: true }, //检验员
        {
            width: 50,
            columnAlign: 'center',
            field: 'processResult',
            isResize: true //工序结果
        }
    ],
    searchDemo_checkInfoListTitleColumns = [
        [{ fields: ['processName'], title: '工序名称', titleAlign: 'center', rowspan: 3 }, { fields: ['batchNo'], title: '关联信息', titleAlign: 'center', rowspan: 3 }, { fields: ['orderNo'], title: '工单号', titleAlign: 'center', rowspan: 3 }, { fields: ['qualityName'], title: '工序检验项', titleAlign: 'center', rowspan: 3 }, { fields: ['evaluation'], title: '评价测量技术', titleAlign: 'center', rowspan: 3 }, { fields: ['frequency'], title: '检测频率', titleAlign: 'center', rowspan: 3 }, { fields: ['myCheck', 'professionalCheck', 'operatorUserName', 'checkUserName', 'processResult'], title: '工序检验项', titleAlign: 'center', colspan: 5 }],
        [{ fields: ['myCheck', 'professionalCheck', 'operatorUserName', 'checkUserName'], title: '实测数据', titleAlign: 'center', colspan: 4 }, { fields: ['processResult'], title: '判定', titleAlign: 'center', rowspan: 2 }],
        [{ fields: ['myCheck'], title: '自检', titleAlign: 'center' }, { fields: ['professionalCheck'], title: '专检', titleAlign: 'center' }, { fields: ['operatorUserName'], title: '操作员', titleAlign: 'center' }, { fields: ['checkUserName'], title: '检验员', titleAlign: 'center' }]
    ],
    aboutInfoColumns = [{ width: 130, columnAlign: 'center', field: 'batchNo', title: '检测炉号', titleAlign: 'center', isResize: true }, { width: 120, columnAlign: 'center', field: 'aboutNo', title: '关联炉号', titleAlign: 'center', isResize: true }];
var isServer = true;
var url = isServer ? {
    summaryInfo: webApiUrl + '/api/ProductTraceability/summaryInfoList',
    productionInfo: webApiUrl + '/api/ProductTraceability/productionInfoList',
    aboutInfo: webApiUrl + '/api/ProductTraceability/aboutInfo',
    getSelectItems: webApiUrl + '/api/ProductTraceability/getSelectItems',
    checkInfo: webApiUrl + '/api/ProductTraceability/checkInfoList'
} : {
    summaryInfo: '/data/ProductTraceability/summaryInfoList.json',
    productionInfo: '/data/ProductTraceability/productionInfoList.json',
    aboutInfo: '/data/ProductTraceability/aboutInfo.json',
    getSelectItems: '/data/ProductTraceability/getSelectItems.json',
    checkInfo: '/data/ProductTraceability/checkInfoList.json'
};
var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        return {
            selectedArray: [],
            loading: false, //菊花
            aboutModal: false, //关于炉号
            showImg: false,
            showImgFilepath: '',
            isAllCheck: false, //是否完整检验过程
            searchMoudle: { //搜索模块
                productNo: { //成品号
                    data: [],
                    key: 'productNo',
                    val: 'productName',
                    activity: ''
                },
                subPartsNo: { //子件号
                    data: [],
                    key: 'subPartsNo',
                    val: 'subPartsName',
                    activity: ''
                },
                batchNo: { //炉号
                    data: [],
                    key: 'batchNo',
                    val: 'batchNo',
                    activity: ''
                },
                batchId: { //流水号
                    data: [],
                    key: 'batchId',
                    val: 'batchId',
                    activity: ''
                },
                warehousing: [] //入库时间
            },
            searchInfoMoudle: { //搜索信息结果模块
                curBatchNo: '',
                summaryInfo: { //汇总检验信息Table
                    data: [], //数据
                    column: searchDemo_summaryInfoListColumns, //列信息
                    pageSize: 1000,
                    pageIndex: 1
                },
                productionInfo: { //生产信息
                    data: [], //数据
                    column: searchDemo_productionInfoListColumns //列信息
                },
                checkInfo: {
                    column: searchDemo_checkInfoListColumns,
                    titleRows: searchDemo_checkInfoListTitleColumns,
                    data: [
                            [],
                            []
                        ] //检验信息 多个检验
                },
                aboutInfo: {
                    data: [], //数据
                    column: aboutInfoColumns //列信息
                }
            },
            doPrintRandom: 0
        };
    },
    created: function created() {
        //获取
        this.initSelect();
    },

    methods: {
        selectedChange: function selectedChange(selection) {
            var _this = this;

            this.selectedArray = [];
            selection.forEach(function(item) {
                _this.selectedArray.push(item.batchNo);
            });
        },
        initSelect: function initSelect() {
            var _ = this;
            _.searchMoudle.warehousing.push(_.GetDate(true));
            _.searchMoudle.warehousing.push(_.GetDate());
            _.ajax(url.getSelectItems, {}, function(obj) {
                _.searchMoudle.productNo.data = _.distinct(obj.data, 'productNo');
                _.searchMoudle.subPartsNo.data = _.distinct(obj.data, 'subPartsNo');
                var batchNoData = _.distinct(obj.data, 'batchNo');
                _.searchMoudle.batchNo.data = batchNoData;
                _.searchMoudle.batchNo.activity = batchNoData && batchNoData.length > 0 ? batchNoData[0].batchNo : "";
                _.searchMoudle.batchId.data = _.distinct(obj.data, 'batchId');
                _.search();
            }, 'get', true, "Data");
        },
        GetDate: function GetDate(isFirst) {
            var date = new Date();
            var currentMonth = date.getMonth(); //当前月
            //date.setMonth(currentMonth - 1);
            if (isFirst) {
                date.setDate(1);
                return date;
            } else {
                var nextMonth = ++currentMonth;
                var nextMonthFirstDay = new Date(new Date().getFullYear(), nextMonth, 1);
                //nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + 1);
                var oneDay = 1000 * 60 * 60 * 24;
                return new Date(nextMonthFirstDay - oneDay);
            }
        },
        distinct: function distinct(data, field) {
            var array = [];
            var items = [];
            data.forEach(function(item) {
                if (item[field] && array.indexOf(item[field]) < 0) {
                    array.push(item[field]);
                    items.push(item);
                }
            });
            return items;
        },
        search: function search(isAllCheck, callback) {
            var _ = this;
            //获取搜索的参数
            _.isAllCheck = isAllCheck;
            var searchParams = _.getSearchValues();
            //发送请求获取搜索的检测信息
            var searchModel = {};
            searchModel.search = [];
            searchModel.search.push({ Col: 'productNo', Val: searchParams.productNo, Operation: 'like' });
            searchModel.search.push({ Col: 'subPartsNo', Val: searchParams.subPartsNo, Operation: 'like' });
            searchModel.search.push({ Col: 'batchNo', Val: searchParams.batchNo, Operation: 'like' });
            searchModel.search.push({ Col: 'batchId', Val: searchParams.batchId, Operation: 'like' });
            searchModel.search.push({ Col: 'warehousing', Val: searchParams.warehousing.length > 0 && searchParams.warehousing[0] != "" ? basis.baseData(searchParams.warehousing[0]) : '', Operation: '>=' });
            searchModel.search.push({ Col: 'warehousing', Val: searchParams.warehousing.length > 0 && searchParams.warehousing[0] != "" ? basis.baseData(searchParams.warehousing[1]) + " 23:59:59.999" : '', Operation: '<=' });
            searchModel.pageIndex = 1;
            searchModel.PageSize = 1000;
            _.ajax(url.summaryInfo, searchModel, function(obj) {
                obj.forEach(function(item) {
                    _.searchInfoMoudle[item.batchNo] = {};
                    _.searchInfoMoudle[item.batchNo].checkInfo = clone(_.searchInfoMoudle.checkInfo);
                    _.searchInfoMoudle[item.batchNo].productionInfo = clone(_.searchInfoMoudle.productionInfo);
                });
                _.searchInfoMoudle.summaryInfo.data = obj;
                if (callback) callback(_.searchInfoMoudle.summaryInfo.data);
            });
        },
        print: function print() {
            //console.log(this.selectedArray.join())
            this.$refs.printIframe.src = '/pages/print.html?batchNo=' + this.selectedArray.join();

            // window.open('/pages/print.html?batchNo=' + this.selectedArray.join(), 'newwindow', 'height=0, width=0, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')

            //var _ = this;
            //var obj = clone(_.searchInfoMoudle.summaryInfo.data);
            //_.loading = true;
            //setTimeout(function () {
            //    $('#aaa').css("width", 1024);
            //    _.doPrintRandom = Math.random();
            //    //发送同步请求，并打开当前的扩展项
            //    obj.forEach(function (item) {
            //        _.tableExpand(item, true);
            //        item._expanded = true;
            //    });
            //    _.loading = false;
            //    _.searchInfoMoudle.summaryInfo.data = obj;
            //    doPrint(_);
            //}, 100);
        },
        tableExpand: function tableExpand(row, state, a) {
            var _ = this;
            _.searchInfoMoudle.curBatchNo = row.batchNo;
            var searchModel = {};
            searchModel.search = [];
            searchModel.search.push({ Col: 'batchNo', Val: row.batchNo, Operation: 'like' });
            searchModel.pageIndex = 1;
            searchModel.PageSize = 1000;
            searchModel.Sort = " submitTime ";
            //展开刷新数据
            if (state) {
                //获取生产基本信息
                _.ajax(url.productionInfo, searchModel, function(obj) {
                    CheckConvertData(obj);
                    _.searchInfoMoudle[row.batchNo].productionInfo.data = obj;
                    _.ajax(url.checkInfo, { 'batchNo': row.batchNo, 'IsAllCheck': _.isAllCheck }, function(obj) {
                        obj.data.forEach(function(item) {
                            CheckConvertData(item);
                            item.forEach(function(it) {
                                it.batchNo = row.batchNo;
                            });
                        });
                        _.searchInfoMoudle[row.batchNo].checkInfo.data = obj.data;
                    }, 'get', false, 'data');
                }, '', false);
                //获取多次检测结果
            }
        },

        getSearchValues: function getSearchValues() {
            var moudle = this.searchMoudle;
            return {
                'productNo': moudle.productNo.activity,
                'subPartsNo': moudle.subPartsNo.activity,
                'batchNo': moudle.batchNo.activity,
                'batchId': moudle.batchId.activity,
                'warehousing': moudle.warehousing,
                'all': this.isAllCheck
            };
        },
        showAbout: function showAbout(ThroughputId, batchNo) {
            //拿到ThroughputId之后，查询检验员的数据，后就可以去数据库中查找，与我关联的，或者我关联其他的炉号，显示在页面上就好了！ 如果是我关联其他的，就显示一条，其他的关联我的，就显示同时被关联的其他的
            var _ = this;
            _.aboutModal = true;
            var searchModel = {};
            searchModel.search = [];
            searchModel.search.push({ Col: 'ThroughputId', Val: ThroughputId, Operation: '=' });
            searchModel.pageIndex = 1;
            searchModel.PageSize = 1000;
            _.ajax(url.aboutInfo, searchModel, function(obj) {
                debugger;
                var res = [];
                obj.data.forEach(function(item) {
                    res.push({
                        'batchNo': batchNo,
                        'aboutNo': item
                    });
                });
                _.searchInfoMoudle.aboutInfo.data = res;
            }, '', undefined, "Data");
        },
        ajax: function ajax(url, params, callback, method, sync, type) {
            var sendMethod = method ? method : 'post';
            $.ajax({
                url: url,
                type: sendMethod, //GET
                async: sync === undefined ? true : sync, //或false,是否异步
                data: params,
                success: function success(data, textStatus, jqXHR) {
                    if (type) {
                        callback(data);
                    } else {
                        isServer ? callback(data.data.items) : callback(data);
                    }
                },
                error: function error(xhr, textStatus) {}
            });
        },
        close: function close(model) {
            this[model] = false;
        },
        batchNocellMerge: function batchNocellMerge(rowIndex, rowData, field) {
            if (field === 'batchNo') {
                return {
                    colSpan: 1,
                    rowSpan: this.searchInfoMoudle.aboutInfo.data.length,
                    content: '<div >' + rowData.batchNo + '</div>'
                };
            }
        }
    }
});
Vue.component('checkInfoComponent', {
    props: ['productionInfo', 'checkInfo', 'isAllCheck', 'resize'],

    created: function created() {
        console.log(this);
    },
    data: function data() {
        return {};
    },

    watch: {
        "resize": {
            handler: function handler(newVal) {
                this.resizeTable();
            }
        }
    },
    methods: {
        checkInfoCellMerge: function checkInfoCellMerge(rowIndex, rowData, field) {
            if (field === 'processName' && rowData.Count > 0) {
                return {
                    colSpan: 1,
                    rowSpan: rowData.Count,
                    content: '<span >' + rowData.processName + '</span>'
                };
            }
            if (field === 'batchNo' && rowData.Count > 0) {
                var obj = {
                    colSpan: 1,
                    rowSpan: rowData.Count
                };
                if (rowData.frequency === 1) {
                    obj.content = '<div style="color: white;height: 35px;background-color: #2d8cf0;width: 80%;margin-left: 10%;border-radius: 5px;line-height: 35px;margin-top: ' + (rowData.Count === 1 ? 5 : (rowData.Count - 1) * 30 + 5) + 'px;" onClick="target.showAbout(\'' + rowData.throughputId + '\',\'' + rowData.batchNo + '\')">' + '关联的炉号' + '</div>';
                }
                return obj;
            }
            if (field === 'orderNo' && rowData.Count > 0) {
                return {
                    colSpan: 1,
                    rowSpan: rowData.Count,
                    content: '<span >' + rowData.orderNo + '</span>'
                };
            }
            if (field === 'operatorUserName' && rowData.Count > 0) {
                return {
                    colSpan: 1,
                    rowSpan: rowData.Count,
                    content: '<span >' + rowData.operatorUserName + '</span>'
                };
            }
            if (field === 'checkUserName' && rowData.Count > 0) {
                return {
                    colSpan: 1,
                    rowSpan: rowData.Count,
                    content: '<span >' + rowData.checkUserName + '</span>'
                };
            }
            if (field === 'processResult' && rowData.Count > 0) {
                return {
                    colSpan: 1,
                    rowSpan: rowData.Count,
                    content: '<div style="color: white;height: 35px;background-color: #2d8cf0;width: 80%;margin-left: 10%;border-radius: 5px;line-height: 35px;margin-top: ' + (rowData.Count === 1 ? 5 : (rowData.Count - 1) * 30 + 5) + 'px;">' + rowData.processResult + '</div>'
                };
            }
        },
        resizeTable: function resizeTable() {
            this.$refs.p.resize();
            this.$refs.tp.forEach(function(item) {
                item.resize();
            });
        }
    },
    template: '\n    <div  >\n    <collapse >\n                <Card>\n                    <p slot="title" >\u751F\u4EA7\u4FE1\u606F</p>\n                    <p><v-table ref="p" style="width:100%" :title-row-height=\'48\' :row-height=\'48\'  is-horizontal-resize :columns="productionInfo.column" :table-data="productionInfo.data"  :cell-merge="checkInfoCellMerge"></v-table></p>\n                </Card>\n                </br>\n                <Card>\n                    <p slot="title">\u68C0\u9A8C\u4FE1\u606F </p>\n\n                    <p  v-for="(item,index) in checkInfo.data">\n                    <span v-if="!isAllCheck">\u6700\u65B0\u4E00\u6B21\u68C0\u9A8C</span>\n                    <span v-else>\u7B2C{{index+1}}\u6B21\u68C0\u9A8C\uFF1A</span>\n                    <v-table ref="tp" style="width:100%"  :title-row-height=\'48\' :row-height=\'48\' :height=\'10000\' is-horizontal-resize  :columns="checkInfo.column" :title-rows="checkInfo.titleRows" :cell-merge="checkInfoCellMerge"  :table-data="item"></v-table>\n                    </br>\n                    </p>\n                </Card>\n            </collapse>\n    </div>\n'
});

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

function checkFormatter(rowData, rowIndex, pagingIndex, field) {
    if (rowData.qualityType == 3) {
        if (field == 'myCheck' && !rowData.myCheckValue) {
            return '/';
        }
        if (field != 'myCheck' && !rowData.professionalCheckValue) {
            return '/';
        }
        return "<a onclick='view(\"" + (field == 'myCheck' ? rowData.myCheckValue : rowData.professionalCheckValue) + "\")'>查 看</a>";
    }
    if (field == 'myCheck') {
        if (rowData.myCheck == 1) {
            return '<span style="color:green" >' + boolConvertValue(rowData.qualityType, rowData.myCheckValue) + '</span>';
        } else if (rowData.myCheck == 0) {
            return '<span style="color:red" >' + boolConvertValue(rowData.qualityType, rowData.myCheckValue) + '</span>';
        } else {
            return '/';
        }
    } else if (field == 'professionalCheck') {
        if (rowData.professionalCheck == 1) {
            return '<span style="color:green" >' + boolConvertValue(rowData.qualityType, rowData.professionalCheckValue) + '</span>';
        } else if (rowData.professionalCheck == 0) {
            return '<span style="color:red" >' + boolConvertValue(rowData.qualityType, rowData.professionalCheckValue) + '</span>';
        } else {
            return '/';
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

function doPrint(_) {
    // bdhtml = window.document.body.innerHTML;
    // sprnstr = "<!--startprint-->";
    // eprnstr = "<!--endprint-->";
    // prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
    // prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
    // window.document.body.innerHTML = prnhtml;
    setTimeout(function() {
        $('#aaa').print({});
        setTimeout(function() {
            $('#aaa').css("width", "100%");
            _.doPrintRandom = Math.random();
        }, 500);
    }, 1000);
}

function clone(obj) {
    if (null == obj || "object" != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj))) return obj;
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