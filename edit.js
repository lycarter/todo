var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/latex");
editor.setHighlightActiveLine(true);
editor.$blockScrolling = Infinity;

var fb = new Firebase("https://lcarter-todo.firebaseio.com/");
fb.on('value', function(snapshot){
  var data = snapshot.val();
  display(data, editor);
});

editor.getSession().on('change', function(e) {
  a = editor.getValue().split("\n");
  last = a.pop()
  if (last == 'save'){
     console.log('saving');
     save(a, fb);
  }
});

function save(data, fb) {
  fb.set(data);
} 

function display(data, editor) {
  toPrint = [];
  for (i in data) {
    toPrint.push(data[i]);
  }
  editor.setValue(toPrint.join('\n'));
  editor.clearSelection();
}
