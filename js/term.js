var expanded=false;
var currentContent="home";

window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

window.onload = function() {
	$("#main-content").load("dynamic_content/home.html"); 
	$("#term-container").append('<div class="card term-card"><div class="term term-focus" id="term"></div></div>'); 
	if(window.mobileAndTabletCheck()==true) {
		$("#term-container").hide();
		$("#main-content").css("margin-bottom", "40px");
	}
	function fauxTerm(config) {
		
		var term = config.el || document.getElementById('term');
		var termBuffer = config.initialMessage || '';
		var lineBuffer = config.initialLine || '';
		var cwd = config.cwd || "~/";
		var tags = config.tags || ['red', 'lblue', 'white', 'bold'];
		var processCommand = config.cmd || false;
		var maxBufferLength = config.maxBufferLength || 8192;
		var commandHistory = [];
		var currentCommandIndex = -1;
		var maxCommandHistory = config.maxCommandHistory || 100;
		var autoFocus = config.autoFocus || false;
		var coreCmds = {
			"clear": clear,
			"help": help,
			"home": home,
			"blog": blog,
			"charts": charts,
			"startpage": startpage
		};
		var cmdsHelp = {
			"clear": "Clears the screen",
			"help": "Shows this help page",
			"home": "Opens the home page",
			"blog": "Opens the blog page",
			"charts": "Opens the charts page",
			"startpage": "Opens the startpage page"
		};
		
		var fauxInput = document.createElement('textarea');
		fauxInput.className = "faux-input";
		document.body.appendChild(fauxInput);
		if ( autoFocus ) {
			fauxInput.focus();
		}
		help();


		function getLeader() {
			return cwd + "$ ";
		}

		function renderTerm() {
			var bell = '<span class="bell"></span>';
			var ob = termBuffer + getLeader() + lineBuffer;
			term.innerHTML = ob;
			term.innerHTML += bell;
			term.scrollTop = term.scrollHeight;
		}
		
		function writeToBuffer(str) {
			termBuffer += str;
			
			//Stop the buffer getting massive.
			if ( termBuffer.length > maxBufferLength ) {
				var diff = termBuffer.length - maxBufferLength;
				termBuffer = termBuffer.substr(diff);
			}
			term.scrollTop = term.scrollHeight;
			
		}
		
		function renderStdOut(str) {
			var i = 0, max = tags.length;
			for ( i; i<max; i++ ) {
				var start = new RegExp('{' + tags[i] + '}', 'g');
				var end = new RegExp('{/' + tags[i] + '}', 'g');
				str = str.replace(start, '<span class="' + tags[i] + '">');
				str = str.replace(end, '</span>');
			}
			return str;
		}
		
		function clear(argv, argc) {
			termBuffer = "";
			return "";
		}

		function blog(argv, argc) {
			$("#main-content").load("dynamic_content/blog.html");
			return "";
		}

		function charts(argv, argc) {
			$("#main-content").load("dynamic_content/charts.html");
			return "";
		}

		function startpage(argv, argc) {
			window.location.pathname = '/startpage/index.html';
			return "";
		}

		function home(argv, argc) {
			$("#main-content").load("dynamic_content/home.html");
			return "";
		}

		function help(argv, argc) {
			writeToBuffer("\nCommands available:\n");
			let entries = Object.entries(cmdsHelp);
			for (const [cmd, desc] of entries) {
				stdout = renderStdOut("\t{lblue}{bold}"+cmd+"{/bold}{/lblue}: "+desc+"\n");
				writeToBuffer(stdout);
			}
			writeToBuffer("\n");
			return "";
		}
		
		function isCoreCommand(line) {
			if ( coreCmds.hasOwnProperty(line) ) {
				return true;
			}
			return false;
		}
		
		function coreCommand(argv, argc) {
			
			var cmd = argv[0];
			return coreCmds[cmd](argv, argc);
			
		}

		function processLine() {
			
			//Dispatch command
			var stdout, line = lineBuffer, argv = line.split(" "), argc = argv.length;
			
			var cmd = argv[0];
			
			lineBuffer += "\n";
			writeToBuffer( getLeader() + lineBuffer );
			lineBuffer = "";
			 
			//If it's not a blank line.
			if ( cmd !== "" ) {
				
				//If the command is not registered by the core.
				if ( !isCoreCommand(cmd) ) {
					
					//User registered command
					if ( processCommand ) {
						stdout = processCommand(argv,argc);
					} else {
						stdout = "{white}{bold}" + cmd + "{/bold}{/white}: command not found\n";
					}
				} else {
					//Execute a core command
					stdout = coreCommand(argv,argc);
				}

				//If an actual command happened.
				if ( stdout === false ) {
					stdout = "{white}{bold}" + cmd + "{/bold}{/white}: command not found\n";
				}
			
				stdout = renderStdOut(stdout);
				writeToBuffer(stdout);
				
				addLineToHistory(line);
			
			}

			renderTerm();
		}
		
		function addLineToHistory(line) {
			commandHistory.unshift( line );
			currentCommandIndex = -1;
			if ( commandHistory.length > maxCommandHistory ) {
				console.log('reducing command history size');
				console.log(commandHistory.length);
				var diff = commandHistory.length - maxCommandHistory;
				commandHistory.splice(commandHistory.length -1, diff);
				console.log(commandHistory.length);
			}
		}
		
		function isInputKey(keyCode) {
			var inputKeyMap = [32,190,192,189,187,220,221,219,222,186,188,191];
			if ( inputKeyMap.indexOf(keyCode) > -1 ) {
				return true;
			}
			return false;
		}
		
		function toggleCommandHistory(direction) {
			
			var max = commandHistory.length -1;
			var newIndex = currentCommandIndex + direction;
			
			if ( newIndex < -1 ) newIndex = -1;
			if ( newIndex >= commandHistory.length) newIndex = commandHistory.length -1;
			
			if ( newIndex !== currentCommandIndex ) {
				currentCommandIndex = newIndex;
			}
			
			if ( newIndex > -1 ) {
				//Change line to something from history.
				lineBuffer = commandHistory[newIndex];
			} else {
				//Blank line...
				lineBuffer = "";
			}
			
			
		}

		function acceptInput(e) {
			e.preventDefault();
			
			 fauxInput.value = "";
			
			if ( e.keyCode >= 48 && e.keyCode <= 90 || isInputKey(e.keyCode) ) {
				if (! e.ctrlKey ) {
					//Character input
					lineBuffer += e.key;
				} else {
					//Hot key input? I.e Ctrl+C
				}
			} else if ( e.keyCode === 13 ) {
				processLine();
			} else if ( e.keyCode === 9 ) {
				lineBuffer += "\t";
			} else if ( e.keyCode === 38 ) {
				toggleCommandHistory(1);
			} else if ( e.keyCode === 40 ) {
				toggleCommandHistory(-1);
			}
			else if ( e.key === "Backspace" ) {
				lineBuffer = lineBuffer.substr(0, lineBuffer.length -1);
			}

			renderTerm();
		}

		term.addEventListener('click', function(e){
			fauxInput.focus();
			term.classList.add('term-focus');
		});
		fauxInput.addEventListener('keydown', acceptInput);
		fauxInput.addEventListener('blur', function(e){
			term.classList.remove('term-focus');
		});
		renderTerm();
		
	}
	var myTerm = new fauxTerm({
		el: document.getElementById("term"),
		cwd: "~/",
		initialMessage: "Welcome to the console!\n",
		autoFocus: true
		/*
		tags: ['red', 'blue', 'white', 'bold'],
		maxBufferLength: 8192,
		maxCommandHistory: 500,
		cmd: function(argv, argc) {
			console.log(argv);
			return false;
		}*/
	});
}

function loadContent(name){
	$("#main-content").load("dynamic_content/"+name+".html");
	currentContent=name;
}

function loadSideContent(name){
	$("#preview").load("common/card_holder.html", function() {
		$("#card-content").load(name);
	});
}

function closeSideContent(name){
	if(expanded) {
		expandSideContent();
		$("#preview").empty();	
	} else {
		$("#preview").empty();	
	}
}

function loadBlogContent(name){
	$("#preview").load("common/card_holder.html", function() {
		$("#card-content").load("blog/"+name+"_content.html");
	});
}

function expandSideContent(){
	if(expanded) {
		$("#third-column").removeClass("col-xl-8");
		$("#second-column").addClass("col-xl-4");
		$("#third-column").addClass("col-xl-4");
		$("#second-column").append('<div id="main-content"></div>');
		loadContent(currentContent);
		expanded=false;
	} else {
		$("#second-column").empty();
		$("#second-column").removeClass("col-xl-4");
		$("#third-column").removeClass("col-xl-4");
		$("#third-column").addClass("col-xl-8");
		expanded=true;
	}
}

function showPizza(){
	var pizza = $("#pizza");
	pizza.show('slow');
	pizza.hide('slow');
}
