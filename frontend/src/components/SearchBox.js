import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const SearchBox = () => {
  const [keyword, setKeyword] = useState();

  const productList = useSelector((state) => state.productList);
  const { page } = productList;

  let history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) history.push(`/?keyword=${keyword}&page=${page}`);
    else history.push(history.push(history.location.pathname));
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>

      <Button type="submit" variant="outline-success" className="p-2">
        Submit
      </Button>
    </Form>
  );
};

export default SearchBox;
