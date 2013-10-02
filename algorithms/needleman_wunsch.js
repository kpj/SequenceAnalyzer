//seq1 = "ACTAAC";
//seq2 = "ACAGT";

seq1 = window.prompt("Enter first sequence");
seq2 = window.prompt("Enter second sequence");

function clean(list, deleteValue) {
	for (var i = 0; i < list.length; i++) {
		if (list[i] == deleteValue) {         
			list.splice(i, 1);
			i--;
		}
	}
	return list;
}

function generate_matrix(type) {
	$.ajax({
		url: 'matrices/' + type,
		success: function(data) {
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

			start();
		}
	});
}

// which substitution matrix to use
//subs_matrix = generate_matrix("BLOSUM62");

// gap penalty
gap_penalty = 8;

// return value for matching AA pair
function apply_subs_matrix(c1, c2) {
	return parseInt(subs_matrix[c1][c2]);
}

// entry for matrix
function Entry(val, x, y) {
	this.value = val;

	this.x = x;
	this.y = y;

	this.fromEntry = null;

	this.is_crucial = false;
}

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
function update_html() {
	document.body.innerHTML = "";
	document.body.appendChild(create_table());
}

// initialize matrix
var matrix = [];
for(var x = 0 ; x < seq1.length ; x++) {
	var cur = new Entry(0, x, 0);
	matrix.push([cur]);
	for(var y = 1 ; y < seq2.length ; y++) {
		matrix[matrix.length - 1].push(new Entry((x == 0) ? 0 : null, x, y));
	}
}
// link initial values
for(var x = 0 ; x < seq1.length ; x++) {
	if(x != 0)
		matrix[x][0].fromEntry = matrix[x - 1][0];
}
for(var y = 0 ; y < seq2.length ; y++) {
	if(y != 0)
		matrix[0][y].fromEntry = matrix[0][y - 1];
}


// recursive score calculation
function F(x, y) {
	if(matrix[x][y].value == null) {
		var horizontal = F(x - 1, y).value - gap_penalty;
		var vertical = F(x, y - 1).value - gap_penalty;
		var diagonal = F(x - 1, y - 1).value + apply_subs_matrix(seq1[x], seq2[y]);

		// get max element and corresponding matrix-entry (stupid implementation)
		if(horizontal >= vertical && horizontal >= diagonal) {
			matrix[x][y].value = horizontal;
			matrix[x][y].fromEntry = F(x - 1, y);
		} else if(vertical >= diagonal) {
			matrix[x][y].value = vertical;
			matrix[x][y].fromEntry = F(x, y - 1);
		} else {
			matrix[x][y].value = diagonal;
			matrix[x][y].fromEntry = F(x - 1, y - 1);
		}
	}
	return matrix[x][y];
}

// get path
function get_path(entry) {
	var next = entry.fromEntry;
	if(next == null) {
		return [entry];
	}
	return [entry].concat(get_path(next));
}

function start() {
	var end = [seq1.length - 1, seq2.length - 1];
	F(end[0], end[1]);

	var path = get_path(matrix[end[0]][end[1]]);
	for(var p in path) {
		matrix[path[p].x][path[p].y].is_crucial = true;
	}

	update_html();
}

window.onload = function() {
	generate_matrix("BLOSUM62");
}
