// import { faker } from "@faker-js/faker";
const { faker } = require("@faker-js/faker");

const generateUser = (quantity) => {
  const role = ["admin", "seller", "user"];
  const Users = [];
  for (let index = 0; index < quantity; index++) {
    Users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.imei(),
      password: "1234",
      imagePath: "/images/users/1.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      role: index === 0 ? role[0] : index < 25 ? role[1] : role[2],
    });
  }
  return Users;
};

module.exports = { generateUser };
