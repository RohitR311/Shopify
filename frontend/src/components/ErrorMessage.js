import React from "react";
import { Alert } from "react-bootstrap";

const ErrorMessage = ({children, variant}) => {
  return (
    <Alert variant={variant}>
      <p>
        {children}
      </p>
    </Alert>
  );
};

export default ErrorMessage;
