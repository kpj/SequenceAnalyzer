// gap penalty
gap_penalty = 8;

// retrieves new values/sets default ones if necessary
function update_settings() {
	$("#options").children("input").each(function(i) {
		var id = $(this)[0].id;

		// update variables
		var js_value = eval($(this)[0].id);
		var html_value = $(this).val();

		if(html_value == "") {
			$(this).val(js_value);
		} else {
			window[id] = html_value;
		}
	});
}
