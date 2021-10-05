import { useQueryParams } from '@/lib/useQueryParams'
import useUsers, { DEFAULT_RPP } from '@/lib/users/useUsers'
import { useRouter } from 'next/router'
import Tag from '@/components/common/Tag'
import Pagination from '@/components/common/Pagination'
import SearchBox from '@/components/common/SearchBox'
import UserFiltersPanel from '@/components/users/UserFilterPanel'
import UserListItem from '@/components/users/UserListItem'

export default function UserList({ showAccessColumn = true }) {
  const router = useRouter()
  const { query, params } = useQueryParams()
  const { users, count } = useUsers(query)
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp || DEFAULT_RPP)

  function isSelected({ id }) {
    return id === params.id
  }

  function handlePageChange(page) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    })
  }

  return (
    <main className="flex-auto my-4 container mx-auto px-3">
      <h1 className="mt-4 mb-16 font-bold text-4xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-primary-700 to-primary-300">
        Usuarios
      </h1>
      <div className="relative flex items-end mb-2">
        <h2 className="flex items-center text-xl font-semibold tracking-wide space-x-2">
          <Tag color="primary">{count}</Tag>
          <span>Total</span>
        </h2>
        <div className="flex-auto"></div>
        <SearchBox route="/users" />
        <UserFiltersPanel />
      </div>
      <div className={`overflow-auto rounded-lg bg-white text-gray-700`}>
        <header
          className={`${
            showAccessColumn ? 'hidden md:flex' : 'hidden'
          } px-3 border-b border-gray-300 sticky top-0 z-10 flex space-x-2 bg-white`}>
          <p className="text-sm flex-1">Usuario</p>
          <p className="text-sm">Ultimo acceso</p>
        </header>
        <ul className="">
          {users ? (
            users.map(user => (
              <UserListItem key={user.id} user={user} showAccessColumn={showAccessColumn} selected={isSelected(user)} />
            ))
          ) : (
            <>
              <UserListItem />
              <UserListItem />
              <UserListItem />
              <UserListItem />
              <UserListItem />
            </>
          )}
        </ul>
      </div>
      <Pagination onChange={handlePageChange} page={page} rpp={rpp} count={count} />
    </main>
  )
}
