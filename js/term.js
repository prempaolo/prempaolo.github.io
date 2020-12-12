var expanded=false;
var currentContent="home";

window.onload = function() {
	$("#main-content").load("dynamic_content/home.html"); 
	$("#term-container").append('<div class="card term-card"><div class="term term-focus" id="term"></div></div>'); 
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
