// Initialize Firebase
var config = {
  apiKey: "AIzaSyAhrjQrRP6iU2uTrlyHPCSwltBSitFFFsU",
  authDomain: "gatech-trains.firebaseapp.com",
  databaseURL: "https://gatech-trains.firebaseio.com",
  storageBucket: "gatech-trains.appspot.com",
  messagingSenderId: "828019816316"
};
firebase.initializeApp(config);
//to empty all fields
function doEmpty(){
	$('#myForm')[0].reset();
};

//init database firebase
var database = firebase.database();
var tName = $('#tName').val().trim();
var tDest = $('#tDest').val().trim();
var tFreq = $('#tFreq').val().trim();
var tStart = $('#tStart').val().trim();


//get values on click submit
$("#addTrainTime").on("click", function(event) {
	//alert("inside submit");
	event.preventDefault();

	//var convertedDate = moment(new Date(startDate));
	// console.log(convertedDate);
	// alert(eName+" | "+eRole+" | "+startDate+" | "+monthlyRate);
// save into firebase
	database.ref().push({
	    tName : tName,
	    tDest : tDest,
	    tFreq : tFreq,
	    tStart : tStart,
	    dateAdded : firebase.database.ServerValue.TIMESTAMP
  	});
  	//need to empty all fields after submit
	doEmpty();
});
//get values from database
database.ref().on("child_added", function(childSnapshot){
	var obj = childSnapshot.val();
	//var months = moment().diff(moment(obj.startDate), "months");
	//totalBill = months * obj.monthlyRate;
	console.log(obj);
  console.log("Original Start: "+ obj.tStart);
  var tStartConv = moment(obj.tStart, "hh:mm").subtract(1, "years");
  console.log("Start converted: "+tStartConv);
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  var diffTime = moment().diff(moment(tStartConv), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  var tRemainder = diffTime % obj.tFreq;
  console.log(tRemainder);
  var minutesAway = obj.tFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);
  var nextTrain = moment().add(minutesAway, "minutes");
  var nextTrainFormatted = moment(nextTrain).format("hh:mm");
  console.log("ARRIVAL TIME: " + nextTrainFormatted);
	$('#myTable tr:last').after('<tr><td>'+ obj.tName +'</td><td>'+ obj.tDest +'</td><td>'+ obj.tFreq +'</td><td>'+ nextTrainFormatted +'</td><td>'+ minutesAway +'</td>');
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added",function(snapshot){
// 	var obj = snapshot.val();
// 	var months = moment().diff(moment(obj.startDate), "months");
// 	totalBill = months * obj.monthlyRate;
// 	console.log(totalBill);

// 	$('#myTable tr:last').after('<tr><td>'+ obj.eName +'</td><td>'+ obj.eRole +'</td><td>'+ obj.startDate +'</td><td>'+ months +'</td><td>'+ "$"+obj.monthlyRate +'</td><td>'+ "$"+totalBill +'</td></tr>');
// });
