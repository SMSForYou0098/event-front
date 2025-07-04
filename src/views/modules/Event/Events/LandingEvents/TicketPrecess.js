import React, { useState, memo, Fragment, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Row, Col, Image, Table, Form, Card, Alert, TabPane, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import img1 from "../../../../../assets/modules/e-commerce/images/cart/01.png";
import img2 from "../../../../../assets/modules/e-commerce/images/cart/02.png";
import img3 from "../../../../../assets/modules/e-commerce/images/cart/03.png";
import img4 from "../../../../../assets/modules/e-commerce/images/01.png";
import img5 from "../../../../../assets/modules/e-commerce/images/user-cards/02.png";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import CustomCounter from "../Counter/customCounter";
import OrderCalculation from "../../CustomUtils/BookingUtils/OrderSmmary";

const TicketPrecess = memo(() => {
    const { api, authToken, getCurrencySymbol } = useMyContext();


    const cart = () => {
        document.getElementById("cart").classList.add("show");
        document.getElementById("checkout").classList.remove("show");
        document.getElementById("payment").classList.remove("show");
        document.getElementById("iq-tracker-position-1").classList.add("active");
        document.getElementById("iq-tracker-position-2").classList.remove("active");
        // document.getElementById("iq-tracker-position-2").classList.add("done");
        // document.getElementById("iq-tracker-position-3").classList.add("active");
    };
    const checkout = () => {
        document.getElementById("cart").classList.remove("show");
        document.getElementById("checkout").classList.add("show");
        document.getElementById("iq-tracker-position-1").classList.remove("active");
        document.getElementById("iq-tracker-position-1").classList.add("done");
        document.getElementById("iq-tracker-position-2").classList.add("active");
    };
    const payment = () => {
        document.getElementById("checkout").classList.remove("show");
        document.getElementById("payment").classList.add("show");
        document.getElementById("iq-tracker-position-2").classList.remove("active");
        document.getElementById("iq-tracker-position-2").classList.add("done");
        document.getElementById("iq-tracker-position-3").classList.add("active");
    };

    const [productList, setProductList] = useState([
        {
            image: img1,
            name: "Biker’s Jacket",
            color: "Red & Black",
            size: " L",
            price: "$80.00",
        },
        {
            image: img2,
            name: "Pink Sweater",
            color: "Pink",
            size: "M",
            price: "$70.00",
        },
        {
            image: img3,
            name: "Beats Headphones",
            color: "Green",
            size: "M",
        },
        {
            image: img4,
            name: "Shoes",
            color: "Yellow",
            size: "8",
        },
    ]);



    const { id } = useParams();
    const [event, setEvent] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [code, setCode] = useState('');
    const [appliedPromoCode, setAppliedPromoCode] = useState('');
    const [subtotal, setSubTotal] = useState('0');
    const [discount, setDiscount] = useState(0);
    const [ticketCurrency, setTicketCurrency] = useState('₹');
    const [totalTax, setTotalTax] = useState('10');
    const [grandTotal, setGrandTotal] = useState('10');
    const [baseAmount, setBaseAmount] = useState('0');
    const [centralGST, setCentralGST] = useState('0');
    const [stateGST, setStateGST] = useState('0');



    const getTicketData = async () => {
        await axios.get(`${api}event-detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        })
            .then((res) => {
                if (res.data.status) {
                    setEvent(res.data.events)
                }
            }).catch((err) =>
                console.log(err)
            )
    }

    useEffect(() => {
        getTicketData()
    }, [])


    const getTicketCount = (quantity, category, price) => {
        setSelectedTickets(prevTickets => {
            const existingIndex = prevTickets.findIndex(ticket => ticket.category === category);
            if (existingIndex !== -1) {
                // If category exists, update its quantity
                const updatedTickets = [...prevTickets];
                updatedTickets[existingIndex].quantity = quantity;
                return updatedTickets;
            } else {
                // If category doesn't exist, add a new ticket
                return [...prevTickets, { category, quantity, price }];
            }
        });
    }

    useEffect(() => {
        if (selectedTickets) {
            const total = selectedTickets.reduce((acc, ticket) => {
                const totalPriceForCategory = ticket.price * ticket.quantity;
                return acc + totalPriceForCategory;
            }, 0);
            setSubTotal(total);
        }
    }, [selectedTickets]);


    useEffect(() => {

        if (subtotal) {
            setBaseAmount(subtotal * 10 / 100)
            setCentralGST(baseAmount * 9 / 100)
            setStateGST(baseAmount * 9 / 100)
            setTotalTax(centralGST + stateGST + baseAmount)
        }

        if (((subtotal + totalTax) - discount) > 0) {
            let total = (subtotal + +totalTax) - discount
            setGrandTotal(total.toFixed(2))
        }
    }, [subtotal, totalTax, discount, baseAmount, centralGST, stateGST]);


    const applyPromode = () => {
        if (code === 'abc' || code === '2233') {
            Sweetalert()
            setDiscount(40)
            setAppliedPromoCode(code)
            setCode('')
        } else {
            SweetalertError()
        }
    };
    const handleRemovePromocode = () => {
        setDiscount(0)
    };
    const categories = selectedTickets.reduce((acc, ticket) => {
        if (!acc[ticket.category]) {
            acc[ticket.category] = [];
        }
        acc[ticket.category].push(ticket);
        return acc;
    }, {});

    function Sweetalert() {
        Swal.fire({
            icon: "success",
            title: "Applied Success!",
            text: "Promocode applied succesfully.",
        });
    }
    function SweetalertError() {
        Swal.fire({
            icon: "error",
            title: "Invalid Promocode!",
            text: "Invalid Promocode.",
        });
    }
    return (
        <Fragment>
            <Row>
                {/* <Col sm="12"> */}
                <ul
                    className="text-center iq-product-tracker mb-0 py-4"
                    id="progressbar"
                >
                    <li
                        className="active iq-tracker-position-0"
                        id="iq-tracker-position-1"
                    >
                        Cart
                    </li>
                    <li className="iq-tracker-position-0" id="iq-tracker-position-2">
                        Checkout
                    </li>
                    <li className="iq-tracker-position-0" id="iq-tracker-position-3">
                        Payment
                    </li>
                </ul>
                <div id="cart" className="iq-product-tracker-card show b-0">
                    <Row>
                        <Col lg="8">
                            <Card>
                                <div className="card-header">
                                    <h4> {event?.name}</h4>
                                </div>
                                <Card.Body className="p-0">
                                    <Table responsive className="mb-0">
                                        <tbody>
                                            {event?.tickets?.map((item, index) => {
                                                return (
                                                    <tr data-item="list" key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-4">
                                                                <div>
                                                                    <h6 className="mb-3">{item.name}</h6>
                                                                    <p className="mb-1">Price: {getCurrencySymbol(item?.currency)} {item?.price}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <CustomCounter
                                                                getTicketCount={getTicketCount}
                                                                category={item.name}
                                                                price={item.price}
                                                                limit={10}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-3">
                                                                <p className="text-decoration-line-through mb-0">

                                                                </p>
                                                                <Link to="#" className="text-decoration-none">
                                                                    {getCurrencySymbol(item?.currency)}  {selectedTickets.map((ticket) =>
                                                                        ticket.category === item.name &&
                                                                        item.price * ticket.quantity
                                                                    )}
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card>
                                <div className="card-header">
                                    <h4 className="mb-0">Order Summary</h4>
                                </div>
                                <Card.Body>
                                    <div className="border-bottom">
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6 className="mb-0">Order ID</h6>
                                            <h6 className="mb-0">ASDW11268</h6>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Coupon Code"
                                                aria-label="Coupon Code"
                                                aria-describedby="CouponCode"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                            />
                                            <Button
                                                className="btn btn-primary"
                                                type="button"
                                                id="CouponCode"
                                                onClick={() => applyPromode()}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="border-bottom mt-4">
                                        {
                                            discount !== 0 &&
                                            <div className="d-flex justify-content-end  mb-4">
                                                <TabPane id="alerts-disimissible-component" className=" tab-pane tab-example-result fade active show " role="tabpanel" aria-labelledby="alerts-disimissible-component-tab">
                                                    <Alert className="d-flex align-content-center justify-content-between gap-2 alert-success alert-dismissible fade show mb-0" role="alert">
                                                        <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.94118 10.7474V20.7444C5.94118 21.0758 5.81103 21.3936 5.57937 21.628C5.3477 21.8623 5.0335 21.994 4.70588 21.994H2.23529C1.90767 21.994 1.59347 21.8623 1.36181 21.628C1.13015 21.3936 1 21.0758 1 20.7444V11.997C1 11.6656 1.13015 11.3477 1.36181 11.1134C1.59347 10.879 1.90767 10.7474 2.23529 10.7474H5.94118ZM5.94118 10.7474C7.25166 10.7474 8.50847 10.2207 9.43512 9.28334C10.3618 8.34594 10.8824 7.07456 10.8824 5.74887V4.49925C10.8824 3.83641 11.1426 3.20071 11.606 2.73201C12.0693 2.26331 12.6977 2 13.3529 2C14.0082 2 14.6366 2.26331 15.0999 2.73201C15.5632 3.20071 15.8235 3.83641 15.8235 4.49925V10.7474H19.5294C20.1847 10.7474 20.8131 11.0107 21.2764 11.4794C21.7397 11.9481 22 12.5838 22 13.2466L20.7647 19.4947C20.5871 20.2613 20.25 20.9196 19.8045 21.3704C19.3589 21.8211 18.8288 22.04 18.2941 21.994H9.64706C8.6642 21.994 7.72159 21.599 7.0266 20.896C6.33162 20.1929 5.94118 19.2394 5.94118 18.2451" stroke="currentColor" />
                                                        </svg>
                                                        <h6 className="p-0 m-0"><Badge bg="danger">{appliedPromoCode}</Badge></h6>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <strong>Success!</strong> Promocode applied succesfully!
                                                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleRemovePromocode()}></button>
                                                            </div>
                                                        </div>
                                                    </Alert>
                                                </TabPane>
                                            </div>
                                        }
                                        <OrderCalculation
                                            ticketCurrency={ticketCurrency}
                                            subtotal={subtotal}
                                            discount={discount}
                                            baseAmount={baseAmount}
                                            centralGST={centralGST}
                                            totalTax={totalTax}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6 className="mb-0">Order Total</h6>
                                            <h5 className="text-primary mb-0">
                                                {ticketCurrency}{grandTotal}
                                            </h5>

                                        </div>
                                        <div className="alert border-primary rounded border-1 mb-4">
                                            <div className="d-flex justify-content-between align-items-center ">
                                                <h6 className="text-primary mb-0">
                                                    Total Savings on this order
                                                </h6>
                                                <h6 className="text-primary mb-0">
                                                    <b>{ticketCurrency}{discount}</b>
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <Button
                                                id="place-order"
                                                to="#"
                                                onClick={checkout}
                                                variant="primary d-block mt-3 next w-100"
                                            >
                                                Checkout
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div id="checkout" className="iq-product-tracker-card b-0">
                    <Row>
                        <Col lg="8">
                            <Card>
                                <Card.Body>
                                    <h4 className="mb-0">attendees</h4>
                                    <Row>
                                        <Col lg="4">
                                            <div className="mt-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="address"
                                                        id="address21"
                                                        defaultChecked
                                                    />
                                                    <label
                                                        className="form-check-label mb-0"
                                                        htmlFor="address21"
                                                    >
                                                        <span className="h6 mb-0">Attendee 1</span>
                                                    </label>
                                                </div>
                                                <p className="mb-0">Elon Musk</p>
                                                <p className="mb-0">
                                                    265, Hill View, Rochester Avenue.Kentucky - 40062{" "}
                                                </p>
                                                <div className="mt-2 d-flex gap-1">
                                                    <Link to="#">Edit</Link>
                                                    <span>|</span>
                                                    <Link to="#">Remove </Link>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <h4 className="mb-0">Add Attendee Details</h4>
                                </Card.Header>
                                <Card.Body>
                                    <Form
                                    // onSubmit={handleSubmit}
                                    >
                                        <Row>
                                            {Object.keys(categories).map((category, catIndex) => (
                                                <div key={category}>
                                                    <h5>{category} Attendee</h5>
                                                    <Row>
                                                        {categories[category].map((ticket, ticketIndex) => (
                                                            Array.from({ length: ticket.quantity }).map((_, index) => (
                                                                <React.Fragment key={`${category}-${ticketIndex}-${index}`}>
                                                                    <Col lg="6">
                                                                        <div className="form-group">
                                                                            <Form.Label htmlFor={`contact-${category}-${ticketIndex}-${index}`}>Contact Number ({index + 1})</Form.Label>
                                                                            <Form.Control
                                                                                type="text"
                                                                                id={`contact-${category}-${ticketIndex}-${index}`}
                                                                                name="contact"
                                                                            // onChange={(e) => handleChange(e, category, index)}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <div className="form-group">
                                                                            <Form.Label htmlFor={`email-${category}-${ticketIndex}-${index}`}>Email ID ({index + 1})</Form.Label>
                                                                            <Form.Control
                                                                                type="email"
                                                                                id={`email-${category}-${ticketIndex}-${index}`}
                                                                                name="email"
                                                                            // onChange={(e) => handleChange(e, category, index)}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </React.Fragment>
                                                            ))
                                                        ))}
                                                    </Row>
                                                </div>
                                            ))}
                                        </Row>
                                        <div className="d-flex">
                                            <Button type="submit" className="btn btn-primary">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card>
                                <Card.Header>
                                    <h4 className="mb-0">Payment Summary</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="border-bottom">
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6 className="mb-0">Order ID</h6>
                                            <h6 className="mb-0">ASDW11268</h6>
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Coupon Code"
                                                aria-label="Coupon Code"
                                                aria-describedby="CouponCode"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                            />
                                            <Button
                                                className="btn btn-primary"
                                                type="button"
                                                id="CouponCode"
                                                onClick={() => applyPromode()}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="border-bottom mt-4">
                                        {
                                            discount !== 0 &&
                                            <div className="d-flex justify-content-end  mb-4">
                                                <TabPane id="alerts-disimissible-component" className=" tab-pane tab-example-result fade active show " role="tabpanel" aria-labelledby="alerts-disimissible-component-tab">
                                                    <Alert className="d-flex align-content-center justify-content-between gap-2 alert-success alert-dismissible fade show mb-0" role="alert">
                                                        <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.94118 10.7474V20.7444C5.94118 21.0758 5.81103 21.3936 5.57937 21.628C5.3477 21.8623 5.0335 21.994 4.70588 21.994H2.23529C1.90767 21.994 1.59347 21.8623 1.36181 21.628C1.13015 21.3936 1 21.0758 1 20.7444V11.997C1 11.6656 1.13015 11.3477 1.36181 11.1134C1.59347 10.879 1.90767 10.7474 2.23529 10.7474H5.94118ZM5.94118 10.7474C7.25166 10.7474 8.50847 10.2207 9.43512 9.28334C10.3618 8.34594 10.8824 7.07456 10.8824 5.74887V4.49925C10.8824 3.83641 11.1426 3.20071 11.606 2.73201C12.0693 2.26331 12.6977 2 13.3529 2C14.0082 2 14.6366 2.26331 15.0999 2.73201C15.5632 3.20071 15.8235 3.83641 15.8235 4.49925V10.7474H19.5294C20.1847 10.7474 20.8131 11.0107 21.2764 11.4794C21.7397 11.9481 22 12.5838 22 13.2466L20.7647 19.4947C20.5871 20.2613 20.25 20.9196 19.8045 21.3704C19.3589 21.8211 18.8288 22.04 18.2941 21.994H9.64706C8.6642 21.994 7.72159 21.599 7.0266 20.896C6.33162 20.1929 5.94118 19.2394 5.94118 18.2451" stroke="currentColor" />
                                                        </svg>
                                                        <h6 className="p-0 m-0"><Badge bg="danger">{appliedPromoCode}</Badge></h6>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <strong>Success!</strong> Promocode applied succesfully!
                                                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleRemovePromocode()}></button>
                                                            </div>
                                                        </div>
                                                    </Alert>
                                                </TabPane>
                                            </div>
                                        }
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6>Sub Total</h6>
                                            <h6 className="text-primary">{ticketCurrency}{subtotal}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6>Discount</h6>
                                            <h6 className="text-success">{ticketCurrency}{discount}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6>Base Amount</h6>
                                            <h6 className="text-success">{ticketCurrency}{baseAmount}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6>Central GST (CGST) @ 9%</h6>
                                            <h6 className="text-success">{ticketCurrency}{centralGST}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6>State GST (SGST) @ 9%</h6>
                                            <h6 className="text-success">{ticketCurrency}{centralGST}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6>Convenience fees</h6>
                                            <h6 className="text-success">{ticketCurrency}{totalTax}</h6>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6 className="mb-0">Order Total</h6>
                                            <h5 className="text-primary mb-0">
                                                {ticketCurrency}{grandTotal}
                                            </h5>

                                        </div>
                                        <div className="alert border-primary rounded border-1 mb-4">
                                            <div className="d-flex justify-content-between align-items-center ">
                                                <h6 className="text-primary mb-0">
                                                    Total Savings on this order
                                                </h6>
                                                <h6 className="text-primary mb-0">
                                                    <b>{ticketCurrency}{discount}</b>
                                                </h6>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between flex-wrap">
                                            <Button
                                                id="backbutton"
                                                href="#"
                                                variant=""
                                                onClick={cart}
                                                className="btn-primary-subtle d-block back justify-content-between">Back</Button>
                                            <Button
                                                id="deliver-address"
                                                href="#"
                                                onClick={payment}
                                                className="btn btn-primary d-block"
                                            >
                                                Place Order
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                            {/* <Card>
                                <Card.Header>
                                    <h4 className="mb-0">Delivery Method</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="form-check d-flex align-items-center gap-3">
                                            <input
                                                className="form-check-input"
                                                id="StandardD"
                                                type="radio"
                                                name="delivery001"
                                            />
                                            <label
                                                className="form-check-label d-flex flex-column"
                                                htmlFor="StandardD"
                                            >
                                                <span className="h6">Standard Delivery</span>
                                                <span>2-3 days delivery</span>
                                            </label>
                                        </div>
                                        <h6 className="text-primary mb-0">FREE</h6>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="form-check d-flex align-items-center gap-3">
                                            <input
                                                className="form-check-input"
                                                id="ExpressD"
                                                type="radio"
                                                name="delivery001"
                                            />
                                            <label
                                                className="form-check-label d-flex flex-column"
                                                htmlFor="ExpressD"
                                            >
                                                <span className="h6">Express Delivery</span>
                                                <span>1 day fast delivery</span>
                                            </label>
                                        </div>
                                        <h6 className="text-primary mb-0">$10</h6>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card>
                                <div className="card-header">
                                    <h4 className="mb-0">Additional Services</h4>
                                </div>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                id="productCare"
                                                type="checkbox"
                                                name="delivery002"
                                            />
                                            <label className="form-check-label" htmlFor="productCare">
                                                <span className="h6">Handle With Care</span>
                                                <span>Protection provided</span>
                                            </label>
                                        </div>
                                        <h6 className="text-primary mb-0">$12</h6>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                id="productGift"
                                                type="checkbox"
                                                name="delivery002"
                                            />
                                            <label className="form-check-label" htmlFor="productGift">
                                                <span className="h6">Gift Wrap</span>
                                                <span>Gift wrap your product</span>
                                            </label>
                                        </div>
                                        <h6 className="text-primary mb-0">$15</h6>
                                    </div>
                                </Card.Body>
                            </Card> */}
                        </Col>
                    </Row>
                </div>
                <div id="payment" className="iq-product-tracker-card b-0">
                    <Row>
                        <Col lg="8">
                            <Card>
                                <Card.Header>
                                    <h4 className="mb-0">Payment Options</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between flex-wrap">
                                        <div className="d-flex mt-3">
                                            <Image className="img-fluid" src={img5} alt="01" />
                                            <h6 className="mb-0 ms-3">
                                                Barclays Bank Debit Card ending in 7852
                                            </h6>
                                        </div>
                                        <h6 className="mb-0 mt-3">Elon Musk</h6>
                                        <h6 className="mb-0 mt-3">06 / 2030</h6>
                                    </div>
                                    <Form className="mt-4">
                                        <div className="d-flex align-items-center">
                                            <div className="mb-4">
                                                <Form.Label>
                                                    <span className="h6">Enter CVV</span>
                                                </Form.Label>
                                                <Form.Control type="text" placeholder="xxx" required />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="btn btn-primary mt-2 ms-3"
                                            >
                                                Continue
                                            </Button>
                                        </div>
                                    </Form>
                                    <hr />
                                    <div className="card-lists">
                                        <div className="form-group mt-4">
                                            <div className="form-check mb-4">
                                                <input
                                                    type="radio"
                                                    id="credit"
                                                    name="customRadio"
                                                    className="form-check-input"
                                                    defaultChecked
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="credit"
                                                >
                                                    <span className="h6">Credit / Debit / ATM Card</span>
                                                </label>
                                            </div>
                                            <div className="form-check mb-4">
                                                <input
                                                    type="radio"
                                                    id="netbaking"
                                                    name="customRadio"
                                                    className="form-check-input"
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="netbaking"
                                                >
                                                    <span className="h6"> Net Banking</span>
                                                </label>
                                            </div>
                                            <div className="form-check mb-4">
                                                <input
                                                    type="radio"
                                                    id="emi"
                                                    name="customRadio"
                                                    className="form-check-input"
                                                />
                                                <label className="custom-control-label" htmlFor="emi">
                                                    <span className="h6">EMI (Easy Installment)</span>
                                                </label>
                                            </div>
                                            <div className="form-check mb-4">
                                                <input
                                                    type="radio"
                                                    id="cod"
                                                    name="customRadio"
                                                    className="form-check-input"
                                                />
                                                <label className="custom-control-label" htmlFor="cod">
                                                    <span className="h6">Cash On Delivery</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="d-flex flex-wrap gap-2">
                                        <Button
                                            className="btn btn-primary mt-2"
                                            href="#"
                                            role="button"
                                            onClick={checkout}
                                        >
                                            cancel
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg="4">
                            <Card>
                                <Card.Header>
                                    <h4 className="mb-0">Billing Details</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-4">
                                        <h6 className="mb-0">Order ID</h6>
                                        <h6 className="mb-0">ASDW11268</h6>
                                    </div>
                                    <div className="alert bg-body border-primary rounded border border-1">
                                        <div className="d-flex justify-content-between align-items-center ">
                                            <h6 className="text-primary mb-0">
                                                Expected date of delivery
                                            </h6>
                                            <h6 className="text-primary mb-0">12 Feb 2020</h6>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6 className="mb-0">Sub Total</h6>
                                            <h6 className="mb-0 text-primary">$206.00</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6 className="mb-0">Discount</h6>
                                            <h6 className="mb-0 text-success">-$38.00</h6>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h6 className="mb-0">Shipping</h6>
                                            <h6 className="mb-0 text-primary">FREE</h6>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mt-4">
                                        <h6 className="mb-0">Amount Payable</h6>
                                        <h6 className="mb-0 text-primary">$168.00</h6>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <Link
                                        to="/e-commerce/invoice"
                                        className="btn btn-primary w-100"
                                    >
                                        Finish Payment
                                    </Link>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
                {/* </Col> */}
            </Row>
        </Fragment>
    );
});

TicketPrecess.displayName = "TicketPrecess";
export default TicketPrecess;
