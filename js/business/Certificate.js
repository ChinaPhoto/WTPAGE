var target = new Vue({
    el: '#mainDiv',
    data() {
        const projectId = (rule, value, callback) => {    
            if (value.length <= 0) {
                return callback(new Error('至少选择一项'));
            }
            callback()
        };
        return {
            uploadUrl: fileServerUrl + "/UploadFile", // 上传路径
            total: 0, //总条数
            baseModel: {
                id: 0,
                groupName: '',
                sort: 0,
                createTime: new Date(),
                countTime: '',
                createUser: '',
                timeIsShow: true, // 判断创建时间是否隐藏 
                isShow: false,
                HasBarCode:false,
                Upload:'',
                FilePath:'',
                filename:"",
                NoType:'',
                Remark:'',
                certificateName:'', // 合格证名称
            },
            windowHeight: document.documentElement.clientHeight,
            selectData: [{ name: '目视检测报告', id: '0' }, { name: '成品检验报告', id: '1' }, { name: '镀层厚度检测表', id: '2' }],
            searchType:"certificateName",
            searchKey:"",
            loading: false, //菊花
            searchModel: { //检索模型
                search: [], //检索条件(数据){ Col:列名,Val:列值,Operation:like or =}
                pageIndex: 1, //页码
                pageSize: 50, //分页大小
                sort: '' //排序
            },
            columnData: [ //列
                {
                    align: 'center',
                    title: '名称',
                    sortable: 'custom',
                    key: 'certificateName'
                },

                {
                    align: 'center',
                    title: '创建时间',
                    sortable: 'custom',
                    key: 'createTime',
                    render: (h, { row }) => {
                        if (row.createTime) {
                            let time = row.createTime;
                            return h('div', basis.interceptionTime(time))
                        }
                    }
                },
                {
                    align: 'center',
                    title: '产品关联',
                    // key: 'sort'
                    render: (h, { row }) => {
                        return h('i-button', {
                            props: { type: 'ghost', icon: 'plus' },
                            on: {
                                click: () => {
                                    this.related.id = row.cid
                                    this.related.isShow = true;     
                                    this.clearProDada();
                                
                                    this.associationData(row.cid)
                                }
                            }
                        }, '关联产品')
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

                                        this.clearData();
                                        this.baseModel.isShow = true;
                                        this.baseModel.id =  params.row.cid;
                                        this.baseModel.certificateName = params.row.certificateName;
                                        this.baseModel.HasBarCode = params.row.hasBarCode;
                                        this.baseModel.NoType = params.row.noType.toString();
                                        this.baseModel.FilePath = params.row.filePath;
                                        this.baseModel.filename = this.fileName(params.row.filePath);
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
                                        this.baseModel.id = params.row.cid
                                        this.del()
                                    }
                                }
                            }, [h('i-button', { props: { type: 'ghost', size: 'small', icon: 'android-delete' } }, '删除')])
                        ]);
                    }
                }
            ],
            tableData: { // 主页数据源
                dataSource: [], 
                tableHeight: 0
            },
   
            baseRules:{  // 新增弹窗验证
                certificateName: [{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                FilePath:[{
                    required: true,
                    message: '模板必须上传',
                    trigger: 'change'
                }],
              
                NoType:[{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }]
            },
            related: {  //关联产品弹窗
                id: 0,
                isShow: false,
                productGuid:[], // 产品id
                formTypeIds:[], // 
                materialNo:'', // 材料号
                itemDescription:'', // 货物描述
                acceptanceStandard:'', // 接受标准
                projectData:[], // 产品数据
                drawingNo:''
            },
            relatedRules:{  // 产品弹窗验证
                productGuid:[{
                    required: true,
                    // message: '必填',
                    validator: projectId,
                    trigger: 'change'
                }],
                drawingNo:[{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
                formTypeIds: [{
                    required: true,
                    validator: projectId,
                    trigger: 'change'
                }],
                materialNo:[{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                acceptanceStandard:[{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                itemDescription:[{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                drawingNo:[{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }]

            }

        }
    },
    created() {
        this.search();
        // 获取产品
        this.getProduct()
    },
    methods: {
        add() {      
            this.clearData();
            this.baseModel.isShow = true; 
            this.baseModel.id = 0;

        },
        fileName(data) {     
            let arr= data.split("/");
           return arr[arr.length - 1]
        },
        // 取消窗口
        cancel(data) {
            data.isShow = false;
        },

        // 清除新增弹窗数据
        clearData() {
            this.baseModel.HasBarCode = false;
            this.baseModel.filename = "";
            this.$refs.upLoadDOM.clearFiles();
            this.$refs['editForm'].resetFields();
        },
        // 清除关联产品弹窗数据
        clearProDada() {
            this.$refs['relatedForm'].resetFields();
        },

        // onSort(column, key, order) {
        //     this.searchModel.sort = column.key + " " + column.order;
        //     this.search();
        // },
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
            axios.get(fileServerUrl + 'GetFilePathById?fileGuid='+ response.Data).then((res)=> {
                this.baseModel.FilePath = res.data.Data
                this.baseModel.filename = this.fileName(res.data.Data)
            })
            this.search();
        },
        handleError(error, file, fileList) {
            this.$Spin.hide();
            this.$Message.warning(error);
        },

        download() {
            var _ = this;
            this.$Spin.show();
            this.searchModel.search = [];
            if (this.searchType != '' && this.searchKey != '') {
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            axios.post(webApiUrl + '/api/Group/Download?random=' + Math.random(), _.searchModel)
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
                this.searchModel.search.push({ Col: this.searchType, Val: this.searchKey, Operation: 'like' });
            }
            _.searchModel.pageIndex = pageIndex;
            _.$Spin.show();
            axios.post(webApiUrl + '/api/FormHead/GetCocPageList?random=' + Math.random(), _.searchModel)
                .then(function(response) {
                    _.$Spin.hide();
                    if (response.data.status) {
                        _.tableData.dataSource = response.data.data.items;
                        _.total = response.data.data.totalNum;
                    }else{
                        console.log(response.data.errorCode)
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        // // 指标翻页
        // indexChangePage(index) {
        //     this.indexModel.search = [];
        //     let data = {
        //         pageIndex: index,
        //         pageSize: this.indexModel.pageSize,
        //         search: [{
        //             Col: 'GroupId',
        //             Val: this.indexModel.searchKey,
        //             Operation: '='
        //         }],
        //         sort: ''
        //     };
        //     this.$Spin.show()
        //     axios.post(webApiUrl + '/api/Group/GetPageListDetail?random=' + Math.random(), data).then((res) => {
        //         this.$Spin.hide();
        //         if (res.status) {
        //             this.indexModel.tableData = res.data.data.items
        //             this.indexModel.total = res.data.data.totalNum
        //         }
        //     })
        // },
        //成品数据展示
        // /api/ProductBasicInfo/GetProductInfo
        getProduct(){
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetProductInfo?random=' + Math.random())
            .then(
                (res)=>{
                    if (res.data.status) {
                        this.related.projectData = res.data.data
                    }
                })
            .catch(function(error) {
                console.log(error);
            });
        },

        // 关联产品数据请求
        associationData(id){
            axios.get('/api/FormHead/GetCocDetailProduct', {
                params:{
                    cid:id
                }
            }).then((res)=>{
                this.related.acceptanceStandard = res.data.data.cocDetail.acceptanceStandard;
                this.related.drawingNo = res.data.data.cocDetail.drawingNo;
                this.related.materialNo = res.data.data.cocDetail.materialNo;
                this.related.formTypeIds = res.data.data.cocDetail.formTypeIds.split(',');
                this.related.itemDescription = res.data.data.cocDetail.itemDescription;
                let arr = [];
                res.data.data.list_CocProduct.forEach((val) => {
                    arr.push(val.productGuid)
                })
                this.related.productGuid = arr
            })
        },


        // 关联产品数据保存
        associationSave(){
            this.$refs['relatedForm'].validate((valid) => {
                let arr = []
                this.related.productGuid.forEach((value,index) =>{
                    let obj = {
                        CID: this.related.id,
                        ProductGuid: value
                    }
                    arr.push(obj)
                })
                if (valid) {
                    let data = {
                        CocDetail:{
                            CID: this.related.id,
                            MaterialNo: this.related.materialNo ,
                            AcceptanceStandard: this.related.acceptanceStandard,
                            ItemDescription: this.related.itemDescription,
                            DrawingNo: this.related.drawingNo,
                            FormTypeIds: this.related.formTypeIds.toString()
                        },
                        list_C_CocProduct:arr
                    }
                   axios.post('/api/FormHead/AddCocDetailProduct',data).then((res)=>{
                       if(res.data.status){
                            this.$Message.success('保存成功');
                            this.related.isShow= false;
                       }
                   })
                } else {
                    this.$Message.error('保存失败');
                }
            })
        },


        del() {
            var _ = this;
            this.$Spin.show();
            axios.get(webApiUrl + "/api/FormHead/DeleteCoc?random=" + Math.random(), {
                params:{
                    id: _.baseModel.id
                }
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
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    this.$Spin.show();
                    var url = webApiUrl + "/api/FormHead/InsertCoc?random=" + Math.random();
                    if (_.baseModel.id != 0) {
                        url = webApiUrl + "/api/FormHead/UpdateCoc?random=" + Math.random();
                    }
                    let data = {
                        CID: this.baseModel.id,
                        CertificateName: _.baseModel.certificateName,
                        NoType: _.baseModel.NoType,
                        HasBarCode: _.baseModel.HasBarCode,
                        CreateTime: _.baseModel.createTime,
                        FilePath: _.baseModel.FilePath,
                        Remark:''
                    }
                    axios.post(url, data)
                        .then(function(response) {
                            if (response.data.status) {
                                _.search();
                                _.$refs['editForm'].resetFields();
                                _.baseModel.isShow = false;
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



        // 数据请求
        // bindData() {
        //     this.bindIndexModel.isShow = true;
        //     let data = {
        //         Level: 1
        //     }
        //     let url = webApiUrl + "/api/Group/GetGroupQualityTreeByLevel?random=" + Math.random();
        //     axios.post(url, data).then((res) => {
        //         let array = res.data.data;
        //         this.bindIndexModel.treeData = this.bindDataResolve(data, array)
        //     })
        // },
        // 返回数据解析
        // bindDataResolve(data, arr) {
        //     let array = [];
        //     arr.forEach((val, index) => {
        //         let obj = {};
        //         obj.title = val.ProductCode + '-' + val.title;
        //         obj.Id = val.Id;
        //         obj.index = val.Level;
        //         if (data.Level < 3) {
        //             obj.loading = false;
        //             obj.children = []
        //         }
        //         array.push(obj)
        //     })
        //     return array
        // },


        // loading data 数据的异步加载
        // loadData(item, callback) {
        //     // console.log(item)
        //     let url = webApiUrl + "/api/Group/GetGroupQualityTreeByLevel?random=" + Math.random();
        //     if (item.index === 1) {
        //         this.bindIndexModel.depositData = item.Id
        //     }
        //     let data = {
        //         Level: item.index + 1,
        //         ProductGuid: this.bindIndexModel.depositData
        //     }
        //     if (item.index === 2) {
        //         data.ProcessGuid = item.Id;
        //     }
        //     // console.log(data.ProcessGuid)
        //     axios.post(url, data).then((res) => {
        //         let array = res.data.data;

        //         if (data.Level >= 2) {
        //             this.bindIndexModel.treeData.forEach((val, index) => {
        //                 if (val.Id === data.ProductGuid) {
        //                     if (data.Level == 2) {
        //                         val.children = this.bindDataResolve(data, array)
        //                         callback(val.children)
        //                     } else if (data.Level === 3) {
        //                         val.children.forEach((value) => {
        //                             if (value.Id === data.ProcessGuid) {
        //                                 value.children = this.bindDataResolve(data, array)
        //                                 callback(value.children)
        //                             }
        //                         })
        //                     }
        //                 }
        //             })
        //         } else if (data.Level === 3) {
        //             this.bindIndexModel.treeData.forEach((val, index) => {
        //                 if (val.Id === data.ProductGuid) {
        //                     val.children.forEach((value) => {
        //                         if (value.Id === data.ProcessGuid) {
        //                             value.children = this.bindDataResolve(data, array)
        //                             callback(value.children)
        //                         }
        //                     })
        //                 }
        //             })
        //         }
        //     })

        // },
        // // 选中数据处理
        // treeSelect(arr) {
        //     let array = [];
        //     this.bindIndexModel.guidData = [];
        //     arr.forEach((val, index) => {
        //         if (val.index !== 1 && val.index !== 2) {
        //             array.push(val)
        //         }
        //     })
        //     array.forEach((value, index) => {
        //         this.bindIndexModel.guidData.push({ GroupId: this.indexModel.searchKey, QualityId: value.Id })
        //     })

        // },
        // //点击保存的返回的数据
        // bingIndex() {
        //     this.bindIndexModel.isShow = false
        //     let data = this.bindIndexModel.guidData
        //     axios.post(webApiUrl + "/api/Group/AddGroupQuality?random=" + Math.random(), data)
        //         .then((res) => {
        //             this.indexChangePage(1)
        //         })
        // },
        moduleMaxHeight() {
           // this.modalMaxHeight.maxHeight = this.windowHeight - 300 + 'px'
        }


    },
    mounted() {
        this.moduleMaxHeight()
        basis.tableHeightData(this.tableData)
    }
})