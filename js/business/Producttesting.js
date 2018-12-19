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
                reportName: '',  // 名称
                productGuid:'',  // 
                sort: 0,
                createTime: new Date(),
                countTime: '',
                createUser: '',
                timeIsShow: true, // 判断创建时间是否隐藏 
                projectData:[],//产品清单
                isShow:false
             
            },
            windowHeight: document.documentElement.clientHeight,
            selectData: [{ name: '毛坯尺寸及外观检测', id: '1' }, { name: '米字型检测', id: '2' }, { name: '外观及视检验', id: '3' }, { name: '位置度评定', id: '4' }, { name: '全尺寸检测', id: '6' }, { name: '清洗检测', id: '7' }, { name: '涂装过程检测', id: '8' }, { name: '涂装厚度检测', id: '9' }, { name: '包装封箱前检测', id: '10' }, { name: '外购件复检', id: '11' }, { name: '成品检测', id: '12' }],
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
                    key: 'reportName'
                },
                {
                    align: 'center',
                    title: '成品',
                    sortable: 'custom',
                    key: 'productCode'
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
                    title: '绑定子件',
                    // key: 'sort'
                    render: (h, { row }) => {
                        return h('i-button', {
                            props: { type: 'ghost', icon: 'plus' },
                            on: {
                                click: () => {
                                    this.clearComponentPopData();
                                    this.componentPop.isShow= true;
                                    this.componentPop.id = row.pid;
                                    this.getComponent(this.componentPop.id );
                                    let el = this.$refs['selectValue'].$children[1].$el.lastChild;
                                    let vm = this;
                                    Sortable.create(el, {
                                        onEnd: vm.endFunc,
                                    });    
                                }
                            }
                        }, '绑定子件')
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
                                        this.clearData().then(()=>{
                                            this.baseModel.isShow = true;      
                                            this.baseModel.id = params.row.pid;
                                            this.baseModel.productGuid = params.row.productGuid;
                                            this.baseModel.reportName = params.row.reportName;
                                        });                     
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
                                        this.baseModel.id = params.row.pid
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
            // 待选特性值数据
            featureData:[], 
            feature:[
                {
                    align: 'center',
                    title: 'ID',                 
                    key: 'QualityId'
                },
                {
                    align: 'center',
                    title: '名称',                 
                    key: 'Quality'
                },
                {
                    align: 'center',
                    title: '工序',                   
                    key: 'ProcessName'
                },
                {
                    align: 'center',
                    title: '选择添加',
                    render:(h, {row})=>{
                        return h('i-button', {
                            props: { type: 'success', icon: 'plus'  },
                            on: {
                                click: ()=> {
                                    if( this.selectFeatureData.length > 0) {                                       
                                        let data = row.QualityId   
                                        let arr = []        
                                        this.selectFeatureData.map((val)=>{ 
                                            arr.push(val.QualityId)                                           
                                        })
                                        if (arr.indexOf(data) === -1){
                                            this.selectFeatureData.push(row);
                                        }
                                    }else {
                                        this.selectFeatureData.push(row);
                                    }     
                                              
                                }
                            }
                        },'添加')
                    }
                }
            ],
            // 已选中特性值的暂存数据
            selectFeatureData:[],  
            selectFeature:[
                {
                    align: 'center',
                    title: 'ID',                 
                    key: 'QualityId'
                },
                {
                    align: 'center',
                    title: '名称',
                    // sortable: 'custom',
                    key: 'Quality'
                },
                {
                    align: 'center',
                    title: '工序',
                    // sortable: 'custom',
                    key: 'ProcessName'
                },
                {
                    align: 'center',
                    title: '选择删除',
                    render:(h, {row})=>{
                        return h('i-button', {
                            props: { type: 'error', icon: 'trash-a'  },
                            on: {
                                click: ()=> {
                                    this.selectFeatureData.splice(row ,1)
                                }
                            }
                        },'删除')
                    }
                }
            ],

            baseRules:{  // 新增弹窗验证
                reportName:[{
                    required: true,
                    message: '必填',
                    trigger: 'blur'
                }],
                productGuid:[{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }]
            }, 
            componentPop:{  // 绑定子件弹窗数据
                isShow:false,
                componentName:'',
                id:'',
                productGuid:'',
                processGuid:'',
                formId:'',
                formType: 0, 
                SKU:'',
                projectData:[],  // 子件数据
                SKUdata:[],  // sku数据
                processData:[] // 工序数据
            },
            componentRules:{  // 子件弹窗验证
                productGuid:[{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
                SKU:[{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
                processGuid:[{
                    required: true,
                    message: '必填',
                    trigger: 'change'
                }],
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
        clearData(RED) {
            return new Promise((resolve,reject) =>{
                this.$refs['editForm'].resetFields();
                this.$refs.productGuidClear.clearSingleSelect();  
                setTimeout(resolve)         
           })     
        },
        // 清除子件弹窗验证数据
        clearComponentPopData(){
            this.$refs['componentPop'].resetFields();
            this.$refs.project.clearSingleSelect(); 
            this.componentPop.SKU = '';
            this.componentPop.processGuid = '';
            this.projectData = [];
            this.SKUdata = [];
            this.processData =[];
            this.featureData =[];
            this.selectFeatureData =[];
        },
        // 清除子件选中
        deleProData(){
            this.componentPop.productGuid ="";
            this.componentPop.SKU ="";
            this.componentPop.SKUdata =[];
            this.componentPop.processGuid ="";
            this.componentPop.processData =[];
            this.featureData = [];  //表示table 数据
            this.selectFeatureData= []; //清楚已选中数据
            this.$refs['sku'].clearSingleSelect();
            this.$refs['process'].clearSingleSelect();    
        },
         // 清除sku选中
         deleDataSKU(){
            this.componentPop.processGuid ="";
            this.componentPop.processData =[];
            this.featureData = [];
            this.$refs['process'].clearSingleSelect()
         },
         // 清除 工序选中
         delePreData(){
            this.featureData = [];
            this.$refs['selectValue'].$forceUpdate()
         },
         // 表格拖动
        endFunc(e) {
            let arr = [],  // 空数组 用来储存 移动的数组
                idData = e.clone.innerText.split("   ");
                id = idData[1],
                newIndex = e.newIndex

           if( this.selectFeatureData.length > 0) {
                this.selectFeatureData.forEach((value,index) =>{
                    if(id == value.QualityId) {
                        arr = this.selectFeatureData.splice(index, 1)
                    }
                })
                this.selectFeatureData.splice(newIndex, 0, arr[0]);
           }
         },
         // 获取子件
         getComponent (id) {
            axios.get(webApiUrl + '/api/FormHead/GetPirDetailProduct?random=' + Math.random(),{
                params: {
                    pid: id  
                }
            }).then((res) =>{
               if(res.status ){
                  if(res.data.data.list_pirDetail) {
                   
                    this.componentPop.productGuid = res.data.data.pirConfig.productGuid
                    this.getSKU(this.componentPop.productGuid);
                     this.selectFeatureData = res.data.data.list_pirDetail;
                  }                   
               }else {
                   this.$Message.error(res.errorCode)
               }
            }).catch((err) =>{
                console.log(err)
            })
         },
        getSKU(value){       
            if(value){
                this.selectFeatureData= []; //清楚已选中数据
                this.featureData = [];
                this.componentPop.SKUdata = [];
                this.componentPop.SKU="";
                this.componentPop.processGuid="";
                axios.get(webApiUrl + '/api/ProductBasicInfo/GetSkuByProductId?random=' + Math.random(), {
                    params: {
                        ProductGuid: value
                    }
                })
                .then((res)=>{
                        if(res.data.status){
                            this.componentPop.SKUdata = res.data.data;
                        }
                    }).catch(function(error) {
                    console.log(error);
                });
            }
        },
        // 获取 工序
        getProcess(value){
            if(value){
                this.componentPop.processData = [];
                this.componentPop.processGuid = '';
                this.featureData = [];
                this.$refs.process.clearSingleSelect();  
                axios.get(webApiUrl + '/api/ProductBasicInfo/GetProcessBySkuId', {
                    params: {
                        SKUGuid: value
                    }
                }).then((res)=>{
                    if(res.data.status){
                        this.componentPop.processData = res.data.data;
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }
        },
        // 获取table数据
        async getTableData(value){
            if(value) {
                this.featureData = [];
                let res = await this.getFormId()
                if(res.data.data) {
                    this.componentPop.formId = res.data.data.formId;
                    this.componentPop.formType = 0;
                  
                    axios.get(webApiUrl + "/api/Form/GetQualityBy?random=" + Math.random(), {
                        params: {
                            ProductId: this.componentPop.productGuid,
                            ProcessGuid:this.componentPop.processGuid,
                            FormType: 0,
                            FormId:  this.componentPop.formId,
                        }
                    }).then((res)=>{
                        if(res.data.status){
                            let arr = [];
                            res.data.data.forEach((val,index) =>{
                                delete val._checked; 
                                arr.push(val)
                            })
                            this.featureData = arr
                        } 
                    }).catch((err) =>{
                        console.log(err)
                    })
                } else {
                    this.$Message.error('表单Id 未找到 请配置')
                }
            }
        },

        // 获取 form id
         getFormId(){
            let data = {
                ProductGuid: this.componentPop.productGuid,
                SkuGuid: this.componentPop.SKU,
                ProcessGuid: this.componentPop.processGuid,
            }
            return new Promise((resolve, reject) => {
                axios.get(webApiUrl + '/api/FormHead/GetFormIdByPSP', {
                    params:data
                }
                ).then((res) =>{
                    resolve(res)
                })
               
            })
            
         
           
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
            axios.post(webApiUrl + '/api/FormHead/GetPirPageList?random=' + Math.random(), _.searchModel)
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
        //成品数据展示
        // /api/ProductBasicInfo/GetProductInfo
        getProduct(){
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetProductInfoByType?random=' + Math.random(),{
                params:{
                    productType:2
                }
            })
            .then(
                (res)=>{
                   this.baseModel.projectData = res.data.data
                })
            .catch(function(error) {
                console.log(error);
            });
            axios.get(webApiUrl + '/api/ProductBasicInfo/GetProductInfoByType?random=' + Math.random(),{
                params:{
                    productType:3
                }
            })
            .then(
                (res)=>{
                   this.componentPop.projectData = res.data.data               
                })
            .catch(function(error) {
                console.log(error);
            });
        },
        // 子件配置提交
        componentPopSave() {
            let objReport = {
                Pid: this.componentPop.id,
                FormId: this.componentPop.formId,
                ProductGuid: this.componentPop.productGuid,
            }
            let dataArr = [];
         if(this.selectFeatureData.length > 0){
            this.selectFeatureData.forEach((value,index) =>{
                let obj = {               
                    QualityId: value.QualityId,
                    Sort:index
                }
                dataArr.push(obj)
            })
         }
            let data = {
                pirConfig: objReport,
                list_pirDetail: dataArr
            }
            this.$refs['componentPop'].validate((valid) => {
                if(valid){
                   if(this.selectFeatureData.length > 0) {
                        axios.post(webApiUrl + '/api/FormHead/AddPirDetailProduct', data)
                        .then((res)=>{
                        if(res.data.status){
                            this.componentPop.isShow= false;
                            this.$Message.success('保存成功');
                        } else {
                            this.$Message.error(res.data.errorCode);
                        }
                        }).catch((err)=>{
                            console.log(err)
                        }) 
                   }else {
                    this.$Message.error('至少选中一项特性值');
                   }
                }else{
                    this.$Message.error('验证失败');
                }
            })
          
        },
        del() {
            var _ = this;
            this.$Spin.show();
            axios.get(webApiUrl + "/api/FormHead/DeletePir?random=" + Math.random(), {
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
                    var url = webApiUrl + "/api/FormHead/InsertPir?random=" + Math.random();
                    if (_.baseModel.id != 0) {
                        url = webApiUrl + "/api/FormHead/UpdatePir?random=" + Math.random();
                    }
                    let data = {
                        Pid: this.baseModel.id,
                        reportName: _.baseModel.reportName,
                        productGuid: _.baseModel.productGuid,
                        CreateTime: _.baseModel.createTime
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
    },
    mounted() {
        basis.tableHeightData(this.tableData)
    }
})