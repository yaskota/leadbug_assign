// controllers/campaignController.js
import Campaign from "../models/Campaign.js";
import Template from "../models/Template.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendCampaign = async (req, res) => {
    try {
        const { templateId, recipients, dynamicData } = req.body;
        
        if (!templateId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        const template = await Template.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        // Initialize campaign in DB
        const campaignRecipients = recipients.map(r => ({
            email: r.email,
            name: r.name || "",
            status: "pending"
        }));

        const campaign = await Campaign.create({
            createdBy: req.user._id,
            templateId,
            recipients: campaignRecipients
        });

        // Setup background sending (we will await it here for simplicity, or we can offload to a worker)
        // For a queue-based system you would just return "Started" and do this asynchronously.
        // We will do it synchronously but non-blocking response.
        res.status(202).json({ message: "Campaign started", campaignId: campaign._id });

        // Loop and send
        for (let i = 0; i < campaign.recipients.length; i++) {
            const recipient = campaign.recipients[i];
            
            // Replace variables
            let emailContent = template.content;
            
            // Default replace {{name}} if present on the recipient object
            emailContent = emailContent.replace(/\{\{name\}\}/g, recipient.name || "Customer");

            // Replace other dynamicData
            if (dynamicData) {
                for (const [key, value] of Object.entries(dynamicData)) {
                    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                    emailContent = emailContent.replace(regex, value);
                }
            }

            try {
                await sendEmail({
                    to: recipient.email,
                    subject: template.title,
                    text: emailContent.replace(/<[^>]*>?/gm, ''), // naive strip tags for text fallback
                    html: emailContent
                });
                recipient.status = "sent";
            } catch (error) {
                recipient.status = "failed";
                recipient.errorMsg = error.message;
            }
        }
        
        // Save final status
        await campaign.save();

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
};

export const getCampaignStatus = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ createdBy: req.user._id })
            .populate("templateId", "title")
            .sort({ createdAt: -1 });
        
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
