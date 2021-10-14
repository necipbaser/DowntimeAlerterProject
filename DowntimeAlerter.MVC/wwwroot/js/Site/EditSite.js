//# sourceURL=EditSite.js
var EditSite = {
    Init: function () {
        EditSite.LoadFormData();
    },
    LoadFormData: function () {
        EditSite.GetSiteEmailList();
    },
    GetSiteEmailList: function () {
        var siteId = $("#selectedSiteId").text();
        if (siteId == "")
            return Util.Notification.Swall("warning", "Please select a site!", "Error", "Ok", false);

        var formData = new FormData();
        formData.append("id", siteId);
        Util.BlockUI.Block("Please wait, the site is being added...");
        Util.Ajax.Generic("Site", "GetSiteEmails", EditSite.CallbackGetSiteEmailList, formData, true);
    },
    CallbackGetSiteEmailList: function (response) {
        Util.BlockUI.UnBlock();
        if (response.success == true) {
            EditSite.GetSiteEmails(response.data);
        } else {
            Util.Notification.Swall("warning", response.msg, "Error", "Ok", false);
        }
    },
    Update: function () {
        //parameters
        var siteName = $("#txtEditSiteName").val();
        var siteUrl = $("#txtEditSiteUrl").val();
        var siteIntervalTime = $("#txtEditIntervalTime").val();
        var siteId = $("#selectedSiteId").text();

        //validations
        if (siteName == "")
            return Util.Notification.Swall("warning", "Site name cannot be empty!", "Error", "Ok", false);
        if (siteUrl == "")
            return Util.Notification.Swall("warning", "Site Url cannot be empty!", "Error", "Ok", false);
        if (siteIntervalTime < 60)
            return Util.Notification.Swall("warning", "The Interval Time must be greater than 60 seconds!", "Error", "Ok", false);
        if (siteId=="")
            return Util.Notification.Swall("warning", "Please select a site!", "Error", "Ok", false);

        var formData = new FormData();
        formData.append("Name", siteName);
        formData.append("Url", siteUrl);
        formData.append("IntervalTime", siteIntervalTime);
        formData.append("Id", siteId);
        Util.BlockUI.Block("Please wait, the site is being added...");
        Util.Ajax.Generic("Site", "UpdateSite", EditSite.CallbackUpdate, formData, true,"PUT");
    },
    CallbackUpdate: function (response) {
        Util.BlockUI.UnBlock();
        if (response.success == true) {
            SiteList.LoadFormData();
            $("#responsive-modal").modal("toggle");
            return Util.Notification.Swall("success", response.msg, "Success", "Ok", false);
        } else {
            return Util.Notification.Swall("warning", response.msg, "Error", "Ok", false);
        }
    },
    AddEmail: function () {
        var emailAdress = $("#txtEditEmail").val();
        if (emailAdress == "" || Util.EmailValidate.EmailValidate(emailAdress) != true)
            return Util.Notification.Swall("warning", "Please enter a correct e-mail address!", "Error", "Ok", false);
        var siteId = $("#selectedSiteId").text();
        var formData = new FormData();
        formData.append("SiteId", siteId);
        formData.append("Email", emailAdress);
        Util.BlockUI.Block("Please wait, the email is added...");
        Util.Ajax.Generic("Site", "AddSiteEmail", EditSite.CallbackAddEmail, formData, true, "POST");
    },
    CallbackAddEmail: function (response) {
        Util.BlockUI.UnBlock();
        if (response.success == true) {
            EditSite.GetSiteEmailList();
            Util.Ajax.Generic("Task", "StartRecurringNotificationJob", "", null, true, "GET");
            return Util.Notification.Swall("success", response.msg, "Success", "Ok", false);
        } else {
            return Util.Notification.Swall("warning", response.msg, "Error", "Ok", false);
        }
    },
    DeleteEmail: function (id) {
        var formData = new FormData();
        formData.append("id", id);
        Util.Notification.SwallOptionalParameter('warning', 'Are you sure?', 'Alert', 'Ok', true, 'Cancel', EditSite.CallBackDeleteSiteEmailAlert, null, formData);
    },
    CallBackDeleteSiteEmailAlert: function (args) {
        var formData = args[0];
        Util.Ajax.Generic("Site", "DeleteSiteEmail", EditSite.CallBackDeleteSiteEmail, formData, true, "DELETE");
    },
    CallBackDeleteSiteEmail: function (response) {
        if (response.data == true) {
            EditSite.GetSiteEmailList();
            return Util.Notification.Swall("success", "The site email was deleted.", "Info", "Ok", false);
        }
    },
    GetSiteEmails: function (data) {
        var html = '';
        if (data.length<1)
            $("#tblEditSiteEmails").html(html);
        else {
            for (var i = 0; i < data.length; i++) {
                html += '<tr>';
                html += '<td>' + (i + 1) + '</td>';
                html += '<td>' + data[i].email + '</td>';
                html += '<td>';
                html += '<a style="height:18px;" onclick="EditSite.DeleteEmail(`' + data[i].id + '`)" class="btn btn-lg btn-clean btn-icon btn-icon-lg" title="Delete"> <i style="color:#e41dc2;" class="fa fa-trash-alt"></i></a>';
                html += '</button>';
                html += '</td>';
                html += '</tr>';
            }
            $("#tblEditSiteEmails").html(html);
        }
    }
}