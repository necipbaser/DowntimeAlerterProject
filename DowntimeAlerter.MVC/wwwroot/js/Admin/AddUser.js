//# sourceURL=AddUser.js
var AddUser = {
    Init: function () {
        AddUser.LoadFormData();
    },
    LoadFormData: function () {
    },
    Save: function () {
        //parameters
        var userName = $("#txtUserName").val();
        var password = $("#txtPassword").val();
        //validations
        if (userName == "")
            return Util.Notification.Swall("warning", "User name cannot be empty!", "Error", "Ok", false);
        if (password == "")
            return Util.Notification.Swall("warning", "Password cannot be empty!", "Error", "Ok", false);
        if (userName.length<3)
            return Util.Notification.Swall("warning", "Username must be at least 3 characters!", "Error", "Ok", false);
        if (password.length<5)
            return Util.Notification.Swall("warning", "Password must be at least 5 characters!", "Error", "Ok", false);

        var formData = new FormData();
        formData.append("UserName", userName);
        formData.append("Password", password);
        Util.BlockUI.Block("Please wait, the site is being added...");
        Util.Ajax.Generic("Admin", "CreateUser", AddUser.CallbackSave, formData, true);
    },
    CallbackSave: function (response) {
        Util.BlockUI.UnBlock();
        if (response.success == true) {
            Index.LoadFormData();
            $("#responsive-modal").modal("toggle");
            return Util.Notification.Swall("success", response.msg, "Success", "Ok", false);
        } else {
            return Util.Notification.Swall("warning", response.msg, "Error", "Ok", false);
        }
    }
};