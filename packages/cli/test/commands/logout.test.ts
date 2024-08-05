import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('logout', () => {
  it('runs logout cmd', async () => {
    const {stdout} = await runCommand('logout')
    expect(stdout).to.contain('hello world')
  })

  it('runs logout --name oclif', async () => {
    const {stdout} = await runCommand('logout --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
