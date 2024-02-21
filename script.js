function toggleProjectInfo(projectNumber) {
  var projectInfo = document.getElementById('project-info-' + projectNumber);
  var button = document.querySelector('#project-info-' + projectNumber + ' + button');
  if (projectInfo.style.display === 'none' || projectInfo.style.display === '') {
    projectInfo.style.display = 'block';
    button.textContent = 'Click to hide';
  } else {
    projectInfo.style.display = 'none';
    button.textContent = 'Click to read more';
  }
}
