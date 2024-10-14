const users = {};

const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  // HEAD requests don't get a body back, just the metadata.
  // So if the user made one, we don't want to write the body.
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

// return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// function to add a user from a POST body
const addUser = (request, response) => {
  // default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  const { name, age } = request.body;

  // If we dont have BOTH name and age, respond with a 400
  if (!name || !age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Otherwise, we do a 204
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!users[name]) {
    // Make a new user and return 201
    responseCode = 201;
    users[name] = {
      name,
    };
  }
  users[name].age = age;

  // This prints in the git bash console instead of the web console like the assignment pdf shows,
  // but it still does in fact do it
  console.log(users[name]);

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  // When we send back a 204 status code, it will not send response
  // body. However, if we didn't pass in an object as the 4th param
  // to our respondJSON function it would break. So we send in an
  // empty object, which will stringify to an empty string.
  return respondJSON(request, response, responseCode, {});
};

// Not found
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// public exports
module.exports = {
  getUsers,
  addUser,
  notFound,
};
