import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('link', () => {
  it('runs link cmd', async () => {
    const {stdout} = await runCommand('link')
    expect(stdout).to.contain('hello world')
  })

  it('runs link --name oclif', async () => {
    const {stdout} = await runCommand('link --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
