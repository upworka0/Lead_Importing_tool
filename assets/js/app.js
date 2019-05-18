var csv_data=[];
var dataTable ;


function AjaxRequest(data){
    return new Promise((resolve, reject) => {
       $.ajax({
            url : 'Controller.php',
            method : 'POST',
            data : data,
            success :  function(res){
                resolve(res);
            },
            error: function(err){
                reject();
            },
            processData: false,
            contentType: false,
       });
    });
}


var App = function(){
    var dataTable;

    var initCSVTable = function(_data){
        var data = [];

        for (i = 1; i < _data.length; i++){
            data.push([i, _data[i].LastName, _data[i].FirstName, _data[i].PrimaryPhone, _data[i].Address, _data[i].City, _data[i].State, _data[i].ZipCode ])
        }

        dataTable.clear();
        dataTable.rows.add(data);
        dataTable.draw();
    }

    var initSettingTable = function(_data){
        var i, html = "";
        for (i = 1; i < _data.length; i++){
            html += "<tr>";
            html += "<td>A</td>";
            html += "<td>" + _data[i]['GroupId'] + "</td>";
            html += "<td>" + _data[i]['SecurityCode'] + "</td>";
            html += "<td>" + _data[i]['Campaign'] + "</td>";
            html += "<td>" + _data[i]['Subcampaign'] + "</td>";
            html += "<td>" + _data[i]['Rate'] + "</td>";
            html += "</tr>";
        }
        $('#settingsTable tbody').html(html);
    }

    var uploadRequest = async function(){
        var dt = $('#file_upload').serializeArray();
        var formData = new FormData();
        for (var i = 0 ; i < dt.length ; i++){
            formData.append(dt[i].name, dt[i].value);
        }
        
        if (document.getElementById('file'))
            if (document.getElementById('file').files.length > 0)
                formData.append("file", document.getElementById('file').files[0]);
        showSpinner('uploading_spinner');

        var res = await AjaxRequest(formData);
        var data = JSON.parse(res);
        if (data.status === 'success'){
            initCSVTable(data.data, dataTable);
            hideSpinner('uploading_spinner');
            showNotification('alert-success', 'Successfully Uploaded.', "top", "center", "", "animated fadeOutRight");
        }else{
            hideSpinner('uploading_spinner');
            showNotification('alert-danger', data.message, "top", "center", "", "animated fadeOutRight");
            /*alert(data.message);*/
        }
    }


    var settingsRequest = async function(){
        var dt = $('#settingsForm').serializeArray();
        var formData = new FormData();
        for (var i = 0 ; i < dt.length ; i++){
            formData.append(dt[i].name, dt[i].value);
        }
        showSpinner('setting_spinner');

        var res = await AjaxRequest(formData);
        var data = JSON.parse(res);
        if (data.status === 'success'){
            showNotification('alert-success', 'Successfully Submitted.', "top", "center", "", "animated fadeOutRight");
            initSettingTable(data.data);
            hideSpinner('setting_spinner');
        }else{
            hideSpinner('setting_spinner');
            showNotification('alert-danger', data.message, "top", "center", "", "animated fadeOutRight");
            /*alert(data.message);*/
        }
    }


    var initialize = function(){
        $('#cred_sec').removeClass('hidden');

        $('#file_upload').validate({
            highlight: function (input) {
                $(input).parents('.form-line').addClass('error');
            },
            unhighlight: function (input) {
                $(input).parents('.form-line').removeClass('error');
            },
            errorPlacement: function (error, element) {
                $(element).parents('.form-group').append(error);
            },
            submitHandler:function(form){
                try{
                    uploadRequest();
                }catch(err){

                }
                return false;
            }
        });

        dataTable = $('.dataTable').DataTable({
            responsive: true,
        });

        $('.settings').on('click', function () {
            $('#settingModal').modal('show');
        });


        $('#settingsForm').validate({
            errorPlacement: function (error, element) {
                $(element).parents('.form-group').append(error);
            },
            submitHandler:function(form){
                try{
                    settingsRequest();
                }catch(err){

                }
                return false;
            }
        });
    }

    return {
        // Public functions
        init: function() {
            // init
            initialize();
        },
    };
}();


$(function(){
    App.init();
});




/*
function uploadRequest(){
    var dt = $('#file_upload').serializeArray();
    var formData = new FormData();
    for (var i = 0 ; i < dt.length ; i++){
        formData.append(dt[i].name, dt[i].value);
    }
    
    if (document.getElementById('file'))
        if (document.getElementById('file').files.length > 0)
            formData.append("file", document.getElementById('file').files[0]);
    showSpinner();
    
    $.ajax({
        url  : 'Controller.php',
        method : 'POST',
        data : formData,
        success : function(res){
            var data = JSON.parse(res);
            if (data.status === 'success'){
                csv_data = data.data;
                initCSVTable(csv_data, dataTable);
                hideSpinner();
            }else{
                hideSpinner();
                alert(data.message);
            }
        },
        processData: false,
        contentType: false,
    });
}

function settingsRequest(){
    var dt = $('#settingsForm').serializeArray();
    var formData = new FormData();
    for (var i = 0 ; i < dt.length ; i++){
        formData.append(dt[i].name, dt[i].value);
    }
    showSpinner();
    
    $.ajax({
        url  : 'Controller.php',
        method : 'POST',
        data : formData,
        success : function(res){
            var data = JSON.parse(res);
            if (data.status === 'success'){
                _data = data.data;
                initSettingTable(_data);
                hideSpinner();
            }else{
                hideSpinner();
                alert(data.message);
            }
        },
        processData: false,
        contentType: false,
    });
}
*/



/*$(document).ready(function(){
	// $('#home_sec').removeClass('hidden');
	$('#cred_sec').removeClass('hidden');


    $('#file_upload').validate({
        highlight: function (input) {
            console.log(input);
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        },
        submitHandler:function(form){
            try{
                uploadRequest();    
            }catch(err){

            }            
            return false;
        }
    });

    $('#settingsForm').validat({
        submitHandler:function(form){
            try{
                settingsRequest();    
            }catch(err){

            }            
            return false;
        }
    });

    dataTable = $('.dataTable').DataTable({
        responsive: true,
    });


    $('.settings').on('click', function () {
        // var color = $(this).data('color');
        // $('#mdModal .modal-content').removeAttr('class').addClass('modal-content modal-col-' + color);
        $('#settingModal').modal('show');
    });
})*/




// Notification Test
/*$(function () {
    $('button').on('click', function () {
        var placementFrom = $(this).data('placement-from');
        var placementAlign = $(this).data('placement-align');
        var animateEnter = $(this).data('animate-enter');
        var animateExit = $(this).data('animate-exit');
        var colorName = $(this).data('color-name');

        showNotification(colorName, null, placementFrom, placementAlign, animateEnter, animateExit);
    });
});*/



