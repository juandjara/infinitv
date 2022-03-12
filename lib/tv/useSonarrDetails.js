import { useQueryParams } from '../useQueryParams'
import useTVDetails from './useTVDetails'

export default function useSonarrDetails() {
  const { params } = useQueryParams()
  const { data, mutate } = useTVDetails(params.id)

  return {
    sonarr: data && data.sonarr,
    mutate
  }
}
