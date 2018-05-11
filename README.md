# object-mapping utility library by [Brainbean Apps](https://brainbeanapps.com)

[![Build Status](https://img.shields.io/travis/brainbeanapps/object-mapping.svg)](https://travis-ci.org/brainbeanapps/object-mapping)
[![Coverage Status](https://img.shields.io/coveralls/github/brainbeanapps/object-mapping.svg)](https://coveralls.io/github/brainbeanapps/object-mapping?branch=master)
[![npm version](https://badge.fury.io/js/object-mapping.svg)](https://badge.fury.io/js/object-mapping)
[![Dependency Status](https://img.shields.io/librariesio/github/brainbeanapps/object-mapping.svg)](https://libraries.io/github/brainbeanapps/object-mapping)
[![Maintainability](https://api.codeclimate.com/v1/badges/9671e17e993340df3491/maintainability)](https://codeclimate.com/github/brainbeanapps/object-mapping/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/object-mapping.png?downloads=true)](https://nodei.co/npm/object-mapping/)

A decorator-based object-to-object mapper for TypeScript and ES2016/ES7.

## Getting Started

### Installation

```bash
npm install --save object-mapping
```

or

```bash
yarn add object-mapping
```

### Usage

```js
import 'reflect-metadata'
import { map, mapping } from 'object-mapping'

export interface Dto {
  demo_value = ''
}

export class Model {
  @mapping('Dto').rename('demo_value')
  demoValue = ''

  public static fromDto (dto: Dto): Model {
    return map<Dto, Model>('GetDemoValueResponseDto', Model, dto)
  }

  public static toDto (object: Model): Dto {
    return map<Model, Dto>(Model, 'Dto', object)
  }

  public toDto (): Dto {
    return Model.toDto(this)
  }
}
```
