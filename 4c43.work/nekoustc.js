//if IE
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isIE11) {
        return 11; //IE11
    } else if (isEdge) {
        return 12;//edge
    } else {
        return 13;//不是ie浏览器
    }
}

//if browser supports placeholder
function placeholder(e) {


    var type = e.getAttribute("type");
    if (type == "hidden") {
        return;
    }
    if (type == "button") {
        var html = e.innerHTML;
        e.value = html;
        return;
    }

    e.value = e.getAttribute('placeholder');
    e.style.color = "gray";
    //input in IE support placeholder ,display onfocus content
    if (IEVersion() === 10 || IEVersion() === 11) {
        e.type = "text";
        e.onfocus = function () {
            this.value = this.getAttribute('onfocus').toString().split('\'')[1];
            this.style.color = "";
            if (e.getAttribute("mark")) {
                this.type = "password";
            }
        };
        e.onblur = function () {
            if (this.value === this.getAttribute('onfocus').toString().split('\'')[1] || this.value === "") {
                this.value = this.getAttribute('onblur').toString().split('\'')[1];
                this.style.color = "gray";
                if (e.getAttribute("mark")) {
                    this.type = "text";
                }
            }
        };
    }
    //input in IE don't support placeholder ,display placeholder/onfocus/onblur content.
    else if (IEVersion() < 10) {
        // the blow line doesn't work for < IE8

        if (IEVersion() < 9) {
            e.outerHTML = e.outerHTML.replace('type="password"', 'type="text"');
        } else {
            e.setAttribute("type", "text");
        }
        var focus = e.getAttribute('onfocus');
        var a = "";

        if (focus != null) {
            a = focus.toString().split('\'')[1];
        }

        var blur = e.getAttribute('onblur');
        var b = "";
        if (blur != null) {
            b = blur.toString().split('\'')[1];
        }
        if (e.value === "") {
            e.value = e.getAttribute('placeholder');
            e.style.color = "gray";
        }
        e.onfocus = function () {
            this.value = a;
            this.style.color = "";
            if (this.getAttribute("mark") === "password") {
                if (IEVersion() < 9) {
                    // the blow line doesn't work for < IE8
                    e.outerHTML = e.outerHTML.replace('type="text"', 'type="password"');
                } else {
                    this.setAttribute("type", "password");
                }
            }
        };
        e.onblur = function () {
            if (this.value === a || this.value === "") {
                this.value = b;
                this.style.color = "gray";
                if (this.getAttribute("mark") === "password") {
                    if (IEVersion() < 9) {
                        // the blow line doesn't work for < IE8
                        e.outerHTML = e.outerHTML.replace('type="text"', 'type="password"');
                    } else {
                        this.setAttribute("type", "text");
                    }
                }
            }
        };
    }
}

//xmlHttp
function xmlHttpRequest() {
    var xmlHttp = null;
    if (window.XMLHttpRequest) {// code for all new browsers
        xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {// code for IE5 and IE6
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlHttp;
}

$(document).ready(function () {
    getlist();
    
});

function getJsonLength(jsonData){
    var jsonLength = 0;
    for(var item in jsonData){
    jsonLength++;
    }
    return jsonLength;
}

function getlist(){
    $.ajax({
        type:"GET",
        dataType:"json",
        crossDomain: true,
        url:"https://api.4c43.work/nekosearch.php?tag=wx",
        success:function(result){
            console.log(result)
            if(result){
                var jsl = 0;
                jsl = getJsonLength(result);
                for(var i=0;i<jsl;i++){
                    var node=document.createElement("OPTION");
                    node.setAttribute("value",result[i].text);
                    document.getElementById("nameslist").appendChild(node);
                }
            }
        },
        error:function(){
            alert("异常！");
        }
    })
}

function getInfo(name) {
    $.ajax({
        //几个参数需要注意一下
        type: "GET",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "https://api.4c43.work/selectname.php?",
        data: {
            name:name
        },
        success: function (result) {
            //alert(result);
            console.log(result);//打印服务端返回的数据(调试用)
            $('#sex').val(result['sex']);
            var birthday=result['birthday'];
            if(birthday != '' && birthday != null){
                $('#birth_y').val(birthday.split('-')[0]);
                $('#birth_m').val(birthday.split('-')[1]);
            }
            $('#health').val(result['health']);
            if (result['health'] == 'death'){
                $('#deathdate').parent().show();
            }else{
                $('#deathdate').parent().hide();
                $('#deathdate').val('');
            }
            
            $('#tnr').val(result['TNR']);
            if (result['TNR'] == 'cut'){
                $('#cutdate').parent().show();
            }else{
                $('#cutdate').parent().hide();
                $('#cutdate').val('');
            }
            $('#cutdate').val(result['cutdate']);
            $('#deathdate').val(result['deathdate']);
            $('#vac').val(result['vac']);
            if (result['vac'] == 'have'){
                $('#vacdate').parent().show();
            }else{
                $('#vacdate').parent().hide();
                $('#vacdate').val('');
            }
            $('#vacdate').val(result['vacdate']);
            $('#adopt').val(result['adopt']);
            if (result['adopt'] == 'yes') {
                $('#adopter').parent().show();
                $('#adoptdate').parent().show();
                $('#a_tel').parent().show();
            }else{
                $('#adopter').parent().hide();
                $('#adoptdate').parent().hide();
                $('#a_tel').parent().hide();
                $('#adopter').val('');
                $('#adoptdate').val('');
                $('#a_tel').val('');
            }
            $('#adoptdate').val(result['adoptdate']);
            $('#adopter').val(result['adopter']);
            $('#area').val(result['sch_area']);
            $('#desc').val(result['description']);
            $('#uploader').val(result['uploader']);
            $('#tag').val("add");
        },
        error: function () {
            $("#cathead").attr("src","https://nekoustc.hk.ufileos.com/cats/null.jpg");
            $('#tag').val("new");
            //alert("异常！");
        }
    });
}

function sendPost() {
    var flag = checkForm();
		if (flag == false) {
			return;
		}
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "html",//预期服务器返回的数据类型
        url: "https://api.4c43.work/nekoupload.php",
        data: $('#upform').serialize(),
        success: function (result) {
            alert(result);
            //console.log(result);//打印服务端返回的数据(调试用)
            if (result.resultCode == 200) {
            };
        },
        error: function () {
            alert("异常！");
        }
    });
}

function checkForm(){
    var name = $("#name").val();
    //var desc = $("#desc").val();
    var uploader = $("#uploader").val();
    if (name.trim() == '' ||name.trim() == '数据库中已有内容：') {
        alert("请输入名字！");
        $("#name").focus();
        return false;
    }
    /*if (desc.trim() == '') {
        alert("请输入名字！");
        $("#desc").focus();
        return false;
    }*/
    if (uploader.trim() == '') {
        alert("请输入上传者！");
        $("#uploader").focus();
        return false;
    }
}

$(document).ready(function () {
    $('#deathdate').parent().hide();
    $('#vacdate').parent().hide();
    $('#cutdate').parent().hide();
    $('#adopter').parent().hide();
    $('#adoptdate').parent().hide();
    $('#a_tel').parent().hide();
    $("#adopt").bind("change", function () {
        if (this.value == 'yes') {
            $('#adopter').parent().show();
            $('#adoptdate').parent().show();
            $('#a_tel').parent().show();
        }
        else {
            $('#adopter').parent().hide();
            $('#adoptdate').parent().hide();
            $('#a_tel').parent().hide();
            $('#adopter').val('');
            $('#adoptdate').val('');
            $('#a_tel').val('');
        }
    });
    $("#tnr").bind("change", function () {
        if (this.value == 'cut'){
            $('#cutdate').parent().show();
        }
        else{
            $('#cutdate').parent().hide();
            $('#cutdate').val('');
        }
    });
    $("#health").bind("change", function () {
        if (this.value == 'death'){
            $('#deathdate').parent().show();
        }
        else{
            $('#deathdate').parent().hide();
            $('#deathdate').val('');
        }
    });
    $("#vac").bind("change", function () {
        if (this.value == 'have'){
            $('#vacdate').parent().show();
        }
        else{
            $('#vacdate').parent().hide();
            $('#vacdate').val('');
        }
    });
    $("#selector").bind("blur",function(){
        if (this.value == 'add'){
            alert("更新将会覆盖你所输入内容的条目");
        }
    })
    $("#name").bind("blur", function () {
        var cname=this.value.trim();
        if (cname != '' && cname != 'null') {
            $("#cathead").attr("src","https://nekoustc.hk.ufileos.com/cats/"+cname+".jpg");
            getInfo(cname);
        }else{
            $("#cathead").attr("src","https://cdn.jsdelivr.net/gh/lclichen/cdn@main/cats/null.jpg");
            $('#tag').val("new");
        }
    });

    var bucketName = "nekoustc";
    var bucketUrl = "https://nekoustc.hk.ufileos.com/";
    var tokenPublicKey = '';
    var tokenPrivateKey = '';
    var tokenServerUrl = "https://api.4c43.work/token_server.php";
    var prefix = 'cats';
    var ufile =  new UCloudUFile(bucketName, bucketUrl, tokenPublicKey, tokenPrivateKey, tokenServerUrl, prefix);
    // uploader监听
    $("#imguploader").on("change", uploaderChange);
    function uploaderChange() {
        // 普通上传
        var fileRename = $("#name").val()+'.jpg';
        var file = document.getElementById("imguploader").files[0];

        var data = {
            file: file,
            fileRename: fileRename
        };

        var successCallBack = function(res) {
            alert("图片 "+fileRename+" 上传成功")
        };
        var progressCallBack = function(res) {

        };
        var errorCallBack = function(res) {
            //alert("图片 "+fileRename+" 上传失败")
        };

        ufile.uploadFile(data, successCallBack, errorCallBack, progressCallBack);
        $(this).remove();
        $('<input type="file" id="imguploader" name="imguploader" class="form-control hide" />').on("change", uploaderChange).appendTo($("#uploaderWrap"))
    }
    // 普通上传
    

    
    var prefix2 = 'imgco';
    var ufile2 =  new UCloudUFile(bucketName, bucketUrl, tokenPublicKey, tokenPrivateKey, tokenServerUrl, prefix2);
    // uploader监听
    $("#imguploader2").on("change", uploaderChange);
    function uploaderChange() {
        // 普通上传
        var file = document.getElementById("imguploader2").files[0];
        var fileRename = file.name;//$("#name").val()+'.jpg'; //需要修改这里哦
        console.log(fileRename)
        var data = {
            file: file,
            fileRename: fileRename
        };

        var successCallBack = function(res) {
            alert("图片 "+fileRename+" 上传成功")
            $.ajax({
                //几个参数需要注意一下
                type: "POST",//方法类型
                dataType: "html",//预期服务器返回的数据类型
                url: "https://api.4c43.work/imgupload.php",
                data: {
                    name: $("#name").val(),
                    imgname: fileRename
                },
                success: function (result) {
                    //console.log(result);//打印服务端返回的数据(调试用)
                    if (result.resultCode == 200) {
                        if(result == 'new'){
                            $("#tag").val("add");
                        }
                    };
                },
                error: function () {
                    alert("异常！");
                }
            });
        };
        var progressCallBack = function(res) {

        };
        var errorCallBack = function(res) {
            //alert("图片 "+fileRename+" 上传失败")
        };

        ufile2.uploadFile(data, successCallBack, errorCallBack, progressCallBack);
        $(this).remove();
        $('<input type="file" id="imguploader2" name="imguploader2" class="form-control hide" />').on("change", uploaderChange).appendTo($("#uploaderWrap"))
    }
    // 普通上传
    

});
function imgup(){
    console.log('触发头像上传...')
    $("#imguploader").trigger("click");
    console.log('已触发')
}

function imgCollectUp(){
    console.log('触发图集上传...')
    $("#imguploader2").trigger("click");
    console.log('已触发')
}