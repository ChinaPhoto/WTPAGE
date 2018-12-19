var rgxNumber = /^([0-9]*)+(.[0-9]{1,4})?$/;
var numValidator = function(rule, value, callback) {
    if (!rgxNumber.test(value)) {
        callback(new Error('只能输入数字并且最多允许四位小数'));
    } else {
        if (value.length > 20) {
            callback(new Error('长度必须小于20位'));
        } else {
            callback();
        }
    }
}



var target = new Vue({
    el: '#mainDiv',
    data() {
        // const formulaTest = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error('计算公式不能为空'));
        //     }

        //     let data = {
        //         Express: this.baseModel.calcuteExpress
        //     }
        //     axios.post(webApiUrl + "/api/QualityCondition/CheckCalcute?random=" + Math.random(), data).then((res) => {
        //         if (res.data.status) {
        //             callback();
        //         } else {
        //             return callback(new Error(res.data.errorCode));
        //         }
        //     }).catch(function(error) {
        //         callback(new Error(error));
        //     });
        // };

        let NumRows = (rule, value, callback) => {
            let rgxRowNumber = /^([1-9]\d*(\.\d*[1-9])?)$/;
            if (!value) {
                callback(new Error('不能为空'))
            }
            if (!rgxRowNumber.test(value)) {
                callback(new Error('只能输入大于1整数'))
            }
            callback()
        }

        const formulaVerification = (rule, value, callback) => {
            let obj = {};
            if (!value) {
                callback()
            }
            if (value) {
                if (rule.field == "timeValue" || rule.field == 'timeMaxValue') {
                    obj = {
                        "ValueType": '4',
                        "Formula": value
                    }
                } else {
                    obj = {
                        "ValueType": '1',
                        "Formula": value
                    }
                }

                var data = JSON.stringify(obj);
                axios.get(webApiUrl + '/api/QualityCondition/GetVerifyFormula?random=' + Math.random(), {
                    params: {
                        value: data
                    }
                }).then((res) => {
                    if (res.data.data.status == 1) {
                        callback()
                    } else if (res.data.data.status == 0) {
                        callback(new Error('公式验证错误'));
                    }
                })
            }

        }
        return {
            selectItem: {
                m_select_Product: '',
                m_data_Product: [],
                m_select_SKU: '',
                m_data_SKU: [],
                m_select_Process: '',
                m_data_Process: [],
                m_select_Equipment: '',
                m_data_Equipment: []
            },
            ValueType: [{
                k: '0',
                v: '文本型'
            }, {
                k: '1',
                v: '数值型'
            }, {
                k: '2',
                v: '布尔型'
            }, {
                k: '3',
                v: '附件'
            }, {
                k: '4',
                v: '日期型'
            }, {
                k: '5',
                v: '二维表型'
            }],
            ValueTypeEr: [{
                k: '0',
                v: '文本型'
            }, {
                k: '1',
                v: '数值型'
            }],
            formItem: {
                m_txt_Name: '',
                m_img_Name: '',
                m_select_valueType: ''
            },
            title: '',
            uploadUrl: fileServerUrl + 'UploadFile', // 上传路径
            total: 0, //总条数
            baseModel: {
                imgVisible: false,
                imgUrl: '',
                id: 0,
                SKUId: '',
                equipmentId: '',
                Quality: '',
                imgFileId: '',
                productId: '',
                processId: '',
                qualityId: 0,
                valueType: "1",
                valueTypeEr: "1",
                maxValue: '',
                minValue: '',
                timeValue: '',
                value: '',
                // recheck: false,
                isCalcute: false,
                calcuteExpress: '',
                isCondition :false,
                conditionDisplay:'',
                qualityType: '0',
                location: '',
                size: '',
                format: '',
                equipment: '',
                evaluation: '',
                booleanValue: "1",
                roleValue: ['1'],
                poNo: '',
                remark: '',
                rowNumber: '',
                time: '0',
                timeMaxValue: ''
            },
            windowHeight: document.documentElement.clientHeight,
            modalMaxHeight: {
                maxHeight: '110px',

                overflowX: 'hidden',
                overflowY: 'auto'
            },
            tableHeight: '1000',
            baseRules: {
                valueType: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                // frequency: [{
                //     required: true,
                //     message: '必填',
                //     trigger: 'blur'
                // }],
                Quality: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                value: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                minValue: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }, {
                    validator: formulaVerification,
                    trigger: 'blur'
                }],
                timeMaxValue: [{
                    required: true,
                    validator: formulaVerification,
                    trigger: 'blur'
                }],
                timeValue: [{
                    required: true,
                    validator: formulaVerification,
                    trigger: 'blur'
                }],
                roleValue: [
                    { required: true, type: 'array', min: 1, message: '请选择一项', trigger: 'change' }
                ],
                calcuteExpress: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }, {
                    validator: formulaVerification,
                    trigger: 'blur'
                }],
                conditionDisplay: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }, {
                    validator: formulaVerification,
                    trigger: 'blur'
                }],
                qualityType: [{
                    required: true,
                    message: '请选择表单类型',
                    trigger: 'change'
                }],
                maxValue: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }, {
                    validator: formulaVerification,
                    trigger: 'blur'
                }],
                time: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }, {
                    validator: numValidator,
                    trigger: 'blur'
                }],
                poNo: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
                rowNumber: [{
                    required: true,
                    validator: NumRows,
                    trigger: 'blur'
                }]

                // location: [{
                //     required: true,
                //     message: '必选',
                //     trigger: 'change'
                // }],
                // size: [{
                //     required: true,
                //     message: '必选',
                //     trigger: 'change'
                // }],
                // format: [{
                //     required: true,
                //     message: '必选',
                //     trigger: 'change'
                // }],
                // equipment: [{
                //     required: true,
                //     message: '请选择表单类型',
                //     trigger: 'change'
                // }]
            },
            searchType: 'Quality', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: false, //编辑窗
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            Indicator: { // 指标类型数据检测
                data: [{ name: '通用', id: '0' }, { name: '毛坯尺寸及外观检测', id: '1' }, { name: '米字型检测', id: '2' }, { name: '外观及视检验', id: '3' }, { name: '位置度评定', id: '4' }, { name: '全尺寸检测', id: '6' }, { name: '清洗检测', id: '7' }, { name: '涂装过程检测', id: '8' }, { name: '涂装厚度检测', id: '9' }, { name: '包装封箱前检测', id: '10' }, { name: '外购件复检', id: '11' }, { name: '成品检测', id: '12' }],
                dataValue: '',
                pp: '', // 泡泡号
                dataId: '', // 这是公共返回的id
                isLable: true,
                position: {
                    data: [],
                    value: '',
                    id: '0'
                }, //位置
                size: {
                    data: [],
                    value: '',
                    id: '1'
                },
                shape: {
                    data: [],
                    value: '',
                    id: '2'
                },
                equipment: {
                    data: [],
                    value: '',
                    id: '3'
                }
            },
            columnData: [ //列
                {
                    align: 'center',
                    type: 'selection',
                    width: 40
                },
                {
                    align: 'center',
                    title: '检测项ID',
                    key: 'qualityId',
                    width: 100
                },
                {
                    align: 'center',
                    title: '检测项名称',
                    key: 'quality'
                },
                {
                    align: 'center',
                    title: '检测项图片',
                    key: 'imgFileId',
                    render: (h, params, v) => {
                        if (params.row.imgFileId) {
                            // console.log(params.row)
                            return h('img', {
                                attrs: {
                                    "src": fileServerUrl + 'GetFileStramById?fileID=' + params.row.imgFileId
                                },
                                style: {
                                    "width": "170px",
                                    "height": "45px"
                                }
                            })
                        }
                        return h('span', "");
                    }
                },
                {
                    align: 'center',
                    title: '检测项类型',
                    key: 'QualityType',
                    render: (h, { row }, v) => {
                        let str = '';
                        switch (row.qualityType) {
                            case 0:
                                str = '通用';
                                break;
                            case 1:
                                str = '毛坯尺寸及外观检测';
                                break;
                            case 2:
                                str = '米字型检测';
                                break;
                            case 3:
                                str = '外观及视检验';
                                break;
                            case 4:
                                str = '位置度评定';
                                break;
                            case 6:
                                str = '全尺寸检测';
                                break;
                            case 7:
                                str = '清洗检测';
                                break;
                            case 8:
                                str = '涂装过程检测';
                                break;
                            case 9:
                                str = '涂装厚度检测';
                                break;
                            case 10:
                                str = '包装封箱前检测';
                                break;
                            case 11:
                                str = '外购件复检';
                                break;
                            case 12:
                                str = '成品检测';
                                break;
                        }
                        //auto 这个地方的值后面是要修稿的
                        // str = this.Indicator.selectValue
                        return h('span', str);
                    }
                },
                // {
                //     align: 'center',
                //     title: '频率',
                //     key: 'frequency',
                //     width: 70,
                //     render: (h, params, v) => {
                //         var str = '';
                //         switch (params.row.frequency) {
                //             case 0:
                //                 str = '全检';
                //                 break;
                //             case 1:
                //                 str = '首件检查';
                //                 break;
                //         }
                //         return h('span', str);
                //     }
                // },
                {
                    align: 'center',
                    title: '用时',
                    width: 70,
                    key: 'time'
                },
                {
                    align: 'center',
                    title: '角色',
                    // width: 80,
                    key: 'roleValue',
                    render: (h, params, v) => {
                        let str = '';
                        str += params.row.roleValue.indexOf("1") >= 0 ? "操作员 " : "";
                        str += params.row.roleValue.indexOf("2") >= 0 ? "检验员 " : "";
                        return h('span', str);
                    }
                },
                {
                    align: 'center',
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
                                        _.showEdit = true;

                                        _.temporary.maxValue = '';
                                        _.temporary.minValue = '';
                                        _.temporary.timeValue = '';
                                        _.temporary.timeMaxValue = '';
                                        _.temporary.booleanValue = "1";
                                        _.$refs['editForm'].resetFields();
                                        _.baseModel.id = 0;
                                        _.title = params.column.title
                                        _.copyDataHandl(params.row)
                                    }
                                }
                            }, '复制'),
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
                                        _.showEdit = true;

                                        _.temporary.maxValue = '';
                                        _.temporary.minValue = '';
                                        _.temporary.timeValue = '';
                                        _.temporary.timeMaxValue = '';
                                        _.temporary.booleanValue = "1";
                                        _.$refs['editForm'].resetFields();


                                        _.baseModel.id = params.row.id;
                                        _.title = params.column.title
                                        _.copyDataHandl(params.row)
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
                                        _.baseModel.id = params.row.id;
                                        _.del();
                                    }
                                }
                            }, [h('i-button', {
                                props: {
                                    type: 'ghost',
                                    size: 'small',
                                    icon: 'android-delete'
                                }
                            }, '删除')])
                        ]);
                    }
                }
            ],
            formTableData: {
                dataSource: [], //数据源
                tableHeight: 0
            },

            draggingRecord: {
                BeforeSort: '',
                BeforeId: '',
                EndSort: '',
                ProductId: ''
            }, //拖拽数据源
            temporary: {
                maxValue: '',
                minValue: '',
                timeValue: '',
                timeMaxValue: '',
                booleanValue: ''

            }, // 数据暂存
            copyPop:{  // 复制弹窗数据
                show:false,
                selectItem:{
                   Product:'',
                   SKU:'',
                   Process:''
                },
                copyTableData:[],
                copySKU:[],
                copyProcess:[]
            },
            copyPopRules:{  // 数据弹窗验证
                Product: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }]
            }
        }
    },
    created() {
        // this.search();

        this.getProduct();
    },
    watch: {
        'selectItem.m_select_Product': function() {
            this.$refs.s_sku.clearSingleSelect();
            this.selectItem.m_select_Process = "";
            this.selectItem.m_data_Process = [];
            this.selectItem.m_select_SKU = "";
            this.selectItem.m_data_SKU = [];
            this.$refs.s_process.clearSingleSelect();
            this.searchModel.pageIndex = 1;
            this.getSKU(this.selectItem.m_select_Product);
            this.search();
        },
        'selectItem.m_select_SKU': function() {
            this.$refs.s_process.clearSingleSelect();
            this.selectItem.m_select_Process = "";
            this.selectItem.m_data_Process = [];
            this.getProcess(this.selectItem.m_select_SKU);
            this.searchModel.pageIndex = 1;
            if (!this.selectItem.m_select_SKU) {
                this.search();
            }
        },
        'selectItem.m_select_Process': function() {
            this.searchModel.pageIndex = 1;
            if (!this.selectItem.m_select_Process) {
                this.formTableData.dataSource = [];
            } else {
                this.search();
            }
            if (!this.selectItem.m_select_Process) {
                this.search();
            }
        },
        "baseModel.valueType": function() {
            this.baseModel.booleanValue = '1'
        }
        // "copyPop.selectItem.Product":function (){
        //     this.copyPop.selectItem.SKU = '';
        //     this.copyPop.copySKU = [];
        //     this.copyPop.selectItem.Process = "";
        //     this.copyPop.copyProcess = [];
        // },
        // "copyPop.selectItem.SKU":function() {
        //     this.copyPop.selectItem.Process = "";
        //     this.copyPop.copyProcess = [];
        // }
    },
    methods: {
        deleCopyData(){
            this.copyPop.selectItem.SKU = '';
            this.copyPop.copySKU = [];
            this.copyPop.selectItem.Process = "";
            this.copyPop.copyProcess = [];
            this.$refs.copySKU.clearSingleSelect();
            this.$refs.copyProcess.clearSingleSelect()
        },
        deleCopyDataSKU(){
            this.copyPop.selectItem.Process = "";
            this.copyPop.copyProcess = [];
            this.$refs.copyProcess.clearSingleSelect()
        },
        // 表单多选数据
        selectionData(selection){
            console.log(selection);
            this.copyPop.copyTableData = selection;
        },
        clearVerification() {
            this.baseModel.minValue = this.temporary.minValue ? this.temporary.minValue : '';
            this.baseModel.maxValue = this.temporary.maxValue ? this.temporary.maxValue : '';
            this.baseModel.timeValue = this.temporary.timeValue ? this.temporary.timeValue : '';
            this.baseModel.timeMaxValue = this.temporary.timeMaxValue ? this.temporary.timeMaxValue : '';
            this.baseModel.booleanValue = this.temporary.booleanValue == 1 ? '1' : '0';
            if (this.baseModel.valueType != 5) {
                this.baseModel.valueTypeEr = '0'
            }
        },
        cancel() {
            this.showEdit = false;
        },
        copyCancel (){
            this.copyPop.show = false;
        },
        roleValueData(value) {
            if (value == 0) {
                this.baseModel.roleValue = ['1']
            } else {
                this.baseModel.roleValue = ['2']
            }
        },
        // 选中后的指标类型
        selectReq(value) {
            let _ = this;
            _.Indicator.data.forEach(function(val, index) {
                if (val.name === value) {
                    _.baseModel.qualityType = val.id
                }
            })
        },
        conditionChange: function() {
            this.searchKey = "";
        },
        handleSuccess: function(res, file) {
            this.baseModel.imgVisible = true;
            this.baseModel.imgUrl = fileServerUrl + 'GetFileStramById?fileID=' + res.Data;
            this.baseModel.imgFileId = res.Data;
        },
        //get Data
        getProduct: function() {
            var _ = this;
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetProductInfo?random=' + Math.random())
                .then(function(response) {
                    if (response.data.status) {
                        _.selectItem.m_data_Product = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        getSKU: function(ProductId) {
            if (!ProductId) return;
            var _ = this;
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetSkuByProductId?random=' + Math.random(), {
                    params: {
                        ProductGuid: ProductId
                    }
                })
                .then(function(response) {
                    if (response.data.status) {
                        _.selectItem.m_data_SKU = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        copyGetSKU:function (value) {
            let _ =this;
            if(value){
                _.copyPop.copySKU = [];
                axios.get(webApiUrl + '/api/ProductBasicInfo/GetSkuByProductId?random=' + Math.random(), {
                    params: {
                        ProductGuid: value
                    }
                })
                .then(function(response) {
                    if (response.data.status) {
                        _.copyPop.copySKU = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            }
        },
        getProcess: function(SKUId) {
            if (!SKUId) return;
            var _ = this;
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetProcessBySkuId', {
                    params: {
                        SKUGuid: SKUId
                    }
                })
                .then(function(response) {
                    if (response.data.status) {
                        _.selectItem.m_data_Process = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        copyGetProcess:function (value){
            let _ = this;
            if(value){
                _.copyPop.copyProcess = [];
                axios.get(webApiUrl + '/api/ProductBasicInfo/GetProcessBySkuId', {
                    params: {
                        SKUGuid: value
                    }
                })
                .then(function(response) {
                    if (response.data.status) {
                        _.copyPop.copyProcess  = response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            }
        },
        // getEquiment: function() {
        //     var _ = this;
        //     axios.get(webApiUrl + '/api/ProductBasicInfo/GetEquiment?random=' + Math.random())
        //         .then(function(response) {
        //             if (response.data.status) {
        //                 _.selectItem.m_data_Equipment = response.data.data;
        //             }
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        // },
        // 自动补全框传值
        comReference(data) {
            this.Indicator.dataId = data;
        },
        // 自动补全通用函数
        completion(value) {
            let url = '';
            let data = {};
            this.deleteDATA()
            switch (this.Indicator.dataId) {
                case '0':
                    data = {
                        ColName: 'location',
                        Keyword: value
                    };
                    break;
                case '1':
                    data = {
                        ColName: 'size',
                        Keyword: value
                    };
                    break;
                case '2':
                    data = {
                        ColName: 'Format',
                        Keyword: value
                    };
                    break;
                case '3':
                    data = {
                        ColName: 'Equipment',
                        Keyword: value
                    };
                    break;
            }
            axios.post(webApiUrl + "/api/QualityCondition/AutoComplete?random=" + Math.random(), data).then((res) => {
                if (res.data.data.length > 0) {
                    switch (this.Indicator.dataId) {
                        case '0':
                            this.Indicator.position.data = res.data.data
                            break;
                        case '1':
                            this.Indicator.size.data = res.data.data
                            break;
                        case '2':
                            this.Indicator.shape.data = res.data.data
                            break;
                        case '3':
                            this.Indicator.equipment.data = res.data.data
                            break;
                    }
                }
            })
        },
        // 清空暂存数据
        deleteDATA() {
            this.Indicator.position.data = [];
            this.Indicator.size.data = [];
            this.Indicator.shape.data = [];
            this.Indicator.equipment.data = [];
        },

        //page Function
        add() {
            this.$refs['editForm'].resetFields();
            this.baseModel.timeMaxValue = "";
            this.baseModel.imgVisible = false;
            this.baseModel.imgUrl = "";
            this.title = '';
            this.baseModel.imgFileId = "";
            this.baseModel.valueType = "1";
            this.baseModel.valueTypeEr = "1";
            this.baseModel.maxValue = "";
            this.baseModel.minValue = "";
            this.baseModel.recheck = false;
            this.baseModel.qualityType = "0";
            this.baseModel.time = "0";
            this.baseModel.value = ""; //
            this.baseModel.evaluation = "";
            this.baseModel.roleValue = ['1'];
            this.baseModel.booleanValue = "1";
            this.baseModel.calcuteExpress = "";
            this.baseModel.conditionDisplay = "";
            this.baseModel.timeValue = '';
            this.baseModel.isCalcute = false;
            this.baseModel.isCondition = false;
            this.baseModel.sort = "";
            this.showEdit = true;
            this.baseModel.rowNumber = '';
            this.baseModel.id = 0;
            this.baseModel.remark = ''
        },
        // 复制弹窗
        copy (){
            this.$refs.copyPopProduct.clearSingleSelect();
            this.$refs['copyPop'].resetFields();
            this.copyPop.selectItem.Product = '';
            this.copyPop.selectItem.SKU = '';
            this.copyPop.selectItem.Process = '';
            this.copyPop.show = true;
        },
        onSort(column, key, order) {
            this.searchModel.sort = column.key + " " + column.order;
            this.search();
        },
        uploading(event, file, fileList) {
            this.$Spin.show();
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: "文件格式错误",
                desc: "请选择.xls或者.xlsx文件"
            });
            this.$Spin.hide();
        },
        uploadDone(response, file, fileList) {
            this.$Notice.success({
                title: "提示",
                desc: "文件上传成功"
            });
            this.$Spin.hide();
            this.search();
        },
        download() {
            var _ = this;
            this.$Spin.show();
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({
                    Col: this.searchType,
                    Val: this.searchKey,
                    Operation: 'like'
                });
            }
            axios.post(webApiUrl + '/api/QualityCondition/Download?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    if (response.data.status) {
                        _.$Spin.hide();
                        //文件路径response.data.data
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
                if (this.searchType == "QualityType") {
                    this.searchModel.search.push({ Col: "QualityType", Val: this.searchKey, Operation: '=' });
                } else {
                    this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
                }
            }
            _.searchModel.pageIndex = pageIndex;
            _.searchModel.PageSize = 50;
            _.searchModel.ProductGuid = this.selectItem.m_select_Product;
            _.searchModel.SKUGuid = this.selectItem.m_select_SKU;
            _.searchModel.ProcessGuid = this.selectItem.m_select_Process;
            _.searchModel.EquimentGuid = this.selectItem.m_select_Equipment;
            _.$Spin.show();
            axios.post(webApiUrl + '/api/QualityCondition/GetPageLists?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    _.$Spin.hide();
                    if (response.data.status) {
                        _.formTableData.dataSource = response.data.data.items;
                        _.total = response.data.data.totalNum;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        del() {
            var _ = this;
            this.$Spin.show();
            axios.post(webApiUrl + "/api/QualityCondition/delete?random=" + Math.random(), {
                id: _.baseModel.id
            }).then(res => {
                _.$Spin.hide();
                if (res.data.status) {
                    _.$Message.success("删除成功");
                    _.search();
                } else {
                    _.$Message.error(res.data.errorCode);
                }
            });
        },
        // 复制编辑前的数据统一处理
        copyDataHandl(data) {
            let _ = this;
            _.baseModel.qualityType = data.qualityType.toString();
            _.baseModel.productId = data.productId;
            _.baseModel.processId = data.processId;
            _.baseModel.qualityId = data.qualityId;
            _.baseModel.valueType = data.valueType;
            _.baseModel.valueTypeEr = data.valueTypeEr;
            _.baseModel.maxValue = data.maxValue;
            _.baseModel.minValue = data.minValue;
            _.baseModel.timeMaxValue = data.timeMaxValue
                // _.baseModel.value = data.value;
                // _.baseModel.frequency = data.frequency.toString();
                // _.baseModel.recheck = data.recheck;

            _.baseModel.isCalcute = data.isCalcute;
            _.baseModel.isCondition = data.isCondition;
            _.baseModel.calcuteExpress = data.calcuteExpress;
            _.baseModel.conditionDisplay = data.conditionDisplay;
            _.baseModel.time = data.time.toString();
            _.baseModel.evaluation = data.evaluation;
            _.baseModel.equipmentId = data.equipmentId;
            // 日期检测公式
            _.baseModel.timeValue = data.timeValue;
            _.baseModel.booleanValue = data.booleanValue ? "1" : "0";
            _.baseModel.remark = data.remark;
            _.baseModel.roleValue = data.roleValue.split(',');
            _.baseModel.Quality = data.quality;
            _.baseModel.location = data.location;
            _.baseModel.size = data.size;
            _.baseModel.format = data.format;
            _.baseModel.equipment = data.equipment;
            _.baseModel.rowNumber = data.rowNumber;
            _.baseModel.poNo = data.poNo;
            _.baseModel.sort = data.sort.toString();

            if (data.imgFileId) {
                _.baseModel.imgVisible = true;
                _.baseModel.imgUrl = fileServerUrl + 'GetFileStramById?fileID=' + data.imgFileId;
            } else {
                _.baseModel.imgVisible = false;
            }
            _.baseModel.imgFileId = data.imgFileId;
            _.Indicator.data.forEach((val, index) => {
                if (_.baseModel.qualityType === val.id.toString()) {
                    _.Indicator.selectValue = val.name
                }
            })

            //暂存数据
            _.temporary.maxValue = data.maxValue;
            _.temporary.minValue = data.minValue;
            _.temporary.timeValue = data.timeValue;
            _.temporary.timeMaxValue = data.timeMaxValue
            _.temporary.booleanValue = data.booleanValue ? "1" : "0";
        },
        save() {
            function copy(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
            var _ = this;
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    this.$Spin.show();
                    var model = copy(_.baseModel);
                    model.productId = _.selectItem.m_select_Product;
                    model.SKUId = _.selectItem.m_select_SKU;
                    model.processId = _.selectItem.m_select_Process;
                    model.equipmentId = _.selectItem.m_select_Equipment;
                    model.roleValue = _.baseModel.roleValue.join(',');
                    model.booleanValue = _.baseModel.booleanValue == "1" ? true : false;
                    axios.post(webApiUrl + "/api/QualityCondition/EditCondition?random=" + Math.random(), model)
                        .then(function(response) {
                            if (response.data.status) {
                                _.search();
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
                }
            })
        },
        copySave(){
            this.$refs['copyPop'].validate((valid) => {
                if (valid) {
                    if( this.copyPop.copyTableData.length > 0) {
                        this.copyPop.copyTableData.forEach((val,index) =>{
                            val.id =0 ;
                            val.productId = this.copyPop.selectItem.Product;
                            val.processId = this.copyPop.selectItem.Process;
                        })
                        this.$Spin.show();
                        axios.post(webApiUrl + "/api/QualityCondition/AddConditionList",this.copyPop.copyTableData)
                        .then((res)=>{
                            if(res.status === 200 && res.data == ''){
                                console.log(res)
                                this.$Spin.hide();
                                this.copyPop.show = false;
                                this.$Message.success('复制成功');
                            } else{
                                this.$Spin.hide();
                                this.copyPop.show = false;
                                let errorCode = res.data.errorCode;
                                let errorCodeArr = errorCode.split("<br />")
                                this.$Notice.error({
                                    title: "复制错误提示",
                                    duration: 0,
                                    render: ( h ) =>{
                                      let arr = []
                                      errorCodeArr.forEach((val)=>{
                                        arr.push( h('p', val))
                                      })
                                        return ('div', arr)
                                    }
                                })
                            }

                        }).catch((err)=>{
                            console.log(err)
                            this.$Spin.hide();
                        })
                    }else{
                        this.$Message.warning('至少勾选一条数据');
                    }

                }else{
                    this.$Message.error('验证未通过');
                }
            })
        }
    },
    mounted() {
        this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px';
        basis.tableHeightData(this.formTableData)
    }
})
