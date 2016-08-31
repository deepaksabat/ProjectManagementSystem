$(document).ready(function(){
  compileTemplate();
  getTasks();
});

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
// function getTasks() {
//   $('.js-filter).on("click", function(event) {
//     event.preventDefault();
//     
//     var path = $(event.target).attr('href');
//     var title = $(event.target).text();
//     fetchTasks(path, title);
//   });
// }

function getTasks() {
  $('#filter-tasks-js').on("submit", function(event) {
    event.preventDefault();
    var url = $(event.target).attr('action')
    var values = $(this).serialize();
    fetchTasks(url, values);
  });
}


// fetch tasks based on path
// function fetchTasks(url, title){
//   debugger
//   $.ajax({
//     url: url,
//     method: "GET",
//     dataType: 'JSON'
//   }).success(function(data) {
//     var newTitle = formatTitle(title);
//     $('h2').html(newTitle);
//     renderResponse(data);
//   });
// }

function fetchTasks(url, values){
  $.ajax({
    url: url,
    method: "GET",
    data: values,
    dataType: 'JSON'
  }).success(function(data) {
    console.log(data);
    $(".row").html("");
    renderResponse(data);
  });
}

function filterData(data) {

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
