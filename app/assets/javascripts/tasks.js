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

  overdueCheck() {
    var createdDate = new Date(this.createdAt);
    var currentDate = new Date();
    if (createdDate < currentDate && this.status !== "complete") {
      this.overdue = "Overdue";
    }
  }

  completeCheck() {
    if (this.status === "complete") {
      this.complete = "Complete";
    }
  }

  renderTask() {
    return template(this);
  }

  assignUsers(userArray) {
    var names = "";
    $.each(userArray, function(index, user){
      names = names + user.name + ", ";
    });
    this.assignedUsers = names;
    return this.assignedUsers;
  }

  selfAssignCheck(userArray){
    var email = $("#email").text().slice(14, this.length);
    var assignment = false ;
    $.each(userArray, function(index, user){
      if (user.email === email){
        assignment = true;
      }
    });
    return assignment;
  }
}

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

function getRouteTasks(route){
  $.ajax({
    url: '/tasks/all' + '-' + route,
    method: "GET",
    dataType: 'JSON'
  }).success(function(data) {
    renderResponse(data, route);
  });
}


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

function compileTemplate(){
  source = $("#template").html();
  if ( source !== undefined ) {
    template = Handlebars.compile(source); 
  }
}

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