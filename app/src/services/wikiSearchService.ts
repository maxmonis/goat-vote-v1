// WIP, async doesn't work

import axios from 'axios'

const BASE_URL = 'https://en.wikipedia.org/w/api.php'
const BASE_PARAMS = { format: 'json', origin: '*', action: 'query' }

interface Thumbnail {
  source: string
  height: string
  width: string
}

interface Selection {
  title: string
  thumbnail: Thumbnail
}

class WikiStorageService {
  isLoading: boolean
  appliedQuery: string
  selections: Selection[]
  availableOptions: string[]
  constructor() {
    this.isLoading = false
    this.appliedQuery = ''
    this.selections = []
    this.availableOptions = []
  }

  async searchWiki(query: string, sport: string) {
    if (this.isLoading) return
    const params = {
      ...BASE_PARAMS,
      action: 'opensearch',
      search: query,
    }
    this.isLoading = true
    try {
      const {
        data: [, results],
      }: { data: [string, string[]] } = await axios.get(BASE_URL, {
        params,
      })
      const selectionPromises = results.map(result =>
        this.fetchSelection(result)
      )
      const options = await Promise.all(selectionPromises)
      const revisionPromises = options.map(({ title }) =>
        this.fetchRevisions(title)
      )
      const revisionsPages = await Promise.all(revisionPromises)
      const validOptions = []
      for (const revisionPage of revisionsPages) {
        const { title, revisions } = revisionPage
        const description = revisions[0]['*']
        if (!title.includes('(') && description.includes(`${sport} player`)) {
          const validOption = options.find(option => option.title === title)
          validOption.thumbnail = validOption.thumbnail || {}
          validOptions.push(validOption)
        }
      }
      this.availableOptions = validOptions
      this.appliedQuery = query
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async fetchSelection(selectionTitle: string) {
    const titles = selectionTitle.trim().replace(/\s+/g, '_')
    const params = {
      ...BASE_PARAMS,
      prop: 'pageimages',
      pithumbsize: '80',
      titles,
    }
    const {
      data: {
        query: { pages },
      },
    }: { data: { query: { pages: { [key: string]: any } } } } = await axios.get(
      BASE_URL,
      { params }
    )
    const pageId = Object.keys(pages)[0]
    return pages[pageId]
  }

  private async fetchRevisions(selectionTitle = 'NBA_75th_Anniversary_Team') {
    const titles = selectionTitle.trim().replace(/\s+/g, '_')
    const {
      data: {
        query: { pages },
      },
    }: { data: { query: { pages: { [key: string]: any } } } } = await axios.get(
      BASE_URL,
      {
        params: {
          ...BASE_PARAMS,
          titles,
          rvprop: 'content',
          prop: 'revisions',
        },
      }
    )
    const pageId = Object.keys(pages)[0]
    return pages[pageId]
  }
}

export default WikiStorageService
