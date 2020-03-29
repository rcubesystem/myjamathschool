// r4cube framework starts
r$.subscribe("/r$/viewchange", function (view) {
    if(view=="mobile"){
        r$("#navmenu").css("position","relative");
        r$("#navHNDisp").css("width","85%");
        r$("#navHBDisp").css("width","15%");
    }else{
        r$("#navmenu").css("position","fixed");
        r$("#navHNDisp").css("width","46%");
        r$("#navHBDisp").css("width","4%");
    }
    console.log(view); //shows mobile table desktop
});

r$.subscribe("/r$/onload", function () {
    console.log("page loaded");
    r$("#loginButton").on("click", function () {
        alert("login button clicked");
    });
});
// r4cube framework ends

// Sample Test Codes Starts
r$.subscribe("/r$/onload", function () {
    r$("#bellNotification").on("click", function () {
        alert("Notification button clicked");
    });
});
// Sample Test Codes Ends

// Theming Impl Starts
function themer(val){
    var href;
    switch(val){
        case'1':href = "styles/theming/themeone.css";break;
        case'2':href = "styles/theming/themetwo.css";break;
        case'3':href = "styles/theming/themethree.css";break;        
        case'4':href = "styles/theming/themefour.css";break;
        default:;break;
    }
    document.getElementById('mytheme').href = href;
}
// Theming Impl Ends