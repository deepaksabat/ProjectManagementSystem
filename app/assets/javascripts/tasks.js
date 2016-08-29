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
    var assignment = "" ;
    $.each(userArray, function(index, user){
      if (user.email === email){
        assignment = true;
      }
    });
    return assignment;
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
          var taskObject = new Task(task);
          taskObject.completeCheck();
          taskObject.overdueCheck();
          taskObject.assignUsers(task.assigned_users);          
          var taskRender = taskObject.renderTask()
          $("h2").html("All Active Tasks");
          $(".row").prepend(taskRender);
          if (taskObject.selfAssignCheck(task.assigned_users) === true){
            $("#self-assign").text("Assigned to you");
          }
        })
      });
  });
}

function getCompleteTasks() {
  $('#complete-tasks').on("click", function(e) {
    $.ajax({
      url: '/tasks/all-complete-tasks',
      method: "GET",
      dataType: 'JSON'
    }).success(function(data) {
        $(".row").html("");
        $.each(data, function(index, task){
          var taskObject = new Task(task);
          taskObject.overdueCheck();
          taskObject.completeCheck();
          taskObject.assignUsers(task.assigned_users);
          var taskRender = taskObject.renderTask();
          $("h2").html("All Complete Tasks");
          $(".row").prepend(taskRender);
        })
      });
  });
}

function getOverdueTasks() {
  $('#overdue-tasks').on("click", function(e) {
    $.ajax({
      url: '/tasks/all-overdue-tasks',
      method: "GET",
      dataType: 'JSON'
    }).success(function(data) {
        $(".row").html("");
        $.each(data, function(index, task){
          var taskObject = new Task(task);
          taskObject.overdueCheck();
          taskObject.completeCheck();
          taskObject.assignUsers(task.assigned_users);
          var taskRender = taskObject.renderTask();
          $("h2").html("All Overdue Tasks");
          $(".row").prepend(taskRender);
        })
      });
  });
}

function getAllTasks() {
  $('#all').on("click", function(e) {
    $.ajax({
      url: '/tasks/all',
      method: "GET",
      dataType: 'JSON'
    }).success(function(data) {
        $(".row").html("");
        $.each(data, function(index, task){
          var taskObject = new Task(task);
          taskObject.overdueCheck();
          taskObject.completeCheck();
          taskObject.assignUsers(task.assigned_users);
          var taskRender = taskObject.renderTask();
          $("h2").html("All Tasks");
          $(".row").prepend(taskRender);
        })
      });
  });
}

$(document).ready(function(){
  source = $("#template").html();
  template = Handlebars.compile(source); 
  getActiveTasks();
  getCompleteTasks();
  getOverdueTasks();
  getAllTasks();
});