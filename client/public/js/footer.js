window.onload = function(){
    var bodyHeight =$(document.body).height() ;//获取文档的的高度
    var windowHeight = $(window).height();     //获取窗口的的高度
    var footer = document.getElementById("footer");


    if(windowHeight>bodyHeight ){  //文档高度小于窗口高度时，给footer绝对定位。position:absolute;bottom:0;
        footer.style.position = "absolute";
        footer.style.bottom = "0"
    } else {
        footer.style.positon = "";
        footer.style.bottom = "";
    }
}
