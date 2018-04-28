const path = require('path');
const util = require('./script-utilities');
const dockerComposePath = path.resolve(__dirname, '..', 'docker-compose.dev.yml');

function setComposeLatestImage() {
	const image = `${util.getDockerHubRepository()}:latest`;

	return getComposeData().then(dockerComposeConfig => {
		dockerComposeConfig.services['new-years-client'].image = image;
		dockerComposeConfig.services['new-years-client'].build = '.';
		return saveComposeData(dockerComposeConfig, image);
	});
}

function syncComposeImage() {
	const image = util.getCurrentDockerImage();

	return getComposeData().then(dockerComposeConfig => {
		dockerComposeConfig.services['new-years-client'].image = image;
		delete dockerComposeConfig.services['new-years-client'].build;
		return saveComposeData(dockerComposeConfig, image);
	});
}

function getComposeData() {
	return util.readFile(dockerComposePath).then(dockerCompose => util.convertYamlToJson(dockerCompose));
}

function saveComposeData(updatedComposeData, image) {
	let composeData = util.convertJsonToYaml(updatedComposeData);
	return util
		.writeFile(dockerComposePath, composeData)
		.then(() => console.log(`updated docker compose image to ${image}`));
}

module.exports = {
	setComposeLatestImage,
	syncComposeImage,
};
