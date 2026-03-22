import AuthController from './AuthController'
import CategoryController from './CategoryController'
import SubCategoryController from './SubCategoryController'
import ProductController from './ProductController'
import ClaimController from './ClaimController'
import ContactController from './ContactController'
import BannerController from './BannerController'
import TestimonialController from './TestimonialController'

const Api = {
    AuthController: Object.assign(AuthController, AuthController),
    CategoryController: Object.assign(CategoryController, CategoryController),
    SubCategoryController: Object.assign(SubCategoryController, SubCategoryController),
    ProductController: Object.assign(ProductController, ProductController),
    ClaimController: Object.assign(ClaimController, ClaimController),
    ContactController: Object.assign(ContactController, ContactController),
    BannerController: Object.assign(BannerController, BannerController),
    TestimonialController: Object.assign(TestimonialController, TestimonialController),
}

export default Api