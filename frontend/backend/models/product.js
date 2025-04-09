import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be less than 0']
    },
    discount: {
        type: Number,
        default: 0,
        required: false
    },
    FurnitureCategory: {
        type: String,
        enum: [
            "bed",
            "sofa",
            "couch",
            "chair",
            "table",
            "dining_table",
            "tv_stand",
            "cupboard",
            "wardrobe",
            "office",
            "nightstand",
            "dresser",
            "bookshelf",
            "desk",
            "bench",
            "ottoman",
            "stool",
            "bar_stool",
            "storage_chest",
            "bunk_bed",
            "crib",
            "accessory",
            "other"
        ],
        required: [true, "Furniture Category is required"]
    },

    FurniturePlace: {
        type: String,
        enum: ["livingroom", "bedroom", "kitchen", "bathroom", "office", 'outdoor', "accessary", "all"],
        required: [true, 'Furniture Place  is required']
    },
    tags: [{
        type: String,
    }],
    images: [{
        type: String,
        required: true,
    }],
    view: {
        type: Number,
        default: 0
    },
    reviews: [{
        profile: {
            type: String
        },
        name: {
            type: String
        },
        reviewText: {
            type: String
        },
        star: {
            type: Number
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
    ]
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
