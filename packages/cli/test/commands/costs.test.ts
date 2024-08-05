import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('costs', () => {
  it('runs costs cmd', async () => {
    const {stdout} = await runCommand('costs')
    expect(stdout).to.contain('hello world')
  })

  it('runs costs --name oclif', async () => {
    const {stdout} = await runCommand('costs --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
