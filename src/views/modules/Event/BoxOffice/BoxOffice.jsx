import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";
import BookingList from "../Events/Bookings/BookingList";

const BoxOffice = () => {
  const { UserList, customStyles, authToken, api } = useMyContext();
  const [inputValue, setInputValue] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const customFilter = (option, inputValue) => {
    const label = option.label?.toLowerCase() || "";
    const email = option.data.email?.toLowerCase() || "";
    const number = option.data.number?.toString().toLowerCase() || "";
    const input = inputValue.toLowerCase();

    return (
      email.includes(input) || number.includes(input) || label.includes(input)
    );
  };

  const HandleUserChange = (user) => {
    setSelectedUser(user);
    UserBookings(user.value);
  };
  const UserBookings = async (id) => {
    if (id) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${api}user-bookings/${id}`, {
          headers: {
            Authorization: "Bearer " + authToken,
          },
        });
        setBookings(response.data.bookings);
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
  };

  const customNoOptionsMessage = () => {
    return "No user found";
  };
  return (
    <Row>
      <Col md="6">
        <Card>
          <Card.Header>
            <h5 className="card-title">Box Office</h5>
          </Card.Header>
          <Card.Body>
            <div className="iq-scroller-effect">
              <Row>
                <Col md="12">
                  <div className="form-group custom-choicejs">
                    <Select
                      options={UserList}
                      className="js-choice"
                      select="one"
                      menuIsOpen={inputValue?.length > 0}
                      noOptionsMessage={customNoOptionsMessage}
                      filterOption={customFilter}
                      onInputChange={(value) => setInputValue(value)}
                      onChange={(e) => HandleUserChange(e)}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </div>
                  <span className="text-dark ">
                    User can search via name, mobile number or email
                  </span>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>
      {selectedUser && (
        <Col md="6">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="card-title">Bookings</h5>
              <p className="text-black">
                Total Bookings:{" "}
                <span className="text-secondary">{bookings.length}</span>
              </p>
            </Card.Header>
            <Card.Body style={{ overflowY: "auto", maxHeight: "80vh" }}>
              <div className="iq-scroller-effect">
                {bookings.length > 0 ? (
                  <>
                    <BookingList
                      bookings={bookings}
                      loading={isLoading}
                      setLoading={setIsLoading}
                      hideDownload={true}
                    />
                  </>
                ) : (
                  <p className="text-dark text-center">
                    No bookings found for this user.
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default BoxOffice;
