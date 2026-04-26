[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/draft-release-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/draft-release-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/draft-release-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/draft-release-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/draft-release-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/draft-release-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/draft-release-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/cssnr/draft-release-action/blob/master/src/index.js)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/draft-release-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/draft-release-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/draft-release-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/draft-release-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/draft-release-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/draft-release-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_draft-release-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_draft-release-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/draft-release-action?logo=github&label=updated)](https://github.com/cssnr/draft-release-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/draft-release-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/draft-release-action)
[![GitHub Contributors](https://img.shields.io/github/contributors/cssnr/draft-release-action?logo=github)](https://github.com/cssnr/draft-release-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/draft-release-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/draft-release-action?logo=htmx)](https://github.com/cssnr/draft-release-action)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/draft-release-action?style=flat&logo=github)](https://github.com/cssnr/draft-release-action/forks)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/draft-release-action?logo=github)](https://github.com/cssnr/draft-release-action/discussions)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/draft-release-action?style=flat&logo=github)](https://github.com/cssnr/draft-release-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Draft Release Action

- [Inputs](#Inputs)
  - [Permissions](#Permissions)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

This action will keep a release drafted, with the next semantic version, and auto-generated release notes.

Want to see more feature? [Request one](https://github.com/cssnr/draft-release-action/discussions/categories/feature-requests)...

## Inputs

| Input      | Req. | Default&nbsp;Value | Input&nbsp;Description         |
| :--------- | :--: | :----------------- | :----------------------------- |
| semver     |  -   | `prerelease`       | Semantaic Version to Incriment |
| identifier |  -   | `beta`             | Prerelease Tag to Append       |
| prerelease |  -   | `true`             | Set Draft as Prerelease        |
| prefix     |  -   | -                  | Release Tag Prefix             |
| summary    |  -   | `true`             | Add Job Summary to Workflow    |
| token      |  -   | `github.token`     | Only for Use with a PAT        |

**semver:** This is the string passed to `semver.inc()` to determine which version to increment.
For more details, see the [docs](https://github.com/npm/node-semver?tab=readme-ov-file#functions).

<details><summary>👀 View Example Job Summary</summary>

---

Coming Soon...

---

</details>

With no inputs this will keep a pre-release drafted with the `prerelease` version incremented.

```yaml
- name: 'Draft Release Action'
  uses: cssnr/draft-release-action@master
```

### Permissions

This action requires the following permissions to draft releases:

```yaml
permissions:
  contents: write
```

Permissions documentation for [Workflows](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token) and [Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication).

## Outputs

| Output  | Description         |
| :------ | :------------------ |
| release | Release JSON Object |
| url     | Release HTML URL    |

```yaml
- name: 'Draft Release Action'
  id: draft
  uses: cssnr/draft-release-action@master

- name: 'Echo Output'
  env:
    RELEASE: ${{ steps.draft.outputs.release }}
  run: |
    echo "url: '${{ steps.draft.outputs.url }}'"
    echo "commit: ${RELEASE}"
```

## Examples

💡 _Click on an example heading to expand or collapse the example._

This workflow will keep a new draft up-to-date on every push to master.

```yaml
name: 'Draft Release'

on:
  workflow_dispatch:
  push:
    branches: ['master']

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  draft:
    name: 'Draft Release'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write

    steps:
      - name: 'Checkout'
        uses: actions/checkout@v4

      - name: 'Draft Release Action'
        id: draft
        uses: cssnr/draft-release-action@master

      - name: 'Process Release Draft URL'
        run: |
          echo "url: ${{ steps.draft.outputs.url }}"
```

This workflow example is available here: [.github/example/draft.yaml](.github/example/draft.yaml)

For more examples, you can check out other projects using this action:  
https://github.com/cssnr/draft-release-action/network/dependents

## Tags

The following rolling [tags](https://github.com/cssnr/draft-release-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                         | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/draft-release-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/draft-release-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/draft-release-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/draft-release-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/draft-release-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/draft-release-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/draft-release-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

## Support

If you run into any issues or need help getting started, please do one of the following:

- [Report an Issue](https://github.com/cssnr/draft-release-action/issues)
- [Q&A Discussion](https://github.com/cssnr/draft-release-action/discussions/categories/q-a)
- [Request a Feature](https://github.com/cssnr/draft-release-action/issues/new?template=1-feature.yaml)
- [Chat with us on Discord](https://discord.gg/wXy6m2X8wY)

[![Features](https://img.shields.io/badge/features-brightgreen?style=for-the-badge&logo=rocket&logoColor=white)](https://github.com/cssnr/draft-release-action/issues/new?template=1-feature.yaml)
[![Issues](https://img.shields.io/badge/issues-red?style=for-the-badge&logo=southwestairlines&logoColor=white)](https://github.com/cssnr/draft-release-action/issues)
[![Discussions](https://img.shields.io/badge/discussions-blue?style=for-the-badge&logo=livechat&logoColor=white)](https://github.com/cssnr/draft-release-action/discussions)
[![Discord](https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/wXy6m2X8wY)

# Contributing

If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

[![Actions Tools](https://raw.githubusercontent.com/smashedr/repo-images/refs/heads/master/actions/actions-tools.png)](https://actions-tools.cssnr.com/)

Additionally, you can support other [GitHub Actions](https://actions.cssnr.com/) I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy Action](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [Docker Context Action](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
- [Actions Up Action](https://github.com/cssnr/actions-up-action?tab=readme-ov-file#readme)
- [Rhysd Actionlint Action](https://github.com/cssnr/actionlint-action?tab=readme-ov-file#readme)
- [Zensical Action](https://github.com/cssnr/zensical-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Homebrew Action](https://github.com/cssnr/homebrew-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [TOML Action](https://github.com/cssnr/toml-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [JSON Key Value Check Action](https://github.com/cssnr/json-key-value-check-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Create Pull Action](https://github.com/cssnr/create-pull-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)
- [Check Build Action](https://github.com/cssnr/check-build-action?tab=readme-ov-file#readme)
- [Web Request Action](https://github.com/cssnr/web-request-action?tab=readme-ov-file#readme)
- [Get Commit Action](https://github.com/cssnr/get-commit-action?tab=readme-ov-file#readme)

<details><summary>❔ Unpublished Actions</summary>

These actions are not published on the Marketplace, but may be useful.

- [cssnr/create-files-action](https://github.com/cssnr/create-files-action?tab=readme-ov-file#readme) - Create various files from templates.
- [cssnr/draft-release-action](https://github.com/cssnr/draft-release-action?tab=readme-ov-file#readme) - Keep a draft release ready to publish.
- [cssnr/env-json-action](https://github.com/cssnr/env-json-action?tab=readme-ov-file#readme) - Convert env file to json or vice versa.
- [cssnr/push-artifacts-action](https://github.com/cssnr/push-artifacts-action?tab=readme-ov-file#readme) - Sync files to a remote host with rsync.
- [smashedr/update-release-notes-action](https://github.com/smashedr/update-release-notes-action?tab=readme-ov-file#readme) - Update release notes.
- [smashedr/combine-release-notes-action](https://github.com/smashedr/combine-release-notes-action?tab=readme-ov-file#readme) - Combine release notes.

---

</details>

<details><summary>📝 Template Actions</summary>

These are basic action templates that I use for creating new actions.

- [javascript-action](https://github.com/smashedr/javascript-action?tab=readme-ov-file#readme) - JavaScript
- [typescript-action](https://github.com/smashedr/typescript-action?tab=readme-ov-file#readme) - TypeScript
- [py-test-action](https://github.com/smashedr/py-test-action?tab=readme-ov-file#readme) - Dockerfile Python
- [test-action-uv](https://github.com/smashedr/test-action-uv?tab=readme-ov-file#readme) - Dockerfile Python UV
- [docker-test-action](https://github.com/smashedr/docker-test-action?tab=readme-ov-file#readme) - Docker Image Python

Note: The `docker-test-action` builds, runs and pushes images to [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

---

</details>

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)

<a href="https://github.com/cssnr/draft-release-action">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=cssnr/draft-release-action&type=date&legend=bottom-right&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=cssnr/draft-release-action&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=cssnr/draft-release-action&type=date&legend=bottom-right" />
 </picture>
</a>
