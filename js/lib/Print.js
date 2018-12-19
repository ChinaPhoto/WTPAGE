'use strict';

var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        return {
            fileServerUrl: fileServerUrl,
            searchType: '', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: false, //编辑窗
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 9999, //分页大小
                sort: '' //排序
            },
            dataSource: [],
            tableData: [] // table 数据渲染,
        };
    },
    created: function created() {
        this.search();
    },

    filters: {
        dateFormat: function dateFormat(val) {
            return new Date(val).format('yyyy-MM-dd HH:mm:ss');
        }
    },
    methods: {
        search: function search() {
            var _ = this;
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({
                    Col: this.searchType,
                    Val: this.searchKey,
                    Operation: 'like'
                });
            }
            axios.get(webApiUrl + '/api/ProductTraceability/getprint', {
                params: {
                    batchNo: getUrlParam("batchNo")
                }
            }).then(function (response) {
                if (response.data.status) {
                    _.dataSource = response.data.data;
                    _.oneJudgment();
                    setTimeout(function () {
                        return window.print();
                    }, 1000);
                }
            }).catch(function (error) {
                console.log(error);
            });
        },


        //  数据解析
        oneJudgment: function oneJudgment() {
            var _this = this;

            var arr = [];
            var obj = {};
            this.dataSource.forEach(function (val) {
                obj = {};
                obj.produce = val.production;
                obj.info = {
                    "入库时间": val['入库时间'],
                    "子件号": val['子件号'],
                    "子件名称": val['子件名称'],
                    "成品号": val['成品号'],
                    "成品名称": val['成品名称'],
                    "流水号": val['流水号'],
                    "炉号": val['炉号']
                };
                arr = _this.twoJudgment(val.checkList);

                obj.test = arr;
                _this.tableData.push(obj);
            });
        },

        //检验信息二级解析
        twoJudgment: function twoJudgment(data) {
            var _this2 = this;

            var arr = [],
                arrs = [];
            data.forEach(function (val) {
                arrs = [];
                arrs = _this2.threeJudgment(val.info);
                arrs.forEach(function (value, index) {
                    if (index == 0) {
                        value['关联信息'] = val['关联信息'] ? val['关联信息'] : ' ';
                        value['工单号'] = val['工单号'] ? val['工单号'] : ' ';
                        value['工序名称'] = val['工序名称'] ? val['工序名称'] : ' ';
                        value.rowLength = arrs.length.toString();
                    }
                });
                arr = arr.concat(arrs);
            });

            return arr;
        },

        // 检验信息三级解析
        threeJudgment: function threeJudgment(data) {
            var _this3 = this;

            var arr = [],
                i = 0,
                message = '';
            data.forEach(function (val) {
                i = val.detail.length;
                message = val['判定'] ? val['判定'] : ' ';
                arr = arr.concat(_this3.fourJudgment(val.detail, message, i));
            });
            return arr;
        },

        //检验信息四级解析
        fourJudgment: function fourJudgment(data, message, num) {
            var arr = [];
            data.forEach(function (val, index) {
                if (index === 0) {
                    val['判定'] = message;
                    val.rowRudgmentLength = num;
                }
                arr.push(val);
            });
            return arr;
        }
    }
});