//# sourceURL=Login.js
var Login = {
    Init: function () {
        Login.LoadFormData();
    },
    LoadFormData: function () {
    },
    Login: function () {
        var btn = $("#btnLogin");
        var userName = $("#username").val();
        var password = $("#password").val();
        if (userName == "" || userName == null) {
            return toastr["info"]("Please enter username and password!");
        }

        if (password == "" || password == null) {
            return toastr["info"]("Please enter username and password!");
        } else {
            Util.BlockUI.Block("Please wait...");
            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            var formData = new FormData();
            formData.append("Username", userName);
            formData.append("Password", password);
            setTimeout(function () { Util.Ajax.Generic("Login", "Login", Login.CallBackLogin, formData, true); }, 100);
        }
    },
    CallBackLogin: function (response) {
        Util.BlockUI.UnBlock();
        if (response.success == true) {
            window.location.href = "Home/Index";
        } else {
            toastr["error"]("Wrong Username or Password");
            var btn = $("#btnLogin");
            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
        }
    }
}
