import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import ErrorMessage from "../components/ErrorMessage";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const err = "Please select a payment method";

  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("");

  if (!shippingAddress.address) {
    history.push("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));

    if (paymentMethod !== "") {
      history.push("/placeorder");
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method:</Form.Label>

          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="paypal"
              name="paymentMethod-1"
              className="py-3"
              // checked={paymentMethod !== ""}
              onChange={(e) => setPaymentMethod("PayPal")}
            ></Form.Check>

            {/* <Form.Check
              type="radio"
              label="Stripe"
              id="stripe"
              name="paymentMethod-2"
              className="py-3"
              onChange={(e) => setPaymentMethod("Stripe")}
            ></Form.Check> */}
          </Col>
        </Form.Group>

        {paymentMethod === "" ? <ErrorMessage variant="info">{err}</ErrorMessage> : ''}

        <Button type="submit" variant="secondary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
