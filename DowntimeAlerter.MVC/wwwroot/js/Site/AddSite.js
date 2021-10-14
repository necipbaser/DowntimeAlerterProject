//# sourceURL=AddSite.js
var addedEmailList = [];
var AddSite = {
    Init: function () {
        AddSite.LoadFormData();
    },
    LoadFormData: function () {

    },
    Save: function () {
        //parameters
        var siteName = $("#txtSiteName").val();
        var siteUrl = $("#txtSiteUrl").val();
        var siteIntervalTime = $("#txtIntervalTime").val();

        //validations
        if (siteName == "")
            return Util.Notification.Swall("warning", "Site name cannot be empty!", "Error", "Ok", false);
        if (siteUrl == "")
            return Util.Notification.Swall("warning", "Site Url cannot be empty!", "Error", "Ok", false);
        if (siteIntervalTime < 60)
            return Util.Notification.Swall("warning", "The Interval Time must be greater than 60 seconds.", "Error", "Ok", false);

        if (addedEmailList.length < 1)
            return Util.Notification.Swall("warning", "Please enter at least 1 e-mail address.", "Error", "Ok", false);

        var formData = new FormData();
        formData.append("Name", siteName);
        formData.append("Url", siteUrl);
        formData.append("IntervalTime", siteIntervalTime);
        for (var i = 0; i < addedEmailList.length; i++) {
            formData.append("SiteEmails[" + i + "].Email", addedEmailList[i]);
        }
        Util.BlockUI.Block("Please wait, the site is being added...");
        Util.Ajax.Generic("Site", "CreateSite", AddSite.CallbackSave, formData, true);
    },
    CallbackSave: function (response) {
        Util.BlockUI.UnBlock();
        if (response.data == true) {
            //remove and restart job
            Util.Ajax.Generic("Task", "StartNotificationJob", "", null, true, "GET");
            SiteList.LoadFormData();
            $("#responsive-modal").modal("toggle");
            return Util.Notification.Swall("success", response.msg, "Success", "Ok", false);
        } else {
            return Util.Notification.Swall("warning", response.msg, "Error", "Ok", false);
        }
    },
    AddEmail: function () {
        var emailAdress = $("#txtEmail").val();
        if (emailAdress == "" || Util.EmailValidate.EmailValidate(emailAdress) != true)
            return Util.Notification.Swall("warning", "Please enter a correct e-mail address!", "Error", "Ok", false);

        if ($.inArray(emailAdress, addedEmailList) != -1) {
            Util.Notification.Swall("warning", "This email address already added!", "Error", "Ok", false);
        } else {
            addedEmailList.push(emailAdress);
            AddSite.GetAddedEmailList();
        }
    },
    DeleteEmail: function (email) {
        addedEmailList = jQuery.grep(addedEmailList, function (value) {
            return value != email;
        });
        AddSite.GetAddedEmailList();
    },
    GetAddedEmailList: function () {
        var html = '';
        if (addedEmailList.length<1)
            $("#tblAddedEmail").html(html);
        else {
            for (var i = 0; i < addedEmailList.length; i++) {
                html += '<tr>';
                html += '<td>' + (i + 1) + '</td>';
                html += '<td>' + addedEmailList[i] + '</td>';
                html += '<td>';
                html += '<a style="height:18px;" onclick="AddSite.DeleteEmail(`' + addedEmailList[i] + '`)" class="btn btn-lg btn-clean btn-icon btn-icon-lg" title="Delete"> <i style="color:#e41dc2;" class="fa fa-trash-alt"></i></a>';
                html += '</button>';
                html += '</td>';
                html += '</tr>';
            }
            $("#tblAddedEmail").html(html);
        }
    }
}