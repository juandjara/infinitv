export default function Index() {
  return <div></div>
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/tv'
    }
  }
}
