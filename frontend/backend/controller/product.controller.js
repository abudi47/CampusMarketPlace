import uploadImageToCloudinary from "../config/UploadToClaudinary.js";
import Product from "../models/product.js";

// Create a new product
export const createProduct = async (req, res) => {

    try {
        const { name, description, price, FurnitureCategory, tags, sellerId, FurniturePlace, discount } = req.body;
        const { files } = req;

        // Validation: Check if all required fields are present
        if (!name || !description || !price || !FurnitureCategory || !FurniturePlace || !discount || !files) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Handle file uploads (assuming you've set up Cloudinary or another service)
        const imageUrls = [];

        // Upload each file and store the URL
        for (let file of files) {
            const url = await uploadImageToCloudinary(file);
            imageUrls.push(url);
        }

        // Create the product
        const product = new Product({
            name,
            description,
            price,
            sellerId,
            tags,
            discount,
            FurnitureCategory,
            FurniturePlace,
            images: imageUrls
        });

        // Save to the database
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const AddReview = async (req, res) => {

    const { profile, name, reviewText, star, productId } = req.body

    try {
        const products = await Product.findById(productId);
        products.reviews.push({
            profile,
            name,
            reviewText,
            star
        })
        products.save()
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }


        // Send the response after the view count is updated
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getProdctBySellerId = async (req, res) => {
    try {
        const product = await Product.find({ sellerId: req.params.id });
        // Send the response after the view count is updated
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Get a single product by ID
export const Addview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Increment the view count and save the update
        product.view += 1;
        await product.save();

        // Send the response after the view count is updated
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        tags,
        FurnitureCategory,
        FurniturePlace,
        discount,
        existingImages, // Array of existing image URLs to keep
        sellerId
    } = req.body;

    const { files } = req;

    try {
        // Validate product exists and belongs to the seller
        const product = await Product.findOne({
            _id: req.params.id,
            sellerId: sellerId
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found or unauthorized" });
        }

        // Update product fields
        product.name = name;
        product.description = description;
        product.price = price;
        product.FurnitureCategory = FurnitureCategory;
        product.FurniturePlace = FurniturePlace;
        product.discount = discount || 0; // Default to 0 if not provided
        product.tags = JSON.parse(tags) || []; // Parse the tags array

        // Handle images
        const imageUrls = [];

        // 1. Keep existing images that weren't deleted
        const existingImagesToKeep = JSON.parse(existingImages || '[]');
        imageUrls.push(...existingImagesToKeep);

        // 2. Upload new images if any
        if (files && files.length > 0) {
            for (let file of files) {
                const url = await uploadImageToCloudinary(file);
                imageUrls.push(url);
            }
        }

        // Validate we have at least one image
        if (imageUrls.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }

        // Update product images
        product.images = imageUrls;

        // Save the updated product

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(400).json({
            error: error.message || "Failed to update product"
        });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const searchProduts = async (req, res) => {

}