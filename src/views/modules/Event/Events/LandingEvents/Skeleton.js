import React from 'react'
import { Image } from 'react-bootstrap'
import skeleton from '../../../../../assets/event/stock/skltn.gif';
const Skeleton = () => {
  return (
    <div>
      <Image src={skeleton} width={300} className='rounded-4'/>
    </div>
  )
}

export default Skeleton
