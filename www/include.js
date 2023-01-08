/*******************************************************************************

            7 December MMXXI PUBLIC DOMAIN by Jean-Marc Lienher

            The authors disclaim copyright to this source code.

 ******************************************************************************/


let include_loading = 0;

if (typeof process != "undefined") {
	global.include = global.include || include;
	global.bind = global.bind || bind;
}

function node_alert(m)
{
	console.log(m);
}

function include(src)
{
	if ((typeof navigator == "undefined")) {
		global.window = global.window || global;
		global.document = global.document || {};
		global.alert = global.alert || node_alert;
		global.run = global.run || run;
		require(src);
		return;
	}
	window.process = window.process || {};
	window.process.argv = window.process.argv || [];
	include_loading++;
	let s = document.createElement("script");
	let r = document.getElementById("scripts").parentNode;
	let x = null;
	let lst = r.lastChild;
	r.appendChild(s);
	if (include_loading == 1) {
		s.setAttribute("src", src + ".js");
	} else {
		s.setAttribute("src_", src + ".js");
		//s.setAttribute("src", "");
	}
	//s.setAttribute("id", "s" + include_loadin);
	s.addEventListener("load", end, false);
}

function end(ev)
{
	include_loading--;
	let r = document.getElementById("scripts").parentNode;
	let c = r.getElementsByTagName("script");
	let i = 0;
	while (i < c.length) {
		if (c[i].getAttribute("src") === null) {
			c[i].setAttribute("src", c[i].getAttribute("src_"));
			return;
		}
		i++;
	}
	if (include_loading == 0) {
	
		include_loading = -128;

	}
	//window[ev.target.data] ;
}

function run(app)
{
	if (typeof navigator == "undefined") {
		window[app].main();	
	} else {
		if (include_loading < 0) {
			window[app].main();
		} else {
			setTimeout(run, 50, app);
		}
	}
}

/*
function bind(cls, callback) {
	return cls[callback].bind(cls);
}
*/
