//# sourceURL=SiteList.js
var SiteList = {
    Init: function () {
        SiteList.LoadFormData();
    },
    LoadFormData: function () {
        Util.Ajax.Datatable("/Site/GetAllSites", columns);
    },
    AddSiteModal: function () {
        Util.Modal.OpenModal('/Site/AddSite', SizeForModal.XLARGE);
    },
    EditSiteModal: function (id) {
        Util.Modal.OpenModal('/Site/EditSite/' + id, SizeForModal.XLARGE);
    },
    DeleteSite: function (id) {
        var formData = new FormData();
        formData.append("id", id);
        Util.Notification.SwallOptionalParameter('warning', 'Are you sure?', 'Alert', 'Ok', true, 'Cancel', SiteList.CallBackDeleteSiteAlert, null, formData);
    },
    CallBackDeleteSiteAlert: function (args) {
        var formData = args[0];
        Util.Ajax.Generic("Site", "DeleteSite", SiteList.CallBackDeleteSite, formData, true,"DELETE");
    },
    CallBackDeleteSite: function (response) {
        if (response.success == true) {
            Util.Ajax.Generic("Task", "StartRecurringNotificationJob", "", null, true, "GET");
            SiteList.LoadFormData();
            return Util.Notification.Swall("success", "The site was deleted.", "Info", "Ok", false);
        } else {
            return Util.Notification.Swall("warning", response.msg, "Error", "Ok", false);
        }
    },
}
var columns = [{
    data: "id",
    title: "#",
    width: '5%',
    render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
    }
},
{
    data: 'name',
    title: 'Name',
    width: '15%',
},
{
    data: 'url',
    title: 'Url',
    width: '15%',
    },
    {
        data: 'intervalTime',
        title: 'Interval Time',
        width: '15%',
    },
{
    data: 'Actions',
    title: 'Actions',
    width: '5%',
    render: function (data, type, full, meta) {
        var returnValue = '<a style="height:18px;" href="javascript:SiteList.EditSiteModal(\'' + full.id +
            '\')" class="btn btn-lg btn-clean btn-icon btn-icon-lg" title="Edit">' +
            ' <i class="flaticon2-pen"></i>' +
            '</a>';
        returnValue += '<a style="height:18px;" href="javascript:SiteList.DeleteSite(\'' + full.id +
            '\')" class="btn btn-lg btn-clean btn-icon btn-icon-lg" title="Delete">' +
            ' <i style="color:#f74747" class="fa fa-trash-alt"></i>' +
            '</a>';
        return returnValue;
    }
}
];