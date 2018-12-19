(function() {
    let Button = function(options) {

        let defaults = {
            el: 'container',
            buttons: {}, //  公用 组件
            isShow: true, // 是否显示 默认显示
            // axios 需要传递的参数
            a: '',
            b: '',
            c: ''
        }


        this.opts = $.extend({}, defaults, options);
        this.init();
        return this;
    };
    Button.prototype = {
        init: function() {
            let _this = this;
            _this.Rendering();
        },
        Rendering: function() { // dom渲染
            let _this = this,
                opts = this.opts,
                button = opts.buttons;

            button.div = $('<div class="DownButton"></div>');
            button.icon = $('<i class="ivu-icon ivu-icon-arrow-down-a icon"></i>');
            button.prompt = $('<p class="prompt">点我下载基础数据</p>')
            button.div.append(button.icon).append(button.prompt);
            button.box = $('#' + opts.el).parent('div');
            button.box.append(button.div);
            if (opts.isShow) {
                button.div.on('click', function() {
                    _this.business()
                })
            } else {
                button.div.hide()
            }

        },
        business: function(data) { //  axios 请求
            console.log(11111)
                // axios.post(url,data).then((res)) 
        }
    }
    window.Button = Button;
})()