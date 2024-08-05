import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('turbo-credits:balance', () => {
  it('runs turbo-credits:balance cmd', async () => {
    const {stdout} = await runCommand('turbo-credits:balance')
    expect(stdout).to.contain('hello world')
  })

  it('runs turbo-credits:balance --name oclif', async () => {
    const {stdout} = await runCommand('turbo-credits:balance --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
