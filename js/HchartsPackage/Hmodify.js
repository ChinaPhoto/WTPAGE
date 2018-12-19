(function() {
    // 现在只有柱形图, 后面有需要可以依次添加
    var Hcharts = function(type, content) {
        if (this instanceof Hcharts) {
            new this[type](content)
        } else {
            new Hcharts(type, content)
        }
    };
    Hcharts.prototype = {
        column: function(data) {
            this.el = data.el;
            this.text = data.text;
            this.categories = data.categories;
            this.yAxisText = data.yAxisText;
            this.series = data.series;


            var chart = Highcharts.chart(this.el, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.text
                },
                xAxis: {
                    categories: this.categories,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: this.yAxisText
                    }
                },
                series: this.series
            });

            var button = new Button({
                el: this.el
            })
        }
    }
    window.Hcharts = Hcharts
})()