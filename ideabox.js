var ideaList = $('.idea-list');
var ideaTitle = $('.idea-title');
var ideaBody = $('.idea-body');
var saveButton = $('#save-button');
var titleField = $('#title-input');
var bodyField = $('#body-input');
var ideaFields = $('#title-input, #body-input');
var ideaBox = $('.idea-box');
var storageArray = [];
var currentIdea;

getAndDisplayIdeas()

function getAndDisplayIdeas() {
  for (var i = 0; i < localStorage.length; i++) {
    var idea = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependIdeas(idea);
  }
}


saveButton.on('click', function() {
  addNewIdeaBox();
  clearInputFields();
  disableSaveButton();
  storeNewObject();
});

function NewIdeaConstructor(titleText, bodyText, quality, uniqueid){
  this.titleText = titleText;
  this.bodyText = bodyText;
  this.quality =  quality || "swill";
  this.uniqueid = uniqueid || Date.now();
}

function addNewIdeaBox(titleText, bodyText) {
  currentIdea = new NewIdeaConstructor(titleField.val(), bodyField.val());
  prependIdeas(currentIdea);
}

function prependIdeas(currentIdea) {
  ideaList.prepend(
    `<article id=${currentIdea.uniqueid} class="idea-box">
      <div class="search-field">
        <div class="idea-box-header">
          <h2 class="idea-title" contentEditable="true">${currentIdea.titleText}</h2>
          <p class="delete-idea"></p>
        </div>
        <p class="idea-body" contentEditable="true">${currentIdea.bodyText}</p>
      </div>
      <div class="idea-box-footer">
        <p class="upvote"></p>
        <p class="downvote"></p>
        <div class="idea-ranking-quality">quality:</div>
        <div class="idea-ranking">${currentIdea.quality}</div>
      </div>
    </article>`);
}

$("#search-input").keyup(function(){

  var filter = $(this).val();
  $(".idea-list .search-field").each(function() {
    if ($(this).text().search(new RegExp(filter, "i")) < 0) {
      $(this).parent().addClass('hidden');
    } else {
      // $(this).removeClass('hidden');
      getAndClearAndDisplayIdeas();
    }
  });
});

function clearInputFields() {
  return titleField.val("") && bodyField.val("");
}

function disableSaveButton() {
  saveButton.prop('disabled', true);
}

function storeNewObject(){
  localStorage.setItem(currentIdea.uniqueid, JSON.stringify(currentIdea));
}

$('.idea-list').on('click', '.delete-idea', function(){
  var ideaId = this.closest('article').id;
  $(this).closest('article').remove();
  localStorage.removeItem(ideaId);
});

$('.idea-list').on('click', '.upvote', function(){
  var qualityStatus = $(this).closest('.idea-box').find('.idea-ranking');
  var quality;
  var ideaID = this.closest('article').id;
  if (qualityStatus.text() == 'swill'){
    quality = 'plausible';
  } else if (qualityStatus.text() === 'plausible'){
    quality = 'genius';
  }
  storeUpdate(ideaID, 'quality', quality);
  getAndClearAndDisplayIdeas();
});

function storeUpdate(id, attribute, newValue) {
  for (var i = 0; i < localStorage.length; i++) {
    var idea = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (id == idea.uniqueid) {
      if (attribute === 'quality') {
        idea.quality = newValue;
      } else if (attribute === 'title') {
        idea.title = newValue;
      } else if (attribute === 'body') {
        idea.body = newValue;
      }
      localStorage.setItem(parseInt(id), JSON.stringify(idea));
    }
  }
}

function getAndClearAndDisplayIdeas() {
  $('.idea-box').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var idea = JSON.parse(localStorage.getItem(localStorage.key(i)));
    prependIdeas(idea);
}
}










$('.idea-list').on('click', '.downvote', function(){
var qualityStatus = $(this).siblings('.idea-ranking');
 if (qualityStatus.html() === 'genius'){
qualityStatus.replaceWith(`<div class="idea-ranking">plausible</div>`)
} else if (qualityStatus.html() === 'plausible'){
  qualityStatus.replaceWith(`<div class="idea-ranking">swill</div>`)
}
});
//swill  -  plausible  -  genius

$(ideaFields).on('input', function(){
  if($('#title-input').val() && $('#body-input').val()){
    $('#save-button').prop('disabled', false);
  } else {
    $('#save-button').prop('disabled', true);
  }
});

ideaFields.keypress(function(event) {
   if (event.which === 13) {
     addNewIdeaBox();
     clearInputFields();
     disableSaveButton();
     storeNewObject();
   }
 });
