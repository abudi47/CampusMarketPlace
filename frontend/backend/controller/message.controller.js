import uploadImageToCloudinary from "../config/UploadToClaudinary.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import Company from "../models/Seller.js";


export const sendMessage = async (req, res) => {
    const { SenderIsAdmin, caption, IsImg, sellerId, message, ReplyMessageID } = req.body;
    console.log(req.body);

    if (!sellerId || (!message && !IsImg)) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    let url = "";

    if (req.file) {
        try {
            url = await uploadImageToCloudinary(req.file);
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ error: "Failed to upload image" });
        }
    }

    try {
        // Create and save the new message
        const newMessage = new Message({
            SenderIsAdmin,
            sellerId,
            message: req.file ? url : message,
            IsImg,
            caption: caption || '',
            ReplyMessageID

        });

        await newMessage.save();

        // Update or create conversation
        const conversation = await Conversation.findOne({ seller: sellerId });
        if (conversation) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        } else {
            const newConversation = new Conversation({
                seller: sellerId,
                messages: [newMessage._id],
            });
            await newConversation.save();
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error saving new message or updating conversation:", error);
        res.status(500).json({ error: "Failed to save message or update conversation" });
    }
};


export const getMessages = async (req, res) => {
    const { sellerId } = req.params;
    console.log(sellerId);

    if (!sellerId) {
        return res.status(400).json({ error: "seller ID is required" });
    }

    try {
        // Find the conversation for the seller
        const conversation = await Conversation.findOne({ seller: sellerId })
            .populate({
                path: "messages",
                model: "Message",
                select: "-__v", // Exclude unnecessary fields like __v
            });

        // If no conversation exists, return an empty array
        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
};


export const getRecentMessages = async (req, res) => {
    try {
        // Fetch the latest 5 seller messages, excluding admin messages
        const messages = await Message.find({ SenderIsAdmin: false })
            .sort({ createdAt: -1 })  // Sort by createdAt in descending order
            .limit(5)  // Limit the result to the most recent 5 messages
            .populate('sellerId', '_id name email logo');  // Populate seller info (you can adjust the fields)

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};



export const getAllsellersFromConversations = async (req, res) => {
    try {

        const sellers = await Company.find();

        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sellers" });
    }
};
