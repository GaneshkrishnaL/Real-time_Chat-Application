const { hash, genSalt, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const prisma = require("../../utils/db");

const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if the user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "user already registered" });

    // create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password, await genSalt(10)),
      },
    });

    // issue token
    const token = await sign({ id: newUser.id }, process.env.JWT_SECRET);

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser)
      return res.status(400).json({ error: "user not registered" });

    // check password
    const validPassword = await compare(password, existingUser.password);
    if (!validPassword)
      return res.status(400).json({ error: "incorrect password" });

    // issue token
    const token = await sign({ id: existingUser.id }, process.env.JWT_SECRET);

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

const getUserController = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id }, // get the user id from jwt payload
      select: {
        // return only the selected fields
        id: true,
        name: true,
        email: true,
        chats: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                from: true,
              },
            },
            contact: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        Chat: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                from: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    throw new Error(error?.message);
  }
};

const getUsersController = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: req.query?.q,
        },
        email: {
          contains: req.query?.q,
        },
        NOT: {
          id: user?.id,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        chats: {
          select: {
            id: true,
            contactId: true,
            messages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                from: true,
              },
            },
          },
        },
        Chat: {
          select: {
            id: true,
            userId: true,
            messages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                from: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    throw new Error(error?.message);
  }
};

const updateUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        name,
        email,
        password: await hash(password, await genSalt(10)),
      },
      select: {
        id: true,
        name: true,
        email: true,
        chats: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                from: true,
              },
            },
            contact: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        Chat: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                from: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({ data: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  getUserController,
  getUsersController,
  updateUserController,
};
