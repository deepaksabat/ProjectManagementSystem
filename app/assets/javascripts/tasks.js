class Task {
  constructor(attributes){
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
  overdueCheck() {
    var createdDate = new Date(this.createdAt);
    var currentDate = new Date();
    if (createdDate < currentDate && this.status !== "complete") {
      this.overdue = "Overdue";
    }
  }

  // Check if the task is complete
  completeCheck() {
    if (this.status === "complete") {
      this.complete = "Complete";
    }
  }

  // Render the handlebars template
  renderTask() {
    return template(this);
  }

  // Iterate over the assigned users array and create a string of users
  assignUsers(userArray) {
    var names = "";
    $.each(userArray, function(index, user){
      names = names + user.name + ", ";
    });
    this.assignedUsers = names;
    return this.assignedUsers;
  }

  // Check if the current user is assigned to the task
  selfAssignCheck(userArray){
    var email = $("#email").text().slice(0, this.length);
    var assignment 
    $.each(userArray, function(index, user){
      if (user.email === email){
        assignment = true;
      }
    });
    return assignment;
  }
}

// master getTask function, triggered when a filter button is clicked
function getTasks() {
  $('.js-filter').on("click", function(e) {
    var route = $(event.target)[0].id
    if ( route === "all"){
      getAllTasks();
    } else {
      getRouteTasks(route);
    } 
  });
}

// if the user wants to see all tasks
function getAllTasks(){
  var route = "All Tasks";
  $.ajax({
    url: '/tasks/all',
    method: "GET",
    dataType: 'JSON'
  }).success(function(data) {
    renderResponse(data, route);
  });
}

// if the users wants to see a particular group of tasks
function getRouteTasks(route){
  $.ajax({
    url: '/tasks/all' + '-' + route,
    method: "GET",
    dataType: 'JSON'
  }).success(function(data) {
    renderResponse(data, route);
  });
}

// render the AJAX response to the page
function renderResponse(data, route) {
  $(".row").html("");
  $.each(data, function(index, task){
    var taskObject = new Task(task);
    taskObject.overdueCheck();
    taskObject.completeCheck();
    taskObject.assignUsers(task.assigned_users);
    var title = formatTitle(route);
    $('h2').html( title );
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

$(document).ready(function(){
  compileTemplate();
  getTasks();
});