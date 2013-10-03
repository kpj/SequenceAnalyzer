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

// initialize matrix
var matrix = [];
function parse_matrix() {
	matrix = [];
	for(var x = 0 ; x < seq1.length ; x++) {
		var cur = new Entry( - x * gap_penalty, x, 0);
		matrix.push([cur]);
		for(var y = 1 ; y < seq2.length ; y++) {
			matrix[matrix.length - 1].push(new Entry((x == 0) ? - y * gap_penalty : null, x, y));
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

function apply_needleman_wunsch() {
	seq1 = rmWhiteSpace($("#seq1").val().toUpperCase());
	seq2 = rmWhiteSpace($("#seq2").val().toUpperCase());

	parse_matrix();

	var end = [seq1.length - 1, seq2.length - 1];
	F(end[0], end[1]);

	var path = get_path(matrix[end[0]][end[1]]);
	for(var p in path) {
		matrix[path[p].x][path[p].y].is_crucial = true;
	}

	update_html();
}
