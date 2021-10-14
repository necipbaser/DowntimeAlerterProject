//# sourceURL=LogList.js
var LogList = {
    Init: function () {
        LogList.LoadFormData();
    },
    LoadFormData: function () {
        Util.Ajax.Datatable("/Log/GetAllLogs", columns);
    },
    LogDetailModal: function (id) {
        Util.Modal.OpenModal('/Log/LogDetails?id=' + id, SizeForModal.XLARGE);
    },
}
var columns = [{
    data: "id", 
    title: "#",
    width: '4%',
    render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
    }
},
{
    data: 'level',
    title: 'Type',
    width: '4%',
    render: function (data, type, full, meta) {
        var returnValue = full.level;
        if (full.level == "Error")
            returnValue = '<span><span style="width: 100px;" class="btn btn-bold btn-sm btn-font-sm  btn-label-danger">' + full.level + '</span></span>';
        if (full.level == "Information")
            returnValue = '<span><span style="width: 100px;" class="btn btn-bold btn-sm btn-font-sm  btn-label-brand">' + full.level + '</span></span>';
        if (full.level == "Debug")
            returnValue = '<span><span style="width: 100px;" class="btn btn-bold btn-sm btn-font-sm  btn-label-dark">' + full.level + '</span></span>';
        if (full.level == "Warning")
            returnValue = '<span><span style="width: 100px;" class="btn btn-bold btn-sm btn-font-sm  btn-label-warning">' + full.level + '</span></span>';
        return returnValue;
    }
},
{
    data: 'messageTemplate',
    title: 'Message',
    width: '35%',
},
{
    data: 'timeStamp',
    title: 'Date',
    width: '15%',
    render: function (data, type, row) {
        if (type === "sort" || type === "type") {
            return data;
        }
        return moment(data).format("DD-MM-YYYY HH:mm");
    }
},
{
    data: 'Actions',
    title: 'Actions',
    width: '5%',
    render: function (data, type, full, meta) {
        var returnValue = '<a style="height:18px;" href="javascript:LogList.LogDetailModal(\'' + full.id +
            '\')" class="btn btn-lg btn-clean btn-icon btn-icon-lg" title="Log Details">' +
            ' <i class="flaticon-list-2"></i>' +
            '</a>';
        return returnValue;
    }
}
];