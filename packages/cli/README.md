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
$ npm install -g ewig
$ ewig COMMAND
running command...
$ ewig (--version)
ewig/0.0.1 linux-x64 node-v20.15.1
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
* [`ewig plugins`](#ewig-plugins)
* [`ewig plugins add PLUGIN`](#ewig-plugins-add-plugin)
* [`ewig plugins:inspect PLUGIN...`](#ewig-pluginsinspect-plugin)
* [`ewig plugins install PLUGIN`](#ewig-plugins-install-plugin)
* [`ewig plugins link PATH`](#ewig-plugins-link-path)
* [`ewig plugins remove [PLUGIN]`](#ewig-plugins-remove-plugin)
* [`ewig plugins reset`](#ewig-plugins-reset)
* [`ewig plugins uninstall [PLUGIN]`](#ewig-plugins-uninstall-plugin)
* [`ewig plugins unlink [PLUGIN]`](#ewig-plugins-unlink-plugin)
* [`ewig plugins update`](#ewig-plugins-update)
* [`ewig turbo-credits balance`](#ewig-turbo-credits-balance)
* [`ewig turbo-credits buy USDAMOUNT`](#ewig-turbo-credits-buy-usdamount)
* [`ewig whoami`](#ewig-whoami)

## `ewig costs`

describe the command here

```
USAGE
  $ ewig costs

DESCRIPTION
  describe the command here
```

## `ewig deploy`

Deploys the current project.

```
USAGE
  $ ewig deploy [--prod] [--skip-domain] [--skip-registration]

FLAGS
  --prod               Deploy to production and assign main ArNS domain.
  --skip-domain        Prevent ArNS domain assing when deploying in production.
  --skip-registration  Prevents deployment from registering with AO process, disables cache updates.

DESCRIPTION
  Deploys the current project.
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

Initialize a new Ewig project in the current directory.

```
USAGE
  $ ewig init [PROJECTNAME] [-f]

ARGUMENTS
  PROJECTNAME  Name of the new project.

FLAGS
  -f, --force  Override previous initialization.

DESCRIPTION
  Initialize a new Ewig project in the current directory.
```

## `ewig inspect`

Load the project info.

```
USAGE
  $ ewig inspect [--json]

FLAGS
  --json  Switch to JSON output.

DESCRIPTION
  Load the project info.
```

## `ewig link PROJECT-ID`

Links the current project to an existing AO process

```
USAGE
  $ ewig link PROJECT-ID

ARGUMENTS
  PROJECT-ID  The address of the project's AO process

DESCRIPTION
  Links the current project to an existing AO process
```

## `ewig login [KEYFILE]`

Activate a private key.

```
USAGE
  $ ewig login [KEYFILE]

ARGUMENTS
  KEYFILE  Path to your JWK file.

DESCRIPTION
  Activate a private key.
```

## `ewig logout`

Deactivate private key.

```
USAGE
  $ ewig logout

DESCRIPTION
  Deactivate private key.
```

## `ewig plugins`

List installed plugins.

```
USAGE
  $ ewig plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ewig plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.9/src/commands/plugins/index.ts)_

## `ewig plugins add PLUGIN`

Installs a plugin into ewig.

```
USAGE
  $ ewig plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ewig.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the EWIG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the EWIG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ewig plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ewig plugins add myplugin

  Install a plugin from a github url.

    $ ewig plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ewig plugins add someuser/someplugin
```

## `ewig plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ewig plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ewig plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.9/src/commands/plugins/inspect.ts)_

## `ewig plugins install PLUGIN`

Installs a plugin into ewig.

```
USAGE
  $ ewig plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ewig.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the EWIG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the EWIG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ewig plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ewig plugins install myplugin

  Install a plugin from a github url.

    $ ewig plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ewig plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.9/src/commands/plugins/install.ts)_

## `ewig plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ ewig plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ewig plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.9/src/commands/plugins/link.ts)_

## `ewig plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ewig plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ewig plugins unlink
  $ ewig plugins remove

EXAMPLES
  $ ewig plugins remove myplugin
```

## `ewig plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ ewig plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.9/src/commands/plugins/reset.ts)_

## `ewig plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ewig plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ewig plugins unlink
  $ ewig plugins remove

EXAMPLES
  $ ewig plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.9/src/commands/plugins/uninstall.ts)_

## `ewig plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ewig plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ewig plugins unlink
  $ ewig plugins remove

EXAMPLES
  $ ewig plugins unlink myplugin
```

## `ewig plugins update`

Update installed plugins.

```
USAGE
  $ ewig plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.9/src/commands/plugins/update.ts)_

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
