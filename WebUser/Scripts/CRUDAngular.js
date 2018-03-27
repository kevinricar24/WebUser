var app = angular.module("myApp", []);

//Define the url endpoint
var urlport = "http://localhost:58035/User/";

// Create Base64 Object
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
var passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{10,15}$/;

app.controller("myCtrl", function ($scope, $http) {

    $scope.ValidateData = function () {

        var validate = true;

        var Action = document.getElementById("btnSave").getAttribute("value");

        if (($scope.UserEmail == undefined) || (!emailRegex.test($scope.UserEmail))) {
            document.getElementById('emailvalidation').innerText = "Correo Invalido!";
            document.getElementById('emailvalidation').setAttribute("style", "color:red;");
            validate = false;
        } else {
            document.getElementById('emailvalidation').innerText = "";
        }
        

        if (($scope.UserUsername == undefined) || ($scope.UserUsername.length < 7)) {
            document.getElementById('usernamevalidation').innerText = "Usuario Invalido!";
            document.getElementById('usernamevalidation').setAttribute("style", "color:red;");
            validate = false;
        } else {
            document.getElementById('usernamevalidation').innerText = "";
        }
        

        if (($scope.UserPassword1 == undefined || $scope.UserPassword2 == undefined) || (!passwordregex.test($scope.UserPassword1))) {
            document.getElementById('passwordvalidation').innerText = "Contraseña Invalida!";
            document.getElementById('passwordvalidation').setAttribute("style", "color:red;");
            validate = false;
        } else if ($scope.UserPassword1 != $scope.UserPassword2) {
            document.getElementById('passwordvalidation').innerText = "Las contraseñas deben ser iguales";
            document.getElementById('passwordvalidation').setAttribute("style", "color:red;");
            validate = false;
        } else {
            document.getElementById('passwordvalidation').innerText = "";
        }
        
        if (Action == "Guardar") {
            if (($scope.UserStatus == undefined) || ($scope.UserStatus == "")) {
                document.getElementById('statusvalidation').innerText = "Elija un Estado";
                document.getElementById('statusvalidation').setAttribute("style", "color:red;");
                validate = false;
            } else {
                document.getElementById('statusvalidation').innerText = "";
            }
        }
        
        
        if (validate === true) {
            $scope.InsertData();
        }
    };

    $scope.InsertData = function () {
        var Action = document.getElementById("btnSave").getAttribute("value");
        if (Action === "Guardar") {
            $scope.User = {};
            $scope.User.Email = $scope.UserEmail;
            $scope.User.Username = $scope.UserUsername;
            var encodedPassword = Base64.encode($scope.UserPassword1);
            $scope.User.Password = encodedPassword;
            $scope.User.Status = parseInt($scope.UserStatus);
            $scope.User.Sex = $scope.UserSex;
            $scope.User.CreationDate = new Date();
            $http({
                method: "post",
                url: urlport + "Insert_User",
                datatype: "json",
                data: JSON.stringify($scope.User)
            }).then(function (response) {
                alert(response.data);
                $scope.GetAllData();
                $scope.UserEmail = "";
                $scope.UserUsername = "";
                $scope.UserPassword1 = "";
                $scope.UserPassword2 = "";
                $scope.UserStatus = "";
                $scope.UserSex = "";
            });
        } else if (Action === "Actualizar") {
            $scope.User = {};
            $scope.User.Username = $scope.UserUsername;
            var encodedPassword = Base64.encode($scope.UserPassword1);
            $scope.User.Password = encodedPassword;
            $scope.User.Sex = $scope.UserSex;
            $scope.User.Email = $scope.UserEmail;
            $scope.User.Id = document.getElementById("UserID_").value;
            $http({
                method: "post",
                url: urlport + "Update_User",
                datatype: "json",
                data: JSON.stringify($scope.User)
            }).then(function (response) {
                alert(response.data);
                $scope.GetAllData();
                $scope.UserEmail = "";
                $scope.UserUsername = "";
                $scope.UserPassword1 = "";
                $scope.UserPassword2 = "";
                $scope.UserSex = "";
                document.getElementById("btnSave").setAttribute("value", "Guardar");
                document.getElementById("btnSave").style.backgroundColor = "limegreen";
                document.getElementById("spn").innerHTML = "Agregar Nuevo Usuario";
                document.getElementById("StatusDiv").setAttribute("style", "display:inline");
            });
        } 
    };
    $scope.GetAllData = function () {
        $http({
            method: "get",
            url: urlport + "Get_AllUser"
        }).then(function (response) {
            $scope.users = response.data;
        }, function () {
            alert("Error Occur");
        });
    };
    $scope.UpdateUser = function (user) {
        document.getElementById("UserID_").value = user.Id;
        $scope.UserUsername = user.Username;
        $scope.UserEmail = user.Email;
        $scope.UserSex = user.Sex;
        document.getElementById("StatusDiv").setAttribute("style", "display:none");
        document.getElementById("btnSave").setAttribute("value", "Actualizar");
        document.getElementById("btnSave").style.backgroundColor = "Orange";
        document.getElementById("spn").innerHTML = "Actualizar";
    };
    $scope.DeleteUser = function (user) {
        $http({
            method: "post",
            url: urlport  + "Delete_User",
            datatype: "json",
            data: JSON.stringify(user)
        }).then(function (response) {
            alert(response.data);
            $scope.GetAllData();
        })  
    };
});  