const util = require('./script-utilities');

function build() {
	let imageRepoTag = util.getCurrentDockerImage();
	return util.spawnPromise('docker', ['build', '-f', './docker/dev.Dockerfile', '-t', imageRepoTag, '.']);
}

function push() {
	let imageRepoTag = util.getCurrentDockerImage();
	return util.spawnPromise('docker', ['push', imageRepoTag]);
}

module.exports = {
	build,
	push,
};
