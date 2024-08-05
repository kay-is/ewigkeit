# Ewig

A deployment tool for the Permaweb.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ewig.svg)](https://npmjs.org/package/ewig)
[![Downloads/week](https://img.shields.io/npm/dw/ewig.svg)](https://npmjs.org/package/ewig)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g ewig
$ ewig COMMAND
running command...
$ ewig (--version)
ewig/0.0.0 linux-x64 node-v20.14.0
$ ewig --help [COMMAND]
USAGE
  $ ewig COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`ewig`](#ewig)
- [`ewig  `](#ewig--)
- [`ewig build`](#ewig-build)
- [`ewig deploy`](#ewig-deploy)
- [`ewig dev`](#ewig-dev)
- [`ewig domains add ARNSDOMAIN`](#ewig-domains-add-arnsdomain)
- [`ewig domains inspect ARNSDOMAIN`](#ewig-domains-inspect-arnsdomain)
- [`ewig domains ls`](#ewig-domains-ls)
- [`ewig domains rm ARNSDOMAIN`](#ewig-domains-rm-arnsdomain)
- [`ewig help [COMMAND]`](#ewig-help-command)
- [`ewig init [PROJECTNAME]`](#ewig-init-projectname)
- [`ewig login [KEYFILE]`](#ewig-login-keyfile)
- [`ewig logout`](#ewig-logout)
- [`ewig plugins`](#ewig-plugins)
- [`ewig plugins add PLUGIN`](#ewig-plugins-add-plugin)
- [`ewig plugins:inspect PLUGIN...`](#ewig-pluginsinspect-plugin)
- [`ewig plugins install PLUGIN`](#ewig-plugins-install-plugin)
- [`ewig plugins link PATH`](#ewig-plugins-link-path)
- [`ewig plugins remove [PLUGIN]`](#ewig-plugins-remove-plugin)
- [`ewig plugins reset`](#ewig-plugins-reset)
- [`ewig plugins uninstall [PLUGIN]`](#ewig-plugins-uninstall-plugin)
- [`ewig plugins unlink [PLUGIN]`](#ewig-plugins-unlink-plugin)
- [`ewig plugins update`](#ewig-plugins-update)
- [`ewig whoami`](#ewig-whoami)

## `ewig`

Show active key and address.

```
USAGE
  $ ewig

DESCRIPTION
  Show active key and address.

ALIASES
  $ ewig
  $ ewig
```

## `ewig  `

Show active key and address.

```
USAGE
  $ ewig

DESCRIPTION
  Show active key and address.

ALIASES
  $ ewig
  $ ewig
```

## `ewig build`

Build the project with the buildCommand in the config.

```
USAGE
  $ ewig build [-p]

FLAGS
  -p, --prod  build for production

DESCRIPTION
  Build the project with the buildCommand in the config.
```

_See code: [src/commands/build.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/build.ts)_

## `ewig deploy`

Deploys the current project.

```
USAGE
  $ ewig deploy [--prod] [--skip-domain]

FLAGS
  --prod         Deploy to production and assign main ArNS name.
  --skip-domain  Prevent ArNS name assing when deploying in production.

DESCRIPTION
  Deploys the current project.
```

_See code: [src/commands/deploy.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/deploy.ts)_

## `ewig dev`

Run the devCommand from ewig.json

```
USAGE
  $ ewig dev

DESCRIPTION
  Run the devCommand from ewig.json
```

_See code: [src/commands/dev.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/dev.ts)_

## `ewig domains add ARNSDOMAIN`

Add an ArNS domain to the project.

```
USAGE
  $ ewig domains add ARNSDOMAIN [--add-controller]

ARGUMENTS
  ARNSDOMAIN  ArNS domain to add to the project.

FLAGS
  --add-controller  Add the project as controller to ANT.

DESCRIPTION
  Add an ArNS domain to the project.
```

_See code: [src/commands/domains/add.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/domains/add.ts)_

## `ewig domains inspect ARNSDOMAIN`

Read details of an ArNS domain.

```
USAGE
  $ ewig domains inspect ARNSDOMAIN

ARGUMENTS
  ARNSDOMAIN  ARNs domain to inspect.

DESCRIPTION
  Read details of an ArNS domain.
```

_See code: [src/commands/domains/inspect.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/domains/inspect.ts)_

## `ewig domains ls`

List all ArNS domains associated with the project.

```
USAGE
  $ ewig domains ls

DESCRIPTION
  List all ArNS domains associated with the project.
```

_See code: [src/commands/domains/ls.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/domains/ls.ts)_

## `ewig domains rm ARNSDOMAIN`

Remove ArNS domain from the project.

```
USAGE
  $ ewig domains rm ARNSDOMAIN [--remove-controller]

ARGUMENTS
  ARNSDOMAIN  ArNS domain to remove from project.

FLAGS
  --remove-controller  Remove the project as controller from ANT.

DESCRIPTION
  Remove ArNS domain from the project.
```

_See code: [src/commands/domains/rm.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/domains/rm.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.6/src/commands/help.ts)_

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

_See code: [src/commands/init.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/init.ts)_

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

_See code: [src/commands/login.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/login.ts)_

## `ewig logout`

Deactivate private key.

```
USAGE
  $ ewig logout

DESCRIPTION
  Deactivate private key.
```

_See code: [src/commands/logout.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/logout.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.7/src/commands/plugins/index.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.7/src/commands/plugins/inspect.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.7/src/commands/plugins/install.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.7/src/commands/plugins/link.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.7/src/commands/plugins/reset.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.7/src/commands/plugins/uninstall.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.3.7/src/commands/plugins/update.ts)_

## `ewig whoami`

Show active key and address.

```
USAGE
  $ ewig whoami

DESCRIPTION
  Show active key and address.

ALIASES
  $ ewig
  $ ewig
```

_See code: [src/commands/whoami.ts](https://github.com/kay-is/ewig/blob/v0.0.0/src/commands/whoami.ts)_

<!-- commandsstop -->
