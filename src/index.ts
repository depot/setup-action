import * as core from '@actions/core'
import * as http from '@actions/http-client'
import * as toolCache from '@actions/tool-cache'
import * as path from 'path'

type ApiResponse = {ok: true; url: string} | {ok: false; error: string}

const client = new http.HttpClient('depot-setup-action')

async function run() {
  // Get user-specified version to install (defaults to "latest")
  const version = core.getInput('version')

  // Resolve the version to a specific download via the Depot API
  const {url, resolvedVersion} = await resolveVersion(version)

  // Install the resolved version if necessary
  const toolPath = toolCache.find('depot', resolvedVersion)
  if (toolPath) {
    core.addPath(toolPath)
  } else {
    await installDepotCLI(url, resolvedVersion)
  }

  core.info(`depot ${resolvedVersion} is installed`)
}

async function resolveVersion(version: string) {
  const res = await client.get(`https://depot.dev/api/cli/release/${process.platform}/${process.arch}/${version}`)
  const body = await res.readBody()
  const response: ApiResponse = JSON.parse(body)

  if (!response.ok) throw new Error(response.error)

  const matches = response.url.match(/cli\/releases\/download\/v(\d+\.\d+\.\d+)/)
  const resolvedVersion = matches ? matches[1] : version
  return {url: response.url, resolvedVersion}
}

async function installDepotCLI(url: string, resolvedVersion: string) {
  const tarPath = await toolCache.downloadTool(url)
  const extractedPath = await toolCache.extractTar(tarPath)
  const cachedPath = await toolCache.cacheDir(path.join(extractedPath, 'bin'), 'depot', resolvedVersion)
  core.addPath(cachedPath)
}

run().catch((error) => {
  if (error instanceof Error) {
    core.setFailed(error.message)
  } else {
    core.setFailed(`${error}`)
  }
})
