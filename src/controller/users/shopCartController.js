import { ShoppingCart } from "../../models/shoppingCart.js";
import { CartItems } from "../../models/shoppingCartItem.js";
import { User } from "../../models/userModel.js";
import { Buyer } from "../../models/buyerModel.js";
import catchAsync from "../../utils/catchAsync.js";
import { Product } from "../../models/productModel.js";
import RedisApi from "../../utils/RedisApi.js";
import ErrorApi from "../../utils/errorApi.js";
import { sequelize } from "../../models/db.js";


export const addToCart = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.body._productId);

  if (!product) return next(new ErrorApi("چنین محصولی وجود ندارد"));
  //await RedisApi.deleteByKey({ ModelName: ShoppingCart.name, uniqueId: req.user.get("_userId") });
  const existCechk = await req.cart.getProducts({ where: { _productId: req.body._productId } });
  if (existCechk.length) return next(new ErrorApi("محصول در سبد خرید وجود دارد", 400));
  const [item] = await req.cart.addProduct(product, { through: { price: product.get("price"), quantity: 1 } });
  let price = +req.cart.get("totalPrice");
  price += +item.get("price");
  await ShoppingCart.update(
    { totalPrice: price, payablePrice: price },
    { where: { _userId: req.user.get("_userId") } }
  );
  res.sendStatus(204);
});

export const updateCart = catchAsync(async (req, res, next) => {
  
  if (!req.body.id) return next(new ErrorApi("لطفا آیدی محصول را ارسال کنید"));
  if (!req.body.side) return next(new ErrorApi("کاهش یا افزایش دادن محصول را مشخص کنید"));
  //await RedisApi.deleteByKey({ ModelName: ShoppingCart.name, uniqueId: req.user.get("_userId") });
  if (req.body.side === "up") {
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

  const totalPrice = await CartItems.sum("price", { where: { _cartId: req.cart.get("_cartId") } });

  await ShoppingCart.update(
    { totalPrice: totalPrice ?? 0, payablePrice: totalPrice ?? 0 },
    { where: { _cartId: req.cart.get("_cartId") } }
  );
  res.sendStatus(200);
});

export const getCarts = catchAsync(async (req, res, next) => {
  const cachedData = await RedisApi.findInRedis({ ModelName: ShoppingCart.name, uniqueId: req.user.get("_userId") });

  if (cachedData) return res.status(200).json({ data: cachedData });
  const carts = await ShoppingCart.findAll({
    where: { _cartId: req.cart.get("_cartId") },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: Product,
        through: { attributes: ["quantity", "price"] },
        attributes: ["_productId", "productName", "price", "imagePath", "status"],
      },
    ],
  });
  await RedisApi.setInRedis({
    ModelName: ShoppingCart.name,
    uniqueId: req.user.get("_userId"),
    data: carts,
    exTime: 3600,
  });
  res.status(200).json({ data: carts });
});
