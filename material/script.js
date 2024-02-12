//$(selector).event()

$(document).ready(function(){
    $("#btn1").click(function(){
        $("#divOne").hide("slow",function(){
            alert("Element hiddin now")
        });
    })
    $("#btn2").click(function(){
        $("#divOne").show();
    })
    
    $("#btn3").click(function(){
        $("#divOne").toggle();
    })
    // $("#divOne").hover(function(){
    //   alert("You entered div")
    // },
    // function(){
    //  alert("You leave div")
    // })
    $("#txtInput").focus(function(){
        $(this).css({"background-color":"red" ,"color":"white"})
    })
    $("#txtInput").blur(function(){
        $(this).css("background-color","white")
    })

    $("#btn4").click(function(){
        $("#img1").attr("src","2.jpg");
    })

    $("#btn5").click(function(){
        $("#divOne").append("<p>This is para</p>")
    })

    $("#btn6").click(function(){
        $("#divOne").prepend("<p>This is para</p>")
    })

    $("#btn7").click(function(){
        $("#divOne").after("<p>This is para</p>")
    })

    $("#btn8").click(function(){
        $("#divOne").before("<p>This is para</p>")
    })

    $("#btn9").click(function(){
        $("#divOne").remove();
    })

    $("#btn10").click(function(){
        $("#divOne").empty();
    })

    $("#btn11").click(function(){
        $("#divOne").addClass("class1")
    });

    $("#btn12").click(function(){
        $("#divOne").removeClass("class1");
    })

    $("#btn13").click(function(){
        $("#divOne").toggleClass("class1")
    })
})