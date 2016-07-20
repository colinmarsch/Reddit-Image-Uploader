var imgUrl;

function uploadImage(info, tab) {
	imgUrl = info.srcUrl;
	if(imgUrl.includes(",")) {
		imgUrl = imgUrl.split(",")[1];
	}
	$.ajax({
		url: 'https://api.imgur.com/3/image',
		headers: {
			'Authorization': 'Client-ID d2b39b0f79a5003'
		},
		type: 'POST',
		data: {
			'image': imgUrl
		},
		success: function(response) {
			var img = response.data.link;
			chrome.storage.sync.get("showImage",
				function(item) {
					if(item.showImage) {
						chrome.tabs.create({url: img});
					}
				});	
			chrome.tabs.create({url: 'http://reddit.com/submit?url=' + img});
		},
		error: function(response) {
			//create a page with instructions for the user to send the error data to the developer
			//add some premade messages incase of certain common errors that I know how the user can avoid
		}
	});
};

chrome.contextMenus.onClicked.addListener(uploadImage);

chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		id: "imgSelected",
		title: "Upload This Image To Reddit",
		contexts: ["image"]
	});
});
