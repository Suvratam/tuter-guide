// Choose which sidebar file to load
// You can change this value dynamically later
const sidebarFile = 'sidebar/docker.html';  // or 'sidebar/git.html', etc.

fetch(sidebarFile)
  .then(response => response.text())
  .then(data => {
    document.getElementById('sidebar').innerHTML = data;
  })
  .catch(error => {
    console.error('Error loading sidebar:', error);
  });
