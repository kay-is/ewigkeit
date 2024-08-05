import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('whoami', () => {
  it('runs whoami cmd', async () => {
    const {stdout} = await runCommand('whoami')
    expect(stdout).to.contain('hello world')
  })

  it('runs whoami --name oclif', async () => {
    const {stdout} = await runCommand('whoami --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
