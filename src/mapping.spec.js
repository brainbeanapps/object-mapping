/* eslint-env mocha */

import 'reflect-metadata'
import { describe, it } from 'mocha'
import chai, { expect } from 'chai'
import mapping, { MAPPING_METADATA_KEY } from './mapping'

chai
  .should()

describe('@mapping()', () => {
  it('should support custom mapping', () => {
    const object = class {
      @mapping('Dto')(
        x => x.renamed,
        x => ({ renamed: x })
      )
      field = 'value'
    }
    const metadata = Reflect.getMetadata(`${MAPPING_METADATA_KEY}:Dto`, object.prototype, 'field')
    expect(metadata).not.to.be.an('undefined')
    metadata.from({ renamed: 'marker' }).should.be.a('string', 'marker')
    metadata.to('marker').should.have.property('renamed', 'marker')
  })

  it('should support as-is mapping', () => {
    const object = class {
      @mapping('Dto').asIs
      field = 'value'
    }
    const metadata = Reflect.getMetadata(`${MAPPING_METADATA_KEY}:Dto`, object.prototype, 'field')
    expect(metadata).not.to.be.an('undefined')
    metadata.from({ field: 'marker' }).should.be.a('string', 'marker')
    metadata.to('marker').should.have.property('field', 'marker')
  })

  it('should support const mapping', () => {
    const object = class {
      @mapping('Dto').const('from', 'to')
      field = 'value'
    }
    const metadata = Reflect.getMetadata(`${MAPPING_METADATA_KEY}:Dto`, object.prototype, 'field')
    expect(metadata).not.to.be.an('undefined')
    metadata.from({ field: 'marker' }).should.be.a('string', 'from')
    metadata.to('marker').should.have.property('field', 'to')
  })

  it('should support rename mapping', () => {
    const object = class {
      @mapping('Dto').rename('renamed')
      field = 'value'
    }
    const metadata = Reflect.getMetadata(`${MAPPING_METADATA_KEY}:Dto`, object.prototype, 'field')
    expect(metadata).not.to.be.an('undefined')
    metadata.from({ renamed: 'marker' }).should.be.a('string', 'marker')
    metadata.to('marker').should.have.property('renamed', 'marker')
  })

  it('should support multiple fields', () => {
    const object = class {
      @mapping('Dto').rename('renamed1')
      field1 = 'value1'

      @mapping('Dto').rename('renamed2')
      field2 = 'value2'
    }
    const metadata = Reflect.getMetadata(`${MAPPING_METADATA_KEY}:Dto`, object.prototype)
    expect(metadata).to.be.an('array', [ 'field1', 'field2' ])
  })

  it('should throw on mapping redefinition', () => {
    expect(() => (class {
      @mapping('Dto').rename('renamed1')
      @mapping('Dto').rename('renamed2')
      field = 'value'
    })).to.throw(/already defined/)
  })

  it('should throw on incomplete mapping definition', () => {
    expect(() => (class {
      @mapping('Dto')()
      field = 'value'
    })).to.throw(/should be defined and should be functions/)
  })
})
