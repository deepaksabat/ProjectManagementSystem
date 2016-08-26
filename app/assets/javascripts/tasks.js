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
  }

  overdueCheck() {
    var createdDate = new Date(this.createdAt);
    var currentDate = new Date();
    if (createdDate < currentDate) {
      this.overdue = "Overdue";
    }
  }

  completeCheck() {
    if (this.status === "complete") {
      this.complete = "Complete";
    }
  }

  renderTask() {
    return Task.template(this);
  }

  assignUsers() {
    var names = "";
    $.each(attributes.assigned_users, function(index, user){
      names = names + user.name + " ";
    });
    return names;
  }
}

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

$(document).ready(function(){
  Task.templateSource = $("#activeTasksTemplate").html();
  Task.template = Handlebars.compile(Task.templateSource); 
  getActiveTasks();
});