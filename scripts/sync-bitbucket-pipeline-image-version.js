const path = require('path');
const util = require('./script-utilities');

module.exports = () => {
	let pipelinesFilepath = path.resolve(__dirname, '..', 'bitbucket-pipelines.yml');
	let version = util.getCurrentVersion();

	return util
		.readFile(pipelinesFilepath)
		.then(pipeline => util.convertYamlToJson(pipeline))
		.then(pipelineObject => {
			let image = util.getCurrentDockerImage();

			if (pipelineObject.image.name) {
				pipelineObject.image.name = image;
			} else {
				pipelineObject.image = image;
			}

			return util.convertJsonToYaml(pipelineObject);
		})
		.then(updatedPipeline => util.writeFile(pipelinesFilepath, updatedPipeline))
		.then(() => console.log(`updated bitbucket pipelines image version to ${version}`));
};
