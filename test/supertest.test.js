import { expect } from "chai";
import supertest from "supertest";
import bcrypt from "bcrypt";

const requester = supertest("http://localhost:8080");


let createdUser;
describe("Testing jwt router", () => {
    describe("Create a new account", () => {
        it("Register account successfully using email and password", async function () {
          const mockUser = {
            first_name: "John",
            last_name: "Test",
            email: "test@example.com",
            role: "user",
            password: "test1234",
          };
    
          const response = await requester
            .post("/api/jwt/register")
            .send(mockUser);

          expect(response.statusCode).is.equals(200);
          expect(response.ok).is.equals(true);
          expect(response._body.status).is.equals("success");

          createdUser = response._body.data;
          
        });
    
        it("The password should be stored encrypted", async function () {
          const isMatch = await bcrypt.compare("test1234", createdUser.password);
    
          expect(createdUser.password).to.not.equal("test1234");
          expect(isMatch).is.equals(true);
        });
    
        it("New user should have 'user' role", async function () {
          expect(createdUser.role).to.be.equals("user");
          expect(createdUser.role).to.be.a("string");
        });
    });

    describe("Login user", () => {
      it("Login user successfully using valid credentials", async function () {
        const mockUser = {
          email: "test@example.com",
          password: "test1234",
        };
  
        const { statusCode, ok, _body } = await requester
          .post("/api/jwt/login")
          .send(mockUser);
  
        expect(statusCode).is.equals(200);
        expect(ok).is.equals(true);
        expect(_body.success).is.equals("success");
      });
  
      it("Login user failed with invalid credentials", async function () {
        const mockUser = {
          email: "test@example.com",
          password: "test123456",
        };
  
        const { statusCode, ok, _body } = await requester
          .post("/api/jwt/login")
          .send(mockUser);
  
        expect(statusCode).is.equals(500);
        expect(ok).is.equals(false);
        expect(_body.success).is.equals("error");
        expect(_body.error).is.equals("Invalid credentials");
      });
  
      it("Valid login should store cookie", async function () {
        const mockUser = {
          email: "test@example.com",
          password: "test1234",
        };
  
        const result = await requester.post("/api/jwt/login").send(mockUser);
  
        const cookieResult = result.headers["set-cookie"][0];
  
        const cookieData = cookieResult.split("=");
        this.cookie = {
          name: cookieData[0],
          value: cookieData[1],
        };
  
        expect(this.cookie.name).to.be.ok.and.equal("jwtCookieToken");
        expect(this.cookie.value).to.be.ok.and.not.equal("");
      });
    });
  
    describe("Logout user", () => {
      it("Logout user successfully", function (done) {
        requester.get("/api/jwt/logout").end((error, response) => {
          if (error) {
            done(error);
          } else {
            const { statusCode, ok, _body, headers } = response;
            const cookieResult = headers["set-cookie"][0];
            const cookieData = cookieResult.split(";");
  
            this.cookie = {
              name: cookieData[0].split("=")[0],
              value: cookieData[0].split("=")[1],
            };
  
            expect(this.cookie.name).to.be.ok.and.equal("jwtCookieToken");
            expect(this.cookie.value).to.be.equals("");
  
            expect(statusCode).is.equals(200);
            expect(ok).is.equals(true);
            expect(_body.success).is.equals(true);
  
            done();
          }
        });
      });
    });
});


describe("Testing Product Endpoints", () => {
  let newProduct;
  describe("Create a new product", () => {
    it("Create a new product with all information neccesary", async function () {
      const mockProduct = {
        title: "Test product",
        description: "Description for a random test product",
        price: 100,
        thumbnails: "Sin imagen",
        category: "Test",
        code: "TEST01",
        stock: 10,
        status: true,
      };

      const response = await requester
        .post("/api/products")
        .send(mockProduct);
      expect(response.statusCode).is.equals(201);
      expect(response.ok).is.equals(true);
      expect(response._body.productCreated).to.not.be.empty;

      newProduct = response._body.productCreated;
    });

    it("Fail to create a new product with missing properties", async function () {
      const mockProduct = {
        title: "Test product",
        thumbnail: "Sin imagen",
        category: "Test",
        code: "TEST02",
        stock: 10,
        status: true,
      };

      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(mockProduct);

      expect(statusCode).is.equals(400);
      expect(ok).is.equals(false);
      expect(_body.error).is.equals("Product creation error");
      expect(_body.code).is.equals(3);
    });

    it("Fail to create a new product with existing code", async function () {
      const mockProduct = {
        title: "Test product",
        description: "Description for a random test product",
        price: 100,
        thumbnail: "Sin imagen",
        category: "Test",
        code: "TEST01",
        stock: 10,
        status: true,
      };

      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(mockProduct);

      expect(statusCode).is.equals(400);
      expect(ok).is.equals(false);
      expect(_body.error).is.equals("Product creation error");
    });
  });

  describe("Get products", () => {
    it("Get all products", async function () {
      const response = await requester.get("/api/products");

      expect(response.statusCode).is.equals(200);
      expect(response.ok).is.equals(true);
      expect(response._body.productData).to.not.be.empty;
    });

    it("Get product by ID", async function () {
      const { statusCode, ok, _body } = await requester.get(
        `/api/products/${newProduct._id}`
      );

      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
      expect(_body.productSelected).to.not.be.empty;
    });

    it("Failed to get product with an invalid ID", async function () {
      const { statusCode, ok, _body } = await requester.get(
        `/api/products/asfas`
      );

      expect(statusCode).is.equals(404);
      expect(ok).is.equals(false);
      expect(_body.error).is.not.equals("");
    });
  });

  describe("Delete a product", () => {
    it("Failed to delete a product with invalid ProductID", async function () {
      const { statusCode, ok, _body } = await requester.delete(
        `/api/products/asdfsaf`
      );

      expect(statusCode).is.equals(400);
      expect(ok).is.equals(false);
      expect(_body.error).is.not.equals("");
    });

    it("Delete a product with a valid ProductID", async function () {
      const response = await requester.delete(
        `/api/products/${newProduct._id}`
      );

      expect(response.statusCode).is.equals(200);
      expect(response.ok).is.equals(true);
      expect(response._body.message).is.equals("Content successfully deleted!");
    });
  });
});

describe("Testing Cart Endpoints", () => {
  let newCart;
  describe("Create a new cart", () => {
    it("Create a new cart successfully", async function () {
      
      const response = await requester
        .post("/api/carts");
      expect(response.statusCode).is.equals(200);
      expect(response.ok).is.equals(true);
      expect(response._body.cart).to.not.be.empty;

      newCart = response._body.cart;
    });
  });

  let productGeneratedForTesting;
  describe("Add a new product to cart", () => {
    it("Add a product to cart successfully", async function () {
      const mockProduct = {
        title: "Test product",
        description: "Description for a random test product",
        price: 100,
        thumbnails: "Sin imagen",
        category: "Test",
        code: "TEST01",
        stock: 10,
        status: true,
      };

      const result = await requester.post("/api/products").send(mockProduct);

      productGeneratedForTesting = result._body.productCreated;

      const response = await requester
        .post(`/api/carts/${newCart._id}/products/${productGeneratedForTesting._id}`).send(mockProduct);
      expect(response.statusCode).is.equals(200);
      expect(response.ok).is.equals(true);
      expect(response._body.message).is.equals("Product added");
    });
  });

  describe("Delete a new product from the cart", () => {
    it("Product deleted successfully", async function () {
      const response = await requester
        .delete(`/api/carts/${newCart._id}/products/${productGeneratedForTesting._id}`);
      expect(response.statusCode).is.equals(200);
      expect(response.ok).is.equals(true);
      expect(response._body.message).is.equals("Product deleted");
    });
  });
});
