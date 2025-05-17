# Common

Common utilities, decorators, exceptions, and types shared across Selvoc project.

## Features

- Decorators (e.g., `@ToDate`)
- App exceptions (transport agnostic; custom `code` and NestJS mapper are planned)
- Shared TypeScript types

## Usage

```sh
npm install @selvoc/common
```

Import what you need:

```ts
import { ToDate } from '@selvoc/common';
import { NotFoundException } from '@selvoc/common';
// ...
```
