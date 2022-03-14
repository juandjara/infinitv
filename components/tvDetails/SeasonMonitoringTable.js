export default function SeasonMonitoringTable({ sonarr, onEdit }) {
  const headers = ['Season', '# op episodes', 'Status']
  const allSelected = sonarr.seasons.every(s => s.monitored)

  function toggleAll() {
    const flag = !allSelected
    onEdit({
      ...sonarr,
      seasons: sonarr.seasons.map(s => ({ ...s, monitored: flag }))
    })
  }

  function editSeason(seasonNumber, flag) {
    onEdit({
      ...sonarr,
      seasons: sonarr.seasons.map(s =>
        s.seasonNumber === seasonNumber ? { ...s, monitored: flag } : s
      )
    })
  }

  return (
    <div className="overflow-hidden shadow-md sm:rounded-lg">
      <table className="min-w-full">
        <thead className="bg-blue-600">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                  checked={allSelected}
                  onChange={toggleAll}
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            {headers.map(h => (
              <th
                key={h}
                scope="col"
                className="py-3 px-4 text-xs font-medium tracking-wider text-left uppercase text-blue-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sonarr.seasons.map(season => (
            <tr key={season.seasonNumber} className="border-b bg-blue-700 border-blue-600">
              <td className="p-4 w-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 text-blue-500 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                    checked={season.monitored}
                    onChange={() => editSeason(season.seasonNumber, !season.monitored)}
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <td className="py-4 px-4 text-sm font-medium whitespace-nowrap text-white">
                <span>Season {season.seasonNumber}</span>
              </td>
              <td className="py-4 px-4 text-sm whitespace-nowrap text-blue-300">
                {season.statistics.totalEpisodeCount}
              </td>
              <td className="py-4 px-4 w-36 text-sm whitespace-nowrap text-blue-300">
                {season.monitored ? 'Monitored' : 'Not Monitored'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
