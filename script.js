function scrollCourses(){
  document.getElementById("courses").scrollIntoView({behavior:"smooth"})
}

function openLogin(){
  alert("Login Feature Coming Soon")
}

function openBatch(){
  window.location.href = "batch.html"
}

function openSubjects(){
  window.location.href = "subject.html"
}

function openChapters(){
  window.location.href = "chapter.html"
}

function openTopics(){
  window.location.href = "topic.html"
}

function openLesson(videoId){
  localStorage.setItem("selectedVideo", videoId)
  window.location.href = "lesson.html"
}
