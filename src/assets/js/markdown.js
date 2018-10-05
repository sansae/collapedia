function markdown() {
  document.getElementById('preview-title').value = document.getElementById('title-input').value;

  var titleInput = document.getElementById('title-input');

  titleInput.onkeyup = function() {
    document.getElementById('preview-title').value = this.value;
  }
}
