'use strict';

var _methods;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var target = new Vue({
    el: '#mainDiv',
    data: function data() {
        var _this2 = this,
            _ref6;

        var validateTitle = function validateTitle(rule, value, callback) {
            var postData = {};
            if (!value) {
                return callback(new Error('必填'));
            }
            if (_this2.buttonName == '复制') {
                postData = { Id: _this2.copyModal.id, FormTitle: _this2.copyModal.formTitle };
            } else {
                postData = { Id: _this2.baseModel.Id, FormTitle: _this2.baseModel.Title };
            }
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
        var depositEndDataFun = function depositEndDataFun(rule, value, callback) {

            if (value === '') {
                return callback(new Error('必填'));
            }

            _this2.baseModel.StartTime = basis.baseData(_this2.baseModel.StartTime, 1);
            _this2.baseModel.EndTime = basis.baseData(_this2.baseModel.EndTime, 1);
            var StartTime = _this2.baseModel.StartTime.split("-");
            var ST = new Date(StartTime[0], StartTime[1], StartTime[2]);
            var EndTime = _this2.baseModel.EndTime.split("-");
            var ET = new Date(EndTime[0], EndTime[1], EndTime[2]);
            if (ET.getTime() < ST.getTime()) {
                return callback(new Error('结束时间要晚于开始时间'));
            }
            callback();
        };
        return _ref6 = {
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
                formTitle: [{ required: true, validator: validateTitle, trigger: 'blur' }],

                CompletionValue: [{ required: true, message: '必填', trigger: 'change' }]
            },
            baseRules: { // 新增编辑验证
                Title: [{ required: true, validator: validateTitle, trigger: 'blur' }],
                productValue: [{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
                StartTime: [{ required: true, validator: depositStartDataFun, trigger: 'blur' }],
                EndTime: [{ required: true, validator: depositEndDataFun, trigger: 'blur' }],
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
            }
        }, _defineProperty(_ref6, 'uploadUrl', fileServerUrl + "/UploadFile"), _defineProperty(_ref6, 'searchType', 'title'), _defineProperty(_ref6, 'searchKey', ''), _defineProperty(_ref6, 'loading', false), _defineProperty(_ref6, 'showEdit', {
            isShow: false
        }), _defineProperty(_ref6, 'searchModel', { //检索模型
            search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
            pageIndex: 1, //页码
            pageSize: 50, //分页大小
            sort: '' //排序
        }), _defineProperty(_ref6, 'columnData', [//列
        {
            align: 'center',
            title: '产品检验单名称',
            sortable: 'custom',
            key: 'Title',
            width: 320,
            fixed: 'left'
        }, {
            align: 'center',
            title: '产品',
            width: 300,
            key: 'ProductCode',
            sortable: 'custom',
            render: function render(h, _ref) {
                var row = _ref.row;

                var product = row.ProductCode + '-' + row.ProductName;
                return h('div', product);
            }
        }, {
            align: 'center',
            title: '产品检验单类型',
            width: 170,
            key: "FormType",
            sortable: 'custom',
            render: function render(h, _ref2) {
                var row = _ref2.row;

                var formType = row.FormType;
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
            title: '绑定检验单表头',
            width: 158,
            key: 'formHead',
            render: function render(h, params) {
                return h('div', [h('i-button', {
                    props: { type: 'ghost', size: 'small', icon: 'plus-circled' },
                    on: {
                        click: function click() {
                            var _ = target;
                            _.$Spin.show();
                            _.sourceFormHead = [];
                            _.targetFormHead = [];
                            _.sourceFormHeadKey = [];
                            axios.get(webApiUrl + '/api/Form/GetFormHeadRelation?random=' + Math.random(), {
                                params: {
                                    id: params.row.Id
                                }
                            }).then(function (response) {

                                if (response.data.status) {
                                    var formHead = response.data.data.formHead;
                                    var formHeadRelation = response.data.data.formHeadRelation;

                                    formHeadRelation.forEach(function (value, index, array) {
                                        _.targetFormHead.push(value.formHeadId);
                                    });
                                    formHead.forEach(function (value, index, array) {
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
                            }).catch(function (error) {
                                console.log(error);
                                _.$Spin.hide();
                            });

                            _.changeFormHeadDataFun();

                            var el = _this2.$refs.bindingFormHead.$children[2].$el.children[1].children[1];
                            var vm = _this2;
                            Sortable.create(el, {
                                onEnd: vm.endFunc,
                                onChoose: vm.chooseFunc
                            });
                            _.bindingFormHead.isShow = true;
                        }
                    }
                }, '绑定表头')]);
            }
        }, {
            align: 'center',
            title: '绑定工序检验单',
            width: 158,
            key: 'bindForm',
            render: function render(h, _ref3) {
                var row = _ref3.row;

                return h('i-button', {
                    props: { type: 'ghost', size: 'small', icon: 'plus-circled' },
                    on: {
                        click: function click() {
                            _this2.Items.formGroupId = row.Id;
                            _this2.$Spin.show();
                            _this2.Items.tableData = [];
                            _this2.Items.isShow = true;
                            var url = webApiUrl + '/api/FormGroup/GetFormInfo?random=' + Math.random();
                            axios.get(url, {
                                params: {
                                    productGuid: row.ProductGuid,
                                    formType: row.FormType,
                                    formGroupId: row.Id

                                }
                            }).then(function (res) {
                                _this2.$Spin.hide();
                                if (res.data.status) {
                                    var data = res.data.data;

                                    data.forEach(function (val, index) {
                                        var obj = {
                                            CreateTime: val.CreateTime,
                                            FormTitle: val.FormTitle,
                                            FormType: val.FormType,
                                            formId: val.Id,
                                            Remark: val.Remark,
                                            RffectTime: basis.interceptionTime(val.RffectTime),
                                            _checked: val._checked == "0" ? false : true
                                        };
                                        _this2.Items.tableData.push(obj);
                                    });
                                } else {
                                    _this2.$Message.warning(res.data.errorCode);
                                }
                            });
                        }
                    }
                }, '绑定工序');
            }
        }, {
            align: 'center',
            title: '备注',
            width: 380,
            key: 'Remark'
        }, {
            align: 'center',
            title: '预览',
            width: 100,
            render: function render(h, _ref4) {
                var row = _ref4.row;

                return h('i-button', {
                    props: { type: 'ghost' },
                    on: {
                        click: function click() {
                            _this2.$Spin.show();
                            _this2.preview.isShow = true;
                            _this2.preview.formHead = row.Title;
                            var url = webApiUrl + '/api/FormGroup/GetFormQualityInfo?random=' + Math.random();
                            axios.get(url, {
                                params: {
                                    formGroupId: row.Id
                                }
                            }).then(function (res) {
                                _this2.$Spin.hide();
                                if (res.data.status) {
                                    _this2.preview.inputData = res.data.data.formHead;
                                    _this2.preview.tableData = res.data.data.data;
                                }
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
            fixed: 'right',
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
                            _this2.buttonName = '复制';
                            _this2.copyModal.tableTitle = '复制';
                            _this2.copyModal.isShow = true;
                            _this2.copyModal.id = params.row.Id;
                            _this2.copyModal.formType = params.row.FormType;
                            switch (params.row.FormType) {
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
                            var _ = target;
                            _this2.$refs['editForm'].resetFields();
                            _.tableTitle = '编辑';
                            _.baseModel.Id = params.row.Id;
                            _.baseModel.Title = params.row.Title;
                            _.baseModel.productGuid = params.row.ProductGuid;
                            _.baseModel.productValue = params.row.ProductName + ' - ' + params.row.ProductCode;
                            _.baseModel.createTime = params.row.CreateTime;
                            _.baseModel.createUser = params.row.CreateUser;
                            _.baseModel.formType = params.row.FormType.toString();
                            _.baseModel.Remark = params.row.Remark;
                            _.baseModel.StartTime = basis.interceptionTime(params.row.StartTime);
                            _.baseModel.EndTime = basis.interceptionTime(params.row.EndTime);
                            _.baseModel.isStart = params.row.IsStart.toString();
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
                            _.baseModel.Id = params.row.Id;
                            _.del();
                        }
                    }
                }, [h('i-button', { props: { type: 'ghost', size: 'small', icon: 'android-delete' } }, '删除')])]);
            }
        }]), _defineProperty(_ref6, 'formGroupTableData', {
            dataSource: [], //数据源
            tableHeight: 0
        }), _defineProperty(_ref6, 'Items', { // 绑定表单数据
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
            }, {
                title: '备注',
                align: 'center',
                key: 'Remark'
            }],
            selectData: [], //  选中后的数据
            formGroupId: 0
        }), _defineProperty(_ref6, 'preview', { //预览窗口
            isShow: false,
            tableData: [],
            inputData: [],
            formHead: '',
            table: [{
                title: '工序名称',
                align: 'center',
                key: 'ProcessName'
            }, {
                title: '设备',
                align: 'center',
                key: 'ConfigEquipmentName'
            }, {
                title: '检测项目',
                align: 'center',
                key: 'Quality'
            }, {
                title: '评价测量技术',
                align: 'center',
                key: 'Evaluation'
            }, {
                title: '检测频率',
                align: 'center',
                key: 'Frequency',
                render: function render(h, _ref5) {
                    var row = _ref5.row;

                    var frequency = row.Frequency;
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
            }, {
                align: 'center',
                title: '检测项图片',
                key: 'imgFileId',
                render: function render(h, params, v) {

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
                                dblclick: function dblclick() {
                                    _this2.img.ImgFileId = params.row.ImgFileId;
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
            }]
        }), _ref6;
    },
    created: function created() {
        this.search();
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
        previewShow: function previewShow(data) {
            this.preview.isShow = false;
        },
        imgPreviewShows: function imgPreviewShows() {
            this.img.imgBigShow = false;
        },
        ItemsSelect: function ItemsSelect(value) {
            this.Items.selectData = [];
            this.Items.selectData = this.ItemsSelectData(value);
        },

        // 图片前段处理
        imgBig: function imgBig() {
            return fileServerUrl + 'GetFileStramById?fileID=' + this.img.ImgFileId;
        },

        //清空筛选后的数据
        clearSearchKey: function clearSearchKey() {
            this.searchKey = '';
        },

        // 处理选中数据 
        ItemsSelectData: function ItemsSelectData(data) {
            var _this4 = this;

            var arr = [];
            if (data && data.length > 0) {
                data.forEach(function (val, index) {
                    var obj = {
                        FormGroupId: _this4.Items.formGroupId,
                        FormId: val.formId
                    };
                    arr.push(obj);
                });
            } else {
                arr = [{
                    FormGroupId: this.Items.formGroupId,
                    FormId: 0
                }];
            }
            return arr;
        },
        handleMaxSize: function handleMaxSize(file) {
            this.$Spin.hide();
            this.$Notice.warning({
                title: '提示',
                desc: '图片' + file.name + ' 太大,超过规定的2M'
            });
        },
        handleFormatError: function handleFormatError(file) {
            this.$Spin.hide();
            this.$Notice.warning({
                title: '提示',
                desc: '请选择文件后缀为 .jpg/.jpeg/.png/.bpm/.svg/.gif 的图片文件'
            });
        },
        ItemsConfirm: function ItemsConfirm() {
            var _this5 = this;

            this.Items.isShow = false;
            var url = webApiUrl + '/api/FormGroup/AddFormGroupRelation?random=' + Math.random();
            if (this.Items.selectData.length > 0) {
                this.$Spin.show();
                axios.post(url, this.Items.selectData).then(function (res) {
                    _this5.$Spin.hide();
                    if (res.data.status) {
                        _this5.$Message.success('保存成功');
                    } else {
                        _this5.$Message.warning(res.data.errorCode);
                    }
                });
            }
        },

        // //自动补全
        completeReq: function completeReq(value) {
            var _this6 = this;

            if (value) {
                this.autoCompleteData.data = '';
                var data = this.baseModel.productValue,
                    url = webApiUrl + '/api/Form/GetProductByName?random=' + Math.random();
                axios.get(url, {
                    params: { name: value }
                }).then(function (res) {
                    _this6.autoCompleteData.data = res.data.data;
                }).catch();
            } else {
                this.baseModel.productGuid = '';
            }
        },

        // 选中产品guid 
        projectGuidReq: function projectGuidReq(value) {
            var _this7 = this;

            if (value) {
                var valueData = value.split('-')[1];
                this.autoCompleteData.data.forEach(function (val, index) {
                    if (val.ProductCode === valueData) {
                        _this7.baseModel.productGuid = val.ProductGuid;
                    }
                });
            }
        },

        // 清空数据
        deleteProcess: function deleteProcess() {
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
        filterMethod: function filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        }
    }, _defineProperty(_methods, 'filterMethod', function filterMethod(data, query) {
        return data.label.indexOf(query) > -1;
    }), _defineProperty(_methods, 'cancel', function cancel(data) {
        data.isShow = false;
        // this.showEdit = false;
    }), _defineProperty(_methods, 'cancelFormHead', function cancelFormHead() {
        this.bindingFormHead.isShow = false;
    }), _defineProperty(_methods, 'saveFormHead', function saveFormHead() {
        var _ = this;
        _.$Spin.show();
        _.inputData.forEach(function (value, index, array) {
            var indexFh = _.sourceFormHeadKey.indexOf(value.key);
            _.sourceFormHead[indexFh].value = value.value;
            _.sourceFormHead[indexFh].fileId = value.fileId;
        });

        _.$Spin.hide();
        _.editFormHead.isShow = false;
    }), _defineProperty(_methods, 'handleSuccess', function handleSuccess(res, file) {
        var _this8 = this;

        if (res.Status == 1) {
            this.$Spin.hide();
            this.$Message.success('图片上传成功');
            this.inputData.forEach(function (val, index) {
                if (_this8.editFormHeadImg.imgRowId == val.key) {
                    val.fileId = res.Data;
                }
            });
        } else {
            this.$Message.warning(res.ErrorCode);
        }
    }), _defineProperty(_methods, 'beforeUpload', function beforeUpload() {
        this.$Spin.show();
    }), _defineProperty(_methods, 'handleError', function handleError(error, file, fileList) {
        this.$Spin.hide();
        this.$Message.warning(error);
    }), _defineProperty(_methods, 'bindId', function bindId(data) {
        this.editFormHeadImg.imgRowId = data;
    }), _defineProperty(_methods, 'add', function add() {
        this.$refs['editForm'].resetFields();
        this.showEdit.isShow = true;
        this.baseModel.Id = 0;
        this.buttonName = '新增';
    }), _defineProperty(_methods, 'onSort', function onSort(column, key, order) {
        this.searchModel.sort = column.key + " " + column.order;
        this.search();
    }), _defineProperty(_methods, 'uploading', function uploading(event, file, fileList) {
        this.$Spin.show();
    }), _defineProperty(_methods, 'uploadDone', function uploadDone(response, file, fileList) {
        this.$Notice.success({
            title: "提示",
            desc: "文件上传成功"
        });
        this.$Spin.hide();
        this.search();
    }), _defineProperty(_methods, 'handleChange2', function handleChange2(newTargetKeys, direction, moveKeys) {
        var _this9 = this;

        var moveData = moveKeys;
        if (direction == 'left') {
            this.targetFormHead = newTargetKeys;
        } else {
            moveData.forEach(function (val) {
                _this9.targetFormHead.push(val);
            });
        }
        this.changeFormHeadDataFun();
    }), _defineProperty(_methods, 'changeFormHeadDataFun', function changeFormHeadDataFun() {
        var _ = this;
        var arr = [],
            dataArr = [];
        _.formHeadData = [];
        if (_.targetFormHead.length > 0) {
            _.targetFormHead.forEach(function (val) {
                _.sourceFormHead.forEach(function (value) {
                    if (val === value.key) {
                        arr.push({
                            FormId: value.fromId,
                            FormHeadId: value.key,
                            Value: value.value,
                            FileId: value.fileId,
                            Label: value.label
                        });
                    }
                });
            });
        }
        arr.forEach(function (val) {
            if (dataArr.indexOf(val.FormHeadId) == -1) {
                _.formHeadData.push(val);
            }
        });
        _.formHeadData.forEach(function (val) {
            if (val) {
                dataArr.push(val.FormHeadId);
            }
        });
    }), _defineProperty(_methods, 'FormHeadDataFun', function FormHeadDataFun() {
        var _ = this;
        _.formHeadData = [];
        if (_.targetFormHead.length > 0) {
            _.targetFormHead.forEach(function (val) {
                _.sourceFormHead.forEach(function (value) {
                    if (val === value.key) {
                        _.formHeadData.push({
                            FormId: value.fromId,
                            FormHeadId: value.key,
                            Value: value.value,
                            FileId: value.fileId,
                            Label: value.label
                        });
                    }
                });
            });
        }
    }), _defineProperty(_methods, 'saveSelectFormHead', function saveSelectFormHead() {
        var _ = this;
        _.$Spin.show();
        var FormHeadRelation = [];
        if (!_.isDrag) {
            this.FormHeadDataFun();
        }
        _.formHeadData.forEach(function (val, index) {
            if (val) {
                FormHeadRelation.push({
                    FormId: val.FormId,
                    FormHeadId: val.FormHeadId,
                    Value: val.Value,
                    FileId: val.FileId,
                    Sort: index
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
            _.bindingFormHead.isShow = false;
        }).catch(function (error) {
            _.$Spin.hide();
            _.bindingFormHead.isShow = false;
        });
    }), _defineProperty(_methods, 'completeReqCopy', function completeReqCopy(value) {
        var _this = this;
        if (value) {
            _this.copyModal.selectValue = '';
            var url = webApiUrl + '/api/Form/GetProductByName?random=' + Math.random();
            axios.get(url, {
                params: { name: value }
            }).then(function (res) {
                _this.copyModal.CP.data = res.data.data;
            }).catch();
        } else {
            _this.copyModal.CP.guid = '';
        }
    }), _defineProperty(_methods, 'skuReq', function skuReq(value) {
        var _this = this;
        if (value) {
            var url = webApiUrl + '/api/Form/GetSQUByProduct?random=' + Math.random();
            _this.copyModal.SKU.data = '';
            var valueData = value.split('-')[1];
            _this.copyModal.CP.data.forEach(function (val, index) {
                if (val.ProductCode === valueData) {
                    _this.copyModal.CP.guid = val.ProductGuid;
                }
            });
            _this.$Spin.show();
            axios.get(url, {
                params: { productGuid: _this.copyModal.CP.guid }
            }).then(function (res) {
                _this.$Spin.hide();
                // if (res.data.status) {
                _this.copyModal.SKU.data = res.data.data;
                _this.copyModal.selectValue = '';
                _this.copyModal.processValue = '';
            });
        }
    }), _defineProperty(_methods, 'selectReq', function selectReq(value) {
        var _this = this;
        _this.$Spin.show();
        _this.copyModal.SKU.guid = value;
        axios.get(webApiUrl + '/api/Form/GetProcessBySku?random=' + Math.random(), {
            params: {
                skuId: _this.copyModal.SKU.guid
            }
        }).then(function (res) {
            _this.$Spin.hide();
            if (res.status) {
                _this.copyModal.GX.data = res.data.data;
                _this.copyModal.processValue = '';
            } else {
                _this.$Message.warning(res.errorCode);
            }
        });
    }), _defineProperty(_methods, 'selectSKUReq', function selectSKUReq() {
        var _this = this;
        _this.copyModal.GX.guid = '';
        _this.copyModal.processValue = '';
    }), _defineProperty(_methods, 'copyProcess', function copyProcess(value) {
        this.copyModal.GX.guid = value;
    }), _defineProperty(_methods, 'copySave', function copySave() {
        var _this10 = this;

        var url = webApiUrl + "/api/Form/CopyFormGroup?random=" + Math.random(),
            data = {
            Id: this.copyModal.id,
            FormTitle: this.copyModal.formTitle,
            FormType: this.copyModal.formType,
            Remark: this.copyModal.remark,
            ProductGuid: this.copyModal.CP.guid,
            ProcessGuid: this.copyModal.GX.guid ? this.copyModal.GX.guid : '',
            SkuGuid: this.copyModal.SKU.guid ? this.copyModal.SKU.guid : ''
        };
        if (this.copyModal.CP.guid) {
            this.$refs['copyForm'].validate(function (valid) {
                if (valid) {
                    axios.post(url, data).then(function (res) {
                        if (res.data.status) {
                            _this10.$Message.success('复制成功');
                            _this10.copyModal.isShow = false;
                            _this10.search();
                        } else {
                            _this10.$Message.warning(res.data.errorCode);
                        }
                    });
                } else {
                    _this10.$Message.error('验证失败');
                }
            });
        } else {
            this.$Message.error('保存失败');
            this.$Message.warning('请选择正确的产品');
        }
    }), _defineProperty(_methods, 'render3', function render3(item) {
        return item.label;
        // if (item.value == "") {
        // return item.label;
        // } else {
        // return item.label + ' - ' + item.value;
        // }
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
                    value: value.value,
                    fileId: value.fileId
                });
            }
        });

        _.editFormHead.isShow = true;
    }), _defineProperty(_methods, 'download', function download() {
        var _ = this;
        this.$Spin.show();
        this.searchModel.search = [];
        if (this.searchType != '' && this.searchKey != '') {
            this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
        }
        axios.post(webApiUrl + '/api/FormGroup/Download?random=' + Math.random(), _.searchModel).then(function (response) {
            if (response.data.status) {
                _.$Spin.hide();
                //文件路径response.data.obj
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
        _.$Spin.show();
        axios.post(webApiUrl + '/api/FormGroup/GetPageListDetail?random=' + Math.random(), _.searchModel).then(function (response) {
            _.$Spin.hide();
            if (response.data.status) {
                _.formGroupTableData.dataSource = response.data.data.items;
                _.total = response.data.data.totalNum;
            }
        }).catch(function (error) {
            _.$Spin.hide();
            console.log(error);
        });
    }), _defineProperty(_methods, 'del', function del() {
        var _ = this;
        this.$Spin.show();
        axios.post(webApiUrl + "/api/FormGroup/delete?random=" + Math.random(), {
            Id: _.baseModel.Id
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
        var _this11 = this;

        var _ = this;
        _.baseModel.StartTime = basis.baseData(_.baseModel.StartTime, 1);

        if (_.baseModel.EndTime != '2099-12-31') {
            _.baseModel.EndTime = basis.baseData(_.baseModel.EndTime, 1);
        }

        this.$refs['editForm'].validate(function (valid) {
            if (valid) {
                _this11.$Spin.show();
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
                    isStart: _.baseModel.isStart
                };
                var url = webApiUrl + "/api/FormGroup/insert?random=" + Math.random();
                if (_.baseModel.Id != 0) {
                    url = webApiUrl + "/api/FormGroup/update?random=" + Math.random();
                }

                if (data.productGuid) {
                    axios.post(url, data).then(function (response) {
                        if (response.data.status) {
                            _.search();
                            _.$refs['editForm'].resetFields();
                            _.showEdit.isShow = false;
                            _.$Message.success('保存成功');
                        } else {
                            _.$Message.error(response.data.errorCode);
                        }
                        _.$Spin.hide();
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    _.$Spin.hide();
                    _this11.$Message.error('保存失败');
                    _this11.$Message.warning('请选择正确的产品');
                }
            } else {
                // this.$refs['editForm'].resetFields();
                _this11.$Message.error('保存失败');
            }
        });
    }), _defineProperty(_methods, 'endFunc', function endFunc(e) {
        var _this12 = this;

        this.isDrag = true;
        var headerData = [];
        var lable = e.item.innerText.replace(/\s+/g, "");
        var indexData = e.newIndex;

        this.formHeadData.forEach(function (val, index) {
            if (val) {
                var valLable = val.Label.replace(/\s+/g, "");
                if (lable == valLable) {
                    headerData = _this12.formHeadData.splice(index, 1);
                }
            }
        });
        this.formHeadData.splice(indexData, 0, headerData[0]);
    }), _defineProperty(_methods, 'chooseFunc', function chooseFunc(e) {
        if (this.formHeadData.length == 0) {
            this.FormHeadDataFun();
        }
    }), _defineProperty(_methods, 'moduleMaxHeight', function moduleMaxHeight() {
        this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px';
    }), _methods),
    mounted: function mounted() {
        this.moduleMaxHeight();
        basis.tableHeightData(this.formGroupTableData);
    }
});
