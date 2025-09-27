const customResourceResponse = {};

customResourceResponse.success = {
  statusCode: 200,
  message: "Request has been processed successfully.",
};
customResourceResponse.reqCreated = {
  statusCode: 201,
  message: "Record has been created successfully.",
};
customResourceResponse.reqUnauthorized = {
  statusCode: 401,
  message: "Unauthorized.",
};
customResourceResponse.reqForbidden = {
  statusCode: 403,
  message: "Forbidden.",
};
customResourceResponse.recordNotFound = {
  statusCode: 404,
  message: "No record found.",
};
customResourceResponse.serverError = {
  statusCode: 500,
  message: "Internal server error.",
};
customResourceResponse.reqValidationError = {
  statusCode: 422,
  message: "Data validation failed.",
};
customResourceResponse.noFileUploaded = {
  statusCode: 400,
  message: "No file uploaded.",
};

export default customResourceResponse;
