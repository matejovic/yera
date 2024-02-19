import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// note: so far no db is used...
export const auth = new Elysia()
  .post(
    "/auth/token",
    async ({ body, jwt, cookie, setCookie, params }) => {
      const { email, password } = body;

      // Validate body data
      if (!body.email || !body.password) {
        throw new Error("email and password are required");
      }

      // find the user by their email
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });

      // Check if user exists
      if (!user) {
        // register them...
        const hashedPassword = await Bun.password.hash(body.password);

        const newUser = await db.user.create({
          data: {
            ...body,
            password: hashedPassword,
          },
        });
        // Password is valid, user is authenticated
        const token = await jwt.sign({ id: newUser.id });
        setCookie("token", token, { httpOnly: true });
        // return a cookie
        return { token: token };
      }

      // Check if the provided password matches the hash
      const isPasswordValid = await Bun.password.verify(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        return {
          error: "Invalid password",
        };
      }

      // Password is valid, user is authenticated
      const token = await jwt.sign({ id: user.id });
      setCookie("token", token, { httpOnly: true });
      // return a cookie
      return { token: token };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    },
  )

  .post("/auth/logout", async ({ cookie, setCookie }) => {
    // invalidate the JWT token
    setCookie("token", "", { httpOnly: true });
    return { message: "Logged out" };
  })
  .get("/auth/profile", async ({ cookie: { token }, jwt }) => {
    const token_data = await jwt.verify(token);
    if (!token_data) {
      return null;
    }

    const user = await db.user.findUnique({
      where: {
        id: token_data.id,
      },
    });

    return {
      id: token_data.id,
      email: user?.email 
    };
  })
  .post("/auth/profile", async ({ body, cookie: { token }, jwt }) => {
    // check if the user is authenticated
    const token_data = await jwt.verify(token);

    if (!token_data) {
      return { message: "Unauthorized" };
    }

    // TODO: add validation for body.bio
    // TODO: add validation for token_data.id
    const updatedUser = await db.user.update({
      where: { id: token_data.id },
      data: { bio: body.bio },
    });

    return { message: "Profile updated" };
  });
