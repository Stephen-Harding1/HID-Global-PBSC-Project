var xhr = new XMLHttpRequest();
xhr.responseType = "document";
xhr.open("GET", "https://javascriptproject.s3.amazonaws.com/workstation.xml", true);
xhr.send();

var	count = 0;
var idArr = [];
var nameArr = [];

 
//display function to set values in html
function setArrValues(){
	document.getElementById("value").value = nameArr[count];
	document.getElementById("setting").value = idArr[count];
}
//function to set the list menu
function wsMenu(){
	htm="";
	for(i=0;i<nameArr.length;i++){
		htm+="<button cnt='"+[i]+"' id='item"+[i]+"' class='wsItem' wsName='"+nameArr[i]+"' wsId='"+idArr[i]+"' onclick='itemClick(this)'>"
		+"Name: "+nameArr[i]+"<span></span> Id: "+idArr[i]+"</button>";
	}
	document.getElementById("wsList").innerHTML=htm;
}

//function to set values in form to whatever button the user selects from the wsMenu
function itemClick(d){
	document.getElementById("value").value = d.getAttribute("wsName");
	document.getElementById("setting").value = d.getAttribute("wsId");
	count=d.getAttribute("cnt");
}



//This function loads the data from the XML file into arrays
xhr.onload = function() {
	var xmlDoc = this.responseXML;
	var id = xmlDoc.getElementsByTagName("setting");
	var name = xmlDoc.getElementsByTagName("value");
	for(i = 0; i < id.length; i++){
// I had to change the code here, because name is an attribute.		
		idArr.push(id[i].getAttribute('name'));
		nameArr.push(name[i].textContent);

	}
	setArrValues();
	console.log("XML loaded");
	wsMenu();	
};   

	
//This is the code for the next button

document.getElementById("next").addEventListener("click", function(){
	count++;
	if(count == nameArr.length){
		count=0;
		setArrValues();
	}
	else{
		setArrValues();
	}
	document.getElementById("item"+count).focus();
	
});

//This is the code for the previous button

document.getElementById("previous").addEventListener("click", function(){
	if(count > 0){
		count = count - 1;
		setArrValues();
	}
	else{
		count=nameArr.length-1;
		setArrValues();
	}
	document.getElementById("item"+count).focus();
});

//This is the code for the modify button

document.getElementById("modify").addEventListener("click", function(){
	if (nameArr.length === 0){
		alert("There are no workstations to modify!")
	}
	else{
	tempName = nameArr[count];
	tempId = idArr[count];
	nameArr[count] = prompt("Please enter the new name: ", nameArr[count]);
	idArr[count] = prompt("Please enter the new ID: ", idArr[count]);
	
	if(nameArr[count] === null){
		nameArr[count] = tempName;
	}
	if(idArr[count] === null){
		idArr[count] = tempId;
	}
	}
	if(!checkForDuplicates()){
		nameArr[count] = tempName;
		idArr[count] = tempId;
	}
	setArrValues();
	wsMenu();	
});

//This is the code for the new button

document.getElementById("new").addEventListener("click", function(){
	tempName = prompt("Please enter the new name: ", "new name")
	tempId = prompt("Please enter the new ID: ", "new id")
	if(tempName === null || tempId === null){
		alert("Workstation name or workstation id was not entered!")
	}
	else{
	nameArr.push(tempName);
	idArr.push(tempId);
	}
	if(!checkForDuplicates()){
		nameArr.pop();
		idArr.pop();
	}
	setArrValues();
	wsMenu();	
});

//This is the code for the delete button

document.getElementById("delete").addEventListener("click", function(){
	if(nameArr.length === 0){
		alert("There are no workstations to delete!")
	}
	else{
	if(confirm("Are you sure you want to delete this workstation?")){
	nameArr.splice(count,1);
	idArr.splice(count,1);
	if(count === 0 ){
	document.getElementById("value").value = nameArr[count];
	document.getElementById("setting").value = idArr[count];
	}
	else{
		count = count - 1;
		document.getElementById("value").value = nameArr[count];
		document.getElementById("setting").value = idArr[count];
	}
	}
	if(nameArr.length === 0){
		document.getElementById("value").value = "No Workstations";
		document.getElementById("setting").value = "No Workstation IDs";
	}
}
wsMenu();	
});

// This is the code for the save button
document.getElementById("save").addEventListener("click", function() {
	//write the XML file
	var text='<?xml version="1.0" encoding="utf-8"?><WorkstationConfiguration><WorkstationIds>';//xml loop code will go here
	for(i=0;i<nameArr.length;i++){

		text= text+'<setting name="'+idArr[i]+'" serializeAs="String"><value>'+nameArr[i]+'</value>'+'</setting>';
	} // for
	text=text+'</WorkstationIds></WorkstationConfiguration>';

	var name=prompt("Enter a name for the file to be downloaded");
	
	if(name != null){
		name = name + '.xml'
		alert(name);
		var myFile = document.createElement('a'); 
		var contentFile = new Blob([text], {type: 'text/xml'});//type is XML on the html side
		myFile.setAttribute('href', window.URL.createObjectURL(contentFile));
		myFile.setAttribute('download', name);
		
		myFile.dataset.downloadurl = ['text/plain', myFile.download, myFile.href].join(':');
		myFile.draggable = true; 
		myFile.classList.add('dragout');

		myFile.click();
	}
});





checkForDuplicates = function(){
	for(i = 0; i < nameArr.length; i++){
		for(j = i + 1; j < nameArr.length; j++){
			if(nameArr[i] === nameArr[j]){
				alert("ERROR: A workstation already exists with that name!" );
				return false;
			}
			if(idArr[i] === idArr[j]){
				alert("ERROR: A workstation already exists with that ID!");
				return false;
			}
		}
	}
	return true;
}

var openFile = function(event) {
	var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
		var text = reader.result;
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(text, "text/xml");
		nameArr.splice(0, nameArr.length);
		idArr.splice(0, idArr.length);
		var id = xmlDoc.getElementsByTagName("setting");
		var name = xmlDoc.getElementsByTagName("value");
		for(i = 0; i < id.length; i++){	
			idArr.push(id[i].getAttribute('name'));
			nameArr.push(name[i].textContent);
			}
		setArrValues();
		console.log("XML loaded");
		wsMenu();	
	}
    reader.readAsText(input.files[0]);
};