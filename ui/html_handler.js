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
	document.getElementById("table_output").innerHTML = "";
	document.getElementById("table_output").appendChild(create_table());

	document.getElementById("alignment_output").innerHTML = "<pre>" + generate_alignment().replace(/\n/g, '<br>') + "</pre>";
}

// convert given path into visual alignment
// 0 -> no gap, 1 -> gap in seq, -1 -> gap in seq
function get_gap(p1, p2) {
	console.log(p1.x + " =?= " + p2.x + " && " + p1.y + " =?= " + p2.y);
	if(p1.x + 1 == p2.x && p1.y + 1 == p2.y)
		return 0;
	if(p1.x + 1 == p2.x && p1.y == p2.y)
		return 1;
	if(p1.x == p2.x && p1.y + 1 == p2.y)
		return -1;
}
function generate_alignment() {
	var end = [seq1.length - 1, seq2.length - 1];

	var path = get_path(matrix[end[0]][end[1]]).reverse();

	var top_line = "";
	var middle_line = "";
	var bottom_line = "";

	var gap_symbol = "-";

	var s1i = 1;
	var s2i = 1;
	top_line += seq1[0];
	middle_line += "|";
	bottom_line += seq2[0];
	for(var p = 0 ; p < path.length - 1 ; p++) {
		var gap = get_gap(path[p], path[p + 1]);
		console.log("Gap value: " + gap);
		if(gap == 0) {
			top_line += seq1[s1i];
			middle_line += "|";
			bottom_line += seq2[s2i];

			s1i++;
			s2i++;
		} else if(gap == 1) {
			top_line += seq1[s1i];
			middle_line += " ";
			bottom_line += gap_symbol;

			s1i++;
		} else if(gap == -1) {
			top_line += gap_symbol;
			middle_line += " ";
			bottom_line += seq2[s2i];

			s2i++;
		}
		console.log(top_line + "\n" + middle_line + "\n" + bottom_line);
	}

	var out = top_line + "\n" + middle_line + "\n" + bottom_line;
	return out;
}
