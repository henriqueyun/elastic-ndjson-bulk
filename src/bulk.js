const fs = require('fs')
const split = require('split2')
const client = require('./esclient')

async function demonstrate () {
  try {

    if (await JSON.stringify( client.indices.exists({ index: 'my-index' })) == "{}") {
      await client.indices.delete({ index: 'my-index' })
    }

    await client.indices.create({
      index: 'my-index'
    })

    const result = await client.helpers.bulk({
      datasource: fs.createReadStream('./data.ndjson').pipe(split(JSON.parse)) ,
      onDocument (doc) {
        //console.log(doc)
        return {
          index: { _index: 'my-index' }
        }
      },
      refreshOnCompletion: true
    })

    console.log(`Bulk Result ${JSON.stringify(result)}`)

    const { body } = await client.search({
      index: 'my-index',
      body: {
        query: {
          match_all: {}
        }
      }
    })

    console.log(await body.hits.hits)

  } catch (e) {
    console.error(e)
  }
}

demonstrate();
