import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('turbo-credits:buy', () => {
  it('runs turbo-credits:buy cmd', async () => {
    const {stdout} = await runCommand('turbo-credits:buy')
    expect(stdout).to.contain('hello world')
  })

  it('runs turbo-credits:buy --name oclif', async () => {
    const {stdout} = await runCommand('turbo-credits:buy --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
