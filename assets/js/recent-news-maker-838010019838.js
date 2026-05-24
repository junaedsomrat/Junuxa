let newsList=[];

function addNews(){
 const item={
  title:document.getElementById("title").value,
  thumbnail:document.getElementById("thumbnail").value,
  date:document.getElementById("date").value,
  author:document.getElementById("author").value,
  content:document.getElementById("content").value
 };
 
 if(!item.title){
  alert("Title is required!");
  return;
 }
 
 newsList.push(item);
 alert("News added! Total: "+newsList.length);
 
 // Clear form
 document.getElementById("title").value="";
 document.getElementById("thumbnail").value="";
 document.getElementById("date").value="";
 document.getElementById("author").value="";
 document.getElementById("content").value="";
}

function generateJSON(){
 if(newsList.length===0){
  alert("Add at least one news item!");
  return;
 }
 document.getElementById("output").style.display="block";
 document.getElementById("jsonOutput").value=JSON.stringify(newsList,null,2);
}

function clearList(){
 if(confirm("Clear all news items?")){
  newsList=[];
  document.getElementById("output").style.display="none";
 }
}

function copyJSON(){
 const textarea=document.getElementById("jsonOutput");
 textarea.select();
 document.execCommand("copy");
 alert("Copied to clipboard!");
}