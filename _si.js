// GPLv2 License - Copyright (c) 2014 Dave Martin
_si.survey = function () {
	
	var d = document, h = d.getElementsByTagName('head')[0],
		id = '_si';
		
	function addCss () {
	    var c = d.createElement( 'link' );
	   
	    c.rel  = 'stylesheet';
	    c.type = 'text/css';
	    c.href = '_si/_si.css';
	    c.media = 'all';
	    
	    h.appendChild( c );
	}
	
	function addSurvey() {
		var s = d.createElement( 'div' );
		
		s.id = id;
		s.innerHTML = '<form id="_si-form" name="_si-form" method="post">' +
					  '<span>' + encodeHTML(_si.settings.question) + '</span>' +
					  addSurveyField() +
					  '<input type="submit" value="Send" />' +
					  '<a href="#" onclick="javascript:_si.survey.hide();">hide</a>' +
					  '</form>';
		
		d.body.appendChild( s );
		
		setTimeout(function () {
			d.getElementById( id ).setAttribute("class", "active");
		}, 500);
		
		document.forms["_si-form"].onsubmit = function(){
			// Submit form
			var url = "_si/process.php",
				fields = serializeFields(),
				http = new XMLHttpRequest();
			http.open("POST", url, true);
			http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			http.send(fields);
			
			// Show thanks Message
			document.getElementById('_si-form').innerHTML = '<div class="thanks">Thank you!</div>';
			
			// Hide survey after 2 seconds
			setTimeout(function () {
				toggleSurvey( false );
			}, 2000);
			
			return false;
		}
	}
	
	function addSurveyField() {
		switch(_si.settings.type) {
		case 'checkbox':
			return radioCheckboxBuilder('checkbox');
			break;
		case 'radio':
			return radioCheckboxBuilder('radio');
			break;
		case 'textarea':
			return '<textarea id="si_q" name="si_q"></textarea>';
			break;
		default:
			return '<input type="text" id="si_q" name="si_q" />';
		}
	}
	
	function encodeHTML(str) {
	    return str.replace(/</g, '&lt;').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
	}
	
	function radioCheckboxBuilder(type) {
		var o = _si.settings.options.length,
			cb = '';
		if ( o === 0 )
			return radioCheckboxOption(type, '', 'Radio Option');
		for ( var i = 0; i < o; i++ ) {
			cb += radioCheckboxOption(type, i, _si.settings.options[i]);
		}
		return cb;
	}
	
	function radioCheckboxOption(type, id, value) {
		var id = 'si_q' + id,
			name = 'si_q';
		if ('checkbox' === type) {
			name = 'si_q[]';
		}
		return '<label for="' + id + '"><input type="' + type + '" id="' + id + '" name="' + name + '" value="' + value + '" />' + encodeHTML(value) + '</label>';
	}
	
	function radioCheckboxSelected(c) {
		s = 'si_q=';
		for (var i = 0; i < c.length; i++) {
			if (c[i].checked) {
				s += encodeURIComponent(c[i].value) + '|';
			}
		}
		return s;
	}
	
	function serializeFields() {
		var form = document.forms["_si-form"],
			s = '';
		switch(_si.settings.type) {
			case 'checkbox':
				s = radioCheckboxSelected(form.elements['si_q[]'])
				break;
			case 'radio':
				s = radioCheckboxSelected(form.elements['si_q'])
				break;
			case 'text':
			case 'textarea':
				s = 'si_q=' + encodeURIComponent(document.getElementById('si_q').value);
				break;
		}
		return s;
	}
	
	function toggleSurvey( show ) {
  		var right = ( show ) ? 0 : -324;
		d.getElementById( id ).style.right = right + 'px';
	}
	
	return {
		init: function () {
			// Uses localStorage to track who's seen the survey
			// Thus older browsers (<= IE7) will be excluded from seeing it
			if (typeof localStorage !== "undefined") {
				var viewed = localStorage.getItem(_si.settings.question);
				
				if ( !viewed ) {
					addCss();
					addSurvey();
					setTimeout(function () {
						toggleSurvey( true );
					}, 300);
					// Mark as viewed
					localStorage.setItem(_si.settings.question, true);
				}
			}
		},
		hide: function () {
			toggleSurvey( false );
		},
		show: function () {
			toggleSurvey( true );
		}
	}
} ();

_si.survey.init();