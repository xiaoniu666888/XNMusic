import { HYEventStore } from "hy-event-store"
import { getPlaylistDetail } from '../services/music'

// const rankingIds = [ 3779629, 2884035, 19723756 ]
const rankingMap = {
  newRanking: 3779629,
  originRanking: 2884035,
  upRanking:  19723756
}

const rankingStore = new HYEventStore({
  state: {
    newRanking: {},
    originRanking: {},
    upRanking: {}
  },
  actions: {
    fetchRankingDataAction(ctx) {
      for(const key in rankingMap){
        const id = rankingMap[key]
        getPlaylistDetail(id).then( res => {
          ctx[key] = res.playlist
        })
      }
    }
  }
})

export default rankingStore