//# sourceURL=NotificationLogList.js
var NotificationLogList = {
    Init: function () {
        NotificationLogList.LoadFormData();
    },
    LoadFormData: function () {
        Util.Ajax.Datatable("/NotificationLog/GetAllLogs", columns);
    }
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
    data: 'state',
    title: 'Type',
    width: '4%',
    render: function (data, type, full, meta) {
        var returnValue = full.state;
        if (full.state == "Up")
            returnValue = '<span><span style="width: 150px;" class="btn btn-bold btn-sm btn-font-sm  btn-label-success">' + full.state + '</span></span>';
        if (full.state == "Down")
            returnValue = '<span><span style="width: 150px;" class="btn btn-bold btn-sm btn-font-sm  btn-label-danger">' + full.state + '</span></span>';
        if (full.state == "Name Not Resolved")
            returnValue = '<span><span style="width: 150px;" class="btn btn-bold btn-sm btn-font-sm  btn-label-warning">' + full.state + '</span></span>';
        return returnValue;
    }
},
{
    data: 'siteName',
    title: 'Name',
    width: '10%',
    render: function (data, type, full, meta) {
        var returnValue = "<b>" + full.siteName + "</b>";
        return returnValue;
    }
},
{
    data: 'message',
    title: 'Detail',
    width: '25%',
},
{
    data: 'checkedDate',
    title: 'Date',
    width: '15%',
    render: function (data, type, row) {
        if (type === "sort" || type === "type") {
            return data;
        }
        return moment(data).format("DD-MM-YYYY HH:mm");
    }
}
];