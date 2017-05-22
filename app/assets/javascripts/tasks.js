$(document).ready(function(){
  compileTemplate();
  getTasks();
});

function Task(attributes) {
  this.id = attributes.id;
  this.description = attributes.description;
  this.name = attributes.name;
  this.dueDate = attributes.due_date;
  this.status = attributes.status;
  this.createdAt = attributes.created_at;
  this.ownerName = attributes.owner.name;
  this.projectName = attributes.project.name;
  this.commentCount = attributes.comments.length;
  this.projectID = attributes.project.id;
  this.overdue = "";
  this.complete = "";
  this.assignedUsers = "";
}

  // Check if the task is overdue
Task.prototype.overdueCheck = function() {
  var createdDate = new Date(this.createdAt);
  var currentDate = new Date();
  if (createdDate < currentDate && this.status !== "complete") {
    this.overdue = "Overdue";
  }
}

  // Check if the task is complete
Task.prototype.completeCheck = function() {
  if (this.status === "complete") {
    this.complete = "Complete";
  }
}

  // Render the handlebars template
Task.prototype.renderTask = function() {
  return template(this);
}

  // Iterate over the assigned users array and create a string of users
Task.prototype.assignUsers = function(userArray) {
  var names = "";
  $.each(userArray, function(index, user){
    names = names + user.name + ", ";
  });
  this.assignedUsers = names;
  return this.assignedUsers;
}

  // Check if the current user is assigned to the task
Task.prototype.selfAssignCheck = function(userArray){
  var email = $("#email").text().slice(0, this.length);
  var assignment 
  $.each(userArray, function(index, user){
    if (user.email === email){
      assignment = true;
    }
  });
  return assignment;
}


function getTasks() {
  $('#filter-tasks-js').on("submit", function(event) {
    event.preventDefault();
    var url = $(event.target).attr('action')
    var values = $(this).serialize();
    fetchTasks(url, values);
  });
}

function fetchTasks(url, values){
  $.get(url, values, function(data) {
    $(".row").html("");
    $('h2').text(data.length + " Tasks");
    renderResponse(data);
  }, "json");
}

// render the AJAX response to the page
function renderResponse(data) {
  $.each(data, function(index, task){
    var taskObject = new Task(task);
    taskObject.overdueCheck();
    taskObject.completeCheck();
    taskObject.assignUsers(task.assigned_users);
    var taskRender = taskObject.renderTask();
    $(".row").prepend(taskRender);
    if (taskObject.selfAssignCheck(task.assigned_users) === true){
      $("#self-assign").text("Assigned to you");
    }
  })
}

// compile the handlebars template on document load
function compileTemplate(){
  source = $("#template").html();
  if ( source !== undefined ) {
    template = Handlebars.compile(source); 
  }
}

// format the page title after an AJAX request
function formatTitle(str){
  var array = str.replace(/[-]/, " ").split(" ");
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray[i] = array[i].charAt(0).toUpperCase() + array[i].substr(1);
  }
  return newArray.join(" ");
}
