import { ShoppingCart } from "../../models/shoppingCart.js";
import { CartItems } from "../../models/shoppingCartItem.js";
import catchAsync from "../../utils/catchAsync.js";
import { Product } from "../../models/productModel.js";
import ErrorApi from "../../utils/errorApi.js";
import { sequelize } from "../../models/db.js";


export const addToCart = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.body._productId);

  if (!product) return next(new ErrorApi("چنین محصولی وجود ندارد"));

  const existCechk = await req.cart.getProducts({ where: { _productId: req.body._productId } });
  if (existCechk.length) return next(new ErrorApi("محصول در سبد خرید وجود دارد", 400));

  await req.cart.addProduct(product, { through: { price: product.get("price"), quantity: 1 } });
  res.sendStatus(204);
});

export const updateCart = catchAsync(async (req, res, next) => {
  if (!req.body.id) return next(new ErrorApi("لطفا آیدی محصول را ارسال کنید"));
  if (!req.body.side) return next(new ErrorApi("کاهش یا افزایش دادن محصول را مشخص کنید"));
  console.log('works')

  const cartItem = await CartItems.findOne({
    where: { _cartItemId: req.body.id },
    attributes: ["_productId", "quantity"],
  });

  const checkProductQuantity = await Product.findOne({
    where: { _productId: cartItem.get("_productId") },
    attributes: ["stockQuantity"],
  });

  if (req.body.side === "up") {
    if (cartItem.get("quantity") >= checkProductQuantity.get("stockQuantity"))
      return res.status(422).json({ status: "faild", message: "موجودی محصول ناکافی" });
    console.log('works')
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
  const carts = await ShoppingCart.findAll({
    where: { _cartId: req.cart.get("_cartId") },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: Product,
        through: { attributes: ["quantity", "price"] },
        attributes: ["_productId", "productName", "price", "imagePath", "status", "stockQuantity"],
      },
    ],
  });
  const price = await CartItems.sum("price", { where: { _cartId: req.cart.get("_cartId") } });
  const [cart] = carts;
  cart.dataValues.discount = 0;
  cart.dataValues.payablePrice = price ?? 0;
  cart.dataValues.totalPrice = price ?? 0;

  req.data = { data: carts };
  next();
});
