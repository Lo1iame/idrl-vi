import {test} from 'node:test'
import assert from 'node:assert/strict'
import {presentationPalette} from '../scripts/presentation-palette.mjs'

test('presentation palette follows the supplied brand and semantic tokens',()=>{
  const tokens={brand:{navy:'#112233',blue:'#223344',cyan:'#334455',navyOnDark:'#445566'},light:{foreground:'#556677',mutedForeground:'#667788',border:'#778899',surfaceSubtle:'#8899aa'}}
  assert.deepEqual(presentationPalette(tokens),{navy:'#112233',blue:'#223344',cyan:'#334455',soft:'#445566',ink:'#556677',muted:'#667788',rule:'#778899',pale:'#8899aa',white:'#ffffff',cool:'#c8d9ee'})
})
