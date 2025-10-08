const github = require('@actions/github')

class Api {
    /**
     * GitHub Api
     * @param {String} token
     */
    constructor(token) {
        this.octokit = github.getOctokit(token)
    }

    /**
     * List Releases
     * @return {Promise<InstanceType<typeof github.GitHub>|Undefined>}
     */
    async listReleases() {
        const response = await this.octokit.rest.repos.listReleases({
            ...github.context.repo,
            per_page: 2,
        })
        return response.data
    }

    /**
     * Delete Release
     * @param {string} release_id
     * @return {Promise<String>}
     */
    async deleteRelease(release_id) {
        const response = await this.octokit.rest.repos.deleteRelease({
            ...github.context.repo,
            release_id,
        })
        return response.status
    }

    /**
     * Get Latest Release
     * @param {Object} data
     * @return {Promise<InstanceType<typeof github.GitHub>|Undefined>}
     */
    async generateReleaseNotes(data) {
        const response = await this.octokit.rest.repos.generateReleaseNotes({
            ...github.context.repo,
            ...data,
        })
        return response.data
    }

    /**
     * Upload Release Asset
     * @param {Object} data
     * @return {Promise<InstanceType<typeof github.GitHub>|Undefined>}
     */
    async createRelease(data) {
        const response = await this.octokit.rest.repos.createRelease({
            ...github.context.repo,
            ...data,
        })
        return response.data
    }
}

module.exports = Api
