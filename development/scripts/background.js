window.addEventListener('load', function() {

	var toDate = null;
	var debugging = true;
	
    window.addEventListener( 'storage', function(event) {
		debug( "Storage event: " + event.key + " " + event.oldValue + " " + event.newValue );
		
    	//if( event.oldValue !== event.newValue )
    	{
			if (event.key === 'urlLink' && widget.preferences.urlLink !== undefined ) {
				updateUrl();
			}
			else if( event.key === 'year' || event.key === 'month' || event.key === 'day' || 
					event.key === 'hour' || event.key === 'minute' || event.key === 'second' )
			{
				updateCountdown();
			}	
			
		}
        
	}, false );
	
	function updateCountdown() {
		var year = widget.preferences.year;
		var month = widget.preferences.month;
		var day = widget.preferences.day;
		var hour = widget.preferences.hour;
		var minute = widget.preferences.minute;
		var second = widget.preferences.second;
		
		toDate = new Date(year, month-1, day, hour, minute, second, 0);
	}
	
	var iframe = document.querySelector('iframe');
	function updateUrl() {
    	if( widget.preferences.urlLink ) {
			iframe.src = widget.preferences.urlLink;
		    if (opera.contexts.speeddial) {
				opera.contexts.speeddial.url = widget.preferences.urlLink;
			}
		}
	}
	
    // Simple function to prefix a zero if the value passed is less than 10
    function formatTime(time) {
        return (time < 10) ? '0' + time : time;
    }
    
    function debug( mess ) {
   		if( debugging ) {
   			opera.postError( mess );
        }
   }
   
	function diff_between(date1, date2) {
		var date1_ms = date1.getTime()
		var date2_ms = date2.getTime()

		var difference_ms = Math.abs(date1_ms - date2_ms)
		
		return difference_ms;
	}

	var output = document.querySelector('output');
	var diff, date, days, hours, mins, secs;
	
	var ONE_SECOND = 1000;
	var ONE_MINUTE = ONE_SECOND * 60;
	var ONE_HOUR = ONE_MINUTE * 60;
	var ONE_DAY = ONE_HOUR * 24;
	
	// Get and display the current time every 500 milliseconds
	var timer = window.setInterval(function() {
		
	    date = new Date();
	    var text = '';
	    
		diff = diff_between( toDate, date );
		days = Math.floor(diff / ONE_DAY);
		
		if( toDate > date ) {
			
			hours = Math.floor( (diff - days * ONE_DAY) / ONE_HOUR );
			mins  = Math.floor( (diff - days * ONE_DAY - hours * ONE_HOUR) / ONE_MINUTE );
			secs  = Math.floor( (diff - days * ONE_DAY - hours * ONE_HOUR - mins * ONE_MINUTE) / ONE_SECOND );
	   
	   		text = ''
	   		if( days != 0 ) {
	   			text += days + '<span class="gap">&nbsp</span>d<span class="full">ay';
	   			if( days != 1 ) {
		   			text += 's';
		   		}
	   			text += '</span> ';
	   		}
	   		if( hours != 0 ) {
	   			text += hours + '<span class="gap">&nbsp</span>h<span class="full">our';
	   			if( hours != 1 ) {
		   			text += 's';
		   		}
	   			text += '</span> ';
	   		}
	   		if( mins != 0 ) {
	   			text += mins + '<span class="gap">&nbsp</span>m<span class="full">inute'
	   			if( mins != 1 ) {
		   			text += 's';
		   		}
	   			text += '</span> ';
	   		}
	   		if( secs != 0 || ( mins != 0 || hours != 0 || days != 0 ) ) {
	   			text += secs + '<span class="gap">&nbsp</span>s<span class="full">econd';
	   			if( secs != 1 ) {
		   			text += 's';
		   		}
	   			text += '</span> ';
	   		}
	    }
	    
	    if( text == '' ) {
			if( days == 0 ) {
				text = "Complete";
			}
			else {
		    	text = "Complete " + days + '<span class="gap">&nbsp</span>d<span class="full">ay';
		    	if( days != 1 ) {
		    		text += 's'; 
		    	}
		    	text += '</span> ago';
		    }
	   	}
	   	
		output.innerHTML = text;
	   	
	   	
	}, 500); // Twice a second to allow for slight delays in JavaScript execution
		
    updateCountdown();
    
}, false);
