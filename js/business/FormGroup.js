var target = new Vue({
    el: '#mainDiv',
    data() {
        const validateTitle = (rule, value, callback) => {
            let postData = {};
            if (!value) {
                return callback(new Error('必填'));
            }
            if (this.buttonName == '复制') {
                postData = { Id: this.copyModal.id, FormTitle: this.copyModal.formTitle };
            } else {
                postData = { Id: this.baseModel.Id, FormTitle: this.baseModel.Title }
            }
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
        const depositEndDataFun = (rule, value, callback) => {

            if (value === '') {
                return callback(new Error('必填'));
            }

            this.baseModel.StartTime = basis.baseData(this.baseModel.StartTime, 1);
            this.baseModel.EndTime = basis.baseData(this.baseModel.EndTime, 1);
            let StartTime = this.baseModel.StartTime.split("-");
            let ST = new Date(StartTime[0], StartTime[1], StartTime[2]);
            let EndTime = this.baseModel.EndTime.split("-");
            let ET = new Date(EndTime[0], EndTime[1], EndTime[2]);
            if (ET.getTime() < ST.getTime()) {
                return callback(new Error('结束时间要晚于开始时间'));
            }
            callback()
        }
        return {
            uploadUrl: webApiUrl + '/api/FormGroup/upload?random=' + Math.random(), // 上传路径
            total: 0, //总条数
            bindingFormHead: {
                isShow: false
            }, //绑定表单头框
            sourceFormHead: [],
            buttonName: '',
            sourceFormHeadKey: [],
            targetFormHead: [],
            editFormHead: {
                isShow: false
            }, //表单头编辑窗
            inputData: [],
            dragMarker: 0,
            editFormHeadImg: { // 表单头编辑 图片处理
                imgRowId: 0
            },
            windowHeight: document.documentElement.clientHeight,
            modalMaxHeight: {
                maxHeight: '110px',
                overflowX: 'hidden',
                overflowY: 'auto'

            },
            img: {
                imgBigShow: false,
                ImgFileId: '',
                xx: '',
                css: {
                    maxWidth: '750px',
                    height: 'auto'
                }
            },
            isDrag: false, // 是否拖动
            formHeadData: [], //表单头数据
            listStyle: {
                width: '350px',
                height: '500px'
            },
            transferTitles: ['原检验单表头', '选中检验单表头'],
            baseModel: { // 新增数据
                Id: 0,
                Title: '',
                productValue: '',
                productGuid: '',
                createTime: new Date(),
                createUser: '',
                formType: 0,
                Remark: '',
                StartTime: '',
                EndTime: '2099-12-31',
                isStart: '0'
            },
            copyModal: {
                isShow: false,
                id: '',
                formTitle: '',
                formType: '',
                formTypeValue: '',
                remark: '',
                CompletionValue: '',
                selectValue: '',
                processValue: '',
                tableTitle: '', // 主要用于储藏 操作的还是 新增的
                CP: {
                    data: [],
                    guid: ''
                },
                SKU: {
                    data: [],
                    guid: ''
                },
                GX: {
                    data: [],
                    guid: ''
                }

            },
            copyRules: {
                formTitle: [
                    { required: true, validator: validateTitle, trigger: 'blur' }
                ],

                CompletionValue: [
                    { required: true, message: '必填', trigger: 'change' }
                ]
            },
            baseRules: { // 新增编辑验证
                Title: [
                    { required: true, validator: validateTitle, trigger: 'blur' }
                ],
                productValue: [{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
                StartTime: [
                    { required: true, validator: depositStartDataFun, trigger: 'blur' }
                ],
                EndTime: [
                    { required: true, validator: depositEndDataFun, trigger: 'blur' }
                ],
                formType: [{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }]
            },
            baseModelOption: [{ name: '通用', id: '0' }, { name: '毛坯尺寸及外观检测', id: '1' }, { name: '米字型检测', id: '2' }, { name: '外观及视检验', id: '3' }, { name: '位置度评定', id: '4' }, { name: '全尺寸检测', id: '6' }, { name: '清洗检测', id: '7' }, { name: '涂装过程检测', id: '8' }, { name: '涂装厚度检测', id: '9' }, { name: '包装封箱前检测', id: '10' }, { name: '外购件复检', id: '11' }, { name: '成品检测', id: '12' }],
            autoCompleteData: { // 自动补全数据
                data: [],
                guid: ''
            },
            uploadUrl: fileServerUrl + "/UploadFile", // 上传路径
            searchType: 'title', //搜索条件KEY
            searchKey: '', //检索值VALUE
            loading: false, //菊花
            showEdit: {
                isShow: false
            }, //编辑窗
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            columnData: [ //列
                {
                    align: 'center',
                    title: '产品检验单名称',
                    sortable: 'custom',
                    key: 'Title',
                    width: 320,
                    fixed: 'left'
                },
                {
                    align: 'center',
                    title: '产品',
                    width: 300,
                    key: 'ProductCode',
                    sortable: 'custom',
                    render: (h, { row }) => {
                        let product = row.ProductCode + '-' + row.ProductName
                        return h('div', product)
                    }
                },
                {
                    align: 'center',
                    title: '产品检验单类型',
                    width: 170,
                    key: "FormType",
                    sortable: 'custom',
                    render: (h, { row }) => {
                        let formType = row.FormType;
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
                    title: '绑定检验单表头',
                    width: 158,
                    key: 'formHead',
                    render: (h, params) => {
                        return h('div', [h('i-button', {
                            props: { type: 'ghost', size: 'small', icon: 'plus-circled' },
                            on: {
                                click: () => {
                                    var _ = target;
                                    _.$Spin.show();
                                    _.sourceFormHead = []
                                    _.targetFormHead = []
                                    _.sourceFormHeadKey = []
                                    axios.get(webApiUrl + '/api/Form/GetFormHeadRelation?random=' + Math.random(), {
                                        params: {
                                            id: params.row.Id
                                        }
                                    }).then(function(response) {

                                        if (response.data.status) {
                                            var formHead = response.data.data.formHead;
                                            var formHeadRelation = response.data.data.formHeadRelation;

                                            formHeadRelation.forEach(function(value, index, array) {
                                                _.targetFormHead.push(value.formHeadId);
                                            });                                    
                                            formHead.forEach(function(value, index, array) {
                                                var vle = "";
                                                var fid = null;
                                                var indexFh = _.targetFormHead.indexOf(value.id);
                                                if (indexFh > -1) {
                                                    vle = formHeadRelation[indexFh].value;
                                                    fid = formHeadRelation[indexFh].fileId ? formHeadRelation[indexFh].fileId : '';
                                                };
                                                _.sourceFormHead.push({
                                                    fromId: params.row.Id,
                                                    key: value.id,
                                                    label: value.content,
                                                    value: vle,
                                                    fileId: fid
                                                });
                                                _.sourceFormHeadKey.push(value.id);
                                            });

                                        } else {
                                            _.$Message.success(response.data.errorCode);
                                        }
                                        _.$Spin.hide();
                                    }).catch(function(error) {
                                        console.log(error);
                                        _.$Spin.hide();
                                    });

                                    _.changeFormHeadDataFun()
                                    
                                    let el = this.$refs.bindingFormHead.$children[2].$el.children[1].children[1];
                                    let vm = this;
                                    Sortable.create(el, {
                                        onEnd: vm.endFunc,
                                        onChoose: vm.chooseFunc
                                    });
                                    _.bindingFormHead.isShow = true;
                                }
                            }
                        }, '绑定表头')]);
                    }
                },
                {
                    align: 'center',
                    title: '绑定工序检验单',
                    width: 158,
                    key: 'bindForm',
                    render: (h, { row }) => {
                        return h('i-button', {
                            props: { type: 'ghost', size: 'small', icon: 'plus-circled' },
                            on: {
                                click: () => {
                                    this.Items.formGroupId = row.Id
                                    this.$Spin.show();
                                    this.Items.tableData = [];
                                    this.Items.isShow = true;
                                    let url = webApiUrl + '/api/FormGroup/GetFormInfo?random=' + Math.random();
                                    axios.get(url, {
                                        params: {
                                            productGuid: row.ProductGuid,
                                            formType: row.FormType,
                                            formGroupId: row.Id

                                        }
                                    }).then((res) => {
                                        this.$Spin.hide();
                                        if (res.data.status) {
                                            let data = res.data.data;

                                            data.forEach((val, index) => {
                                                let obj = {
                                                    CreateTime: val.CreateTime,
                                                    FormTitle: val.FormTitle,
                                                    FormType: val.FormType,
                                                    formId: val.Id,
                                                    Remark: val.Remark,
                                                    RffectTime: basis.interceptionTime(val.RffectTime),
                                                    _checked: val._checked == "0" ? false : true
                                                }
                                                this.Items.tableData.push(obj)
                                            })
                                        } else {
                                            this.$Message.warning(res.data.errorCode)
                                        }
                                    })
                                }
                            }
                        }, '绑定工序')
                    }
                },
                {
                    align: 'center',
                    title: '备注',
                    width: 380,
                    key: 'Remark'
                },
                {
                    align: 'center',
                    title: '预览',
                    width: 100,
                    render: (h, { row }) => {
                        return h('i-button', {
                            props: { type: 'ghost' },
                            on: {
                                click: () => {
                                    this.$Spin.show();
                                    this.preview.isShow = true;
                                    this.preview.formHead = row.Title
                                    let url = webApiUrl + '/api/FormGroup/GetFormQualityInfo?random=' + Math.random();
                                    axios.get(url, {
                                        params: {
                                            formGroupId: row.Id
                                        }
                                    }).then((res) => {
                                        this.$Spin.hide();
                                        if (res.data.status) {
                                            this.preview.inputData = res.data.data.formHead
                                            this.preview.tableData = res.data.data.data
                                        }
                                    })
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
                    fixed: 'right',
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
                                        this.buttonName = '复制'
                                        this.copyModal.tableTitle = '复制';
                                        this.copyModal.isShow = true;
                                        this.copyModal.id = params.row.Id;
                                        this.copyModal.formType = params.row.FormType;
                                        switch (params.row.FormType) {
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
                                        var _ = target;
                                        this.$refs['editForm'].resetFields();
                                        _.tableTitle = '编辑';
                                        _.baseModel.Id = params.row.Id;
                                        _.baseModel.Title = params.row.Title;
                                        _.baseModel.productGuid = params.row.ProductGuid;
                                        _.baseModel.productValue = params.row.ProductName + ' - ' + params.row.ProductCode
                                        _.baseModel.createTime = params.row.CreateTime;
                                        _.baseModel.createUser = params.row.CreateUser;
                                        _.baseModel.formType = params.row.FormType.toString();
                                        _.baseModel.Remark = params.row.Remark;
                                        _.baseModel.StartTime = basis.interceptionTime(params.row.StartTime);
                                        _.baseModel.EndTime = basis.interceptionTime(params.row.EndTime);
                                        _.baseModel.isStart = params.row.IsStart.toString()
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
                                        _.baseModel.Id = params.row.Id;
                                        _.del();
                                    }
                                }
                            }, [h('i-button', { props: { type: 'ghost', size: 'small', icon: 'android-delete' } }, '删除')])
                        ]);
                    }
                }
            ],

            formGroupTableData: {
                dataSource: [], //数据源
                tableHeight: 0
            },


            Items: { // 绑定表单数据
                isShow: false,
                tableData: [],
                table: [{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
                        title: '工序检验单名称',
                        width: 160,
                        align: 'center',
                        key: 'FormTitle'
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'Remark'
                    }
                ],
                selectData: [], //  选中后的数据
                formGroupId: 0
            },
            preview: { //预览窗口
                isShow: false,
                tableData: [],
                inputData: [],
                formHead: '',
                table: [{
                        title: '工序名称',
                        align: 'center',
                        key: 'ProcessName'
                    },
                    {
                        title: '设备',
                        align: 'center',
                        key: 'ConfigEquipmentName'
                    },
                    {
                        title: '检测项目',
                        align: 'center',
                        key: 'Quality'
                    }, {
                        title: '评价测量技术',
                        align: 'center',
                        key: 'Evaluation',
                    }, {
                        title: '检测频率',
                        align: 'center',
                        key: 'Frequency',
                        render: (h, { row }) => {
                            let frequency = row.Frequency
                            switch (frequency) {
                                case 0:
                                    return h('div', "全检");
                                    break;
                                case 1:
                                    return h('div', "首单检测");
                                    break;
                                case 2:
                            }
                        }
                    },
                    {
                        align: 'center',
                        title: '检测项图片',
                        key: 'imgFileId',
                        render: (h, params, v) => {

                            if (params.row.ImgFileId) {
                                return h('img', {
                                    attrs: {
                                        "src": fileServerUrl + 'GetFileStramById?fileID=' + params.row.ImgFileId
                                    },
                                    style: {
                                        "width": "170px",
                                        "height": "45px"
                                    },
                                    on: {
                                        dblclick: () => {
                                            this.img.ImgFileId = params.row.ImgFileId
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
            }
        }
    },
    created() {
        this.search();
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
        previewShow(data) {
            this.preview.isShow = false;
        },
        imgPreviewShows() {
            this.img.imgBigShow = false;
        },
        ItemsSelect(value) {
            this.Items.selectData = [];
            this.Items.selectData = this.ItemsSelectData(value)
        },
        // 图片前段处理
        imgBig() {
            return fileServerUrl + 'GetFileStramById?fileID=' + this.img.ImgFileId
        },
        //清空筛选后的数据
        clearSearchKey() {
            this.searchKey = ''
        },
        // 处理选中数据 
        ItemsSelectData(data) {
            let arr = [];
            if (data && data.length > 0) {
                data.forEach((val, index) => {
                    let obj = {
                        FormGroupId: this.Items.formGroupId,
                        FormId: val.formId
                    }
                    arr.push(obj)
                })

            } else {
                arr = [{
                    FormGroupId: this.Items.formGroupId,
                    FormId: 0
                }]
            }
            return arr
        },
        handleMaxSize(file) {
            this.$Spin.hide();
            this.$Notice.warning({
                title: '提示',
                desc: '图片' + file.name + ' 太大,超过规定的2M'
            });
        },
        handleFormatError(file) {
            this.$Spin.hide();
            this.$Notice.warning({
                title: '提示',
                desc: '请选择文件后缀为 .jpg/.jpeg/.png/.bpm/.svg/.gif 的图片文件'
            });
        },
        ItemsConfirm() {
            this.Items.isShow = false;
            let url = webApiUrl + '/api/FormGroup/AddFormGroupRelation?random=' + Math.random();
            if (this.Items.selectData.length > 0) {
                this.$Spin.show();
                axios.post(url, this.Items.selectData).then((res) => {
                    this.$Spin.hide();
                    if (res.data.status) {
                        this.$Message.success('保存成功');
                    } else {
                        this.$Message.warning(res.data.errorCode)
                    }
                })
            }

        },
        // //自动补全
        completeReq(value) {
            if (value) {
                this.autoCompleteData.data = '';
                let data = this.baseModel.productValue,
                    url = webApiUrl + '/api/Form/GetProductByName?random=' + Math.random();
                axios.get(url, {
                    params: { name: value }
                }).then((res) => {
                    this.autoCompleteData.data = res.data.data;
                }).catch()
            } else {
                this.baseModel.productGuid = '';
            }

        },
        // 选中产品guid 
        projectGuidReq(value) {
            if (value) {
                let valueData = value.split('-')[1];
                this.autoCompleteData.data.forEach((val, index) => {
                    if (val.ProductCode === valueData) {
                        this.baseModel.productGuid = val.ProductGuid
                    }
                })
            }
        },
        // 清空数据
        deleteProcess() {
            this.copyModal.formTitle = '';
            this.copyModal.formType = '';
            this.copyModal.formTypeValue = '';
            this.copyModal.remark = '';
            this.copyModal.CompletionValue = '';
            this.copyModal.selectValue = '';
            this.copyModal.processValue = '';
            this.copyModal.tableTitle = '';
            this.copyModal.CP.data = [];
            this.copyModal.SKU.data = [];
            this.copyModal.GX.data = [];
            this.copyModal.CP.guid = '';
            this.copyModal.SKU.guid = '';
            this.copyModal.GX.guid = '';
        },
        // 筛选区分大小写
        filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        filterMethod(data, query) {
            return data.label.indexOf(query) > -1;
        },
        cancel(data) {
            data.isShow = false;
            // this.showEdit = false;
        },
        cancelFormHead() {
            this.bindingFormHead.isShow = false;
        },
        saveFormHead() {
            var _ = this;
            _.$Spin.show();
            _.inputData.forEach(function(value, index, array) {
                var indexFh = _.sourceFormHeadKey.indexOf(value.key);
                _.sourceFormHead[indexFh].value = value.value;
                _.sourceFormHead[indexFh].fileId = value.fileId;
            });

            _.$Spin.hide();
            _.editFormHead.isShow = false;
        },

        handleSuccess(res, file) {
            if (res.Status == 1) {
                this.$Spin.hide();
                this.$Message.success('图片上传成功');
                this.inputData.forEach((val, index) => {
                    if (this.editFormHeadImg.imgRowId == val.key) {
                        val.fileId = res.Data
                    }
                })
            } else {
                this.$Message.warning(res.ErrorCode);
            }
        },
        beforeUpload() {
            this.$Spin.show();
        },
        handleError(error, file, fileList) {
            this.$Spin.hide();
            this.$Message.warning(error);
        },
        bindId(data) {
            this.editFormHeadImg.imgRowId = data;
        },
        add() {
            this.$refs['editForm'].resetFields();
            this.showEdit.isShow = true;
            this.baseModel.Id = 0;
            this.buttonName = '新增'
        },
        onSort(column, key, order) {
            this.searchModel.sort = column.key + " " + column.order;
            this.search();
        },
        uploading(event, file, fileList) {
            this.$Spin.show();
        },

        uploadDone(response, file, fileList) {
            this.$Notice.success({
                title: "提示",
                desc: "文件上传成功"
            });
            this.$Spin.hide();
            this.search();
        },
        handleChange2(newTargetKeys, direction, moveKeys) {
            let moveData = moveKeys
            if (direction == 'left') {
                this.targetFormHead = newTargetKeys;
            } else {
                moveData.forEach((val) => {
                    this.targetFormHead.push(val)
                })
            }
            this.changeFormHeadDataFun();
        },
        changeFormHeadDataFun() {
            let _ = this;
            let arr = [],
                dataArr = [];
                _.formHeadData =[];
            if (_.targetFormHead.length > 0) {
                _.targetFormHead.forEach((val) => {
                    _.sourceFormHead.forEach((value) => {
                        if (val === value.key) {
                            arr.push({
                                FormId: value.fromId,
                                FormHeadId: value.key,
                                Value: value.value,
                                FileId: value.fileId,
                                Label: value.label
                            })
                        }
                    })
                })
            }
            arr.forEach((val) => {
                if (dataArr.indexOf(val.FormHeadId) == -1) {
                    _.formHeadData.push(val)
                }
            })   
            _.formHeadData.forEach((val) => {
                if (val) {
                    dataArr.push(val.FormHeadId)
                }
            })
          
          
        },

        FormHeadDataFun() {
            var _ = this;
            _.formHeadData = [];
            if (_.targetFormHead.length > 0) {
                _.targetFormHead.forEach((val) => {
                    _.sourceFormHead.forEach((value) => {
                        if (val === value.key) {
                            _.formHeadData.push({
                                FormId: value.fromId,
                                FormHeadId: value.key,
                                Value: value.value,
                                FileId: value.fileId,
                                Label: value.label
                            })
                        }
                    })
                })
            }
        },

        saveSelectFormHead() {
            var _ = this;
            _.$Spin.show();
            let FormHeadRelation = [];
            if (!_.isDrag) {
                this.FormHeadDataFun();
            }
            _.formHeadData.forEach((val, index) => {
                if (val) {
                    FormHeadRelation.push({
                        FormId: val.FormId,
                        FormHeadId: val.FormHeadId,
                        Value: val.Value,
                        FileId: val.FileId,
                        Sort: index
                    })
                }
            })

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
                _.$Spin.hide();
                _.bindingFormHead.isShow = false;
            }).catch(function(error) {
                _.$Spin.hide();
                _.bindingFormHead.isShow = false;
            });

        },

        //自动补全
        completeReqCopy(value) {
            let _this = this
            if (value) {
                _this.copyModal.selectValue = '';
                let url = webApiUrl + '/api/Form/GetProductByName?random=' + Math.random();
                axios.get(url, {
                    params: { name: value }
                }).then((res) => {
                    _this.copyModal.CP.data = res.data.data;

                }).catch()
            } else {
                _this.copyModal.CP.guid = ''
            }
        },
        // sku 参数  
        skuReq(value) {
            let _this = this;
            if (value) {
                let url = webApiUrl + '/api/Form/GetSQUByProduct?random=' + Math.random();
                _this.copyModal.SKU.data = '';
                let valueData = value.split('-')[1];
                _this.copyModal.CP.data.forEach(function(val, index) {
                    if (val.ProductCode === valueData) {
                        _this.copyModal.CP.guid = val.ProductGuid
                    }
                })
                _this.$Spin.show();
                axios.get(url, {
                    params: { productGuid: _this.copyModal.CP.guid }
                }).then((res) => {
                    _this.$Spin.hide();
                    // if (res.data.status) {
                    _this.copyModal.SKU.data = res.data.data;
                    _this.copyModal.selectValue = '';
                    _this.copyModal.processValue = ''
                })
            }
        },
        // sku选中后的guid 
        selectReq(value) {
            let _this = this;
            _this.$Spin.show();
            _this.copyModal.SKU.guid = value
            axios.get(webApiUrl + '/api/Form/GetProcessBySku?random=' + Math.random(), {
                params: {
                    skuId: _this.copyModal.SKU.guid
                }
            }).then((res) => {
                _this.$Spin.hide();
                if (res.status) {
                    _this.copyModal.GX.data = res.data.data;
                    _this.copyModal.processValue = ''
                } else {
                    _this.$Message.warning(res.errorCode)
                }
            })
        },
        selectSKUReq() {
            let _this = this;
            _this.copyModal.GX.guid = '';
            _this.copyModal.processValue = '';
        },

        copyProcess(value) {
            this.copyModal.GX.guid = value;
        },
        // 复制保存
        copySave() {
            let url = webApiUrl + "/api/Form/CopyFormGroup?random=" + Math.random(),
                data = {
                    Id: this.copyModal.id,
                    FormTitle: this.copyModal.formTitle,
                    FormType: this.copyModal.formType,
                    Remark: this.copyModal.remark,
                    ProductGuid: this.copyModal.CP.guid,
                    ProcessGuid: this.copyModal.GX.guid ? this.copyModal.GX.guid : '',
                    SkuGuid: this.copyModal.SKU.guid ? this.copyModal.SKU.guid : ''
                }
            if (this.copyModal.CP.guid) {
                this.$refs['copyForm'].validate((valid) => {
                    if (valid) {
                        axios.post(url, data).then((res) => {
                            if (res.data.status) {
                                this.$Message.success('复制成功');
                                this.copyModal.isShow = false;
                                this.search()
                            } else {
                                this.$Message.warning(res.data.errorCode)
                            }
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
        render3(item) {
            return item.label;
            // if (item.value == "") {
            // return item.label;
            // } else {
            // return item.label + ' - ' + item.value;
            // }

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
                        value: value.value,
                        fileId: value.fileId
                    });
                }
            });

            _.editFormHead.isShow = true;
        },
        download() {
            var _ = this;
            this.$Spin.show();
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            axios.post(webApiUrl + '/api/FormGroup/Download?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    if (response.data.status) {
                        _.$Spin.hide();
                        //文件路径response.data.obj
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
                if (this.searchType == "formType") {
                    this.searchModel.search.push({ Col: "formType", Val: this.searchKey, Operation: '=' });
                } else {
                    this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
                }
            }
            _.searchModel.pageIndex = pageIndex;
            _.$Spin.show()
            axios.post(webApiUrl + '/api/FormGroup/GetPageListDetail?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    _.$Spin.hide()
                    if (response.data.status) {
                        _.formGroupTableData.dataSource = response.data.data.items;
                        _.total = response.data.data.totalNum;
                    }
                })
                .catch(function(error) {
                    _.$Spin.hide();
                    console.log(error);
                });
        },
        del() {
            var _ = this;
            this.$Spin.show();
            axios.post(webApiUrl + "/api/FormGroup/delete?random=" + Math.random(), {
                Id: _.baseModel.Id
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
        save() {
            var _ = this;
            _.baseModel.StartTime = basis.baseData(_.baseModel.StartTime, 1);

            if (_.baseModel.EndTime != '2099-12-31') {
                _.baseModel.EndTime = basis.baseData(_.baseModel.EndTime, 1);
            }

            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    this.$Spin.show();
                    var data = {
                        Id: _.baseModel.Id,
                        Title: _.baseModel.Title,
                        productGuid: _.baseModel.productGuid,
                        createTime: _.baseModel.createTime,
                        createUser: _.baseModel.createUser,
                        formType: _.baseModel.formType,
                        remark: _.baseModel.Remark,
                        StartTime: _.baseModel.StartTime,
                        EndTime: _.baseModel.EndTime,
                        isStart: _.baseModel.isStart,
                    }
                    var url = webApiUrl + "/api/FormGroup/insert?random=" + Math.random();
                    if (_.baseModel.Id != 0) {
                        url = webApiUrl + "/api/FormGroup/update?random=" + Math.random();
                    }

                    if (data.productGuid) {
                        axios.post(url, data)
                            .then(function(response) {
                                if (response.data.status) {
                                    _.search();
                                    _.$refs['editForm'].resetFields();
                                    _.showEdit.isShow = false;
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
                        _.$Spin.hide();
                        this.$Message.error('保存失败');
                        this.$Message.warning('请选择正确的产品');
                    }

                } else {
                    // this.$refs['editForm'].resetFields();
                    this.$Message.error('保存失败');
                }
            })
        },
        //拖拽 数据处理
        endFunc(e) {
            this.isDrag = true;
            let headerData = [];
            let lable = e.item.innerText.replace(/\s+/g, "");
            let indexData = e.newIndex;

            this.formHeadData.forEach((val, index) => {
                if (val) {
                    let valLable = val.Label.replace(/\s+/g, "")
                    if (lable == valLable) {
                        headerData = this.formHeadData.splice(index, 1)
                    }
                }
            })
            this.formHeadData.splice(indexData, 0, headerData[0]);
        },
        chooseFunc(e) {
            if (this.formHeadData.length == 0) {
                this.FormHeadDataFun();
            }       
        },
        moduleMaxHeight() {
            this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px'
        }

    },
    mounted() {
        this.moduleMaxHeight()
        basis.tableHeightData(this.formGroupTableData)
    }
})