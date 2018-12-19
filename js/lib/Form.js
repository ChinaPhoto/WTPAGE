'use strict';

var _methods;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        var _this2 = this;

        var validateformTitle = function validateformTitle(rule, value, callback) {
            if (!value) {
                return callback(new Error('必填'));
            }

            var postData = { Id: _this2.copyModal.id, FormTitle: _this2.copyModal.formTitle };
            axios.post(webApiUrl + '/api/Form/IsFromTitle?random=' + Math.random(), postData).then(function (response) {
                if (response.data.status) {
                    callback();
                } else {
                    return callback(new Error(response.data.errorCode));
                }
            }).catch(function (error) {
                callback(new Error(error));
            });
        };
        var depositStartDataFun = function depositStartDataFun(rule, value, callback) {

            if (value === '') {
                return callback(new Error('必填'));
            }
            callback();
        };
        return {
            uploadUrl: webApiUrl + '/api/Form/upload?random=' + Math.random(), // 上传路径
            total: 0, //总条数
            baseModel: {
                id: 0,
                formTitle: '', //表单头名称
                remark: '',
                rffectTime: '2000-1-1',
                createTime: new Date(),
                createUser: '',
                formType: ''
            },
            windowHeight: document.documentElement.clientHeight,
            modalMaxHeight: {
                maxHeight: '110px',
                overflowX: 'hidden',
                overflowY: 'auto'
            },
            AllFormType: '',
            baseModelOption: [{ name: '通用', id: '0' }, { name: '毛坯尺寸及外观检测', id: '1' }, { name: '米字型检测', id: '2' }, { name: '外观及视检验', id: '3' }, { name: '位置度评定', id: '4' }, { name: '全尺寸检测', id: '6' }, { name: '清洗检测', id: '7' }, { name: '涂装过程检测', id: '8' }, { name: '涂装厚度检测', id: '9' }, { name: '包装封箱前检测', id: '10' }, { name: '外购件复检', id: '11' }, { name: '成品检测', id: '12' }],
            sourceFormHead: [],
            sourceFormHeadKey: [],
            targetFormHead: [],
            inputData: [],
            xxx: this.AllFormType == 0 ? 'processValue' : '',
            listStyle: {
                width: '250px',
                height: '500px'
            },
            autoComplete: { // 自动补全公用数据 三级联动公用数据
                CP: {
                    data: [],
                    guid: '' // 默认数据
                },
                SKU: {
                    data: [],
                    guid: '' // 默认数据
                },
                GX: {
                    data: [],
                    guid: '' // 默认数据
                },
                formType: 0, // 类型
                formId: 0, // 
                isTrue: true,
                table: [] // table 选中数据
            },
            transferTitles: ['源表单头', '选中表单头'],
            baseRules: {
                formTitle: [{ required: true, message: '必填', trigger: 'blur' }],
                // depositStartData: [
                //     { required: true, validator: depositStartDataFun, trigger: 'blur' }
                // ],
                formType: [{
                    required: true,
                    message: '请选择表单类型',
                    trigger: 'blur'
                }]
            },
            searchType: 'formTitle', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: {
                isShow: false
            }, //编辑窗
            editFormHead: false, //表单头编辑窗
            bindingFormHead: false, //绑定表单头框
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            draggingRecord: {
                BeforeSort: '',
                BeforeId: '',
                EndSort: '',
                FormId: ''
            }, //拖拽数据源
            columnData: [//列
            {
                align: 'center',
                title: '工序检验单名称',
                sortable: 'custom',
                key: 'formTitle'
            },

            // {
            //     align: 'center',
            //     title: '生效时间',
            //     key: 'depositStartData',
            //     render: (h, params) => {
            //         if (params.row.rffectTime) {
            //             var aboutCtime = params.row.rffectTime;
            //             return h('div', basis.interceptionTime(aboutCtime))
            //         }
            //     }
            // },
            {
                align: 'center',
                title: '工序检验单类型',
                sortable: 'custom',
                key: 'formType',
                render: function render(h, params) {
                    var formType = params.row.formType;
                    switch (formType) {
                        case 0:
                            return h('div', "通用");
                            break;
                        case 1:
                            return h('div', "毛坯尺寸及外观检测");
                            break;
                        case 2:
                            return h('div', "米字型检测");
                            break;
                        case 3:
                            return h('div', "外观及视检验");
                            break;
                        case 4:
                            return h('div', "位置度评定");
                            break;

                        case 6:
                            return h('div', "全尺寸检测");
                            break;
                        case 7:
                            return h('div', "清洗检测");
                            break;
                        case 8:
                            return h('div', "涂装过程检测");
                            break;
                        case 9:
                            return h('div', "涂装厚度检测");
                            break;
                        case 10:
                            return h('div', "包装封箱前检测");
                            break;
                        case 11:
                            return h('div', "外购件复检");
                            break;
                        case 12:
                            return h('div', "成品检测");
                            break;
                    }
                }
            }, {
                align: 'center',
                title: '子件编号',
                sortable: 'custom',
                key: 'productCode'
            }, {
                align: 'center',
                title: '子件名称',
                sortable: 'custom',
                key: 'productName'
            }, {
                align: 'center',
                title: '备注',
                sortable: 'custom',
                key: 'remark'
            }, {
                align: 'center',
                title: '配置工序检测项',
                render: function render(h, params) {

                    return h('i-button', {
                        props: { type: 'ghost', size: 'small', icon: 'plus-circled' },
                        on: {
                            click: function click() {
                                _this2.deleteProcess();
                                _this2.clearData();
                                _this2.getEquiment();
                                _this2.$refs.formValidate.resetFields();
                                _this2.tableTitle = params.row.title;
                                _this2.detection.form.FormId = params.row.id;
                                _this2.detection.isShow = true;
                                // this.autoComplete.table = [];
                                _this2.baseModel.formType = params.row.formType;
                                _this2.AllFormType = params.row.formType;
                                _this2.autoComplete.formId = params.row.id;
                                _this2.$refs.detectionEq.clearSingleSelect();
                                _this2.$Spin.show();
                                _this2.processAxios(_this2.detection.form.FormId, params.column.title);
                            }
                        }
                    }, '配置项');
                }
            }, {
                align: 'center',
                title: '预览',
                width: 130,
                render: function render(h, _ref) {
                    var row = _ref.row;

                    return h('i-button', {
                        props: { type: 'ghost' },
                        on: {
                            click: function click() {
                                _this2.draggingRecord.FormId = row.id;
                                _this2.$Spin.show();
                                _this2.preview.isShow = true;
                                _this2.preview.formHead = row.formTitle;
                                _this2.previewData();
                                var el = _this2.$refs.dragable.$children[1].$el.children[1];
                                var vm = _this2;
                                Sortable.create(el, {
                                    onEnd: vm.endFunc,
                                    onChoose: vm.chooseFunc
                                });
                            }
                        }
                    }, '预览');
                }
            }, {
                align: 'center',
                title: '操作',
                width: 190,
                key: 'action',
                render: function render(h, params) {
                    return h('div', [h('i-Button', {
                        props: {
                            type: 'ghost',
                            size: 'small',
                            icon: 'pricetags'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: function click() {

                                _this2.$refs['copyForm'].resetFields();
                                _this2.deleteProcess();
                                _this2.tableTitle = params.column.title;
                                _this2.copyModal.isShow = true;
                                _this2.copyModal.id = params.row.id;
                                _this2.copyModal.formType = params.row.formType;
                                switch (params.row.formType) {
                                    case 0:
                                        return _this2.copyModal.formTypeValue = "通用";
                                        break;
                                    case 1:
                                        return _this2.copyModal.formTypeValue = "毛坯尺寸及外观检测";
                                        break;
                                    case 2:
                                        return _this2.copyModal.formTypeValue = "米字型检测";
                                        break;
                                    case 3:
                                        return _this2.copyModal.formTypeValue = "外观及视检验";
                                        break;
                                    case 4:
                                        return _this2.copyModal.formTypeValue = "位置度评定";
                                        break;

                                    case 6:
                                        return _this2.copyModal.formTypeValue = "全尺寸检测";
                                        break;
                                    case 7:
                                        return _this2.copyModal.formTypeValue = "清洗检测";
                                        break;
                                    case 8:
                                        return _this2.copyModal.formTypeValue = "涂装过程检测";
                                        break;
                                    case 9:
                                        return _this2.copyModal.formTypeValue = "涂装厚度检测";
                                        break;
                                    case 10:
                                        return _this2.copyModal.formTypeValue = "包装封箱前检测";
                                        break;
                                    case 11:
                                        return _this2.copyModal.formTypeValue = "外购件复检";
                                        break;
                                    case 12:
                                        return _this2.copyModal.formTypeValue = "成品检测";
                                        break;
                                }
                            }
                        }
                    }, '复制'), h('i-Button', {
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
                                _this2.tableTitle = '';
                                var _ = target;
                                _.baseModel.id = params.row.id;
                                _.baseModel.formTitle = params.row.formTitle;
                                _.baseModel.remark = params.row.remark;
                                // _.baseModel.depositStartData = params.row.rffectTime;
                                // _.baseModel.depositEndData = params.row.rffectTime;                                    
                                _.baseModel.createUser = params.row.createUser;
                                _.baseModel.formType = params.row.formType.toString();
                                _.showEdit.isShow = true;
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
            formTableData: {
                dataSource: [], //数据源
                tableHeight: 0
            },

            // 绑定维度数据
            detection: {
                isShow: false,
                form: { // form  参数
                    id: '',
                    FormId: '',
                    formType: 0,
                    CompletionValue: '',
                    selectValue: '',
                    processValue: '',
                    isCalcute: false,
                    isLifiedText: true,
                    userValue: '', //检测项默认检验员
                    // userValueData: '', //工序默认检验员
                    // RecheckUser: '', // 默认复检验员
                    // RecheckUserGuid: '',
                    frequency: '0',
                    CMMUser: '', //默认三坐标人员
                    CMMUserGuid: '',
                    Completion: { // 自动补全参数                     
                        data: [],
                        guid: '' // 被选中的guid
                    },
                    select: { // sku 下拉框参数                    
                        data: [
                            //  { SQUGuid: "f14e4e66-4f87-4e87-bca5-1ce768843d57", SQUName: "挡圈1(114W6203)" },
                            // { SQUGuid: "72d5aec5-b735-42f6-a1f8-9fee147842dd", SQUName: "挡圈1（114W6203优化）" }
                        ],
                        guid: '' // 选中的guid
                    },
                    process: { // 工序
                        data: [],
                        guid: ''
                    },
                    user: { // 用户名                 
                        data: [],
                        guid: ''
                    },
                    // RecheckUserArr: {
                    //     data: []
                    // },
                    CMMUserArr: {
                        data: []
                    },
                    equipment: { // 设备数据 和选中的id
                        data: [],
                        eq: ''
                    }
                }
            },
            img: {
                imgBigShow: false,
                ImgFileId: '',
                css: {
                    maxWidth: '750px',
                    height: 'auto'
                }
            },
            // 绑定 检测项数据
            Items: {
                table: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                }, {
                    title: '工序名称',
                    align: 'center',
                    key: 'ProcessName'
                }, {
                    title: '检测项目',
                    align: 'center',
                    key: 'Quality'
                }, {
                    title: '评价测量技术',
                    align: 'center',
                    key: 'Evaluation'
                }, {
                    title: '备注',
                    align: 'center',
                    key: 'Remark'
                }],
                tableData: []
            },
            dimension: {
                CompletionValue: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                selectValue: [{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
                processValue: [{
                    message: '必填',
                    // validator: processTest,
                    trigger: 'change'
                }],
                userValue: [{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
                frequency: [{
                    required: true,
                    message: '必选项',
                    trigger: 'blur'
                }],
                CMMUser: [{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }]
            },
            preview: { // 预览数据
                isShow: false, // 显示隐藏的数据
                form: {}, // 表单数据
                inputData: [], // 展示的菜单列表,
                formHead: '', // 表单头
                table: [{
                    title: '标识ID',
                    align: 'center',
                    key: 'QualityId'
                }, {
                    title: '工序名称',
                    align: 'center',
                    key: 'ProcessName'
                }, {
                    title: '检测项目',
                    align: 'center',
                    key: 'Quality'
                }, {
                    title: '评价测量技术',
                    align: 'center',
                    key: 'Evaluation'
                }, {
                    title: '检测图片',
                    align: 'center',
                    key: 'ImgFileId',
                    render: function render(h, _ref2) {
                        var row = _ref2.row;

                        if (row.ImgFileId) {
                            return h('img', {
                                attrs: {
                                    "src": fileServerUrl + 'GetFileStramById?fileID=' + row.ImgFileId
                                },
                                style: {
                                    "width": "170px",
                                    "height": "45px"
                                },
                                on: {
                                    dblclick: function dblclick() {
                                        _this2.img.ImgFileId = row.ImgFileId;
                                        _this2.img.imgBigShow = true;
                                    }
                                }
                            });
                        }
                    }
                }, {
                    title: '备注',
                    align: 'center',
                    key: 'Remark'
                }],
                tableData: []
            },
            tableTitle: '',
            copyModal: {
                isShow: false,
                id: '',
                formTitle: '',
                formType: '',
                formTypeValue: '',
                remark: '',
                CompletionValue: '',
                selectValue: '',
                processValue: ''
            },
            copyRules: {
                formTitle: [{ required: true, message: '必填', trigger: 'blur' }],

                CompletionValue: [{ required: true, message: '必填', trigger: 'blur' }]
            }
        };
    },
    created: function created() {
        this.search();
    },

    watch: {
        "baseModel.formType": function baseModelFormType(newVal, oldVal) {
            if (newVal !== '' && newVal != undefined) {
                this.AllFormType = newVal;
            } else {
                this.AllFormType = oldVal;
            }
        }
    },
    methods: (_methods = {
        imgShow: function imgShow(data) {
            var _this3 = this;

            this.inputData.forEach(function (val, index) {
                if (data === val.key) {
                    _this3.img.ImgFileId = val.fileId;
                }
            });
            this.img.imgBigShow = true;
            this.imgBig();
        },

        // 图片前段处理
        imgBig: function imgBig() {
            return fileServerUrl + 'GetFileStramById?fileID=' + this.img.ImgFileId;
        },
        imgPreviewShows: function imgPreviewShows() {
            this.img.imgBigShow = false;
        },

        //工序请求
        processAxios: function processAxios(formId) {
            var _this4 = this;

            if (this.baseModel.formType == 0) {
                this.dimension.processValue[0].required = true;
            } else {
                this.dimension.processValue[0].required = false;
            }
            axios.get(webApiUrl + '/api/Form/GetFormConfig?random=' + Math.random(), {
                params: {
                    FormId: formId
                }
            }).then(function (res) {
                if (res.data.data) {
                    _this4.detection.form.id = res.data.data.Id;
                    _this4.detection.form.Completion.guid = res.data.data.ProductGuid;
                    _this4.detection.form.CompletionValue = res.data.data.ProductName + '-' + res.data.data.ProductCode;
                    _this4.detection.form.isCalcute = res.data.data.IsCMM;
                    _this4.detection.form.isLifiedText = res.data.data.IsNonconformingFlow;
                    _this4.detection.form.select.guid = res.data.data.SkuGuid;
                    _this4.detection.form.userValue = res.data.data.UserName + '-' + res.data.data.UserCode;
                    // this.detection.form.RecheckUser = res.data.data.RecheckUserCode ? res.data.data.RecheckUserName + '-' + res.data.data.RecheckUserCode : '';
                    _this4.detection.form.CMMUser = res.data.data.CMMUserName ? res.data.data.CMMUserName + '-' + res.data.data.CMMUserCode : '';
                    _this4.detection.form.user.guid = res.data.data.CheckUser;
                    _this4.detection.form.equipment.eq = res.data.data.EquipmentId;
                    // this.detection.form.RecheckUserGuid = res.data.data.RecheckUser;
                    _this4.detection.form.CMMUserGuid = res.data.data.CMMUser;
                    _this4.detection.form.process.guid = res.data.data.ProcessGuid;
                    _this4.detection.form.frequency = res.data.data.Frequency.toString();
                    _this4.processTable(_this4.detection.form.process.guid);
                    axios.all([axios.get(webApiUrl + '/api/Form/GetSQUByProduct?random=' + Math.random(), {
                        params: { productGuid: res.data.data.ProductGuid }
                    }), axios.get(webApiUrl + '/api/Form/GetProcessBySku?random=' + Math.random(), {
                        params: { skuId: res.data.data.SkuGuid }
                    })]).then(axios.spread(function (skuData, processData) {
                        _this4.$Spin.hide();
                        _this4.autoComplete.SKU.data = skuData.data.data;
                        _this4.detection.form.selectValue = res.data.data.SkuGuid;
                        _this4.autoComplete.GX.data = processData.data.data;
                        _this4.detection.form.processValue = res.data.data.ProcessGuid;
                    }));
                } else {
                    _this4.$Spin.hide();
                }
            });
        },

        //  绑定检测 table 选中返回的值
        ItemsSelect: function ItemsSelect(selection) {
            this.autoComplete.table = [];
            this.autoComplete.table = this.ItemsSelectTableData(selection);
        },

        // 绑定数据项 选中table 数据函数
        ItemsSelectTableData: function ItemsSelectTableData(data) {
            var _this5 = this;

            var arr = [];
            if (data && data.length > 0) {
                data.forEach(function (val, index) {
                    var obj = {};
                    obj.FormId = _this5.autoComplete.formId;
                    obj.QualityId = val.QualityId;
                    obj.QualityConditionId = val.QualityConditionId;
                    obj.ProductGuid = _this5.detection.form.Completion.guid;
                    obj.SkuGuid = _this5.detection.form.select.guid;
                    obj.ProcessGuid = _this5.detection.form.process.guid;
                    arr.push(obj);
                });
            } else {
                arr = [{
                    FormId: this.autoComplete.formId,
                    ProductGuid: this.detection.form.Completion.guid,
                    SkuGuid: this.detection.form.select.guid,
                    ProcessGuid: this.detection.form.process.guid,
                    QualityId: 0,
                    QualityConditionId: 0
                }];
            }
            return arr;
        },


        //自动补全
        completeReq: function completeReq(value) {
            var _this = this;
            if (value) {
                if (this.tableTitle === '操作') {
                    this.copyModal.selectValue = '';
                } else {
                    this.Items.tableData = [];
                    this.detection.form.selectValue = '';
                }

                var data = _this.detection.form.CompletionValue,
                    url = webApiUrl + '/api/Form/GetProductByName?random=' + Math.random();
                axios.get(url, {
                    params: { name: value }
                }).then(function (res) {
                    _this.autoComplete.CP.data = res.data.data;
                }).catch();
            } else {
                _this.detection.form.Completion.guid = '';
            }
        },

        // sku 参数  
        skuReq: function skuReq(value) {
            var _this6 = this;

            var _this = this;
            if (value) {
                var url = webApiUrl + '/api/Form/GetSQUByProduct?random=' + Math.random();
                _this.autoComplete.SKU.data = '';
                var valueData = value.split('-')[1];
                _this.autoComplete.CP.data.forEach(function (val, index) {
                    if (val.ProductCode === valueData) {
                        _this.detection.form.Completion.guid = val.ProductGuid;
                    }
                });
                _this.processTable(_this.detection.form.process.guid);
                _this.$Spin.show();
                axios.get(url, {
                    params: { productGuid: _this.detection.form.Completion.guid }
                }).then(function (res) {
                    _this.$Spin.hide();
                    // if (res.data.status) {
                    _this.autoComplete.SKU.data = res.data.data;
                    if (_this6.tableTitle === '操作') {
                        _this.copyModal.selectValue = '';
                        _this.copyModal.processValue = '';
                    } else {
                        _this.detection.form.selectValue = '';
                        _this.detection.form.processValue = '';
                    }
                });
            }
        },

        // sku选中后的guid 
        selectReq: function selectReq(value) {
            var _this7 = this;

            var _this = this;
            _this.detection.form.select.guid = value;
            if (value) {
                _this.$Spin.show();
                axios.get(webApiUrl + '/api/Form/GetProcessBySku?random=' + Math.random(), {
                    params: {
                        skuId: _this.detection.form.select.guid
                    }
                }).then(function (res) {
                    _this.$Spin.hide();
                    if (res.status) {
                        _this.autoComplete.GX.data = res.data.data;
                        if (_this7.tableTitle == '操作') {
                            _this.copyModal.processValue = '';
                        } else {
                            _this.detection.form.processValue = '';
                        }
                    } else {
                        _this.$Message.warning(res.errorCode);
                    }
                });
            }
        },
        selectSKUReq: function selectSKUReq() {
            var _this = this;
            _this.autoComplete.GX.data = [];

            if (_this.detection.form.process.guid) {
                _this.detection.form.process.guid = '';
                _this.autoComplete.table = this.ItemsSelectTableData();
            }

            if (this.tableTitle == '操作') {
                _this.copyModal.processValue = '';
            } else {
                _this.detection.form.processValue = '';
            }
        },
        selectProcessReq: function selectProcessReq() {
            var _this = this;
            _this.detection.form.process.guid = '';
            _this.autoComplete.table = this.ItemsSelectTableData();
        },
        previewData: function previewData() {
            var _this8 = this;

            var url = webApiUrl + '/api/Form/GetPreviewFormData?random=' + Math.random();
            axios.get(url, {
                params: {
                    id: this.draggingRecord.FormId
                }
            }).then(function (res) {
                _this8.$Spin.hide();
                if (res.data.status) {
                    _this8.preview.tableData = res.data.data;
                } else {
                    _this8.$Message.warning(res.data.errorCode);
                }
            });
        },

        // 清除默认数据
        clearData: function clearData() {
            this.autoComplete.CP.data = [];
            this.autoComplete.GX.data = [];
            this.autoComplete.SKU.data = [];
            this.detection.form.equipment.data = [];
            this.Items.tableData = [];
        },


        // 工序选中后的 guid
        // processReq(value) {
        //     let _this = this;
        //     _this.detection.form.process.guid = value
        // },

        copyProcess: function copyProcess(value) {
            this.detection.form.process.guid = value;
        },

        // 绑定table
        processTable: function processTable(value) {
            var _this = this;

            _this.detection.form.process.guid = value;
            if (_this.detection.form.CompletionValue) {
                _this.$Spin.show();
                axios.get(webApiUrl + "/api/Form/GetQualityBy?random=" + Math.random(), {
                    params: {
                        ProductId: _this.detection.form.Completion.guid,
                        ProcessGuid: _this.detection.form.process.guid ? _this.detection.form.process.guid : '',
                        FormType: _this.baseModel.formType,
                        FormId: _this.autoComplete.formId
                    }
                }).then(function (res) {
                    _this.$Spin.hide();
                    if (res.status) {
                        _this.Items.tableData = [];
                        res.data.data.forEach(function (val, index) {
                            var objdata = {
                                ProcessName: val.ProcessName,
                                EquipmentName: val.EquipmentName,
                                Quality: val.Quality,
                                Evaluation: val.Evaluation,
                                Frequency: val.Frequency,
                                Remark: val.Remark,
                                _checked: val._checked == "0" ? false : true,
                                QualityId: val.QualityId,
                                QualityConditionId: val.QualityConditionId

                            };
                            _this.Items.tableData.push(objdata);
                        });
                    }
                });
            }
        },

        // 用户名 弹窗
        usernameReqData: function usernameReqData(value, arrData) {
            var _ = this;
            if (value) {
                arrData.data = [];
                var name = value;

                axios.get(webApiUrl + "/api/Form/GetUserList?random=" + Math.random(), {
                    params: {
                        userName: name
                    }
                }).then(function (res) {

                    if (res.status) {
                        arrData.data = res.data.data;
                    }
                });
            }
        },
        usernameReq: function usernameReq(value) {
            var _ = this;
            if (value) {
                _.usernameReqData(value, _.detection.form.user);
            } else {
                _.detection.form.user.guid = '';
            }
        },


        // 默认复检员清空
        // recheck(value) {
        //     let _ = this;
        //     if (value) {
        //         _.usernameReqData(value, _.detection.form.RecheckUserArr)
        //     } else {
        //         _.detection.form.RecheckUserGuid = '';
        //     }
        // },
        // 默认检测员
        CMMUser: function CMMUser(value) {
            var _ = this;
            if (value) {
                _.usernameReqData(value, _.detection.form.CMMUserArr);
            } else {
                _.detection.form.CMMUserGuid = '';
            }
        },

        // 用户名填充修改项
        userReq: function userReq(value) {
            var _ = this;
            if (value) {
                var valueData = value.split('-')[0];
                this.detection.form.user.data.forEach(function (val, index) {
                    if (valueData) {
                        if (valueData === val.LoginAccount) {
                            _.detection.form.user.guid = val.Id;
                        }
                    }
                });
            }
        },

        // rechecReq(value) {
        //     let _ = this;
        //     _.detection.form.RecheckUserArr.data.forEach((val, index) => {
        //         if (value) {
        //             let valueData = value.split('-')[0];
        //             if (valueData === val.LoginAccount) {
        //                 _.detection.form.RecheckUserGuid = val.Id
        //             }
        //         }
        //     })
        // },
        CMMReq: function CMMReq(value) {
            var _ = this;
            _.detection.form.CMMUserArr.data.forEach(function (val, index) {
                if (value) {
                    var valueData = value.split('-')[0];
                    if (valueData === val.LoginAccount) {
                        _.detection.form.CMMUserGuid = val.Id;
                    }
                }
            });
        },

        // 获取设备列表
        getEquiment: function getEquiment() {
            var _ = this;
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetEquiment?random=' + Math.random()).then(function (response) {
                if (response.data.status) {
                    _.detection.form.equipment.data = response.data.data;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        // 复制按钮保存
        copySave: function copySave() {
            var _this9 = this;

            var url = webApiUrl + '/api/Form/CopyForm?random=' + Math.random();
            var obj = {
                FormId: this.copyModal.id,
                FormTitle: this.copyModal.formTitle,
                FormType: this.copyModal.formType,
                Remark: this.copyModal.remark,
                ProductGuid: this.detection.form.Completion.guid,
                ProcessGuid: this.detection.form.process.guid ? this.detection.form.process.guid : '',
                SkuGuid: this.detection.form.select.guid ? this.detection.form.select.guid : ''
            };

            if (obj.ProductGuid) {
                this.$refs['copyForm'].validate(function (valid) {
                    if (valid) {
                        axios.post(url, obj).then(function (res) {
                            if (res.data.status) {
                                _this9.$Message.success('复制成功');
                                _this9.copyModal.isShow = false;
                                _this9.search();
                            } else {
                                _this9.$Message.warning(res.data.errorCode);
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        _this9.$Message.error('验证失败');
                    }
                });
            } else {
                this.$Message.error('保存失败');
                this.$Message.warning('请选择正确的产品');
            }
        },

        // 弹窗点击确认后的函数
        detectionPost: function detectionPost() {
            var _this = this;
            _this.$refs['formValidate'].validate(function (valid) {
                if (valid) {
                    var data = {
                        FormId: _this.detection.form.FormId,
                        ProductGuid: _this.detection.form.Completion.guid ? _this.detection.form.Completion.guid : '',
                        IsCMM: _this.detection.form.isCalcute,
                        IsNonconformingFlow: _this.detection.form.isLifiedText,
                        CheckUser: _this.detection.form.user.guid,
                        ProcessGuid: _this.detection.form.process.guid ? _this.detection.form.process.guid : '',
                        SkuGuid: _this.detection.form.select.guid ? _this.detection.form.select.guid : '',
                        // RecheckUser: _this.detection.form.RecheckUserGuid ? _this.detection.form.RecheckUserGuid : '',
                        CMMUser: _this.detection.form.CMMUserGuid ? _this.detection.form.CMMUserGuid : '',
                        Frequency: _this.detection.form.frequency,
                        EquipmentId: _this.detection.form.equipment.eq ? _this.detection.form.equipment.eq : ''
                    };
                    var url1 = webApiUrl + '/api/Form/SaveFormConfig?random=' + Math.random(),
                        url2 = webApiUrl + '/api/Form/SaveFormRelation?random=' + Math.random();
                    if (data.ProductGuid && data.CheckUser) {
                        _this.$Spin.show();
                        if (_this.autoComplete.table.length > 0) {
                            axios.all([axios.post(url1, data), axios.post(url2, _this.autoComplete.table)]).then(axios.spread(function (DataOne, DataTwo) {
                                if (DataOne.data.status && DataTwo.data.status) {
                                    _this.detection.isShow = false;

                                    _this.$Message.success('保存成功');
                                    _this.deleteProcess();
                                    _this.search();
                                    _this.$Spin.hide();
                                } else if (DataOne.data.status && !DataTwo.data.status) {
                                    _this.$Spin.hide();
                                    _this.$Message.warning(DataTwo.data.errorCode);
                                } else if (DataTwo.data.status && !DataOne.data.status) {
                                    _this.$Spin.hide();
                                    _this.$Message.warning(DataOne.data.errorCode);
                                } else {
                                    _this.$Spin.hide();
                                    _this.$Message.warning(DataOne.data.errorCode);
                                    _this.$Message.warning(DataTwo.data.errorCode);
                                }
                            }));
                        } else {
                            axios.post(url1, data).then(function (res) {
                                if (res.data.status) {
                                    _this.detection.isShow = false;
                                    _this.$Message.success('保存成功');
                                    _this.deleteProcess();
                                    _this.search();
                                    _this.$Spin.hide();
                                } else {
                                    _this.$Message.warning(res.data.errorCode);
                                }
                            });
                        }
                    } else {
                        _this.$Spin.hide();
                        _this.$Message.error('保存失败');
                        if (data.ProductGuid == '') {
                            _this.$Message.warning('请选择正确的产品');
                        }
                        if (data.CheckUser == '') {
                            _this.$Message.warning('请选择正确的检验员');
                        }
                    }
                } else {
                    _this.$Message.error('保存失败');
                }
                // }
            });
        },

        //清空筛选后的数据
        clearSearchKey: function clearSearchKey() {
            this.searchKey = '';
        },


        // 清空工序数据工序数据
        deleteProcess: function deleteProcess() {
            var _this = this;
            _this.detection.form.CMMUser = '';
            // _this.detection.form.RecheckUser = '';
            // _this.detection.form.RecheckUserGuid = '';

            _this.autoComplete.table = [];
            _this.detection.form.FormId = '';
            _this.detection.form.equipment.eq = '';
            _this.detection.form.processValue = '';
            _this.detection.form.Completion.guid = '';
            _this.detection.form.isCalcute = false;
            _this.detection.form.isLifiedText = true;
            _this.detection.form.user.guid = '';
            _this.detection.form.process.guid = '';
            _this.detection.form.select.guid = '';
            _this.detection.form.userValue = '';
            _this.detection.form.CompletionValue = '';
            _this.detection.form.selectValue = '';
            _this.detection.form.deposit = '';
            _this.copyModal.formTitle = '';
            _this.copyModal.CompletionValue = '';
            _this.copyModal.formTypeValue = '';
            // _this.copyModal.depositStartData = '';
            _this.copyModal.selectValue = '';
            _this.copyModal.processValue = '';
            _this.copyModal.remark = '';
        },
        detectionPostlist: function detectionPostlist() {
            this.detection.isShow = false;
        },


        // 取消窗口
        cancel: function cancel(data) {
            data.isShow = false;
        },

        // 筛选区分大小写
        filterMethod: function filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        handleChange2: function handleChange2(newTargetKeys) {
            this.targetFormHead = newTargetKeys;
        }
    }, _defineProperty(_methods, 'filterMethod', function filterMethod(data, query) {
        return data.label.indexOf(query) > -1;
    }), _defineProperty(_methods, 'add', function add() {
        this.$refs['editForm'].resetFields();
        this.showEdit.isShow = true;
        this.baseModel.id = 0;
    }), _defineProperty(_methods, 'onSort', function onSort(column, key, order) {
        this.searchModel.sort = column.key + " " + column.order;
        this.search();
    }), _defineProperty(_methods, 'uploading', function uploading(event, file, fileList) {
        this.$Spin.show();
    }), _defineProperty(_methods, 'showEditFormHead', function showEditFormHead() {
        var _ = this;
        if (_.targetFormHead.length == 0) {
            _.$Message.warning("没有选中表单头");
            return;
        }
        _.inputData = [];
        _.sourceFormHead.forEach(function (value, index, array) {
            var indexFh = _.targetFormHead.indexOf(value.key);
            if (indexFh > -1) {
                _.inputData.push({
                    key: value.key,
                    label: value.label,
                    value: value.value
                });
            }
        });

        _.editFormHead = true;
    }), _defineProperty(_methods, 'saveFormHead', function saveFormHead() {
        var _ = this;
        _.$Spin.show();
        _.inputData.forEach(function (value, index, array) {
            var indexFh = _.sourceFormHeadKey.indexOf(value.key);
            _.sourceFormHead[indexFh].value = value.value;
        });
        _.$Spin.hide();
        _.editFormHead = false;
    }), _defineProperty(_methods, 'saveSelectFormHead', function saveSelectFormHead() {
        var _ = this;
        _.$Spin.show();
        var FormHeadRelation = [];
        _.sourceFormHead.forEach(function (value, index, array) {
            var indexFh = _.targetFormHead.indexOf(value.key);
            if (indexFh > -1) {
                FormHeadRelation.push({
                    FormId: value.fromId,
                    FormHeadId: value.key,
                    Value: value.value
                });
            }
        });
        if (FormHeadRelation.length <= 0) {
            FormHeadRelation.push({
                FormId: _.sourceFormHead[0].fromId,
                FormHeadId: -1
            });
        }
        axios.post(webApiUrl + '/api/Form/UpdateFormHeadRelation?random=' + Math.random(), FormHeadRelation).then(function (response) {
            if (response.data.status) {
                _.$Message.success("保存成功");
            } else {
                _.$Message.error(response.data.errorCode);
            }
            _.$Spin.hide();
            _.bindingFormHead = false;
        }).catch(function (error) {
            _.$Spin.hide();
            _.bindingFormHead = false;
        });
    }), _defineProperty(_methods, 'render3', function render3(item) {
        if (item.value == "") {
            return item.label;
        } else {
            return item.label + ' - ' + item.value;
        }
    }), _defineProperty(_methods, 'handleFormatError', function handleFormatError(file) {
        this.$Notice.warning({
            title: "文件格式错误",
            desc: "请选择.xls或者.xlsx文件"
        });
        this.$Spin.hide();
    }), _defineProperty(_methods, 'uploadDone', function uploadDone(response, file, fileList) {
        this.$Notice.success({
            title: "提示",
            desc: "文件上传成功"
        });
        this.$Spin.hide();
        this.search();
    }), _defineProperty(_methods, 'download', function download() {
        var _ = this;
        _.$Spin.show();

        this.searchModel.search = [];
        if (this.searchType != '' && this.searchKey != '') {
            this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
        }
        axios.post(webApiUrl + '/api/Form/Download?random=' + Math.random(), _.searchModel).then(function (response) {
            if (response.data.status) {
                _.$Spin.hide();
                //文件路径response.data.data
                window.location.href = fileServerUrl + response.data.data;
            }
        }).catch(function (error) {
            console.log(error);
        });
    }), _defineProperty(_methods, 'search', function search() {
        this.changePage(this.searchModel.pageIndex);
    }), _defineProperty(_methods, 'changePage', function changePage(pageIndex) {
        var _ = this;

        this.searchModel.search = [];
        if (this.searchType != '' && this.searchKey != '') {
            if (this.searchType == "formType") {
                this.searchModel.search.push({ Col: "formType", Val: this.searchKey, Operation: '=' });
            } else {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
        }
        _.searchModel.pageIndex = pageIndex;
        console.log(this.searchModel.search);
        _.$Spin.show();
        axios.post(webApiUrl + '/api/Form/GetPageListDetail?random=' + Math.random(), _.searchModel).then(function (response) {
            _.$Spin.hide();
            if (response.data.status) {
                _.formTableData.dataSource = response.data.data.items;
                _.total = response.data.data.totalNum;
            }
        }).catch(function (error) {
            console.log(error);
        });
    }), _defineProperty(_methods, 'del', function del() {
        var _ = this;
        _.$Spin.show();
        axios.post(webApiUrl + "/api/Form/delete?random=" + Math.random(), {
            id: _.baseModel.id
        }).then(function (res) {
            _.$Spin.hide();
            if (res.data.status) {
                _.$Message.success("删除成功");
                _.search();
            } else {
                _.$Message.error(res.data.errorCode);
            }
        });
    }), _defineProperty(_methods, 'save', function save() {
        var _ = this;
        _.$refs['editForm'].validate(function (valid) {
            if (valid) {
                // this.$Spin.show()
                _.$Spin.show();
                var url = webApiUrl + "/api/Form/insert?random=" + Math.random();
                if (_.baseModel.id != 0) {
                    url = webApiUrl + "/api/Form/update?random=" + Math.random();
                }
                axios.post(url, _.baseModel).then(function (response) {
                    if (response.data.status) {
                        _.search();
                        _.$refs['editForm'].resetFields();
                        _.showEdit.isShow = false;
                        // this.$Spin.hide();
                        _.$Spin.hide();
                        _.$Message.success('保存成功');
                    } else {
                        _.$Message.error(response.data.errorCode);
                    }
                    // this.$Spin.hide()
                    _.$Spin.hide();
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                _.$Message.error('验证失败');
            }
        });
    }), _defineProperty(_methods, 'endFunc', function endFunc(e) {
        var _this10 = this;

        // 处理拖拽数据源

        this.preview.tableData.forEach(function (val, index) {
            if (e.oldIndex == index) {
                _this10.draggingRecord.BeforeSort = val.FormQuailtySort;
                _this10.draggingRecord.BeforeId = val.FormQuailtyId;
            }

            if (e.newIndex == index) {
                _this10.draggingRecord.EndSort = val.FormQuailtySort;
            }
        });

        if (this.draggingRecord.BeforeSort != this.draggingRecord.EndSort) {
            axios.post(webApiUrl + '/api/Form/QualityConditionSort?random=' + Math.random(), this.draggingRecord).then(function (res) {
                if (res.data.status) {
                    _this10.previewData();
                } else {
                    _this10.$Message.warning(res.data.errorCode);
                }
            });
        }
    }), _defineProperty(_methods, 'moduleMaxHeight', function moduleMaxHeight() {
        this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px';
    }), _methods),
    mounted: function mounted() {
        this.moduleMaxHeight();
        basis.tableHeightData(this.formTableData);
    }
});
