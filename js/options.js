function save_options() {
	var showImage = document.getElementById("yes").checked;
	chrome.storage.sync.set({
		showImage: showImage
	}, function() {
		var status = document.getElementById("status");
		status.textContent = 'Changes Saved!';
		setTimeout(function() {
			status.textContent = '';
		}, 1000);
	});
}

function restore_settings() {
	chrome.storage.sync.get({
		showImage : true
	}, function(items) {
		if(items.showImage) {
			document.getElementById('yes').checked = true;
		} else {
			document.getElementById('no').checked = true;
		}
	});
}

document.addEventListener('DOMContentLoaded', restore_settings);
document.getElementById('save').addEventListener('click', save_options);
