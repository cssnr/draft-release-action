const core = require('@actions/core')
const github = require('@actions/github')

const semver = require('semver')

// const bot_id = 6071159  // TODO: DEBUG: Remove This
const bot_id = 41898282
const script_id = '<!-- cssnr/draft-release-action -->'

;(async () => {
    try {
        core.info(`🏳️ Starting Draft Release Action`)

        // Debug
        // core.startGroup('Debug: github.context')
        // console.log(github.context)
        // core.endGroup() // Debug: github.context
        // core.startGroup('Debug: process.env')
        // console.log(process.env)
        // core.endGroup() // Debug: process.env
        core.startGroup('Debug')
        console.log('github.context.repo:', github.context.repo)
        console.log('github.context.eventName:', github.context.eventName)
        console.log('github.context.ref:', github.context.ref)
        core.endGroup() // Debug

        // Config
        const config = getConfig()
        core.startGroup('Config')
        console.log(config)
        core.endGroup() // Config

        // Process
        const response = await processRelease(config)
        core.startGroup('Response')
        console.log(response)
        core.endGroup() // Response

        // Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('release', JSON.stringify(response.data))
        core.setOutput('url', response.data.html_url)

        // Summary
        if (config.summary) {
            core.info('📝 Writing Job Summary')
            try {
                await addSummary(config, response)
            } catch (e) {
                console.log(e)
                core.error(`Error writing Job Summary ${e.message}`)
            }
        }

        core.info(`✅ \u001b[32;1mFinished Success`)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * Process Release
 * @param {Config} config
 * @return {Promise<Object>}
 */
async function processRelease(config) {
    const octokit = github.getOctokit(config.token)
    // TODO: Get more than 2 releases and process all drafts...
    const releases = await octokit.rest.repos.listReleases({
        ...github.context.repo,
        per_page: 2,
    })
    // console.log('releases:', releases)
    if (!releases?.data?.length) {
        console.log('releases:', releases)
        throw new Error('No previous release found. Create one first...')
    }

    let [latest, previous] = releases.data
    // console.log('latest:', latest)
    // console.log('previous:', previous)
    console.log('latest.draft:', latest?.draft)
    console.log('previous.draft:', previous?.draft)
    console.log('latest.tag_name:', latest?.tag_name)
    console.log('previous.tag_name:', previous?.tag_name)
    // if (latest.draft && latest.body.includes(script_id)) {
    if (
        latest.draft &&
        latest.author.id === bot_id &&
        latest.body.includes(script_id)
    ) {
        core.info(`⛔ Deleting Latest Draft: \u001b[31;1m${latest.tag_name}`)
        const response = await octokit.rest.repos.deleteRelease({
            ...github.context.repo,
            release_id: latest.id,
        })
        console.log('response.status:', response.status)
        latest = previous
    }

    const tag_name = semver.inc(
        latest.tag_name,
        config.semver,
        config.identifier
    )
    if (!tag_name) {
        throw new Error(
            `Unable to parse ${config.semver} from ${latest.tag_name}`
        )
    }

    core.info(`Creating New Draft: \u001b[33;1m${tag_name}`)
    const response = await octokit.rest.repos.createRelease({
        ...github.context.repo,
        tag_name,
        draft: true,
        prerelease: config.prerelease,
        generate_release_notes: true,
        body: `\n\n\n\n${script_id}`,
    })
    console.log('response.status:', response.status)
    return response
}

/**
 * Add Summary
 * @param {Config} config
 * @param {Object} response
 * @return {Promise<void>}
 */
async function addSummary(config, response) {
    core.summary.addRaw('## Draft Release Action\n\n')
    console.log('response.status:', response.status)
    const result = response.status
        ? '**Created new release:**'
        : '**Previous draft unchanged:**'
    core.summary.addRaw(
        `${result} \`${response.data.tag_name}\`.\n\n${response.data.html_url}\n\n`
    )

    delete config.token
    const yaml = Object.entries(config)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Config</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/draft-release-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get Config
 * @typedef {Object} Config
 * @property {String} semver
 * @property {String} identifier
 * @property {Boolean} prerelease
 * @property {Boolean} summary
 * @property {String} token
 * @return {Config}
 */
function getConfig() {
    return {
        semver: core.getInput('semver', { required: true }),
        identifier: core.getInput('identifier'),
        prerelease: core.getBooleanInput('prerelease'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),
    }
}
