// routes/productRoutes.js
import express from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    AddReview,
    Addview,
    getProdctBySellerId,
} from "../controller/product.controller.js";
import multer from 'multer'
import { searchFurniture } from "../controller/openAI.js";
// import { isAdmin } from "../middelwere/isAdmin.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.post("/", upload.array('images'), createProduct);
router.get("/", getProducts);
router.patch("/add_review", AddReview);
router.get("/search", searchFurniture);
router.get("/:id", getProductById);
router.patch("/:id", upload.array('images'), updateProduct);
router.delete("/:id", deleteProduct);
router.post('/add/view/:id', Addview)
router.get('/seller/:id', getProdctBySellerId)

export default router;
