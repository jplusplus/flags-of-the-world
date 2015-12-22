var htmlClassList = document.documentElement.classList;
htmlClassList.remove("nojs");
htmlClassList.add("js");

var select = document.getElementById("languages");
select.addEventListener('change', function() {
    this.form.submit();
}, false);
var date = document.getElementById("dates");
dates.addEventListener('change', function() {
    this.form.submit();
}, false);
