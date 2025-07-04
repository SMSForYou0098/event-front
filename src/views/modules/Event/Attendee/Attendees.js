import React, { memo, Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Card, Image, } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import CustomDataTable from "../Wallet/CustomDataTable";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";

const Attendees = memo(() => {
  const { api, successAlert, authToken, UserData } = useMyContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetAttendee = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}attendee-list/${UserData?.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });

      if (response.data.status) {
        setUsers(response.data.attendees);
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setLoading(false);
    }
  }, [api, UserData?.id, authToken]);

  useEffect(() => {
    GetAttendee();
  }, [GetAttendee]);


  const [selectedImage, setSelectedImage] = useState("");

  const openLightbox = useCallback((imagePath) => {
    setSelectedImage(imagePath);
  }, []);

  const columns = useMemo(() => [
    {
      dataField: 'id',
      text: '#',
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Name',
      text: 'Name',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Mo',
      text: 'Contact',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Email',
      text: 'Email',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Photo',
      text: 'Photo',
      formatter: (cell) => {
        if (cell) {
          return (
            <div className="d-flex justify-content-center">
              <CustomTooltip text="View Photo">
                <div onClick={() => openLightbox(cell)} style={{ cursor: 'pointer' }}>
                  <img src={cell} alt="Attendee" loading="lazy"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}/>
                </div>
              </CustomTooltip>
            </div>
          );
        }
        return <span>No Image</span>;
      },
      headerAlign: 'center',
      align: 'center'
    }
  ], [openLightbox]);



  return (
    <Fragment>
      <Row>

        {selectedImage && (
          <div
            className="lightbox-overlay"
            onClick={() => setSelectedImage("")}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          >
            <Image
              src={selectedImage}
              alt="Full size"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <div className="header-title">
                <h4 className="card-title">Attendees</h4>
              </div>
            </Card.Header>
            <Card.Body className="px-0">
              <CustomDataTable
                data={users}
                columns={columns}
                loading={loading}
                keyField="id"
                searchPlaceholder="Search attendees..."
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
});

Attendees.displayName = "Attendees";
export default Attendees;
