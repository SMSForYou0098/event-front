import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Form, Button, Modal } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { useParams } from 'react-router-dom';
import useDataTable from '../../../../components/hooks/useDatatable';

const FooterMenus = () => {
  const { api, authToken, successAlert } = useMyContext();
  const { id, name } = useParams()

  const [pages, setPages] = useState([])
  const [menus, setMenus] = useState([])
  const [link, setLink] = useState({ title: '', page: '' });
  const [groups, setGroups] = useState([]);



  const fetchPages = async () => {
    try {
      const response = await axios.get(`${api}pages-get-title`, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      const menus = response.data.pagesData;
      setPages(menus)
    } catch (error) {
      console.error('Failed to fetch payment gateways:', error);
    }
  };
  const fetchMenus = async () => {
    try {
      const response = await axios.get(`${api}footer-menu/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        }
      });
      const menus = response.data.MenuData;
      setMenus(menus)
    } catch (error) {
      console.error('Failed to fetch payment gateways:', error);
    }
  };
  useEffect(() => {
    fetchPages()
    fetchMenus()
  }, []);


  const HandleModelShow = () => {
    setShow(true)
  }
  const [linkTitle, setLinkTitle] = useState('');
  const [attachedPage, setAttachedPage] = useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setLinkTitle('');
    setAttachedPage('');
  };
  const handleSave = async () => {
    let url = editState ? `${api}footer-menu-update/${id}` : `${api}footer-menu-store`;
    const payload = {
      title: linkTitle,
      footer_group_id: id,
      page_id: attachedPage,
    };

    try {
      const response = await axios.post(url, payload);
      if (response.data.status) {
        successAlert('Link' + editState ? 'Update Successfully' : "Added Successfully")
      }
    } catch (error) {
      console.error('Error occurred while making the POST request:', error);
      // Handle error appropriately, e.g., display a notification to the user
    }
  };

  const columns = [
    { data: "title", title: "Link" },
    { data: "pages.title", title: "Page" },
    {
      data: null,
      orderable: false,
      searchable: false,
      title: "Action",
      render: function (data) {
        return `<div class="flex align-items-center list-user-action">
                  <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit" data-id=${data?.id} data-method="Edit" data-table="action">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                  </button>`;
      },
    },
  ];
  const tableRef = useRef(null);
  useDataTable({
    tableRef: tableRef,
    columns: columns,
    data: menus,
    actionCallback: (data) => {
      switch (data.method) {
        case "Edit":
          handleEdit(data?.id);
          break;
        case "Delete":
          alert(data?.id);
          break;
        default:
          break;
      }
    },
    // isFooter: true,
  });
  const [editState, setEditState] = useState('')
  const handleEdit = async (id) => {
    let data = menus?.find((item) => item?.id === id)
    if (data) {
      setEditState(true)
      setShow(true)
      setLinkTitle(data?.title)
      setAttachedPage(data?.pages?.id)
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">{`${editState ? 'Update ' : ' Add '}`}Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Link Title Input */}
            <Form.Group className="mb-3">
              <Form.Label>Link Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter link title"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
              />
            </Form.Group>

            {/* Attach Page Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Attach page with this link</Form.Label>
              <Form.Select
                value={attachedPage}
                onChange={(e) => setAttachedPage(e.target.value)}
              >
                <option>Select a page</option>
                {pages && pages?.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className=" iq-document-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="header-title">
            <h4 className="card-title">Menus For {name}</h4>
          </div>
          <div className="button">
            <h4 className="card-title">
              <Button className='form-control' type="button" onClick={() => HandleModelShow()}>Add Link</Button>
            </h4>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg="12">
              <table
                ref={tableRef}
                className="table dataTable"
                data-toggle="data-table"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}

export default FooterMenus