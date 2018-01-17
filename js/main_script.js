//global variable source link
var apilink = "http://test-api.kuria.tshdev.io/"; //api variable
var sourcelink; //generated link with appropriate query

//ask server and download json resultsCARING
$(document).ready(function(){
    $("button").click(function(){
        reciveData();
    });
});

//get text from searchtext html input to search suppliers
function searchSuppliers() {
    var x = document.getElementById("inputText").value;
    sourcelink = apilink;
    return x;
}

//serching by rates
function ratingFunction(){
    var x = document.getElementById("inputrating").value;
    sourcelink = apilink;
    //console.log(x);
    return x;
}

//get url from button and change onclick query for arrows (send current location so i can determinate where i am
function arrowFunction(a,currentlocation){
    if(a=="L"){ //left and right buttons
        sourcelink = apilink + "?page=" + (Number(currentlocation)-Number(1));
    }else if(a=="R"){
        sourcelink = apilink + "?page=" + (Number(currentlocation)+Number(1));
    }
    reciveData();
}

//get url from button and change onclick query for pages
function pagesFuntion(pagtab){
    sourcelink = apilink + "?page=" + pagtab;
    reciveData();
}

//reset to basic sourcelink
function resetFuntion(){
    document.getElementById('inputText').value = '';
    document.getElementById('inputrating').value = 0;
    sourcelink = apilink;
}

function reciveData(){
    //take valu from text field to query value
    $.getJSON(sourcelink, {
        //page: 0,
        rating: ratingFunction(),
        //take value from searchText field and ask server query
        query: searchSuppliers()
    }, function(result){
        //clear all before data comes in
        $("#maintable").html("");
        for(var i = 0; i<result.payments.length ; i++) {
            $("#maintable").append("<tr><td id='supliertab'>" + result.payments[i].payment_supplier + "</td><td id='poundrating'>" + drawPounds(result.payments[i].payment_cost_rating)
                + "</td><td id='referencetab'>" + result.payments[i].payment_ref + "</td><td id = 'valuetab'>" + '£' + numeral(result.payments[i].payment_amount).format('0,0') + " </td> ");
        }

        //buttons from - to - current
        var btnFrom = result.pagination.from;
        var btnTo = result.pagination.to;
        var currentlocation = result.pagination.current;
        //pages buttons clear
        $("#paggination").html("");

        //left button
        if(result.pagination.left == true){ //active button
            $("#paggination").append("<button class='paginationBtn' onclick=\"arrowFunction('L'," + currentlocation + ")\">\<\</button>")
        }
        else{ //button will not respond but will be displayed
            $("#paggination").append("<button class='paginationBtn'>\<\</button>")
        }
        //show buttons and higlight site where i am
        for(var i = btnFrom; i < btnTo ; i++){
            if(result.pagination.current == i){
                $("#paggination").append("<button class='clickedBtn'>" + Number(i+1) + "</button>")
            }
            else{
                $("#paggination").append("<button class='paginationBtn' onclick=\"pagesFuntion("+i+")\">" + Number(i+1) + "</button>")
            }
        }
        //right button
        if(result.pagination.right == true){ //active button
            $("#paggination").append("<button class='paginationBtn' onclick=\"arrowFunction('R'," + currentlocation + ")\">\>\</button>")
        }
        else{//button will not respond but will be displayed
            $("#paggination").append("<button class='paginationBtn'>\>\</button>")
        }
        //add handler for popup message
        addRowHandlers();
    });
}

//draw graphic pounds
function drawPounds(a){
    var rating = "";
    for(var i = 0; i<5;i++){
        if(i>=a){
            rating = rating + '<div class=\"pound-Empty\">£</div>';
        }else{
            rating = rating + '<div class=\"pound-Full\">£</div>';
        }
    }
    return rating;
}

//add popup message on table
function addRowHandlers() {
    // Get the modal
    var modal = document.getElementById('myModal');

// Get the button that opens the modal
    var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    var rows = document.getElementById("tableId").rows;

    for (i = 0; i < rows.length; i++) {
        rows[i].onclick = function(){ return function(){

            $( "td.modalbox-supp" ).html( this.cells[0].innerHTML );
            $( "td.modalbox-pound" ).html( this.cells[1].innerHTML );
            $( "td.modalbox-ref" ).html( this.cells[2].innerHTML );
            $( "td.modalbox-value" ).html( this.cells[3].innerHTML );


            modal.style.display = "block";
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        };}(rows[i]);
    }
}