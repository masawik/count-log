import { Link } from 'react-router'

export function meta() {return [ { title: '404' } ]}

export default function NotFoundPage() {
  return (
  <div>
    <div>nothing to see here</div>

    <Link to='/' replace className='p-2 border-2 border-black rounded-md inline-block hover:bg-black hover:text-white'>
      Go home
    </Link>
  </div>
  )
}
