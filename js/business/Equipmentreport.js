var target = new Vue({
    el: '#mainDiv',
    data() {

        const depositEndDataFun = (rule, value, callback) => {
            if (value) {
                this.searchData.startData = basis.baseData(this.searchData.startData, 1);
                this.searchData.endData = basis.baseData(this.searchData.endData, 1);
                let startData = this.searchData.startData.split("-");
                let ST = new Date(startData[0], startData[1], startData[2]);
                let endData = this.searchData.endData.split("-");
                let ET = new Date(endData[0], endData[1], endData[2]);
                if (ET.getTime() < ST.getTime()) {
                    if (rule.fullField === "startData") {
                        // return callback(new Error('开始时间要早于结束时间'));
                    } else if (rule.fullField === "endData") {
                        return callback(new Error('结束时间不得早于开始时间'));
                    }

                }
                callback()
            }

        }
        return {
            searchData: {
                startData: '',
                endData: '',
                eqArray: [],
                interval: '0'
            },
            dataSorage: { // 数据储存
                eqData: [{ id: 'a', name: '1' }, { id: 'b', name: '2' }, { id: 'c', name: '3' }],
                interval: [{ id: '0', name: '天' }, { id: '1', name: '月' }]
            },
            searchverification: { // 验证
                startData: [
                    { required: true, message: '必填' }, {
                        validator: depositEndDataFun
                    }
                ],
                endData: [
                    { required: true, message: '必填' }, {
                        validator: depositEndDataFun
                    }
                ],

            },
            styleData: {
                padding: '20px',
                height: '500px',
                overflowY: 'auto'
            }
        }
    },
    created() {},
    methods: {
        download() {
            var _ = this;
            this.loading = true;
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            axios.post(webApiUrl + '/api/Quality/Download?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    if (response.data.status) {
                        _.loading = false;
                        //文件路径response.data.data
                        window.location.href = fileServerUrl + response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        search() {
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    console.log(this.searchData)
                } else {
                    this.$Message.error('验证失败');
                }
            })

            this.$nextTick(() => {
                Hcharts('column', {
                    el: 'boot',
                    text: '设备开机率',
                    categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    yAxisText: '占比',
                    series: [{
                        name: '东京',
                        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                    }, {
                        name: '纽约',
                        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                    }, {
                        name: '伦敦',
                        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
                    }, {
                        name: '柏林',
                        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
                    }]
                })
                Hcharts('column', {
                    el: 'shutdown',
                    text: '设备停机率',
                    categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    yAxisText: '占比',
                    series: [{
                        name: '东京',
                        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                    }, {
                        name: '纽约',
                        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
                    }, {
                        name: '伦敦',
                        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
                    }, {
                        name: '柏林',
                        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
                    }]
                })
            })
        },
        countHeight() {
            this.styleData.height = window.innerHeight - 190 + 'px';
        }

    },
    mounted() {
        this.countHeight()
    }
})