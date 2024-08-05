# Ewig

A deployment tool for the Permaweb.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ewig.svg)](https://npmjs.org/package/ewig)
[![Downloads/week](https://img.shields.io/npm/dw/ewig.svg)](https://npmjs.org/package/ewig)

<!-- toc -->
* [Ewig](#ewig)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @kay-is/ewig
$ ewig COMMAND
running command...
$ ewig (--version)
@kay-is/ewig/0.0.1 linux-x64 node-v20.15.1
$ ewig --help [COMMAND]
USAGE
  $ ewig COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`ewig costs`](#ewig-costs)
* [`ewig deploy`](#ewig-deploy)
* [`ewig help [COMMAND]`](#ewig-help-command)
* [`ewig init [PROJECTNAME]`](#ewig-init-projectname)
* [`ewig inspect`](#ewig-inspect)
* [`ewig link PROJECT-ID`](#ewig-link-project-id)
* [`ewig login [KEYFILE]`](#ewig-login-keyfile)
* [`ewig logout`](#ewig-logout)
* [`ewig turbo-credits balance`](#ewig-turbo-credits-balance)
* [`ewig turbo-credits buy USDAMOUNT`](#ewig-turbo-credits-buy-usdamount)
* [`ewig whoami`](#ewig-whoami)

## `ewig costs`

Estimate the costs of deploying the project.

```
USAGE
  $ ewig costs

DESCRIPTION
  Estimate the costs of deploying the project.
```

## `ewig deploy`

Deploys the project on Arweave. Uses "preview" environment and current branch by default.

```
USAGE
  $ ewig deploy [--prod] [--skip-domain] [--skip-registration]

FLAGS
  --prod               Deploy to production and assign main ArNS domain.
  --skip-domain        Prevent ArNS domain assing when deploying in production.
  --skip-registration  Prevents deployment from registering with AO process, disables cache updates.

DESCRIPTION
  Deploys the project on Arweave. Uses "preview" environment and current branch by default.
```

## `ewig help [COMMAND]`

Display help for ewig.

```
USAGE
  $ ewig help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ewig.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.7/src/commands/help.ts)_

## `ewig init [PROJECTNAME]`

Initialize a new project on AO and links it the working directory.

```
USAGE
  $ ewig init [PROJECTNAME] [-f]

ARGUMENTS
  PROJECTNAME  Name of the new project.

FLAGS
  -f, --force  Override previous initialization.

DESCRIPTION
  Initialize a new project on AO and links it the working directory.
```

## `ewig inspect`

Load the project info from AO.

```
USAGE
  $ ewig inspect [--json]

FLAGS
  --json  Switch to JSON output.

DESCRIPTION
  Load the project info from AO.
```

## `ewig link PROJECT-ID`

Links the working directory to a project on AO.

```
USAGE
  $ ewig link PROJECT-ID

ARGUMENTS
  PROJECT-ID  The address of the project's AO process

DESCRIPTION
  Links the working directory to a project on AO.
```

## `ewig login [KEYFILE]`

Activate a private key. Will generate a new key if none is provided.

```
USAGE
  $ ewig login [KEYFILE]

ARGUMENTS
  KEYFILE  Path to your JWK file.

DESCRIPTION
  Activate a private key. Will generate a new key if none is provided.
```

## `ewig logout`

Deactivate private key.

```
USAGE
  $ ewig logout

DESCRIPTION
  Deactivate private key.
```

## `ewig turbo-credits balance`

Get your token balance for the Turbo bundler

```
USAGE
  $ ewig turbo-credits balance

DESCRIPTION
  Get your token balance for the Turbo bundler
```

## `ewig turbo-credits buy USDAMOUNT`

Buy tokens to use with the Turbo bundler

```
USAGE
  $ ewig turbo-credits buy USDAMOUNT

ARGUMENTS
  USDAMOUNT  Amount of USD to spend

DESCRIPTION
  Buy tokens to use with the Turbo bundler
```

## `ewig whoami`

Show active key and address.

```
USAGE
  $ ewig whoami

DESCRIPTION
  Show active key and address.
```
<!-- commandsstop -->
