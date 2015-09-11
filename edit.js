var fb = new Firebase("https://lcarter-todo.firebaseio.com/");

$(document).ready(function() {
  fb.once("value", function(data) {

    var editors = {};
    for (var name in data.val()) {
      drawNavPill($("ul"), name);
      editors[name] = (drawEditor($(".tab-content"), name));
    }

    d = data.val();
    displayAll(d, editors);

    fb.on("value", function(snapshot) {
      if (editors) {
        var data = snapshot.val();
        displayAll(data, editors);
      }
    });
  });


});

function drawNavPill(element, title) {
  if ($('li').length === 0) {
    pill = $("<li>", {'class': 'active'}).append($("<a>", {'data-toggle': 'tab', 'href': '#' + title}).text(title));
  } else {
    pill = $("<li>").append($("<a>", {'data-toggle': 'tab', 'href': '#' + title}).text(title));
  }
  element.append(pill);
}

function drawEditor(parent, title) {
  if ($('.editor-pane').length === 0) {
    element = $("<div>", {'class': 'tab-pane active', 'id': title}).append($("<div>", {'id': 'editor-' + title, 'class': 'editor-pane'}));
  } else {
    element = $("<div>", {'class': 'tab-pane', 'id': title}).append($("<div>", {'id': 'editor-' + title, 'class': 'editor-pane'}));
  }
  parent.append(element);

  var editor = ace.edit('editor-' + title);
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/latex");
  editor.setHighlightActiveLine(true);
  editor.setShowPrintMargin(false);
  editor.$blockScrolling = Infinity;

  editor.getSession().on('change', function(e) {
    text = editor.getValue().split("\n");
    last = text.pop();
    if (last == 'save'){
       console.log('saving');
       save(title, text, fb);
    }
  });

  return editor;
}

function save(title, data, fb) {
  fb.child(title).set(data);
}

function displayAll(data, editors) {
  for (var i in data) {
    displayOne(data[i], editors[i]);
  }
}

function displayOne(data, editor) {
  var toPrint = [];
  for (var i in data) {
    toPrint.push(data[i]);
  }
  editor.setValue(toPrint.join('\n'));
  editor.clearSelection();
}
