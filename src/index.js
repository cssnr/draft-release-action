import * as core from '@actions/core'
import * as github from '@actions/github'
import semver from 'semver'

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

        // Inputs
        const inputs = getInputs()
        core.startGroup('Inputs')
        console.log(inputs)
        core.endGroup() // Inputs

        // Process
        const response = await processRelease(inputs)
        core.startGroup('Response')
        console.log(response)
        core.endGroup() // Response
        if (!response) {
            console.log('Set Neutral is not yet implemented so exiting with success.')
            return core.info(`⚠️ \u001b[32;1mNo Releases to Process`)
        }

        // Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('release', JSON.stringify(response.data))
        core.setOutput('url', response.data.html_url)

        // Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            try {
                await addSummary(inputs, response)
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
 * @param {Inputs} inputs
 * @return {Promise<object|undefined>}
 */
async function processRelease(inputs) {
    const octokit = github.getOctokit(inputs.token)
    // TODO: Get more than 2 releases and process all drafts...
    const releases = await octokit.rest.repos.listReleases({
        ...github.context.repo,
        per_page: 30,
    })
    // console.log('releases:', releases)
    if (!releases?.data?.length) {
        console.log('releases:', releases)
        core.error('No previous release found. Create one first...')
        return
    }

    const [latest, previous] = releases.data
    // console.log('latest:', latest)
    // console.log('previous:', previous)
    console.log('latest.draft:', latest?.draft)
    console.log('previous.draft:', previous?.draft)
    console.log('latest.tag_name:', latest?.tag_name)
    console.log('previous.tag_name:', previous?.tag_name)

    // Base for version increment is the latest published (non-draft) release.
    // Draft tags are not created until a release is published, so a draft makes
    // a poor base: it can belong to another release train (e.g. a beta draft when
    // drafting a stable release) and its tag is not a valid previous_tag.
    // Stable runs must also exclude prereleases, otherwise a published
    // prerelease ahead of the stable train (e.g. 1.1.5-beta.3 vs a last stable
    // 1.0.1) would pollute the increment.
    let base = inputs.prerelease
        ? (releases.data.find((r) => !r.draft) ?? latest)
        : (releases.data.find((r) => !r.draft && !r.prerelease) ?? latest)
    console.log('base.tag_name:', base?.tag_name)

    const suffix = normalizeSuffix(inputs.suffix)
    console.log('suffix:', suffix)

    let new_name
    if (inputs.calver) {
        new_name = `${getNextCalver(releases.data, inputs)}${suffix}`
    } else {
        const inc = semver.inc(base.tag_name, inputs.semver, inputs.identifier)
        if (!inc) {
            throw new Error(`Unable to parse ${inputs.semver} from ${base.tag_name}`)
        }
        new_name = suffix ? `${inc}${suffix}` : inc
    }
    console.log('new_name:', new_name)
    if (!new_name) {
        throw new Error(`Unable to parse ${inputs.semver} from ${base.tag_name}`)
    }
    const tag_name = `${inputs.prefix}${new_name}`
    console.log('tag_name:', tag_name)

    const notes_tag_name = inputs.notes_prefix
        ? `${inputs.notes_prefix}${new_name}`
        : tag_name
    console.log('notes_tag_name:', notes_tag_name)

    // Delete any previous bot-created drafts in the same train (same prerelease
    // flag and prefix), so separate release trains (e.g. stable and beta) don't
    // delete each other's drafts while stale drafts in this train are cleaned up.
    const drafts = releases.data.filter(
        (r) =>
            r.draft &&
            r.prerelease === inputs.prerelease &&
            r.tag_name.startsWith(inputs.prefix) &&
            r.author.id === bot_id &&
            r.body.includes(script_id),
    )
    for (const draft of drafts) {
        core.info(`⛔ Deleting Previous Draft: \u001b[31;1m${draft.tag_name}`)
        const response = await octokit.rest.repos.deleteRelease({
            ...github.context.repo,
            release_id: draft.id,
        })
        console.log('response.status:', response.status)
    }

    // previous_tag must reference a tag that exists in git, otherwise
    // generateReleaseNotes returns: Invalid previous_tag parameter.
    let previous_tag_name = inputs.previous_tag_name
    if (!previous_tag_name) {
        const prev = releases.data.find(
            (r) => !r.draft && (!inputs.prerelease ? !r.prerelease : true),
        )
        if (prev) {
            previous_tag_name = prev.tag_name
            console.log('previous.tag_name:', previous_tag_name)
        }
    }
    console.log('previous_tag_name:', previous_tag_name)

    const notesRequest = {
        ...github.context.repo,
        tag_name: notes_tag_name,
    }
    if (previous_tag_name) {
        notesRequest.previous_tag_name = previous_tag_name
    }
    const notes = await octokit.rest.repos.generateReleaseNotes(notesRequest)
    console.log('notes.status:', notes.status)
    console.log('notes.data:', notes.data)

    core.info(`Creating New Draft: \u001b[33;1m${tag_name}`)
    const response = await octokit.rest.repos.createRelease({
        ...github.context.repo,
        tag_name,
        draft: true,
        prerelease: inputs.prerelease,
        generate_release_notes: false,
        name: tag_name, // changed from: notes.data.name
        body: `\n\n\n${script_id}\n\n${notes.data.body}`,
    })
    console.log('response.status:', response.status)
    return response
}

/**
 * Add Summary
 * @param {Inputs} inputs
 * @param {object} response
 * @return {Promise<void>}
 */
async function addSummary(inputs, response) {
    core.summary.addRaw('## Draft Release Action\n\n')
    console.log('response.status:', response.status)
    const result = response.status
        ? '**Created new release:**'
        : '**Previous draft unchanged:**'
    core.summary.addRaw(
        `${result} \`${response.data.tag_name}\`.\n\n${response.data.html_url}\n\n`,
    )

    delete inputs.token
    const yaml = Object.entries(inputs)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/draft-release-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get Inputs
 * @typedef {object} Inputs
 * @property {string} semver
 * @property {string} identifier
 * @property {boolean} prerelease
 * @property {boolean} calver
 * @property {string} suffix
 * @property {string} prefix
 * @property {boolean} summary
 * @property {string} token
 * @property {string} previous_tag_name
 * @property {string} notes_prefix
 * @return {Inputs}
 */
function getInputs() {
    return {
        semver: core.getInput('semver', { required: true }),
        identifier: core.getInput('identifier'),
        prerelease: core.getBooleanInput('prerelease'),
        calver: core.getBooleanInput('calver'),
        suffix: core.getInput('suffix'),
        prefix: core.getInput('prefix'),
        summary: core.getBooleanInput('summary'),
        token: core.getInput('token', { required: true }),
        previous_tag_name: core.getInput('previous_tag_name'),
        notes_prefix: core.getInput('notes_prefix'),
    }
}

/**
 * Normalize Suffix
 * Ensures a leading "-" or "+" separator so "abc1234" becomes "-abc1234".
 * Empty string stays empty. Caller passes the "-" if they want it.
 * @param {string} suffix
 * @return {string}
 */
function normalizeSuffix(suffix) {
    if (!suffix) {
        return ''
    }
    const trimmed = suffix.trim()
    if (!trimmed) {
        return ''
    }
    if (trimmed.startsWith('-') || trimmed.startsWith('+')) {
        return trimmed
    }
    return `-${trimmed}`
}

/**
 * Parse CalVer Tag
 * Strips prefix, then matches YYYY.MM.NN[-identifier.N], ignoring any
 * trailing suffix (e.g. short SHA). Returns null when not a CalVer tag.
 * @param {string} tag_name
 * @param {string} prefix
 * @return {{year:number,month:number,micro:number,identifier:string|null,prerelease:number|null}|null}
 */
function parseCalver(tag_name, prefix) {
    let rest = tag_name
    if (prefix) {
        if (!rest.startsWith(prefix)) {
            return null
        }
        rest = rest.slice(prefix.length)
    }
    const match = rest.match(/^(\d{4})\.(\d{2})\.(\d{2,})(?:-([^.+\s]+)\.(\d+))?/)
    if (!match) {
        return null
    }
    return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
        micro: parseInt(match[3], 10),
        identifier: match[4] ?? null,
        prerelease: match[5] !== undefined ? parseInt(match[5], 10) : null,
    }
}

/**
 * Get Next CalVer Version (without prefix/suffix)
 * NN resets to 00 on UTC month rollover. Beta counter resets to 0 on
 * every NN bump and only increments on published prereleases.
 * @param {Array} releases
 * @param {Inputs} inputs
 * @return {string}
 */
function getNextCalver(releases, inputs) {
    const now = new Date()
    const year = now.getUTCFullYear()
    const month = now.getUTCMonth() + 1
    const current = `${year}.${String(month).padStart(2, '0')}`
    console.log('current:', current)

    const candidates = releases
        .filter((r) => !r.draft && (inputs.prerelease ? true : !r.prerelease))
        .map((r) => parseCalver(r.tag_name, inputs.prefix))
        .filter((p) => p && p.year === year && p.month === month)
        .filter((p) => {
            if (p.identifier === null) {
                return true
            }
            return p.identifier === inputs.identifier
        })
    console.log('calver candidates:', candidates.length)

    const pad = (n) => String(n).padStart(2, '0')
    if (!candidates.length) {
        if (inputs.prerelease) {
            return `${current}.00-${inputs.identifier}.0`
        }
        return `${current}.00`
    }

    const maxMicro = Math.max(...candidates.map((p) => p.micro))
    const atMax = candidates.filter((p) => p.micro === maxMicro)
    const hasStable = atMax.some((p) => p.identifier === null)
    const maxBeta = Math.max(
        -1,
        ...atMax.filter((p) => p.identifier !== null).map((p) => p.prerelease ?? -1),
    )
    if (inputs.prerelease) {
        if (hasStable) {
            return `${current}.${pad(maxMicro + 1)}-${inputs.identifier}.0`
        }
        return `${current}.${pad(maxMicro)}-${inputs.identifier}.${maxBeta + 1}`
    }
    if (hasStable) {
        return `${current}.${pad(maxMicro + 1)}`
    }
    return `${current}.${pad(maxMicro)}`
}
