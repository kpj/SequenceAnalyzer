// update html table
function create_table() {
	var table = document.createElement("table");

	var head_row = document.createElement("tr");;
	var tag = document.createElement("td");
	head_row.appendChild(tag);
	for(var x = 0 ; x < seq1.length ; x++) {
		var tag = document.createElement("td");
		tag.innerHTML = seq1[x];
		head_row.appendChild(tag);
	}
	table.appendChild(head_row);

	for(var y = 0 ; y < seq2.length ; y++) {
		var cur_row = document.createElement("tr");

		var tag = document.createElement("td");
		tag.innerHTML = seq2[y];
		cur_row.appendChild(tag);

		for(var x = 0 ; x < seq1.length ; x++) {
			var cur_col_entry = document.createElement("td");

			cur_col_entry.innerHTML = matrix[x][y].value;

			// color highlighting
			if(matrix[x][y].is_crucial) {
				cur_col_entry.style.color = "red";
			}
			cur_row.appendChild(cur_col_entry);
		}
		table.appendChild(cur_row);
	}

	return table;
}

// delete old version and present new one
function update_html() {
	document.getElementById("output").innerHTML = "";
	document.getElementById("output").appendChild(create_table());
}

