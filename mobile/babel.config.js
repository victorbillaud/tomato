module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			// expo-router
			'expo-router/babel',

			// .env
			["module:react-native-dotenv", {
				"envName": "APP_ENV",
				"moduleName": "@env",
				"path": ".env",
				"safe": false,
				"allowUndefined": false,
				"verbose": false
			}]
		],
	}
}
