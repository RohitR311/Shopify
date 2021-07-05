import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../actions/cartActions";
import {
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  Row,
  Form,
} from "react-bootstrap";
import ErrorMessage from "../components/ErrorMessage";
import Loader from "../components/Loader";
import { addToBag, listBagItems, removeFromBag } from "../actions/bagActions";
import { BAG_CLEAR_ITEMS } from "../constants/bagConstants";

const SmartBag = ({ history }) => {
  const dispatch = useDispatch();

  const smartBag = useSelector((state) => state.smartBag);
  const { loading, error, bagItems } = smartBag;

  const generateBag = () => {
    dispatch(listBagItems());
  };

  const removeFromBagHandler = (id) => {
    dispatch(removeFromBag(id));
  };

  const addToCartHandler = () => {
    bagItems.forEach((item) => dispatch(addToCart(item._id, item.qtty)));
    dispatch({ type: BAG_CLEAR_ITEMS });
    localStorage.removeItem("bagItems");
    history.push("/cart");
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Smart Bag</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : bagItems.length === 0 ? (
          <>
            <ErrorMessage variant="info">
              Your Bag is Empty <Link to="/">Go Back</Link>
            </ErrorMessage>
            <Button type="button" className="btn-block" onClick={generateBag}>
              Click here to prefill the Bag!
            </Button>
          </>
        ) : (
          <>
            <ListGroup variant="flush">
              {bagItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>

                    <Col md={2}>&#x20B9; {item.price}</Col>

                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={item.qtty}
                        onChange={(e) =>
                          dispatch(addToBag(item._id, Number(e.target.value)))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={1}>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeFromBagHandler(item._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button
              type="button"
              className="btn-block mt-5"
              onClick={generateBag}
            >
              Click here to prefill the Bag!
            </Button>
          </>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({bagItems.reduce((acc, item) => acc + item.qtty, 0)})
                Items:
              </h2>
              ${" "}
              {bagItems
                .reduce((acc, item) => acc + item.qtty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
          </ListGroup>

          <ListGroup.Item>
            <Button
              type="button"
              className="btn-block"
              disabled={bagItems.length === 0}
              onClick={addToCartHandler}
            >
              Add Items to Cart
            </Button>
          </ListGroup.Item>
        </Card>
      </Col>
    </Row>
  );
};

export default SmartBag;
