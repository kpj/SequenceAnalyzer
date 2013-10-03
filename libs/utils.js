function clean(list, deleteValue) {
	for (var i = 0; i < list.length; i++) {
		if (list[i] == deleteValue) {         
			list.splice(i, 1);
			i--;
		}
	}
	return list;
}

function rmWhiteSpace(str) {
	return str.replace(/\s/g, '');
}
