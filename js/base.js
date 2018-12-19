let basis = {
    // 截取后台返回的时间数据
    interceptionTime(data) {
        let dataDeal = data;
        if (dataDeal.length > 10) {
            dataDeal = dataDeal.substr(0, 10).replace('T', ' ');
        } else {
            dataDeal = dataDeal.replace('T', ' ');
        }
        return dataDeal
    },

    baseData(obj, n = 1) { // //1.年月是  2.年月日 时   3.年月日时分  4.年月日时分秒
        if (!obj) return '';
        if (typeof obj == 'object') {
            if (obj.getTime) {
                obj = new Date(obj);
            } else {
                return '';
            };
        } else if (typeof obj == 'string') {
            obj = new Date(obj);
        };
        let year = obj.getFullYear();
        let month = (obj.getMonth() + 1) > 9 ? (obj.getMonth() + 1) : 0 + String((obj.getMonth() + 1));
        let day = (obj.getDate()) > 9 ? obj.getDate() : 0 + String(obj.getDate());
        let hh = (obj.getHours()) > 9 ? obj.getHours() : 0 + String(obj.getHours());
        let mm = (obj.getMinutes()) > 9 ? obj.getMinutes() : 0 + String(obj.getMinutes());
        let ss = (obj.getSeconds()) > 9 ? obj.getSeconds() : 0 + String(obj.getSeconds());

        let dateStr = '';
        if (n == 1) {
            dateStr = `${year}-${month}-${day}`;
        } else if (n == 2) {
            dateStr = `${year}-${month}-${day} ${hh}`;

        } else if (n == 3) {
            dateStr = `${year}-${month}-${day} ${hh}:${mm}`;
        } else if (n == 4) {
            dateStr = `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
        }
        return dateStr;
    },
    tableHeightData(data) {
        let PageHtml = datasData._data.PageName.split('-')[0]
        let obj = data;
        let timer = false;
        obj.tableHeight = window.innerHeight - 285;

        switch (PageHtml) {
            case 'NonconformingFlow':
                obj.tableHeight = window.innerHeight - obj.selectHeight - 231;
                break;
            case 'QualityCondition':
                obj.tableHeight = window.innerHeight - 244;
                break;
            case 'qualityDirector':
                obj.tableHeight = window.innerHeight - 289;
                break;
            default:
                obj.tableHeight = window.innerHeight - 284;

        }
        if (!timer) {
            timer = true
            window.onresize = () => {
                switch (PageHtml) {
                    case 'NonconformingFlow':
                        obj.selectHeight = target.$refs.failedTable.$el.clientHeight;
                        obj.tableHeight = window.innerHeight - obj.selectHeight - 231;
                        break;
                    case 'QualityCondition':
                        obj.tableHeight = window.innerHeight - 244;
                        break;
                    case 'qualityDirector':
                        obj.tableHeight = window.innerHeight - 289;
                        break;
                    default:
                        obj.tableHeight = window.innerHeight - 284;

                }

                timer = false
            }
        }

    }
}