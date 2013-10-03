function generate_matrix(type) {
	$.ajax({
		url: 'matrices/' + type,
		success: parse_text_matrix
	});
}

function parse_text_matrix(data) {
	var out = {};

	lines = data.split("\n");

	types = lines[0].split(" ");
	types = clean(types, "");

	for(var l = 1 ; l < lines.length - 1 ; l++) {
		var cur_values = lines[l].split(" ");
		cur_values = clean(cur_values, "");
		var cur_type = cur_values.splice(0,1);

		out[cur_type] = {};
		for(var t = 0 ; t < types.length ; t++) {
			out[cur_type][types[t]] = cur_values[t];
		}
	}
	subs_matrix = out; // weird global variable

	apply_needleman_wunsch();
}
