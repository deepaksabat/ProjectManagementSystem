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
  this.assignees = assignUsers();
  debugger

  function assignUsers() {
    var names = "";
    $.each(attributes.assigned_users, function(index, user){
      names = names + user.name + " ";
    });
    return names;
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