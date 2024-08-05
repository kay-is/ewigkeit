import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('inspect', () => {
  it('runs inspect cmd', async () => {
    const {stdout} = await runCommand('inspect')
    expect(stdout).to.contain('hello world')
  })

  it('runs inspect --name oclif', async () => {
    const {stdout} = await runCommand('inspect --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
