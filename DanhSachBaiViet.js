$(".nav-item").click(function(){
	console.log("test");
	$(this).children(".dropdown-menu").slideToggle(600);
  });