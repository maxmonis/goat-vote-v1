const axios = require("axios")

const {BASE_URL, BASE_PARAMS} = require("../constants/wikiSearch")

async function fetchThumbnails(titles: string | string[], pithumbsize = "200") {
  if (!titles?.length) {
    return new Promise((_resolve, reject) => reject([]))
  }
  const params = {
    ...BASE_PARAMS,
    prop: "pageimages",
    pithumbsize,
    titles: typeof titles === "string" ? titles : titles.join("|"),
  }
  try {
    const {data} = await axios.get(BASE_URL, {params})
    return Object.values(data?.query?.pages || {})
  } catch (error) {
    console.error(error)
    return []
  }
}

module.exports = fetchThumbnails

export {}
