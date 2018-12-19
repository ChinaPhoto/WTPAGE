var target = new Vue({
    el: '#mainDiv',
    data() {
        const validateformTitle = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('必填'));
            }

            var postData = { Id: this.copyModal.id, FormTitle: this.copyModal.formTitle }
            axios.post(webApiUrl + '/api/Form/IsFromTitle?random=' + Math.random(), postData).then(function(response) {
                if (response.data.status) {
                    callback();
                } else {
                    return callback(new Error(response.data.errorCode));
                }
            }).catch(function(error) {
                callback(new Error(error));
            });
        };
        const depositStartDataFun = (rule, value, callback) => {

            if (value === '') {
                return callback(new Error('必填'));
            }
            callback()
        }
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
                formType: '',
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
                formTitle: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],
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
            columnData: [ //列
                {
                    align: 'center',
                    title: '工序检验单名称',
                    sortable: 'custom',
                    key: 'formTitle',
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
                    render: (h, params) => {
                        let formType = params.row.formType;
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
                },
                {
                    align: 'center',
                    title: '子件编号',
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
                    title: '备注',
                    sortable: 'custom',
                    key: 'remark'
                },
                {
                    align: 'center',
                    title: '配置工序检测项',
                    render: (h, params) => {

                        return h('i-button', {
                            props: { type: 'ghost', size: 'small', icon: 'plus-circled' },
                            on: {
                                click: () => {
                                    this.deleteProcess();
                                    this.clearData();
                                    this.getEquiment()
                                    this.$refs.formValidate.resetFields();
                                    this.tableTitle = params.row.title;
                                    this.detection.form.FormId = params.row.id;
                                    this.detection.isShow = true;
                                    // this.autoComplete.table = [];
                                    this.baseModel.formType = params.row.formType;
                                    this.AllFormType = params.row.formType;
                                    this.autoComplete.formId = params.row.id;
                                    this.$refs.detectionEq.clearSingleSelect();
                                    this.$Spin.show();
                                    this.processAxios(this.detection.form.FormId, params.column.title);                                   
                                }
                            }
                        }, '配置项')
                    }
                },
                {
                    align: 'center',
                    title: '预览',
                    width: 130,
                    render: (h, { row }) => {
                        return h('i-button', {
                            props: { type: 'ghost' },
                            on: {
                                click: () => {
                                    this.draggingRecord.FormId = row.id
                                    this.$Spin.show();
                                    this.preview.isShow = true;
                                    this.preview.formHead = row.formTitle
                                    this.previewData();
                                    var el = this.$refs.dragable.$children[1].$el.children[1];
                                    let vm = this;
                                    Sortable.create(el, {
                                        onEnd: vm.endFunc,
                                        onChoose: vm.chooseFunc
                                    });
                                }
                            }
                        }, '预览')
                    }
                },
                {
                    align: 'center',
                    title: '操作',
                    width: 190,
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h('i-Button', {
                                props: {
                                    type: 'ghost',
                                    size: 'small',
                                    icon: 'pricetags'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {

                                        this.$refs['copyForm'].resetFields();
                                        this.deleteProcess()
                                        this.tableTitle = params.column.title
                                        this.copyModal.isShow = true;
                                        this.copyModal.id = params.row.id;
                                        this.copyModal.formType = params.row.formType;
                                        switch (params.row.formType) {
                                            case 0:
                                                return this.copyModal.formTypeValue = "通用";
                                                break;
                                            case 1:
                                                return this.copyModal.formTypeValue = "毛坯尺寸及外观检测";
                                                break;
                                            case 2:
                                                return this.copyModal.formTypeValue = "米字型检测";
                                                break;
                                            case 3:
                                                return this.copyModal.formTypeValue = "外观及视检验";
                                                break;
                                            case 4:
                                                return this.copyModal.formTypeValue = "位置度评定";
                                                break;

                                            case 6:
                                                return this.copyModal.formTypeValue = "全尺寸检测";
                                                break;
                                            case 7:
                                                return this.copyModal.formTypeValue = "清洗检测";
                                                break;
                                            case 8:
                                                return this.copyModal.formTypeValue = "涂装过程检测";
                                                break;
                                            case 9:
                                                return this.copyModal.formTypeValue = "涂装厚度检测";
                                                break;
                                            case 10:
                                                return this.copyModal.formTypeValue = "包装封箱前检测";
                                                break;
                                            case 11:
                                                return this.copyModal.formTypeValue = "外购件复检";
                                                break;
                                            case 12:
                                                return this.copyModal.formTypeValue = "成品检测";
                                                break;
                                        }
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
                                        this.tableTitle = '';
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
                            }, [h('i-button', { props: { type: 'ghost', size: 'small', icon: 'android-delete' } }, '删除')])
                        ]);
                    }
                }
            ],
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
                        guid: '', // 被选中的guid
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
                    equipment:{ // 设备数据 和选中的id
                        data:[],
                        eq:''
                    }
                }
            },
            img: {
                imgBigShow: false,
                ImgFileId: '',
                css: {
                    maxWidth: '750px',
                    height: 'auto'
                },
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
                    },                    
                    {
                        title: '检测项目',
                        align: 'center',
                        key: 'Quality'
                    }, {
                        title: '评价测量技术',
                        align: 'center',
                        key: 'Evaluation',
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'Remark'
                    }
                ],
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
                    },                   
                    {
                        title: '检测项目',
                        align: 'center',
                        key: 'Quality'
                    }, {
                        title: '评价测量技术',
                        align: 'center',
                        key: 'Evaluation',
                    },
                    {
                        title: '检测图片',
                        align: 'center',
                        key: 'ImgFileId',
                        render: (h, { row }) => {
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
                                        dblclick: () => {
                                            this.img.ImgFileId = row.ImgFileId
                                            this.img.imgBigShow = true;
                                        }
                                    }
                                })
                            }
                        }
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'Remark'
                    }
                ],
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
                formTitle: [
                    { required: true, message: '必填', trigger: 'blur' }
                ],

                CompletionValue: [
                    { required: true, message: '必填', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.search();
    },
    watch: {
        "baseModel.formType": function(newVal, oldVal) {
            if (newVal !== '' && newVal != undefined) {
                this.AllFormType = newVal
            } else {
                this.AllFormType = oldVal
            }
        }
    },
    methods: {
        imgShow(data) {
            this.inputData.forEach((val, index) => {
                if (data === val.key) {
                    this.img.ImgFileId = val.fileId
                }
            })
            this.img.imgBigShow = true;
            this.imgBig()
        },
        // 图片前段处理
        imgBig() {
            return fileServerUrl + 'GetFileStramById?fileID=' + this.img.ImgFileId
        },
        imgPreviewShows() {
            this.img.imgBigShow = false;
        },
        //工序请求
        processAxios(formId) {
            if (this.baseModel.formType == 0) {
                this.dimension.processValue[0].required = true;
            } else {
                this.dimension.processValue[0].required = false;
            }
            axios.get(webApiUrl + '/api/Form/GetFormConfig?random=' + Math.random(), {
                params: {
                    FormId: formId
                }
            }).then((res) => {              
                if (res.data.data) {
                    this.detection.form.id = res.data.data.Id;
                    this.detection.form.Completion.guid = res.data.data.ProductGuid;
                    this.detection.form.CompletionValue = res.data.data.ProductName + '-' + res.data.data.ProductCode;
                    this.detection.form.isCalcute = res.data.data.IsCMM;
                    this.detection.form.isLifiedText = res.data.data.IsNonconformingFlow;
                    this.detection.form.select.guid = res.data.data.SkuGuid;
                    this.detection.form.userValue = res.data.data.UserName + '-' + res.data.data.UserCode;
                    // this.detection.form.RecheckUser = res.data.data.RecheckUserCode ? res.data.data.RecheckUserName + '-' + res.data.data.RecheckUserCode : '';
                    this.detection.form.CMMUser = res.data.data.CMMUserName ? res.data.data.CMMUserName + '-' + res.data.data.CMMUserCode : '';
                    this.detection.form.user.guid = res.data.data.CheckUser;
                    this.detection.form.equipment.eq = res.data.data.EquipmentId;
                    // this.detection.form.RecheckUserGuid = res.data.data.RecheckUser;
                    this.detection.form.CMMUserGuid = res.data.data.CMMUser;
                    this.detection.form.process.guid = res.data.data.ProcessGuid;
                    this.detection.form.frequency = res.data.data.Frequency.toString();
                    this.processTable(this.detection.form.process.guid)
                    axios.all([
                        axios.get(webApiUrl + '/api/Form/GetSQUByProduct?random=' + Math.random(), {
                            params: { productGuid: res.data.data.ProductGuid }
                        }),
                        axios.get(webApiUrl + '/api/Form/GetProcessBySku?random=' + Math.random(), {
                            params: { skuId: res.data.data.SkuGuid }
                        })
                    ]).then(axios.spread((skuData, processData) => {
                        this.$Spin.hide()
                        this.autoComplete.SKU.data = skuData.data.data;
                        this.detection.form.selectValue = res.data.data.SkuGuid;
                        this.autoComplete.GX.data = processData.data.data;
                        this.detection.form.processValue = res.data.data.ProcessGuid;
                    }))
                } else {
                    this.$Spin.hide()
                }
            })
        },
        //  绑定检测 table 选中返回的值
        ItemsSelect(selection) {
            this.autoComplete.table = [];
            this.autoComplete.table = this.ItemsSelectTableData(selection);
        },
        // 绑定数据项 选中table 数据函数
        ItemsSelectTableData(data) {
            let arr = [];
            if (data && data.length > 0) {
                data.forEach((val, index) => {
                    let obj = {};
                    obj.FormId = this.autoComplete.formId;
                    obj.QualityId = val.QualityId;
                    obj.QualityConditionId = val.QualityConditionId;
                    obj.ProductGuid = this.detection.form.Completion.guid;
                    obj.SkuGuid = this.detection.form.select.guid;
                    obj.ProcessGuid = this.detection.form.process.guid;
                    arr.push(obj)

                })
            } else {
                arr = [{
                    FormId: this.autoComplete.formId,
                    ProductGuid: this.detection.form.Completion.guid,
                    SkuGuid: this.detection.form.select.guid,
                    ProcessGuid: this.detection.form.process.guid,
                    QualityId: 0,
                    QualityConditionId: 0
                }]
            }
            return arr;
        },

        //自动补全
        completeReq(value) {
            let _this = this
            if (value) {
                if (this.tableTitle === '操作') {
                    this.copyModal.selectValue = '';
                } else {
                    this.Items.tableData = [];
                    this.detection.form.selectValue = '';
                }
               
                let data = _this.detection.form.CompletionValue,
                    url = webApiUrl + '/api/Form/GetProductByName?random=' + Math.random();
                axios.get(url, {
                    params: { name: value }
                }).then((res) => {
                    _this.autoComplete.CP.data = res.data.data;

                }).catch()
            } else {
                _this.detection.form.Completion.guid = ''
            }
        },
        // sku 参数  
        skuReq(value) {
            let _this = this;
            if (value) {
                let url = webApiUrl + '/api/Form/GetSQUByProduct?random=' + Math.random();
                _this.autoComplete.SKU.data = '';
                let valueData = value.split('-')[1];
                _this.autoComplete.CP.data.forEach(function(val, index) {
                    if (val.ProductCode === valueData) {
                        _this.detection.form.Completion.guid = val.ProductGuid
                    }
                })
                _this.processTable(_this.detection.form.process.guid)
                _this.$Spin.show()
                axios.get(url, {
                    params: { productGuid: _this.detection.form.Completion.guid }
                }).then((res) => {
                    _this.$Spin.hide()
                        // if (res.data.status) {
                    _this.autoComplete.SKU.data = res.data.data;
                    if (this.tableTitle === '操作') {
                        _this.copyModal.selectValue = '';
                        _this.copyModal.processValue = ''
                    } else {
                        _this.detection.form.selectValue = '';
                        _this.detection.form.processValue = ''
                    }
                })
            }
        },
        // sku选中后的guid 
        selectReq(value) {
            let _this = this;
            _this.detection.form.select.guid = value;
            if (value) {
                _this.$Spin.show()
                axios.get(webApiUrl + '/api/Form/GetProcessBySku?random=' + Math.random(), {
                    params: {
                        skuId: _this.detection.form.select.guid
                    }
                }).then((res) => {
                    _this.$Spin.hide()
                    if (res.status) {
                        _this.autoComplete.GX.data = res.data.data;
                        if (this.tableTitle == '操作') {
                            _this.copyModal.processValue = ''
                        } else {
                            _this.detection.form.processValue = ''
                        }
                    } else {
                        _this.$Message.warning(res.errorCode)
                    }
                })
            }
        },
        selectSKUReq() {
            let _this = this;
            _this.autoComplete.GX.data = [];

            if (_this.detection.form.process.guid) {
                _this.detection.form.process.guid = '';
                _this.autoComplete.table = this.ItemsSelectTableData();
            }

            if (this.tableTitle == '操作') {
                _this.copyModal.processValue = '';
            } else {
                _this.detection.form.processValue = ''
            }

        },
        selectProcessReq() {
            let _this = this;
            _this.detection.form.process.guid = '';
            _this.autoComplete.table = this.ItemsSelectTableData()
        },
        previewData() {
            let url = webApiUrl + '/api/Form/GetPreviewFormData?random=' + Math.random();
            axios.get(url, {
                params: {
                    id: this.draggingRecord.FormId
                }
            }).then((res) => {
                this.$Spin.hide()
                if (res.data.status) {
                    this.preview.tableData = res.data.data
                } else {
                    this.$Message.warning(res.data.errorCode)
                }
            })
        },
        // 清除默认数据
        clearData() {
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

        copyProcess(value) {
            this.detection.form.process.guid = value;
        },
        // 绑定table
        processTable(value) {
            let _this = this;
          
                _this.detection.form.process.guid = value;
            if (_this.detection.form.CompletionValue) {
                _this.$Spin.show()                
                axios.get(webApiUrl + "/api/Form/GetQualityBy?random=" + Math.random(), {
                        params: {
                            ProductId: _this.detection.form.Completion.guid,
                            ProcessGuid: _this.detection.form.process.guid ? _this.detection.form.process.guid : '',
                            FormType: _this.baseModel.formType,
                            FormId: _this.autoComplete.formId,
                        }
                    }).then((res) => {
                        _this.$Spin.hide()
                        if (res.status) {
                            _this.Items.tableData = []
                            res.data.data.forEach((val, index) => {
                                let objdata = {
                                    ProcessName: val.ProcessName,
                                    EquipmentName: val.EquipmentName,
                                    Quality: val.Quality,
                                    Evaluation: val.Evaluation,
                                    Frequency: val.Frequency,
                                    Remark: val.Remark,
                                    _checked: val._checked == "0" ? false : true,
                                    QualityId: val.QualityId,
                                    QualityConditionId: val.QualityConditionId
    
                                }
                                _this.Items.tableData.push(objdata);
                            })
                        }
                    })
           
                }
        },
        // 用户名 弹窗
        usernameReqData(value, arrData) {
            let _ = this;
            if (value) {
                arrData.data = [];
                let name = value;

                axios.get(webApiUrl + "/api/Form/GetUserList?random=" + Math.random(), {
                    params: {
                        userName: name
                    }
                }).then((res) => {

                    if (res.status) {
                        arrData.data = res.data.data;
                    }

                })
            }
        },
        usernameReq(value) {
            let _ = this;
            if (value) {
                _.usernameReqData(value, _.detection.form.user)
            } else {
                _.detection.form.user.guid = ''
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
        CMMUser(value) {
            let _ = this;
            if (value) {
                _.usernameReqData(value, _.detection.form.CMMUserArr)
            } else {
                _.detection.form.CMMUserGuid = ''
            }
        },
        // 用户名填充修改项
        userReq(value) {
            let _ = this;
            if (value) {
                let valueData = value.split('-')[0];
                this.detection.form.user.data.forEach((val, index) => {
                    if (valueData) {
                        if (valueData === val.LoginAccount) {
                            _.detection.form.user.guid = val.Id
                        }
                    }
                })
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
        CMMReq(value) {
            let _ = this;
            _.detection.form.CMMUserArr.data.forEach((val, index) => {
                if (value) {
                    let valueData = value.split('-')[0];
                    if (valueData === val.LoginAccount) {
                        _.detection.form.CMMUserGuid = val.Id
                    }
                }
            })
        },
        // 获取设备列表
        getEquiment: function() {
            var _ = this;
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetEquiment?random=' + Math.random())
                .then(function(response) {
                    if (response.data.status) {
                        _.detection.form.equipment.data= response.data.data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // 复制按钮保存
        copySave() {
            let url = webApiUrl + '/api/Form/CopyForm?random=' + Math.random();
            let obj = {
                FormId: this.copyModal.id,
                FormTitle: this.copyModal.formTitle,
                FormType: this.copyModal.formType,
                Remark: this.copyModal.remark,
                ProductGuid: this.detection.form.Completion.guid,
                ProcessGuid: this.detection.form.process.guid ? this.detection.form.process.guid : '',
                SkuGuid: this.detection.form.select.guid ? this.detection.form.select.guid : ''
            }

            if (obj.ProductGuid) {
                this.$refs['copyForm'].validate((valid) => {
                    if (valid) {
                        axios.post(url, obj).then((res) => {
                            if (res.data.status) {
                                this.$Message.success('复制成功');
                                this.copyModal.isShow = false;
                                this.search()
                            } else {
                                this.$Message.warning(res.data.errorCode)
                            }
                        }).catch((error) => {
                            console.log(error)
                        })
                    } else {
                        this.$Message.error('验证失败');
                    }
                })
            } else {
                this.$Message.error('保存失败');
                this.$Message.warning('请选择正确的产品');
            }
        },
        // 弹窗点击确认后的函数
        detectionPost() {
            let _this = this;
            _this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let data = {
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
                        EquipmentId: _this.detection.form.equipment.eq?_this.detection.form.equipment.eq : ''
                    };
                    let url1 = webApiUrl + '/api/Form/SaveFormConfig?random=' + Math.random(),
                        url2 = webApiUrl + '/api/Form/SaveFormRelation?random=' + Math.random();
                    if (data.ProductGuid && data.CheckUser) {
                        _this.$Spin.show()
                        if (_this.autoComplete.table.length > 0) {
                            axios.all([
                                axios.post(url1, data),
                                axios.post(url2, _this.autoComplete.table)
                            ]).then(axios.spread((DataOne, DataTwo) => {
                                if (DataOne.data.status && DataTwo.data.status) {
                                    _this.detection.isShow = false;

                                    _this.$Message.success('保存成功')
                                    _this.deleteProcess()
                                    _this.search();
                                    _this.$Spin.hide()
                                } else if (DataOne.data.status && !DataTwo.data.status) {
                                    _this.$Spin.hide()
                                    _this.$Message.warning(DataTwo.data.errorCode)
                                } else if (DataTwo.data.status && !DataOne.data.status) {
                                    _this.$Spin.hide()
                                    _this.$Message.warning(DataOne.data.errorCode)
                                } else {
                                    _this.$Spin.hide()
                                    _this.$Message.warning(DataOne.data.errorCode)
                                    _this.$Message.warning(DataTwo.data.errorCode)
                                }
                            }))
                        } else {
                            axios.post(url1, data).then((res) => {
                                if (res.data.status) {
                                    _this.detection.isShow = false;
                                    _this.$Message.success('保存成功')
                                    _this.deleteProcess();
                                    _this.search();
                                    _this.$Spin.hide()
                                } else {
                                    _this.$Message.warning(res.data.errorCode)
                                }
                            })
                        }


                    } else {
                        _this.$Spin.hide()
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
            })
        },
        //清空筛选后的数据
        clearSearchKey() {
            this.searchKey = ''
        },

        // 清空工序数据工序数据
        deleteProcess() {
            let _this = this;
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
            _this.detection.form.selectValue = ''
            _this.detection.form.deposit = '';
            _this.copyModal.formTitle = '';
            _this.copyModal.CompletionValue = '';
            _this.copyModal.formTypeValue = '';
            // _this.copyModal.depositStartData = '';
            _this.copyModal.selectValue = '';
            _this.copyModal.processValue = '';
            _this.copyModal.remark = '';
        },


        detectionPostlist() {
            this.detection.isShow = false;
        },


        // 取消窗口
        cancel(data) {
            data.isShow = false;
        },
        // 筛选区分大小写
        filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },


        handleChange2(newTargetKeys) {
            this.targetFormHead = newTargetKeys;
        },
        filterMethod(data, query) {
            return data.label.indexOf(query) > -1;
        },
        add() {
            this.$refs['editForm'].resetFields();
            this.showEdit.isShow = true;
            this.baseModel.id = 0;
        },
        onSort(column, key, order) {
            this.searchModel.sort = column.key + " " + column.order;
            this.search();
        },
        uploading(event, file, fileList) {
            this.$Spin.show();
        },
        showEditFormHead() {
            var _ = this;
            if (_.targetFormHead.length == 0) {
                _.$Message.warning("没有选中表单头");
                return;
            }
            _.inputData = [];
            _.sourceFormHead.forEach(function(value, index, array) {
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
        },
        saveFormHead() {
            var _ = this;
            _.$Spin.show()
            _.inputData.forEach(function(value, index, array) {
                var indexFh = _.sourceFormHeadKey.indexOf(value.key);
                _.sourceFormHead[indexFh].value = value.value;
            });
            _.$Spin.hide()
            _.editFormHead = false;
        },
        saveSelectFormHead() {
            var _ = this;
            _.$Spin.show()
            var FormHeadRelation = [];
            _.sourceFormHead.forEach(function(value, index, array) {
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
            axios.post(webApiUrl + '/api/Form/UpdateFormHeadRelation?random=' + Math.random(), FormHeadRelation).then(function(response) {
                if (response.data.status) {
                    _.$Message.success("保存成功");
                } else {
                    _.$Message.error(response.data.errorCode);
                }
                _.$Spin.hide()
                _.bindingFormHead = false;
            }).catch(function(error) {
                _.$Spin.hide()
                _.bindingFormHead = false;
            });

        },
        render3(item) {
            if (item.value == "") {
                return item.label;
            } else {
                return item.label + ' - ' + item.value;
            }

        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: "文件格式错误",
                desc: "请选择.xls或者.xlsx文件"
            });
            this.$Spin.hide()
        },
        uploadDone(response, file, fileList) {
            this.$Notice.success({
                title: "提示",
                desc: "文件上传成功"
            });
            this.$Spin.hide()
            this.search();
        },
        download() {
            var _ = this;
            _.$Spin.show();

            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            axios.post(webApiUrl + '/api/Form/Download?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    if (response.data.status) {
                        _.$Spin.hide()
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
                if(this.searchType == "formType"){
                    this.searchModel.search.push({ Col: "formType", Val: this.searchKey, Operation: '=' })
                }else{
                    this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
                }
            }
            _.searchModel.pageIndex = pageIndex;
            console.log(this.searchModel.search)
            _.$Spin.show();
            axios.post(webApiUrl + '/api/Form/GetPageListDetail?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    _.$Spin.hide()
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
            _.$Spin.show();
            axios.post(webApiUrl + "/api/Form/delete?random=" + Math.random(), {
                id: _.baseModel.id
            }).then(res => {
                _.$Spin.hide()
                if (res.data.status) {
                    _.$Message.success("删除成功");
                    _.search();
                } else {
                    _.$Message.error(res.data.errorCode);
                }

            });
        },
        save() {
            var _ = this;
            _.$refs['editForm'].validate((valid) => {
                if (valid) {
                    // this.$Spin.show()
                    _.$Spin.show();
                    var url = webApiUrl + "/api/Form/insert?random=" + Math.random();
                    if (_.baseModel.id != 0) {
                        url = webApiUrl + "/api/Form/update?random=" + Math.random();
                    }
                    axios.post(url, _.baseModel)
                        .then(function(response) {
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
                        })
                        .catch(function(error) {
                            console.log(error);
                        });

                } else {
                    _.$Message.error('验证失败');
                }
            })
        },
        endFunc(e) { // 处理拖拽数据源

            this.preview.tableData.forEach((val, index) => {
                if (e.oldIndex == index) {
                    this.draggingRecord.BeforeSort = val.FormQuailtySort;
                    this.draggingRecord.BeforeId = val.FormQuailtyId
                }

                if (e.newIndex == index) {
                    this.draggingRecord.EndSort = val.FormQuailtySort;
                }
            });


            if (this.draggingRecord.BeforeSort != this.draggingRecord.EndSort) {
                axios.post(webApiUrl + '/api/Form/QualityConditionSort?random=' + Math.random(), this.draggingRecord).then((res) => {
                    if (res.data.status) {
                        this.previewData();
                    } else {
                        this.$Message.warning(res.data.errorCode)
                    }
                })
            }

        },
        moduleMaxHeight() {
            this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px'
        },
        // tableHeightData() {
        //     let timer = false;
        //     let _ = this;
        //     _.tableHeight = basis.tableHeight()
        //     if (!timer) {
        //         console.log(basis.tableHeight())
        //         timer = true
        //         setInterval(() => {
        //             window.onresize = () => {
        //                 _.tableHeight = basis.tableHeight()
        //                 timer = false
        //             }
        //         }, 400)
        //     }

        // }
    },
    mounted() {
        this.moduleMaxHeight();
        basis.tableHeightData(this.formTableData)
    }
})