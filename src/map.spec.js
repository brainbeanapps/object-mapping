/* eslint-env mocha */

import 'reflect-metadata'
import { describe, it } from 'mocha'
import chai, { expect } from 'chai'
import map from './map'
import mapping from './mapping'

chai
  .should()

describe('map()', () => {
  it('should support custom mapping', () => {
    class Model {
      @mapping('Dto')(
        x => x.renamed,
        x => ({ renamed: x })
      )
      field = 'value'
    }
    const dto = map(Model, 'Dto', new Model())
    const model = map('Dto', Model, dto)
    model.should.be.deep.equal(new Model())
    dto.should.have.property('renamed', 'value')
  })

  it('should support as-is mapping', () => {
    class Model {
      @mapping('Dto').asIs
      field = 'value'
    }
    const dto = map(Model, 'Dto', new Model())
    const model = map('Dto', Model, dto)
    model.should.be.deep.equal(new Model())
    dto.should.have.property('field', 'value')
  })

  it('should support const mapping', () => {
    class Model {
      @mapping('Dto').const('from', 'to')
      field = 'value'
    }
    const dto = map(Model, 'Dto', new Model())
    const model = map('Dto', Model, dto)
    model.should.have.property('field', 'from')
    dto.should.have.property('field', 'to')
  })

  it('should support rename mapping', () => {
    class Model {
      @mapping('Dto').rename('renamed')
      field = 'value'
    }
    const dto = map(Model, 'Dto', new Model())
    const model = map('Dto', Model, dto)
    model.should.be.deep.equal(new Model())
    dto.should.have.property('renamed', 'value')
  })

  it('should support mapping with two classes', () => {
    class Dto {
      renamed = ''
    }
    class Model {
      @mapping(Dto).rename('renamed')
      field = 'value'
    }
    const dto = map(Model, Dto, new Model())
    const model = map(Dto, Model, dto)
    model.should.be.deep.equal(new Model())
    dto.should.have.property('renamed', 'value')
  })

  it('should throw if no mapping is set', () => {
    class Dto {
      renamed = ''
    }
    class Model {
      field = 'value'
    }
    expect(() => map(Model, Dto, new Model())).to.throw(/Mapping can not be found/)
  })
})
