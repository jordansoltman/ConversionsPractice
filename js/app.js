// This code is messy..

$(document).foundation();

$(document).ready(function()
{
    $("#answer_box").focus();
    var game = new Game(10);
    game.initialize();

});

function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function splitBinary(value) {
    var padding = 4 - value.length % 4; // calculate the padding
    value = "" + value; // make it a string
    var split = "";
    for(var i = 0; i < value.length/4; i++)
    {
        split = value.substring(value.length - (i+1) * 4, value.length - i * 4) + " " + split;
    }
    if (padding != 4)
        for (var i = 0; i < padding; i++)
            split = "0"+split;
    return split;
}

function Game(num)
{

    var self = this;

    this.fromBase = 10;
    this.toBase = 16;
    this.num = num;
    this.correct;
    this.current;
    this.isPlaying = false;
    this.lower_range = 0;
    this.upper_range = 15;

    $("#answer").submit(function(e){
        e.preventDefault();
        self.answer();
    });

    $(".from button").click(function(e){
        var base = $(e.target).data("base");
        self.setFromBase(e.target);
    });

    $(".to button").click(function(e){
        var base = $(e.target).data("base");
        self.setToBase(e.target);
    });

    $("#edit_range").click(function(){
        $(".range_edit").slideDown();
        $(".range").slideUp();
    });

    $("#upper_range").change(function(){
        var value = Number($("#upper_range").val());
        if(!isInt(value) || value < 0)
            value = self.lower_range;
        self.upper_range = value;
        $("#upper_range").val(value);
        if (value < self.lower_range)
        {
            self.lower_range = value;
            $("#lower_range").val(value);
        }
        self.play();
    });

    $("#lower_range").change(function(){
        var value = Number($("#lower_range").val());
        if(!isInt(value) || value < 0)
            value = 0;
        self.lower_range = value;
        $("#lower_range").val(value);
        if(value > self.upper_range)
        {
            self.upper_range = value;
            $("#upper_range").val(value);
        }
        self.play();
    });

}


Game.prototype.initialize = function()
{
    $("#upper_range").val(this.upper_range);
    $("#lower_range").val(this.lower_range);
    this.isPlaying = true;
    this.play();
}

Game.prototype.play = function()
{

    var num = Math.floor(Math.random() * (this.upper_range - this.lower_range + 1)) + this.lower_range;
    var converted = num.toString(this.fromBase);
    this.current = num;

    // If it's binary we'll format it a bit first
    if(this.fromBase == 2)
        converted = splitBinary(converted);
    $("#from_box").html(converted.toUpperCase());
}

Game.prototype.setFromBase = function(button)
{
    this.fromBase = $(button).data("base");
    $(".from button").removeClass("success");
    $(button).addClass("success");
    this.play();
}

Game.prototype.setToBase = function(button)
{
    this.toBase = $(button).data("base");
    $(".to button").removeClass("success");
    $(button).addClass("success");
}

Game.prototype.answer = function()
{
    var answer = $("#answer_box").val().toUpperCase();

    var converted = parseInt(answer, this.toBase);

    var color = "#48AA45"; // Assume it's correct
    var tdClass = "correct";
    if (this.current != converted){ // And we'll change it otherwise
        color = "#BB1519";
        tdClass = "incorrect";
    }

    $('body').animate({'background-color': color}, 100, "swing", function(){
        $('body').animate({'background-color': '#FFFFFF'}, 200);
    });

    // Format for the table
    converted = this.current.toString(this.fromBase).toUpperCase();

    var correct = this.current.toString(this.toBase).toUpperCase();

    if(this.fromBase == 2)
    {
        converted = splitBinary(converted);
    }

    if(this.toBase == 2)
    {
        correct = splitBinary(correct);
        answer = splitBinary(answer);
    }

    $('tbody').prepend('<tr class="'+tdClass+'"><td>'+converted+'</td><td>'+this.fromBase +' &#10095; '+this.toBase+'</td><td>'+correct+'</td><td>'+answer+'</td></tr>');

    this.play();
    $("#answer_box").val("");
}

