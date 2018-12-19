var target = new Vue({
    el: '#mainDiv',
    data() {
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
            tableData: [], // table 数据渲染,
        }
    },
    created() {
        this.search();
    },
    filters: {
        dateFormat: function(val) {
            return new Date(val).format('yyyy-MM-dd HH:mm:ss')
        }
    },
    methods: {
        search() {
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
                }).then(function(response) {
                    if (response.data.status) {
                        _.dataSource = response.data.data;
                        _.oneJudgment()
                        setTimeout(() => window.print(), 1000)
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },

        //  数据解析
        oneJudgment() {
            let arr = [];
            let obj = {};
            this.dataSource.forEach((val) => {
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
                }
                arr = this.twoJudgment(val.checkList)

                obj.test = arr
                this.tableData.push(obj)
            })
        },
        //检验信息二级解析
        twoJudgment(data) {
            let arr = [],
                arrs = [];
            data.forEach((val) => {
                arrs = [];
                arrs = this.threeJudgment(val.info);
                arrs.forEach((value, index) => {
                    if (index == 0) {
                        value['关联信息'] = val['关联信息'] ? val['关联信息'] : ' ';
                        value['工单号'] = val['工单号'] ? val['工单号'] : ' ';
                        value['工序名称'] = val['工序名称'] ? val['工序名称'] : ' ';
                        value.rowLength = arrs.length.toString()
                    }
                })
                arr = arr.concat(arrs);
            })

            return arr
        },
        // 检验信息三级解析
        threeJudgment(data) {
            let arr = [],
                i = 0,
                message = ''
            data.forEach((val) => {
                i = val.detail.length
                message = val['判定'] ? val['判定'] : ' ';
                arr = arr.concat(this.fourJudgment(val.detail, message, i));

            })
            return arr

        },
        //检验信息四级解析
        fourJudgment(data, message, num) {
            let arr = []
            data.forEach((val, index) => {
                if (index === 0) {
                    val['判定'] = message;
                    val.rowRudgmentLength = num
                }
                arr.push(val)
            })
            return arr
        },

    }
})