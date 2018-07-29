/* API calls
  - Queries and mutations samples
============================================================================= */

/** Store  ***********************************/

`
mutation {
  createStore(
    name: "Demo Stores LTD",
    address: {
      street: "Demo street" ,
      county: "Demo country",
      postcode: "DM0 0UE",
      country: "Demo World"
    }
  ) {
    name,
    address {
      street,
      county,
      postcode,
      country
    }
  }
}


mutation {
  updateStore(
    name: "Demo Stores LTD",
    update: {
      name: "Demo Stores LTD UPDATED",
      address: {
        street: "Demo street UPDATED" ,
        county: "Demo country UPDATED",
        postcode: "DM0 0UU",
        country: "Demo World UPDATED"
      }
    }
  ) {
    name,
    address {
      street,
      county,
      postcode,
      country
    }
  }
}


{
  findStore(name: "demo") {
    name,
    address {
      street,
      county,
      postcode,
      country
    }
  }
}


mutation {
	removeStore(name: "demo") {
    name
  }
}


{
  findAllStores {
    name
  }
}
`


/** User ***********************************/

`
mutation {
  createUser(
    username: "Tester",
    password: "123easy",
    email:    "valid@email.com"
  ) {
    username,
    password,
    email
  }
}


mutation {
  updateUser(
    username: "Tester",
    update: {
      username: "UPDATE_Tester",
      password: "UPDATE_123easy",
      email:    "UPDATE_valid@email.com"
    }
  ) {
    username,
    password,
    email
  }
}


{
  findUser(username: "UPDATE_Tester") {
    username,
    password,
    email
  }
}


{
  findUser(email: "UPDATE_valid@email.com") {
    username,
    password,
    email
  }
}


mutation {
	removeUser(username: "UPDATE_Tester") {
    username
  }
}


{
  findAllUsers {
    username,
    email
  }
}
`
