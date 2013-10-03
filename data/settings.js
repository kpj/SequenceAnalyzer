// gap penalty
gap_penalty = 8;

// substitution matrix to use
subst_matrix_name = ""


// retrieves new values/sets default ones if necessary
function update_settings() {
	$("#options").children().each(function(i) {
		var id = $(this)[0].id;

		// update variables
		if($(this).attr("type") == "text") {
			var js_value = eval($(this)[0].id);
			var html_value = $(this).val();

			if(html_value == "") {
				$(this).val(js_value);
			} else {
				window[id] = html_value;
			}
		} else if($(this).attr("type") == "dropdown") {
			subst_matrix_name = $(this).val();
		}
	});
}
