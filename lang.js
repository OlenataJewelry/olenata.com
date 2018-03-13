(function(){
  var part = (location.search.match(/[?&]+hl=([a-z]{2})/) || [])[1];
  var lang = (part || navigator.userLanguage || navigator.language).toLowerCase(); 
  var node = document.querySelector('div[lang=' + lang.substr(0, 2) + ']') ||
             document.querySelector('div[lang=uk]');
  if (node) node.style.display = 'block';
})();
