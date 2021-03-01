window.onload = function () {
	const offer = document.getElementById("offer");
	const message = document.getElementById("message");
	const answer = document.getElementById("answer");

	const sendMessage = document.getElementById("send-message");

	const createOffer = document.getElementById("create-offer");
	const createAnswer = document.getElementById("create-answer");
	const recvOffer = document.getElementById("offer-received");
	const recvAnswer = document.getElementById("answer-received");
	const receivedOffer = document.getElementById("remote-offer");
	const receivedAnswer = document.getElementById("remote-answer");

	const lc = new RTCPeerConnection();
	var dc = null;
	createOffer.onclick = function (e) {
		dc = lc.createDataChannel("channel");
		dc.onopen = (e) => console.log("connection established");
		dc.onmessage = (e) => console.log("message received ::", e.data);
		lc.onicecandidate = (e) => {
			console.log(
				"ice candidate found ",
				JSON.stringify(lc.localDescription)
			);
			offer.value = JSON.stringify(lc.localDescription);
		};
		lc.createOffer()
			.then((o) => lc.setLocalDescription(o))
			.then(() => {
				console.log("setting of local description is succssefull ");
			});
	};
	createAnswer.onclick = function (e) {
		lc.createAnswer().then((a) => {
			lc.setLocalDescription(a);
			answer.value = JSON.stringify(a);
			console.log("answer is created ::", a);
		});
	};

	recvOffer.onclick = function (e) {
		lc.ondatachannel = (e) => {
			lc.dc = e.channel;
			lc.dc.onmessage = (e) => {
				console.log("message received ::", e.data);
			};
			lc.dc.onopen = (e) => {
				console.log("connection established");
			};
		};
		console.log(receivedOffer.value);

		lc.setRemoteDescription(JSON.parse(receivedOffer.value))
			.then((e) => {
				console.log("offer is set");
			})
			.catch((e) => {
				console.log("got error ::", e.message);
			});
	};
	recvAnswer.onclick = function (e) {
		lc.setRemoteDescription(JSON.parse(receivedAnswer.value));
	};
	sendMessage.onclick = (e) => {
		if (dc == null) {
			lc.dc.send(message.value);
		} else {
			dc.send(message.value);
		}
		message.value = null;
	};
};
