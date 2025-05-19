[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/draft-release-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/draft-release-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/draft-release-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/draft-release-action/tags)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/draft-release-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/draft-release-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/draft-release-action/dist%2Findex.js?label=dist%20size)](https://github.com/cssnr/draft-release-action/blob/master/src/index.js)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/draft-release-action/release.yaml?logo=github&label=release)](https://github.com/cssnr/draft-release-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/draft-release-action/test.yaml?logo=github&label=test)](https://github.com/cssnr/draft-release-action/actions/workflows/test.yaml)
[![Workflow lint](https://img.shields.io/github/actions/workflow/status/cssnr/draft-release-action/lint.yaml?logo=github&label=lint)](https://github.com/cssnr/draft-release-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_draft-release-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_draft-release-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/draft-release-action?logo=github&label=updated)](https://github.com/cssnr/draft-release-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/draft-release-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/draft-release-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/draft-release-action?logo=htmx)](https://github.com/cssnr/draft-release-action)
[![GitHub repo size](https://img.shields.io/github/repo-size/cssnr/draft-release-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/draft-release-action)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/draft-release-action)](https://github.com/cssnr/draft-release-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/draft-release-action?style=flat&logo=github)](https://github.com/cssnr/draft-release-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/draft-release-action?style=flat&logo=github)](https://github.com/cssnr/draft-release-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

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

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/draft-release-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/draft-release-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/draft-release-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20Release%20Notes)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

For more information, see the CSSNR [CONTRIBUTING.md](https://github.com/cssnr/.github/blob/master/.github/CONTRIBUTING.md#contributing).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
