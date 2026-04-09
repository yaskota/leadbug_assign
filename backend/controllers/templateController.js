// controllers/templateController.js
import Template from "../models/Template.js";

export const createTemplate = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const template = await Template.create({
            createdBy: req.user._id,
            title,
            content
        });

        res.status(201).json({ message: "Template created successfully", template });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTemplates = async (req, res) => {
    try {
        const templates = await Template.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTemplateById = async (req, res) => {
    try {
        const template = await Template.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};