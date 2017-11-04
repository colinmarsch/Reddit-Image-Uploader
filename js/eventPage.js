var imgUrl, gfyId;

function uploadImage(info, tab) {
	imgUrl = info.srcUrl;
	if (imgUrl.includes(",")) {
		imgUrl = imgUrl.split(",")[1];
	}
	if (imgUrl.substring(imgUrl.length - 3) === 'mp4' || imgUrl.substring(imgUrl.length - 4) === "gifv" || imgUrl.substring(imgUrl.length - 3) === "gif") {
		chrome.tabs.create({ url: 'https://gfycat.com/fetch/' + imgUrl },
			function (tab) {
				gfyId = tab.id;
			});
	} else {
		$.ajax({
			url: 'https://api.imgur.com/3/image',
			headers: {
				'Authorization': 'Client-ID d2b39b0f79a5003'
			},
			type: 'POST',
			data: {
				'image': imgUrl
			},
			success: function (response) {
				var img = response.data.link;
				chrome.storage.sync.get("showImage",
					function (item) {
						if (item.showImage) {
							chrome.tabs.create({ url: img });
						}
					});
				chrome.tabs.create({ url: 'http://reddit.com/submit?url=' + img });
			},
			error: function (response) {
				//create a page with instructions for the user to send the error data to the developer
				//add some premade messages incase of certain common errors that I know how the user can avoid
			}
		});
	}
};

chrome.contextMenus.onClicked.addListener(uploadImage);

chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		id: "imgSelected",
		title: "Upload This Image/Gif To Reddit",
		contexts: ["image", "video"]
	});
});

chrome.tabs.onUpdated.addListener(
	function (tabId, changeInfo, tab) {
		if (tabId !== gfyId || changeInfo.status !== 'complete' || tab.url.includes('fetch')) {
			return false;
		}
		chrome.tabs.create({ url: 'http://reddit.com/submit?url=' + tab.url });
	});
