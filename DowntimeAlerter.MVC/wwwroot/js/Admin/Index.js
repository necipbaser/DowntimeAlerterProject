//# sourceURL=Index.js
var Index = {
    Init: function () {
        Index.LoadFormData();
    },
    LoadFormData: function () {
        Util.Ajax.Datatable("/Admin/GetAllUsers", columns);
    },
    AddUserModal: function () {
        Util.Modal.OpenModal("/Admin/AddUser", SizeForModal.MEDIUM);
    }
};
var columns = [
    {
        data: "id",
        title: "#",
        width: "15%",
        render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
        }
    },
    {
        data: "userName",
        title: "User Name",
        render: function (data, type, full, meta) {
            var returnValue = "<b>" + full.username + "</b>";
            return returnValue;
        }
    }
];