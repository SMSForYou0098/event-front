import React from 'react'
import { Placeholder } from 'react-bootstrap';

const PostTableSkeletons = () => {
  return Array(10).fill(0).map((_, index) => (
      <tr key={index} className="align-middle text-center">
        <td>
          <Placeholder as="div" animation="glow">
            <Placeholder xs={2} />
          </Placeholder>
        </td>
        <td className="text-start">
          <Placeholder as="div" animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
        </td>
        <td>
          <Placeholder as="div" animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        </td>
        <td>
          <Placeholder as="div" animation="glow">
            <Placeholder style={{ height: '60px', width: '100px' }} />
          </Placeholder>
        </td>
        <td>
          <Placeholder as="div" animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        </td>
        <td>
          <Placeholder as="div" animation="glow">
            <Placeholder.Button variant="info" xs={3} className="me-2" />
            <Placeholder.Button variant="danger" xs={3} />
          </Placeholder>
        </td>
      </tr>
    ));
}

export default PostTableSkeletons
