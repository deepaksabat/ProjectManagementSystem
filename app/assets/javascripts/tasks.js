function getActiveTasks() {
  $('#active-tasks').on("click", function(e) {
    $.ajax({
      url: '/tasks/all-active-tasks',
      method: "GET",
      dataType: 'JSON'
    }).success(function(data) {
        $(".row").html("");
        $.each(data, function(index, task){
          var task = new Task(task);
          task.overdueCheck();
          task.completeCheck();
          var taskRender = task.renderTask()
          $(".row").prepend(taskRender);
        })
      });
  });
}

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
}

Task.prototype.assignUsers = function() {
  var names = "";
  $.each(attributes.assigned_users, function(index, user){
    names = names + user.name + " ";
  });
  return names;
}

Task.prototype.overdueCheck = function() {
  var createdDate = new Date(this.createdAt);
  var currentDate = new Date();
  if (createdDate < currentDate) {
    this.overdue = "Overdue";
  } else {
    return "hello";
  }
}

Task.prototype.completeCheck = function() {
  if (this.status === "complete") {
    this.complete = "Complete";
  }
}

Task.prototype.renderTask = function (){
  return Task.template(this);
}

$(document).ready(function(){
  Task.templateSource = $("#activeTasksTemplate").html();
  Task.template = Handlebars.compile(Task.templateSource); 
  getActiveTasks();
});