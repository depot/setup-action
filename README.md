# Depot `setup-action` GitHub Action

Provides the [Depot CLI](https://github.com/depot/cli) in the GitHub Actions environment, allowing access to the `depot` binary in subsequent workflow steps.

## Usage

Download and install the latest version of the CLI:

```yaml
jobs:
  job-name:
    steps:
      - uses: depot/setup-action@v1
      - run: depot ...
```

Download and install a specific version of the CLI:

```yaml
jobs:
  job-name:
    steps:
      - uses: depot/setup-action@v1
        with:
          version: 1.2.3
      - run: depot ...
```

## Inputs

- `version` (optional) - A string representing the version of the Depot CLI to install (e.g. `1.2.3`). The default value is `latest` which will install the latest available version. Can also specify a semver version range selector (e.g. `0.x.x`).
- `oidc` (optional) - A boolean value indicating, if `true` the action will authenticate with the Depot API using GitHub Actions OIDC and set the `DEPOT_TOKEN` environment variable for future steps. This is typically not needed if you are using the `depot/build-push-action` action. The default value is `false`.

## Authentication

The `depot` CLI can read a Depot API token from the `DEPOT_TOKEN` environment variable:

```yaml
jobs:
  job-name:
    steps:
      - uses: depot/setup-action@v1
      - run: depot build ...
        env:
          DEPOT_TOKEN: ${{ secrets.DEPOT_TOKEN }}
```

## License

MIT License, see `LICENSE`.
