import { ShoppingCart } from "../../models/shoppingCart.js";
import { CartItems } from "../../models/shoppingCartItem.js";
import catchAsync from "../../utils/catchAsync.js";
import { Product } from "../../models/productModel.js";
import ErrorApi from "../../utils/errorApi.js";
import { sequelize } from "../../models/db.js";
import { Discount, ProductDiscount } from "../../models/discount.js";
import { hasDiscount } from "../product/helper.js";
import Query from "../../utils/queryApi.js";
import { Op } from "sequelize";

export const addToCart = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.body._productId);

  if (!product) return next(new ErrorApi("چنین محصولی وجود ندارد"));
  if (!product.get("stockQuantity")) return next(new ErrorApi("موجودی ناکافی", 404));
  const existCechk = await req.cart.getProducts({ where: { _productId: req.body._productId } });
  if (existCechk.length) return next(new ErrorApi("محصول در سبد خرید وجود دارد", 400));

  await req.cart.addProduct(product, {
    through: { price: product.get("price"), quantity: 1 },
  });
  res.sendStatus(204);
});

export const updateCart = catchAsync(async (req, res, next) => {
  if (!req.body.id) return next(new ErrorApi("لطفا آیدی محصول را ارسال کنید"));
  if (!req.body.side) return next(new ErrorApi("کاهش یا افزایش دادن محصول را مشخص کنید"));

  const cartItem = await CartItems.findOne({
    where: { _cartItemId: req.body.id },
    attributes: ["_productId", "quantity"],
  });
  if (!cartItem) return next(new ErrorApi("چنین آیتمی در سبد خرید شما وجود ندارد"));
  const checkProductQuantity = await Product.findOne({
    where: { _productId: cartItem.get("_productId") },
    attributes: ["stockQuantity"],
  });

  if (req.body.side === "up") {
    if (cartItem.get("quantity") >= checkProductQuantity.get("stockQuantity"))
      return res.status(422).json({ status: "faild", message: "موجودی محصول ناکافی" });
    await CartItems.update(
      { price: sequelize.literal(`price * 2`), quantity: sequelize.literal("quantity + 1") },
      { where: { _cartItemId: req.body.id, _cartId: req.cart.get("_cartId") } }
    );
  } else if (req.body.side === "down") {
    await CartItems.update(
      { price: sequelize.literal("price / 2"), quantity: sequelize.literal("quantity - 1") },
      { where: { _cartItemId: req.body.id, _cartId: req.cart.get("_cartId") } }
    );
    await CartItems.destroy({ where: { quantity: 0 } });
  }
  res.sendStatus(200);
});

export const getCarts = catchAsync(async (req, res, next) => {
  if (req.data) return res.status(200).json(req.data);
  let query = new Query();

  query = query.filter({ _cartId: req.cart.get("_cartId") });
  query = query.includeOption(
    1,
    [3],
    [
      [
        [
          Product,
          { attributes: ["quantity", "price", "_cartItemId"] },
          null,
          ["_productId", "productName", "price", "imagePath", "status", "stockQuantity"],
          null,
        ],
        [ProductDiscount, null, null, ["id"], null],
        [
          Discount,
          null,
          null,
          ["value", "discountType"],
          { isActive: 1, endDate: { [Op.gt]: sequelize.literal("NOW()") } },
        ],
      ],
    ]
  );

  const cart = await ShoppingCart.findOne(query.option);
  const price = await CartItems.sum("price", { where: { _cartId: req.cart.get("_cartId") } });
  cart.dataValues.payablePrice = hasDiscount(cart) || price;
  cart.dataValues.totalAmount = price;
  const product = cart.get({ plain: true }).Products;
  
  product.map(async (el) => {
    if (el.stockQuantity <= 0) return await CartItems.destroy({ where: { _productId: product._productId } });
  });

  req.data = { data: cart };
  res.status(200).json(cart);
});

export const getCartItems = catchAsync(async (req, res, next) => {
  const cartItem = await CartItems.findAll({ where: { _cartId: req.cart.get("_cartId") } });
  console.log(cartItem);
  res.status(200).json(cartItem);
});

export const deleteCartItem = catchAsync(async (req, res, next) => {
  await CartItems.destroy({ where: { _cartItemId: req.params.itemId, _cartId: req.cart.get("_cartId") } });
  res.sendStatus(204);
});
