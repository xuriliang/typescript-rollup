class Config {
	static service = {
		uc: "https://unify.kxjlcc.com:8443/uc-api",
		sdkServer: "https://unify.kxjlcc.com:8443/sdk-server"
	};
	static sip = {
		register: true,
		register_expires: 30,
		socketURL: "wss://unify.kxjlcc.com:8443/fswss",
		sipURI: "@webrtc",
		iceURL: ["stun:unify.kxjlcc.com:3478"]
	};
	static im = {
		serverName: "@xiaomankf.com",
		resource: "/tserver-client",
		server: "wss://agent.kxjlcc.com:5291"
	};
}

export default Config;
