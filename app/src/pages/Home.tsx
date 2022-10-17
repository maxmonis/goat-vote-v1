import {useEffect} from "react"
import {useTranslation} from "react-i18next"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import {useAppSelector, useAppDispatch} from "../app/hooks"
import {selectRankings, getAllRankings} from "../features/create/rankingSlice"
import {SavedRanking} from "../interfaces"

const Home = () => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const rankings: SavedRanking[] = useAppSelector(selectRankings)

  useEffect(() => {
    dispatch(getAllRankings())
    // eslint-disable-next-line
  }, [])

  return (
    <Box py={5}>
      <Typography textAlign="center" variant="h1" my={6}>
        Who's the GOAT?
      </Typography>
      <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
        {rankings.map(
          ({_id, category, timeframe, subcategory, creatorName, titles}) => (
            <Box key={_id} m={6} width="15rem">
              <Typography variant="body1" textAlign="center">
                The best {subcategory} in {category}{" "}
                {getTimeframeText(timeframe)}
              </Typography>
              <Typography variant="body2" my={2} textAlign="center">
                by {creatorName}
              </Typography>
              <Box mx="auto" sx={{maxWidth: "max-content"}}>
                {titles.split("|").map((title: string, index: number) => (
                  <Typography variant="body1" key={title}>
                    {_getText({category, subcategory, index})}. {title}
                  </Typography>
                ))}
              </Box>
            </Box>
          )
        )}
      </Box>
    </Box>
  )

  function getTimeframeText(key: string) {
    switch (key) {
      case "all-time":
        return t("of all time")
      case "currently":
        return t("right now")
      case "pre-1920":
        return t("before 1920")
      case "pre-1960":
        return t("before 1960")
      default:
        return t("of the {{decade}}", {decade: key})
    }
  }

  function _getText({
    category,
    subcategory,
    index,
  }: {
    category: string
    subcategory: string
    index: number
  }) {
    switch (category) {
      case "baseball":
        return subcategory === "lineup" && index === 9 ? "P" : index + 1
      case "basketball":
        const positions = ["G", "G", "F", "F", "C"]
        return subcategory === "lineup"
          ? positions[index] || index + 1
          : index + 1
      default:
        return index + 1
    }
  }
}

export default Home
