var Util = {
    selectedCheckBox: null,
    JsonDateToDate: function (value) {

        if (value && value != "") {
            var pattern = /Date\(([^)]+)\)/;
            var results = pattern.exec(value);
            var dt;
            if (results)
                dt = new Date(parseFloat(results[1]));
            else
                dt = null;
            return dt;
        } else {
            return null;
        }
    }
};

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return parseFloat((bytes / (1024 ** i)).toFixed(1))
}

Util.BlockUI = {
    Block: function (text) {
        KTApp.blockPage({
            overlayColor: '#000000',
            type: 'v2',
            state: 'primary',
            message: text,
        });
        $('.blockUI').css('z-index', '105000000');
        $('.blockOverlay').css('z-index', '1050');
    },
    UnBlock: function () {
        KTApp.unblockPage();
    }
}

Util.Notification = {
    Toastr: function (type, msg, title, positionClass) {
        if (!positionClass)
            positionClass = "toast-top-right";

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": positionClass,
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        if (type == "error")
            toastr.error(msg, title);
        else if (type == "success")
            toastr.success(msg, title);
        else if (type == "info")
            toastr.info(msg, title);
        else if (type == "warning")
            toastr.warning(msg, title);
    },
    Swall: function (type, msg, title, confirmBtnText, isCancelBtn, cancelBtnText, dismissFunction, dismissTitle, dismissMessage, dismissType, targetButton, routeUrl) {
        if (!dismissFunction) {
            swal.fire({
                title: title,
                text: msg,
                type: type,
                buttonsStyling: false,
                confirmButtonText: confirmBtnText,
                confirmButtonClass: "btn btn-danger",
                allowEscapeKey: false,
                allowOutsideClick: false,
                showCancelButton: isCancelBtn,
                cancelButtonText: cancelBtnText,
                cancelButtonClass: "btn btn-default"
            });
        }
        else {
            swal.fire({
                title: title,
                text: msg,
                type: type,
                showCancelButton: isCancelBtn,
                confirmButtonText: confirmBtnText,
                cancelButtonText: cancelBtnText,
                reverseButtons: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function (result) {
                if (result.value) {
                    dismissFunction(routeUrl, targetButton);
                    //swal.fire(
                    //    dismissTitle,
                    //    dismissMessage,
                    //    dismissType
                    //);
                } else {
                    if (targetButton)
                        KTApp.unprogress(targetButton);
                }
            });
        }
    },
    SwallOptionalParameter: function (type, msg, title, confirmBtnText, isCancelBtn, cancelBtnText, dismissFunction, targetButton, ...args) {
        if (!dismissFunction) {
            swal.fire({
                title: title,
                text: msg,
                type: type,

                buttonsStyling: false,

                confirmButtonText: confirmBtnText,
                confirmButtonClass: "btn btn-danger",

                allowEscapeKey: false,
                allowOutsideClick: false,

                showCancelButton: isCancelBtn,
                cancelButtonText: cancelBtnText,
                cancelButtonClass: "btn btn-default"
            });
        }
        else {
            swal.fire({
                title: title,
                text: msg,
                type: type,
                showCancelButton: isCancelBtn,
                confirmButtonText: confirmBtnText,
                cancelButtonText: cancelBtnText,
                reverseButtons: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function (result) {
                if (result.value) {
                    dismissFunction(args);
                    //swal.fire(
                    //    dismissTitle,
                    //    dismissMessage,
                    //    dismissType
                    //);
                } else {
                    if (targetButton)
                        KTApp.unprogress(targetButton);
                }
            });
        }
    },
    SwallWithHml: function (type, msg, title, confirmBtnText, html) {
        swal.fire({
            title: title,
            text: msg,
            type: type,
            buttonsStyling: false,
            confirmButtonText: confirmBtnText,
            confirmButtonClass: "btn btn-danger",
            allowEscapeKey: false,
            allowOutsideClick: false,
            cancelButtonText: "Kapat",
            html: html,
            cancelButtonClass: "btn btn-default"
        });
    },
}

Util.Ajax = {
    Navigate: function (url, method, data, contentholder) {
        var returnData = null;
        $('.mcx-loader').fadeIn("slow");
        $("#responsive-kamuModal").modal({
            keyboard: false,
            show: true,
            backdrop: 'static'
        });
        $(contentholder).empty();
        $.ajax({
            type: method,
            url: url,
            cache: false,
            data: data,
            success: function (response) {
                if (contentholder != null && contentholder != '') {
                    $(contentholder).html(response);
                    $('.mcx-loader').fadeOut("slow");
                }
                returnData = response;
            },
            async: true
        });

        return returnData;
    },
    Navigation: function (controller, url, data, contentholder) {
        $.ajax({
            type: "POST",
            url: "/" + controller + "/" + url,
            data: data,
            async: false,
            success: function (response) {
                $(contentholder).empty();

                if (contentholder != null && contentholder != '') {
                    $(contentholder).html(response);
                    $(contentholder).modal('show');
                    $('.mcx-loader').fadeOut("slow");
                }
            },
            error: function (result) {
            }
        });
    },
    Response: function (controller, url, data) {
        var responseData;
        $.ajax({
            type: "POST",
            url: "/" + controller + "/" + url,
            data: data,
            dataType: "json",
            async: false,
            contentType: false,
            processData: false,
            success: function (result) {
                responseData = result;
            }
        });

        return responseData;
    },
    Generic: function (controller, url, callback, data, async, type) {
        if (type == null)
            type = "POST";
        $.ajax({
            type: type,
            url: "/" + controller + "/" + url,
            data: data,
            async: async,
            contentType: false,
            processData: false,
            success: function (result) {
                //if (Object.prototype.toString.call(result) == '[object String]') {
                //    if (result.indexOf("Login/Login.js") > 0) {
                //        window.location.assign("Login/Login");
                //        return;
                //    }
                //}
                if (callback) {
                    callback(result);
                }
            }
        });
    },
    Request2: function (controller, method, data, callback, onEnd, block) {
        $.ajax({
            type: "POST",
            url: "/" + controller + "/" + method,
            cache: false,
            data: "Json=" + data,
            success: function (response) {
                try {
                    response = JSON.parse(response);
                } catch (e) { /*console.log(e);*/
                }

                if (callback) {
                    callback(response);
                }

                if (onEnd) {
                    eval(onEnd);
                }
            },
            error: function (response) {
                if (callback) {
                    response.RestNotification = {};
                    response.RestNotification.NotificationMessage = "Beklenmedik Bir Hata Oluştu!";
                    callback(response);
                }

                if (onEnd) {
                    eval(onEnd);
                }
            },
            async: true,
            beforeSend: function () {
                if (block) {
                    Util.BlockUI.Block("İşlem Yapılıyor...");
                }
            },
            complete: function () {
                if (block) {
                    Util.BlockUI.UnBlock();
                }
            }
        });
    },
    Request: function (method, data, callback) {
        method = "Method=" + method;
        if (data && data != "") {
            data = method + "&" + data;
        } else {
            data = method;
        }
        $.ajax({
            type: "POST",
            url: "/Data/DataManager",
            cache: false,
            data: data,
            success: function (response) {
                response = JSON.parse(response);

                if (callback) {
                    callback(response);
                }
            },
            async: true
        });
    },
    RequestSync: function (method, data, callback) {
        method = "Method=" + method;
        if (data && data != "") {
            data = method + "&" + data;
        } else {
            data = method;
        }
        $.ajax({
            type: "POST",
            url: "/Data/DataManager",
            cache: false,
            data: data,
            success: function (response) {
                response = JSON.parse(response);

                if (callback) {
                    callback(response);
                }
            },
            async: false
        });
    },
    SelectorData: function (method, data, contentHolder, selectorName, defaultText, multiple, callBackAfterChange, selectorSelectedValue, addOption) {

        if (!callBackAfterChange) {
            callBackAfterChange = "";
        };

        if (!selectorSelectedValue) {
            selectorSelectedValue = 0;
        };

        $.ajax({
            type: "POST",
            url: "/Data/" + method,
            cache: false,
            data: data,
            dataType: "json",
            async: true,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = response.response.ResultObject;

                var selectorDiv = document.getElementById(selectorName);

                if (addOption && selectorDiv) {

                    for (var i = 0; i < data.length; i++) {
                        var value = "";

                        if (data[i].Value != "00000000-0000-0000-0000-000000000000")
                            value = data[i].Value;

                        else if (data[i].ValueString != null)
                            value = data[i].ValueString;

                        else if (data[i].ValueInt != null)
                            value = data[i].ValueInt;

                        var option = document.createElement("option");
                        option.text = data[i].Text;
                        option.value = value;

                        if (selectorSelectedValue == value) {
                            option.selected = "true";
                        }

                        selectorDiv.add(option);
                    }
                }
                else {
                    if (callBackAfterChange) {
                        callBackAfterChange = "onchange=\"" + callBackAfterChange + ";\"";
                    }

                    if (multiple == true) {
                        multiple = "multiple=\"multiple\" style=\"overflow-y:auto\" class=\"select2\"";
                    } else {
                        multiple = " class=\"form-control\"";
                    }

                    var html = "<select " + callBackAfterChange + " " + multiple + "  id=\"" + selectorName + "\" name=\"" + selectorName + "\">";

                    var html;
                    if (defaultText) {
                        html += "<option value=\"0\" selected=\"selected\">" + defaultText + "</option>";
                    }
                    for (var i = 0; i < data.length; i++) {
                        var value = "";

                        if (data[i].Value != "00000000-0000-0000-0000-000000000000")
                            value = data[i].Value;

                        else if (data[i].ValueString != null)
                            value = data[i].ValueString;

                        else if (data[i].ValueInt != null)
                            value = data[i].ValueInt;

                        html += "<option value='" + value;

                        if (selectorSelectedValue !== 0) {

                            if (multiple) {
                                var selectedList = selectorSelectedValue.split(',');
                                for (var k = 0; k < selectedList.length; k++) {
                                    if (selectedList[k] === value)
                                        html += "' selected=\"selected\" ";
                                }
                                html += "'>" + data[i].Text + "</option>";
                            }
                            else {
                                if (selectorSelectedValue === value)
                                    html += "' selected=\"selected\">" + data[i].Text + "</option>";
                                else
                                    html += "'>" + data[i].Text + "</option>";
                            }
                        }
                        else {
                            html += "'>" + data[i].Text + "</option>";
                        }
                    }
                    html += "</select>";

                    $(contentHolder).html(html);

                    $("#" + selectorName).select2();
                }

            }
        });
    },

    Selector: function (controllerName, methodName, data, contentHolder, selectorName, defaultText, multiple, callBackAfterChange, selectorSelectedValue, async, disabled, className) {

        if (!callBackAfterChange) {
            callBackAfterChange = "";
        };

        if (!selectorSelectedValue) {
            selectorSelectedValue = 0;
        };
        if (async == null) {
            async = true;
        };
        if (disabled == null) {
            disabled = false;
        };
        if (!className) {
            className = "";
        }

        $.ajax({
            type: "POST",
            url: "/" + controllerName + "/" + methodName,
            cache: false,
            data: data,
            async: async,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                data = response.response;
                var mData;
                if (callBackAfterChange) {
                    callBackAfterChange = "onchange=\"" + callBackAfterChange + ";\"";
                }

                if (multiple == true) {
                    mData = "multiple=\"multiple\" style=\"overflow-y:auto\" class=\"select2 " + className + "\"";
                } else {
                    mData = "class=\"form-control " + className + "\"";
                }

                var html = "<select " + callBackAfterChange + " " + mData + "  id=\"" + selectorName + "\" name=\"" + selectorName + "\">";
                if (defaultText) {
                    html += "<option value=\"\" selected=\"selected\">" + defaultText + "</option>";
                }
                for (var i = 0; i < data.length; i++) {
                    var value = "";

                    if (data[i].Value != "00000000-0000-0000-0000-000000000000")
                        value = data[i].Value;

                    else if (data[i].ValueString != null)
                        value = data[i].ValueString;

                    else if (data[i].ValueInt != null)
                        value = data[i].ValueInt;

                    html += "<option value='" + value;

                    if (selectorSelectedValue === value)
                        html += "' selected=\"selected\">" + data[i].Text + "</option>";
                    else
                        html += "'>" + data[i].Text + "</option>";
                }
                html += "</select>";

                $(contentHolder).html(html);
                $("#" + selectorName).select2();
                if (disabled) {
                    $("#" + selectorName).prop('disabled', disabled);
                }
                if (multiple == true) {
                    $("#" + selectorName).val(selectorSelectedValue);
                }
                $("#" + selectorName).trigger('change');
            }
        });
    },

    SelectorIgnoreList: function (controllerName, methodName, data, contentHolder, selectorName, defaultText, multiple, callBackAfterChange, selectorSelectedValue, async, disabled, className, olmamasiGerekenEnumList) {

        if (!callBackAfterChange) {
            callBackAfterChange = "";
        };

        if (!selectorSelectedValue) {
            selectorSelectedValue = 0;
        };
        if (async == null) {
            async = true;
        };
        if (disabled == null) {
            disabled = false;
        };
        if (!className) {
            className = "";
        }

        $.ajax({
            type: "POST",
            url: "/" + controllerName + "/" + methodName,
            cache: false,
            data: data,
            async: async,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                data = response.response;
                var mData;
                if (callBackAfterChange) {
                    callBackAfterChange = "onchange=\"" + callBackAfterChange + ";\"";
                }

                if (multiple == true) {
                    mData = "multiple=\"multiple\" style=\"overflow-y:auto\" class=\"select2 " + className + "\"";
                } else {
                    mData = "class=\"form-control " + className + "\"";
                }

                var html = "<select " + callBackAfterChange + " " + mData + "  id=\"" + selectorName + "\" name=\"" + selectorName + "\">";
                if (defaultText) {
                    html += "<option value=\"\" selected=\"selected\">" + defaultText + "</option>";
                }
                for (var i = 0; i < data.length; i++) {
                    var value = "";

                    if (olmamasiGerekenEnumList.contains(data[i].Value) == false) {

                        if (data[i].Value != "00000000-0000-0000-0000-000000000000")
                            value = data[i].Value;

                        else if (data[i].ValueString != null)
                            value = data[i].ValueString;

                        else if (data[i].ValueInt != null)
                            value = data[i].ValueInt;

                        html += "<option value='" + value;

                        if (selectorSelectedValue === value)
                            html += "' selected=\"selected\">" + data[i].Text + "</option>";
                        else
                            html += "'>" + data[i].Text + "</option>";
                    }
                }
                html += "</select>";

                $(contentHolder).html(html);
                $("#" + selectorName).select2();
                if (disabled) {
                    $("#" + selectorName).prop('disabled', disabled);
                }
                if (multiple == true) {
                    $("#" + selectorName).val(selectorSelectedValue);
                }
                $("#" + selectorName).trigger('change');
            }
        });
    },
    SelectorValueText: function (method, data, contentHolder, selectorName, defaultText, multiple, callBackAfterChange, selectorSelectedValue) {
        method = "Method=" + method;

        if (!callBackAfterChange) {
            callBackAfterChange = "";
        };

        if (!selectorSelectedValue) {
            selectorSelectedValue = 0;
        };

        if (data && data != "") {
            data = method + "&" + data;
        } else {
            data = method;
        }

        $.ajax({
            type: "POST",
            url: "/Data/DataManager",
            cache: false,
            data: data,
            async: false,
            success: function (response) {
                data = JSON.parse(response).ResultObject;

                if (callBackAfterChange) {
                    callBackAfterChange = "onchange=\"" + callBackAfterChange + ";\"";
                }

                if (multiple == true) {
                    multiple = "multiple=\"multiple\" style=\"overflow-y:auto\" class=\"select2\"";
                } else {
                    multiple = "style=\"width: 100%; border: 1px solid #aaa; border-radius: 5px;\" class=\"select2 form-control\"";
                }

                var html = "<select " + callBackAfterChange + " " + multiple + "  id=\"" + selectorName + "\" name=\"" + selectorName + "\">";

                var html;
                if (defaultText) {
                    html += "<option value=\"0\" selected=\"selected\">" + defaultText + "</option>";
                }
                for (var i = 0; i < data.length; i++) {
                    var value = "";

                    if (data[i].Value != "00000000-0000-0000-0000-000000000000")
                        value = data[i].Value;

                    else if (data[i].ValueString != null)
                        value = data[i].ValueString;

                    else if (data[i].ValueInt != null)
                        value = data[i].ValueInt;

                    html += "<option value='" + value;

                    if (selectorSelectedValue.toString().toUpperCase() == data[i].Text.toString().toUpperCase())
                        html += "' selected=\"selected\">" + data[i].Text + "</option>"
                    else
                        html += "'>" + data[i].Text + "</option>"
                }
                html += "</select>";

                $(contentHolder).html(html);

                $("#" + selectorName).select2();
            }
        });
    },
    Upload: function (controller, url, callback, data, async) {
        if (async == null)
            async = false;

        $.ajax({
            type: 'POST',
            url: "/" + controller + "/" + url,
            data: data,
            async: async,
            processData: false,
            contentType: false,
            success: function (result) {

                if (callback) {
                    callback(result);
                }
            }
        });

    },

    Datatable: function (url, columns, select, selectFunction) {

        if (select === null || select === undefined || select === "") {
            select = false;
        }
        var table = $('.dataTable-util').DataTable({
            responsive: true,
            destroy: true,
            select: select,
            autoWidth: false,
            ajax: {
                url: url,
                type: 'POST',
                data: {
                    pagination: {
                        perpage: 50,
                    },
                },
            },

            columns: columns
        });
        if (select === true) {

            table.on('select', function (e, dt, type, indexes) {
                var rowData = table.rows(indexes).data().toArray();
                selectFunction(true, rowData[0].BasvuruDurum);
            })
                .on('deselect', function (e, dt, type, indexes) {
                    selectFunction(false);
                });
            table.select.info(false);
        }
    },
    DatatableWithId: function (url, columns, select, selectFunction, id, heightValue) {
        if (heightValue == null)
            heightValue = 140;
        if (select === null || select === undefined || select === "") {
            select = false;
        }
        var table = $('#' + id).DataTable({
            responsive: true,
            destroy: true,
            select: select,
            autoWidth: false,
            ajax: {
                url: url,
                type: 'POST',
                data: {
                    pagination: {
                        perpage: 50,
                    },
                },
            },
            "scrollY": heightValue + "px",
            //todo dile göre ingilizce yada türkçe olacak
            oLanguage: {
                "sInfo": "Toplam  _TOTAL_  değerin (_START_ - _END_) görüntüleniyor.",
                "sEmptyTable": "Veri yoktur",
                "sLengthMenu": " _MENU_ Gösterilecek Değer Sayısı",
                "sLoadingRecords": "Yükleniyor - Lütfen Bekleyin...",
                "sInfoEmpty": "0 Kayıt Gösteriliyor",
                "sZeroRecords": "Kayıt Bulunamadı",
                "sInfoFiltered": "(Toplam _MAX_ kayıttan filtrelendi)",
                "sSearch": "Ara",
                oPaginate: {
                    "sPrevious": 'Geri',
                    "sNext": "İleri"
                },
            },
            language: {

            },
            columns: columns
        });
        if (select === true) {

            table.on('select', function (e, dt, type, indexes) {
                var rowData = table.rows(indexes).data().toArray();
                selectFunction(true, rowData[0].BasvuruDurum);
            })
                .on('deselect', function (e, dt, type, indexes) {
                    selectFunction(false);
                });
            table.select.info(false);
        }
    },
    DatatableWithExportButtons: function (url, columns, select, selectFunction) {

        if (select === null || select === undefined || select === "") {
            select = false;
        }
        var table = $('.dataTable-util').DataTable({
            responsive: true,
            "pageLength": 20,
            destroy: true,
            select: select,
            autoWidth: false,
            ajax: {
                url: url,
                type: 'POST',
                data: {
                    pagination: {
                        perpage: 50,
                    },
                },
            },
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            //todo dile göre ingilizce yada türkçe olacak
            oLanguage: {
                "sInfo": "Toplam  _TOTAL_  değerin (_START_ - _END_) görüntüleniyor.",
                "sEmptyTable": "Veri yoktur",
                "sLengthMenu": " _MENU_ Gösterilecek Değer Sayısı",
                "sLoadingRecords": "Yükleniyor - Lütfen Bekleyin...",
                "sInfoEmpty": "0 Kayıt Gösteriliyor",
                "sZeroRecords": "Kayıt Bulunamadı",
                "sInfoFiltered": "(Toplam _MAX_ kayıttan filtrelendi)",
                "sSearch": "Ara",
                oPaginate: {
                    "sPrevious": 'Geri',
                    "sNext": "İleri"
                },
            },
            language: {

            },
            columns: columns
        });
        if (select === true) {

            table.on('select', function (e, dt, type, indexes) {
                var rowData = table.rows(indexes).data().toArray();
                selectFunction(true, rowData[0].BasvuruDurum);
            })
                .on('deselect', function (e, dt, type, indexes) {
                    selectFunction(false);
                });
            table.select.info(false);
        }
    },
    DatatableWithFilter: function (url, columns/*, pagesize, pagination, filtering, sorting*/, select, selectFunction, initComplete) {
        $.fn.dataTable.Api.register('column().title()', function () {
            return $(this.header()).text().trim();
        });
        if (select === null || select === undefined || select === "") {
            select = false;
        }
        var table = $('.dataTable-util').DataTable({
            responsive: true,
            destroy: true,
            select: select,
            autoWidth: false,
            ajax: {
                url: url,
                type: 'POST',
                data: {
                    pagination: {
                        perpage: 50,
                    },
                },
            },
            //todo dile göre ingilizce yada türkçe olacak
            oLanguage: {
                "sInfo": "Toplam  _TOTAL_  değerin (_START_ - _END_) görüntüleniyor.",
                "sEmptyTable": "Veri yoktur",
                "sLengthMenu": " _MENU_ Gösterilecek Değer Sayısı",
                "sLoadingRecords": "Yükleniyor - Lütfen Bekleyin...",
                "sInfoEmpty": "0 Kayıt Gösteriliyor",
                "sZeroRecords": "Kayıt Bulunamadı",
                "sInfoFiltered": "(Toplam _MAX_ kayıttan filtrelendi)",
                "sSearch": "Ara",
                oPaginate: {
                    "sPrevious": 'Geri',
                    "sNext": "İleri"
                }
            },
            language: {
            },
            columns: columns,
            initComplete: function () {
                this.api().columns().every(function () {
                    var column = this;

                    switch (column.title()) {
                        case 'İl':
                            column.data().unique().sort().each(function (d, j) {
                                $('.kt-input[data-col-index="3"]').append('<option value="' + d + '">' + d + '</option>');
                            });
                            break;
                        case 'İlçe':
                            column.data().unique().sort().each(function (d, j) {
                                $('.kt-input[data-col-index="4"]').append('<option value="' + d + '">' + d + '</option>');
                            });
                            break;
                        case 'Başvuru Durumu':
                            var status = {
                                0: { title: 'Başvuru', 'class': 'kt-badge--brand' },
                                1: { title: 'Onay', 'class': 'kt-badge--brand' },
                                2: { title: 'Revize', 'class': ' kt-badge--danger' },
                                3: { title: 'Ret', 'class': ' kt-badge--primary' },
                                4: { title: 'Nitelik Bilgileri', 'class': ' kt-badge--success' },
                                5: { title: 'Bakanlık Alt Komisyon Görüşü', 'class': ' kt-badge--info' },
                                6: { title: 'Diğer Belgeler', 'class': ' kt-badge--danger' },
                                7: { title: 'Yer Seçim Komisyon Dökümanı', 'class': ' kt-badge--warning' },
                                8: { title: 'Kurum Görüşü', 'class': ' kt-badge--success' },
                                9: { title: 'Ara Talimat', 'class': ' kt-badge--info' },
                                10: { title: 'Ara Talimat OSB', 'class': ' kt-badge--danger' },
                                11: { title: 'Kesin Talimat Sayfası', 'class': ' kt-badge--warning' },
                                24: { title: 'Başvuru', 'class': 'kt-badge--brand' },
                                25: { title: 'Onay', 'class': 'kt-badge--brand' },
                                26: { title: 'Revize', 'class': ' kt-badge--danger' },
                                27: { title: 'Red', 'class': ' kt-badge--primary' }
                            };
                            column.data().unique().sort().each(function (d, j) {
                                $('.kt-input[data-col-index="7"]').append('<option value="' + status[d].title + '">' + status[d].title + '</option>');
                            });
                            break;
                    }
                });
            },
        });
        var filter = function () {
            var val = $.fn.dataTable.util.escapeRegex($(this).val());
            table.column($(this).data('col-index')).search(val ? val : '', false, false).draw();
        };

        var asdasd = function (value, index) {
            var val = $.fn.dataTable.util.escapeRegex(value);
            table.column(index).search(val ? val : '', false, true);
        };

        $('#kt_search').on('click', function (e) {
            e.preventDefault();
            var params = {};
            $('.kt-input').each(function () {
                var i = $(this).data('col-index');
                if (params[i]) {
                    params[i] += '|' + $(this).val();
                }
                else {
                    params[i] = $(this).val();
                }
            });
            $.each(params, function (i, val) {
                // apply search params to datatable
                table.column(i).search(val ? val : '', false, false);
            });
            table.table().draw();
        });

        $('#kt_reset').on('click', function (e) {
            e.preventDefault();
            $('.kt-input').each(function () {
                $(this).val('');
                table.column($(this).data('col-index')).search('', false, false);
            });
            table.table().draw();
        });

        if (select === true) {

            table.on('select', function (e, dt, type, indexes) {
                var rowData = table.rows(indexes).data().toArray();
                selectFunction(true, rowData[0].BasvuruDurum);
            })
                .on('deselect', function (e, dt, type, indexes) {
                    selectFunction(false);
                });
            table.select.info(false);
        }
    },
    DatatableFixed: function (url, columns, select, selectFunction, heightValue) {
        if (heightValue == null)
            heightValue = 140;
        if (select === null || select === undefined || select === "") {
            select = false;
        }

        var table = $('.dataTable-util').DataTable({
            responsive: true,
            destroy: true,
            select: select,
            autoWidth: false,
            ajax: {
                url: url,
                type: 'POST',
                data: {
                    pagination: {
                        perpage: 50,
                    },
                },
            },
            "scrollY": heightValue + "px",
            //todo dile göre ingilizce yada türkçe olacak
            oLanguage: {
                "sInfo": "Toplam  _TOTAL_  değerin (_START_ - _END_) görüntüleniyor.",
                "sEmptyTable": "Veri yoktur",
                "sLengthMenu": " _MENU_ Gösterilecek Değer Sayısı",
                "sLoadingRecords": "Yükleniyor - Lütfen Bekleyin...",
                "sInfoEmpty": "0 Kayıt Gösteriliyor",
                "sZeroRecords": "Kayıt Bulunamadı",
                "sInfoFiltered": "(Toplam _MAX_ kayıttan filtrelendi)",
                "sSearch": "Ara",
                oPaginate: {
                    "sPrevious": 'Geri',
                    "sNext": "İleri"
                },
            },
            language: {

            },
            columns: columns
        });
        if (select === true) {

            table.on('select', function (e, dt, type, indexes) {
                var rowData = table.rows(indexes).data().toArray();
                selectFunction(true, rowData[0].BasvuruDurum);
            })
                .on('deselect', function (e, dt, type, indexes) {
                    selectFunction(false);
                });
            table.select.info(false);
        }
    },
    DatatableFixedNew: function (url, columns, select, selectFunction, heightValue) {
        if (heightValue == null)
            heightValue = 140;
        if (select === null || select === undefined || select === "") {
            select = false;
        }
        var table = $('#datatableTableMapT').DataTable({
            responsive: true,
            destroy: true,
            select: select,
            autoWidth: false,
            lengthMenu: [
                [-1],
                ['Tümü']
            ],
            ajax: {
                url: url,
                type: 'POST',
                data: {
                    pagination: {
                        perpage: 50,
                    },
                },
            },
            "scrollY": heightValue + "px",
            //todo dile göre ingilizce yada türkçe olacak
            oLanguage: {
                "sInfo": "Toplam  _TOTAL_  değerin (_START_ - _END_) görüntüleniyor.",
                "sEmptyTable": "Veri yoktur",
                "sLengthMenu": " _MENU_ Ekrandaki Taşınmazlar",
                "sLoadingRecords": "Yükleniyor - Lütfen Bekleyin...",
                "sInfoEmpty": "0 Kayıt Gösteriliyor",
                "sZeroRecords": "Kayıt Bulunamadı",
                "sInfoFiltered": "(Toplam _MAX_ kayıttan filtrelendi)",
                "sSearch": "Ara",
                oPaginate: {
                    "sPrevious": 'Geri',
                    "sNext": "İleri"
                },
            },
            language: {

            },
            columns: columns
        });
        if (select === true) {

            table.on('select', function (e, dt, type, indexes) {
                var rowData = table.rows(indexes).data().toArray();
                selectFunction(true, rowData[0].BasvuruDurum);
            })
                .on('deselect', function (e, dt, type, indexes) {
                    selectFunction(false);
                });
            table.select.info(false);
        }
    },

};

Util.URL = {
    Open: function (url) {
        window.open(url, "_blank");
    },
    Redirect: function (url) {
        window.location.assign(url);
    },
    QueryString: function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
};

Util.Menu = {
    Navigate: function (PageControllerName, PageViewName, data, contentHolder) {
        Util.Ajax.Navigate("/" + PageControllerName + "/" + PageViewName, "POST", data, contentHolder);
    }
};

Util.Modal = {
    OpenModal: function (Url, Size, Percent) {
        $("#responsive-modal").modal({
            keyboard: false,
            show: true,
            backdrop: 'static'
        });
        $("#botasModalContent").css("display", "none");
        $("#botasModalContent").empty();
        $("#botasLargeModalContent").css("display", "none");
        $("#botasLargeModalContent").empty();
        $("#botasSmallModalContent").css("display", "none");
        $("#botasSmallModalContent").empty();
        $("#botasXLargeModalContent").css("display", "none");
        $("#botasXLargeModalContent").empty();
        var contentId;
        $.get(Url, function (data) {
            if (Size === "" || Size === null || Size === SizeForModal.MEDIUM) contentId = "#botasModalContent";
            else if (Size === SizeForModal.LARGE) contentId = "#botasLargeModalContent";
            else if (Size === SizeForModal.SMALL) contentId = "#botasSmallModalContent";
            else if (Size === SizeForModal.XLARGE) contentId = "#botasXLargeModalContent";

            $(contentId).html(data);
            $(contentId).css("display", "block");
        })

        // $.ajax({
        // type: "GET",
        // url: Url,
        // dataType: "json",
        // success: function(data) {
        // if (Size === "" || Size === null || Size === SizeForModal.MEDIUM) contentId = "#botasModalContent";
        // else if (Size === SizeForModal.LARGE) contentId = "#botasLargeModalContent";
        // else if (Size === SizeForModal.SMALL) contentId = "#botasSmallModalContent";
        // else if (Size === SizeForModal.XLARGE) contentId = "#botasXLargeModalContent";

        // $(contentId).html(data);
        // $(contentId).css("display", "block");
        // },
        // error: function(xhr, status, error){
        // window.location.assign("Login/Login");
        // return;
        // }
        // });
    }
}
Util.Elements = {
    Dropzone: function (contentHolder, maxFiles, maxFilesize, addRemoveLinks, acceptedFiles, acceptCallback) {
        if (!addRemoveLinks) {
            addRemoveLinks = true;
        }
        if (!maxFiles) {
            maxFiles = 1;
        }
        if (!maxFilesize) {
            maxFilesize = 50;
        }
        var acceptFlag = false;

        $('#' + contentHolder).dropzone({
            url: "https://keenthemes.com/scripts/void.php",
            paramName: "file",
            maxFiles: maxFiles,
            uploadMultiple: false,
            maxFilesize: maxFilesize,
            addRemoveLinks: addRemoveLinks,
            acceptedFiles: acceptedFiles,
            init: function () {
                $('.dz-progress').css('display', 'none');
                this.on("addedfile", function () {
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                });
                this.on("complete", function () {
                    var rejected_files = this.getRejectedFiles();
                    var myDropzone = this;
                    rejected_files.forEach(function (element) {
                        myDropzone.removeFile(element);
                        if (bytesToSize(element.size) > maxFilesize)
                            Util.Notification.Toastr("error", "Dosya boyutu sınırı aşıldı! En fazla 50MB'lık dosya yükleyebilirsiniz", "Hata");
                        else
                            Util.Notification.Toastr("error", "Sadece aşağıda belirtilen uzantılı dosyalar yüklenebilir.", "Hata");
                    });
                });
            },
            accept: function (file, done) {
                if (acceptCallback) {
                    acceptCallback(file);
                }
            },
        });
    },
    DropzoneFromName: function (contentHolder, maxFiles, maxFilesize, addRemoveLinks, acceptedFiles, acceptCallback) {
        if (!addRemoveLinks) {
            addRemoveLinks = true;
        }
        if (!maxFiles) {
            maxFiles = 1;
        }
        if (!maxFilesize) {
            maxFilesize = 50;
        }
        var acceptFlag = false;

        $('[name="' + contentHolder + '"]').dropzone({
            url: "https://keenthemes.com/scripts/void.php",
            paramName: "file",
            maxFiles: maxFiles,
            uploadMultiple: false,
            maxFilesize: maxFilesize,
            addRemoveLinks: addRemoveLinks,
            acceptedFiles: acceptedFiles,
            init: function () {
                $('.dz-progress').css('display', 'none');
                this.on("addedfile", function () {
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                });
                this.on("complete", function () {
                    var rejected_files = this.getRejectedFiles();
                    var myDropzone = this;
                    rejected_files.forEach(function (element) {
                        myDropzone.removeFile(element);
                        myDropzone.removeFile(element);
                        if (bytesToSize(element.size) > maxFilesize)
                            Util.Notification.Toastr("error", "Dosya boyutu sınırı aşıldı!", "Hata");
                        else
                            Util.Notification.Toastr("error", "Sadece aşağıda belirtilen uzantılı dosyalar yüklenebilir.", "Hata");
                    });
                });
            },
            accept: function (file, done) {
                if (acceptCallback) {
                    acceptCallback(file);
                }
            },
        });
    },
    DropzoneFile: function (contentHolder, maxFiles, maxFilesize, addRemoveLinks, acceptedFiles, acceptCallback) {
        if (addRemoveLinks) {
            addRemoveLinks = true;
        }
        if (!maxFiles) {
            maxFiles = 1;
        }
        if (!maxFilesize) {
            maxFilesize = 50;
        }

        var id = '#' + contentHolder;


        $('#' + contentHolder).dropzone({
            url: "",
            paramName: "file",
            maxFiles: maxFiles,
            uploadMultiple: false,
            maxFilesize: maxFilesize,
            addRemoveLinks: addRemoveLinks,
            acceptedFiles: acceptedFiles,
            init: function () {
                $('.dz-progress').css('display', 'none');
                this.on("addedfile", function () {
                    var rejected_files = this.getRejectedFiles();
                    var myDropzone = this;
                    rejected_files.forEach(function (element) {
                        myDropzone.removeFile(element);
                        myDropzone.removeFile(element);
                        if (bytesToSize(element.size) > maxFilesize)
                            Util.Notification.Toastr("error", "Dosya boyutu sınırı aşıldı!", "Hata");
                        else
                            Util.Notification.Toastr("error", "Sadece aşağıda belirtilen uzantılı dosyalar yüklenebilir.", "Hata");
                    });
                });
            },
            accept: function (file, done) {
                if (acceptCallback) {
                    acceptCallback(file);
                }
            }
        });
    },
    MultiDropzone: function (contentHolder, maxFiles, maxFilesize, addRemoveLinks, acceptedFiles, acceptCallback) {
        if (!addRemoveLinks) {
            addRemoveLinks = true;
        }
        if (!maxFiles) {
            maxFiles = 1;
        }
        if (!maxFilesize) {
            maxFilesize = 50;
        }

        $('#' + contentHolder).dropzone({
            url: "https://keenthemes.com/scripts/void.php",
            paramName: "file",
            maxFiles: maxFiles,
            uploadMultiple: true,
            maxFilesize: maxFilesize,
            addRemoveLinks: addRemoveLinks,
            acceptedFiles: acceptedFiles,
            init: function () {
                $('.dz-progress').css('display', 'none');
                this.on("complete", function () {
                    var rejected_files = this.getRejectedFiles();
                    var myDropzone = this;
                    rejected_files.forEach(function (element) {
                        myDropzone.removeFile(element);
                        myDropzone.removeFile(element);
                        if (bytesToSize(element.size) > maxFilesize)
                            Util.Notification.Toastr("error", "Dosya boyutu sınırı aşıldı!", "Hata");
                        else
                            Util.Notification.Toastr("error", "Sadece aşağıda belirtilen uzantılı dosyalar yüklenebilir.", "Hata");
                    });
                });
            },
            accept: function (file, done) {
                if (acceptCallback) {
                    acceptCallback(file);
                }
            }
        });
    },
    InitDropzone: function () {
        $('.dropzone').each(function () {
            var multi = this.getAttribute("data-multi");
            var extension = this.getAttribute("data-extension");
            if (multi === "true") {
                Util.Elements.MultiDropzone(this.id, 10, null, true, extension);
            } else {
                Util.Elements.Dropzone(this.id, 1, null, true, extension);
            }
        });
    },
    /**
    * Toggle button spinner methods
    * @public
    * @param {element} btn button query element 
    */
    toggleBtnSpinner: function (btn) {
        if (btn.hasClass("kt-spinner"))
            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
        else
            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
    }
}
Util.Variable = {
    IsNotNull: function (variable) {
        if (variable === undefined || variable === null || variable === "") {
            return false;
        } else {
            return true;
        }
    },
    IsGuidEmpty: function (variable) {
        return variable == '00000000-0000-0000-0000-000000000000';
    }
}

Util.Datatable = {

    CheckBoxControl: function () {

        Util.selectedCheckBox = "";

        var gidList = [];
        var control = 0;

        for (var i = 0; i < $(".customCheckBox").length; i++) {
            if ($(".customCheckBox")[i].checked) {

                if (i == 0)
                    Util.selectedCheckBox = "'" + document.getElementsByClassName("customCheckBox")[i].getAttribute("data-id") + "'";
                else
                    Util.selectedCheckBox = Util.selectedCheckBox + ",'" + document.getElementsByClassName("customCheckBox")[i].getAttribute("data-id") + "'";

                gidList.push(document.getElementsByClassName("customCheckBox")[i].getAttribute("data-id"));
                control++;
            }
        }

        if (control > 0) {
            $("#kt_datatable_selected_number").text(control);
            $("#kt_datatable_group_action_form").show();
        } else {
            $("#kt_datatable_group_action_form").hide();
        }
    },

    CheckBoxCheckAll: function () {
        if ($(".customCheckBox")[0].checked) {
            $(".customCheckBox").prop("checked", false);
            $(".customMainCheckBox").prop("checked", false);
        }
        else {
            $(".customCheckBox").prop("checked", true);
            $(".customMainCheckBox").prop("checked", true);
        }
    },

    DeleteSelectedItems: function () {
        var stringValues = "";

        for (var i = 0; i < $(".customCheckBox").length; i++) {
            if ($(".customCheckBox")[i].checked) {
                if (i == 0)
                    stringValues = "'" + document.getElementsByClassName("customCheckBox")[i].getAttribute("data-id") + "'";
                else
                    stringValues = stringValues + ",'" + document.getElementsByClassName("customCheckBox")[i].getAttribute("data-id") + "'";
            }
        }

        var formData = new FormData();
        formData.append("selectedValues", stringValues);
        Util.Ajax.Generic("TasinmazParseller", "ParselDelete", Util.Datatable.CallBackParselDelete, formData, false);
    },

    CallBackParselDelete: function (response) {
        if (response.data == true) {
            Util.Notification.Swall("success", "Seçimler Silindi.", "Başarılı", "Tamam", false);

            location.reload();
        }
    },

    EditSelectedItems: function () {

    },
};

// Define the collection class.
// I add the given item to the collection. If the given item
// is an array, then each item within the array is added
// individually.
function DefaultEqualityComparer(a, b) {
    return a === b || a.valueOf() === b.valueOf();
};

function DefaultSortComparer(a, b) {
    if (a === b) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a == "string") return a.toString().localeCompare(b.toString());
    return a.valueOf() - b.valueOf();
};

function DefaultPredicate() {
    return true;
};

function DefaultSelector(t) {
    return t;
};
window.Collection = (function () {


    // I am the constructor function.
    function Collection(arr) {

        // When creating the collection, we are going to work off
        // the core array. In order to maintain all of the native
        // array features, we need to build off a native array.
        var collection = Object.create(Array.prototype);

        // Initialize the array. This line is more complicated than
        // it needs to be, but I'm trying to keep the approach
        // generic for learning purposes.

        collection = (Array.apply(collection, arguments) || collection);

        // Add all the class methods to the collection.
        Collection.injectClassMethods(collection);

        // Return the new collection object.
        return (collection);

    }


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Define the static methods.
    Collection.injectClassMethods = function (collection) {

        // Loop over all the prototype methods and add them
        // to the new collection.
        for (var method in Collection.prototype) {

            // Make sure this is a local method.
            if (Collection.prototype.hasOwnProperty(method)) {

                // Add the method to the collection.
                collection[method] = Collection.prototype[method];

            }

        }

        // Return the updated collection.
        return (collection);

    };


    // I create a new collection from the given array.
    Collection.fromArray = function (array) {

        // Create a new collection.
        var collection = Collection.apply(null, array);

        // Return the new collection.
        return (collection);

    };


    // I determine if the given object is an array.
    Collection.isArray = function (value) {

        // Get it's stringified version.
        var stringValue = Object.prototype.toString.call(value);

        // Check to see if the string represtnation denotes array.
        return (stringValue.toLowerCase() === "[object array]");

    };


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Define the class methods.
    Collection.prototype = {
        add: function (value) {

            // Check to see if the item is an array.
            if (Collection.isArray(value)) {

                // Add each item in the array.
                for (var i = 0; i < value.length; i++) {

                    // Add the sub-item using default push() method.
                    Array.prototype.push.call(this, value[i]);

                }

            } else {

                // Use the default push() method.
                Array.prototype.push.call(this, value);

            }

            // Return this object reference for method chaining.
            return (this);

        },


        // I add all the given items to the collection.
        addAll: function () {

            // Loop over all the arguments to add them to the
            // collection individually.
            for (var i = 0; i < arguments.length; i++) {

                // Add the given value.
                this.add(arguments[i]);

            }

            // Return this object reference for method chaining.
            return (this);

        },

        select: function (selector, context) {
            context = context || window;
            var arr = Collection();
            var l = this.length;
            for (var i = 0; i < l; i++)
                arr.add(selector.call(context, this[i], i, this));
            return arr;
        },

        selectMany: function (selector, resSelector) {
            resSelector = resSelector || function (i, res) { return res; };
            return this.aggregate(function (a, b) {
                return a.concat(selector(b).select(function (res) { return resSelector(b, res) }));
            }, Collection());
        },
        take: function (c) {
            return this.slice(0, c);
        },

        skip: Array.prototype.slice,

        first: function (predicate, def) {
            var l = this.length;
            if (!predicate) return l ? this[0] : def == null ? null : def;
            for (var i = 0; i < l; i++)
                if (predicate(this[i], i, this))
                    return this[i];

            return def == null ? null : def;
        },

        last: function (predicate, def) {
            var l = this.length;
            if (!predicate) return l ? this[l - 1] : def == null ? null : def;
            while (l-- > 0)
                if (predicate(this[l], l, this))
                    return this[l];

            return def == null ? null : def;
        },

        union: function (arr) {
            return this.concat(arr).distinct();
        },

        intersect: function (arr, comparer) {
            comparer = comparer || DefaultEqualityComparer;
            return this.distinct(comparer).where(function (t) {
                return arr.contains(t, comparer);
            });
        },

        except: function (arr, comparer) {
            if (!(arr instanceof Array)) arr = [arr];
            comparer = comparer || DefaultEqualityComparer;
            var l = this.length;
            var res = Collection();
            for (var i = 0; i < l; i++) {
                var k = arr.length;
                var t = false;
                while (k-- > 0) {
                    if (comparer(this[i], arr[k]) === true) {
                        t = true;
                        break;
                    }
                }
                if (!t) res.push(this[i]);
            }
            return res;
        },

        distinct: function (comparer) {
            var arr = Collection();
            var l = this.length;
            for (var i = 0; i < l; i++) {
                if (!arr.contains(this[i], comparer))
                    arr.push(this[i]);
            }
            return arr;
        },

        zip: function (arr, selector) {
            return this
                .take(Math.min(this.length, arr.length))
                .select(function (t, i) {
                    return selector(t, arr[i]);
                });
        },

        indexOf: Array.prototype.indexOf || function (o, index) {
            var l = this.length;
            for (var i = Math.max(Math.min(index, l), 0) || 0; i < l; i++)
                if (this[i] === o) return i;
            return -1;
        },

        lastIndexOf: Array.prototype.lastIndexOf || function (o, index) {
            var l = Math.max(Math.min(index || this.length, this.length), 0);
            while (l-- > 0)
                if (this[l] === o) return l;
            return -1;
        },

        remove: function (item) {
            var i = this.indexOf(item);
            if (i != -1)
                this.splice(i, 1);
        },

        removeAll: function (predicate) {
            var item;
            var i = 0;
            while ((item = this.first(predicate)) != null) {
                i++;
                this.remove(item);
            }

            return i;
        },

        orderBy: function (selector, comparer) {
            comparer = comparer || DefaultSortComparer;
            var arr = Collection.injectClassMethods(this.slice(0));
            var fn = function (a, b) {
                return comparer(selector(a), selector(b));
            };

            arr.thenBy = function (selector, comparer) {
                comparer = comparer || DefaultSortComparer;
                return arr.orderBy(DefaultSelector, function (a, b) {
                    var res = fn(a, b);
                    return res === 0 ? comparer(selector(a), selector(b)) : res;
                });
            };

            arr.thenByDescending = function (selector, comparer) {
                comparer = comparer || DefaultSortComparer;
                return arr.orderBy(DefaultSelector, function (a, b) {
                    var res = fn(a, b);
                    return res === 0 ? -comparer(selector(a), selector(b)) : res;
                });
            };

            return arr.sort(fn);
        },

        orderByDescending: function (selector, comparer) {
            comparer = comparer || DefaultSortComparer;
            return this.orderBy(selector, function (a, b) { return -comparer(a, b) });
        },

        innerJoin: function (arr, outer, inner, result, comparer) {
            comparer = comparer || DefaultEqualityComparer;
            var res = Collection();

            this.forEach(function (t) {
                arr.where(function (u) {
                    return comparer(outer(t), inner(u));
                })
                    .forEach(function (u) {
                        res.push(result(t, u));
                    });
            });

            return res;
        },

        groupJoin: function (arr, outer, inner, result, comparer) {
            comparer = comparer || DefaultEqualityComparer;
            return this
                .select(function (t) {
                    var key = outer(t);
                    return {
                        outer: t,
                        inner: arr.where(function (u) { return comparer(key, inner(u)); }),
                        key: key
                    };
                })
                .select(function (t) {
                    t.inner.key = t.key;
                    return result(t.outer, t.inner);
                });
        },

        groupBy: function (selector, comparer) {
            var grp = Collection();
            var l = this.length;
            comparer = comparer || DefaultEqualityComparer;
            selector = selector || DefaultSelector;

            for (var i = 0; i < l; i++) {
                var k = selector(this[i]);
                var g = grp.first(function (u) { return comparer(u.key, k); });

                if (!g) {
                    g = Collection();
                    g.key = k;
                    grp.push(g);
                }

                g.push(this[i]);
            }
            return grp;
        },

        toDictionary: function (keySelector, valueSelector) {
            var o = {};
            var l = this.length;
            while (l-- > 0) {
                var key = keySelector(this[l]);
                if (key == null || key == "") continue;
                o[key] = valueSelector(this[l]);
            }
            return o;
        },


        // Aggregates

        aggregate: Array.prototype.reduce || function (func, seed) {
            var arr = this.slice(0);
            var l = this.length;
            if (seed == null) seed = arr.shift();

            for (var i = 0; i < l; i++)
                seed = func(seed, arr[i], i, this);

            return seed;
        },

        min: function (s) {
            s = s || DefaultSelector;
            var l = this.length;
            var min = s(this[0]);
            while (l-- > 0)
                if (s(this[l]) < min) min = s(this[l]);
            return min;
        },

        max: function (s) {
            s = s || DefaultSelector;
            var l = this.length;
            var max = s(this[0]);
            while (l-- > 0)
                if (s(this[l]) > max) max = s(this[l]);
            return max;
        },

        sum: function (s) {
            s = s || DefaultSelector;
            var l = this.length;
            var sum = 0;
            while (l-- > 0) sum += s(this[l]);
            return sum;
        },

        // Predicates

        where: function (predicate, context) {
            context = context || window;
            var arr = Collection();
            var l = this.length;
            for (var i = 0; i < l; i++)
                if (predicate.call(context, this[i], i, this) === true) arr.add(this[i]);
            return arr;
        },

        any: function (predicate, context) {
            context = context || window;
            var f = this.some || function (p, c) {
                var l = this.length;
                if (!p) return l > 0;
                while (l-- > 0)
                    if (p.call(c, this[l], l, this) === true) return true;
                return false;
            };
            return f.apply(this, [predicate, context]);
        },

        all: function (predicate, context) {
            context = context || window;
            predicate = predicate || DefaultPredicate;
            var f = this.every || function (p, c) {
                return this.length == this.where(p, c).length;
            };
            return f.apply(this, [predicate, context]);
        },

        takeWhile: function (predicate) {
            predicate = predicate || DefaultPredicate;
            var l = this.length;
            var arr = Collection();
            for (var i = 0; i < l && predicate(this[i], i) === true; i++)
                arr.push(this[i]);

            return arr;
        },

        skipWhile: function (predicate) {
            predicate = predicate || DefaultPredicate;
            var l = this.length;
            var i = 0;
            for (i = 0; i < l; i++)
                if (predicate(this[i], i) === false) break;

            return this.skip(i);
        },

        contains: function (o, comparer) {
            comparer = comparer || DefaultEqualityComparer;
            var l = this.length;
            while (l-- > 0)
                if (comparer(this[l], o) === true) return true;
            return false;
        },

        // Iterations

        forEach: Array.prototype.forEach || function (callback, context) {
            context = context || window;
            var l = this.length;
            for (var i = 0; i < l; i++)
                callback.call(context, this[i], i, this);
        },

        defaultIfEmpty: function (val) {
            return this.length == 0 ? [val == null ? null : val] : this;
        },

        range: function (start, count) {
            var arr = Collection();
            while (count-- > 0) {
                arr.push(start++);
            }
            return arr;
        },



    };


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //
    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Return the collection constructor.
    return (Collection);


}).call({});

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '-' : '-0') + mm,
    (dd > 9 ? '-' : '-0') + dd
    ].join('');
};


Util.MoneyFormat = {
    Format: function (value) {
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
}

Util.NumberFormat = {
    Format: function (value) {
        return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    }
}

Util.Devexpress = {

    DataGrid: function (url, uniqId, elementId, columns, pageSize, headerFilter, onCellPrepared, toolbarAddButton) {
        $.ajax({
            url: url,
            dataType: 'JSON',
            async: true,
            type: "Post",
            success: function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].BitisTarihi != null)
                        response.data[i].BitisTarihi = new Date(parseInt(response.data[i].BitisTarihi.split('/Date(')[1].split(')/')[0]));
                }

                $("#" + elementId).dxDataGrid({
                    dataSource: response.data,
                    rowAlternationEnabled: true,
                    allowColumnResizing: true,
                    columnResizingMode: "widget",
                    keyExpr: uniqId,
                    showBorders: true,
                    export: {
                        enabled: true,
                        icon: 'exportxlsx'
                    },
                    onExporting: function (e) {
                        var workbook = new ExcelJS.Workbook();
                        var worksheet = workbook.addWorksheet('Liste');
                        DevExpress.excelExporter.exportDataGrid({
                            component: e.component,
                            worksheet: worksheet,
                            topLeftCell: { row: 4, column: 1 }
                        }).then(function (cellRange) {
                            // header
                            var headerRow = worksheet.getRow(2);
                            headerRow.height = 30;
                            worksheet.mergeCells(2, 1, 2, 8);

                            headerRow.getCell(1).value = 'Liste';
                            headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22 };
                            headerRow.getCell(1).alignment = { horizontal: 'center' };


                        }).then(function () {
                            workbook.xlsx.writeBuffer().then(function (buffer) {
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Liste.xlsx');
                            });
                        });
                        e.cancel = true;
                    },
                    editing: {
                        allowUpdating: false,
                        allowAdding: false,
                        allowDeleting: false,
                        mode: 'cell' // 'batch' | 'cell' | 'form' | 'popup'
                    },
                    scrolling: {
                        mode: "standard" // or "virtual" | "infinite"
                    },
                    filterPanel: { visible: true },

                    paging: {
                        pageSize: pageSize,

                    },
                    headerFilter: {
                        visible: headerFilter
                    },
                    filterRow: {
                        visible: true
                    },
                    searchPanel: {
                        placeholder: "Ara...",
                        visible: true,
                        highlightCaseSensitive: true
                    },
                    pager: {
                        allowedPageSizes: [10, 15, 25, 50],
                        showInfo: true,
                        showNavigationButtons: true,
                        showPageSizeSelector: true,
                        visible: true,
                        infoText: "Sayfa {0} ({2} Kayıt)"

                    },
                    focusedRowKey: 999,
                    columns: columns,
                    columnChooser: {
                        enabled: true,
                        mode: "select"
                    },
                    onEditorPreparing: function (e) {

                    },
                    onRowPrepared: function (e) {


                    },
                    onToolbarPreparing: function (e) {
                        var dataGrid = e.component;

                        e.toolbarOptions.items[0].showText = 'always';

                        // Eger Gelen Parametre boş string ise hiç buton eklemiyor.Harici olarak gelen paremetre object ise ekliyor.
                        if (typeof toolbarAddButton == 'string') {

                        } else {
                            e.toolbarOptions.items.push({
                                location: "after",
                                widget: "dxButton",
                                options: toolbarAddButton
                            });
                        }

                    },
                    onContextMenuPreparing: function (e) {

                        // Tablo üzerinde 
                        //if (e.row.rowType === "data") {
                        //    e.items = [{
                        //        icom:"map",
                        //        text: "Haritada Gör",
                        //        onItemClick: function () {
                        //          

                        //        }
                        //    }];

                        //}
                    },
                    onCellPrepared: onCellPrepared,
                    showBorders: true,
                });
            },

            error: function (data) {

            },
        });

        return true;
    },

}
Util.EmailValidate = {
    EmailValidate: function (email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
