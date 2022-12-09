const prisma = require("../../utils/db");

const addChatController = async (req, res) => {
  try {
    const newChat = await prisma.chat.create({
      data: { userId: req.user?.id, contactId: req.body?.contactId },
      select: {
        id: true,
        contact: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({ data: newChat });
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

const getChatsController = async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { userId: { equals: req.user?.id } },
          { contactId: { equals: req.user?.id } },
        ],
      },
    });

    console.log(chats);

    return res.status(201).json({ chats });
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

module.exports = {
  addChatController,
  getChatsController,
};
