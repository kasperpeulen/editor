/* eslint-env jest */
import unexpected from 'unexpected'
import HoverService, { classes as c, defaultCallbacks, computeLevel } from './index'

const expect = unexpected.clone()

const cases = [{
  d: 'basic left',
  in: {
    room: { width: 100, height: 100 },
    mouse: { x: 0, y: 50 }
  },
  actions: (done) => ({
    leftOf: (item, hover, level) => {
      expect(level, 'to be', 10)
      expect(item.id, 'to be', 'foo')
      done()
    }
  })
}, {
  d: 'basic',
  in: {
    room: { width: 100, height: 100 },
    mouse: { x: 99, y: 50 }
  },
  actions: (done) => ({
    rightOf: (item, hover, level) => {
      expect(level, 'to be', 9)
      expect(item.id, 'to be', 'foo')
      done()
    }
  })
}, {
  d: 'basic ii',
  in: {
    room: { width: 100, height: 100 },
    mouse: { x: 95, y: 50 }
  },
  actions: (done) => ({
    rightOf: (item, hover, level) => {
      expect(level, 'to be', 5)
      done()
    }
  })
}, {
  d: 'basic iii',
  in: {
    room: { width: 100, height: 100 },
    mouse: { x: 92, y: 50 }
  },
  actions: (done) => ({
    rightOf: (item, hover, level) => {
      expect(level, 'to be', 2)
      done()
    }
  })
}, {
  d: 'basic iv',
  in: {
    room: { width: 100, height: 100 },
    mouse: { x: 89, y: 50 }
  },
  actions: (done) => ({
    rightOf: (item, hover, level) => {
      expect(level, 'to be', 0)
      done()
    }
  })
}, {
  d: 'corner c3 i',
  in: {
    room: { width: 100, height: 100 },
    mouse: { x: 98, y: 95 }
  },
  actions: (done) => ({
    rightOf: (item, hover, level) => {
      expect(level, 'to be', 0)
      done()
    }
  })
}]

describe('HoverService', () => {
  it('should have as many classes as callbacks', () => {
    expect(Object.keys(defaultCallbacks).length, 'to be', Object.keys(c).length)
  })

  cases.forEach((c) => {
    it(`should pass test case ${c.d}`, (done) => {
      const h = new HoverService({
        defaultCallbacks
      })

      h.hover({ id: 'foo', node: { id: 'foo', levels: {} }, rawNode: () => ({ id: 'foo' }) }, c.hover || {
        node: {
          levels: {
            right: 10,
            left: 10,
            above: 10,
            below: 10
          }
        }, rawNode: () => ({ id: 'foo' })
      }, c.actions(done), {
        room: c.in.room,
        mouse: c.in.mouse,
        ancestors: c.in.ancestors,
      })
    })
  })
})

describe('computeLevel', () => {
  [{
    i: { width: 10, position: 0, levels: 10 },
    e: 0
  }, {
    i: { width: 10, position: 10, levels: 10 },
    e: 10
  }, {
    i: { width: 10, position: 5, levels: 10 },
    e: 5
  }, {
    i: { width: 20, position: 10, levels: 10 },
    e: 5
  }].forEach((c) => {
    it('should compute the right levels when not enough space is available', () => {
      expect(computeLevel(c.i), 'to equal', c.e)
    })
  });

  [{
    i: { width: 121, position: 50, levels: 10 },
    e: 0
  }, {
    i: { width: 121, position: 51, levels: 10 },
    e: 0
  }, {
    i: { width: 121, position: 120, levels: 10 },
    e: 10
  }, {
    i: { width: 121, position: 52, levels: 10 },
    e: 1
  }, {
    i: { width: 121, position: 79, levels: 10 },
    e: 2
  }, {
    i: { width: 121, position: 94, levels: 10 },
    e: 3
  }, {
    i: { width: 121, position: 102, levels: 10 },
    e: 4
  }, {
    i: { width: 121, position: 107, levels: 10 },
    e: 5
  }, {
    i: { width: 121, position: 111, levels: 10 },
    e: 6
  }, {
    i: { width: 121, position: 114, levels: 10 },
    e: 7
  }, {
    i: { width: 121, position: 116, levels: 10 },
    e: 8
  }, {
    i: { width: 121, position: 118, levels: 10 },
    e: 9
  }, {
    i: { width: 121, position: 119, levels: 10 },
    e: 10
  }].forEach((c) => {
    it('should compute the right levels when in a large cell', () => {
      expect(computeLevel(c.i), 'to equal', c.e)
    })
  })
})
