class Comment {
  constructor(attributes){
    this.id = attributes.id;
    this.content = attributes.content;
    this.created_at = attributes.created_at;
    this.task_id = attributes.task_id;
    this.user_id = attributes.user_id;
  } 

  friendlyDate() {
    var date = new Date(this.created_at);
    var friendlyDate = this.formatDate(date);
    return friendlyDate;
  }

  formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " at " + strTime;
  }

  renderComment(){
    return template({content: this.content, id: this.id, createdAt: this.friendlyDate()});
  }

}

function newComment() {
  $('#new_comment').submit(function(event) {
    event.preventDefault();
    var values = $(this).serialize();
    $.post('/projects/1/comments',values).success(function(data) {
        var comment = new Comment(data);
        var commentRender = comment.renderComment()
        $(".comments").prepend(commentRender);
        $("#comment_content").val("");
      });
  });
}

function editComment() {
  $('#edit-comment').click(function(event) {
    event.preventDefault();
    var href = $(this).attr('href');
    $.ajax({
      url: href,
      method: "GET",
      dataType: 'JSON'
    }).done(function(data) {
      alert("hello!");
      console.log(data);
    });
  });

}


function compileTemplate(){
  var source = $("#template").html();
  if ( source !== undefined ) {
    alert("helo")
    template = Handlebars.compile(source); 
  }
}

$(document).ready(function(){
  compileTemplate();
  newComment();
  editComment();
});