import { Op } from "sequelize";
import { OrderItem } from "../../models/orderItemModel.js";
import { Product } from "../../models/productModel.js";
import { CartItems } from "../../models/shoppingCartItem.js";
import catchAsync from "../../utils/catchAsync.js";
import ErrorApi from "../../utils/errorApi.js";

const decreaseProductStock = async (idList) => {
  const productIdList = idList;
  const productsId = await Product.findAll({ where: { _productId: { [Op.in]: productIdList.map((el) => el[0]) } } });

  const updateProd = productsId.map(async (product) => {
    if (product.get("stockQuantity") > 0) {
      return Product.update(
        { stockQuantity: product.get("stockQuantity") - productIdList.map((el) => el[1]) },
        { where: { _productId: product._productId } }
      );
    }
    if (product.get("stockQuantity") <= 0) {
      await CartItems.destroy({ where: { _productId: product.get("_productId") } });
      throw new ErrorApi(`${product.get("productName")} موجودی ناکافی`, 422);
    }
  });

  await Promise.all(updateProd);
};

export const order = catchAsync(async (req, res, next) => {
  const _cartId = await req.cart.get("_cartId");
  const cartItem = await CartItems.findAll({ where: { _cartId } });
  const totalAmount = await CartItems.sum("price", { where: { _cartId } });
  await decreaseProductStock(cartItem.map((el) => [el.get("_productId"), el.get("quantity")]));

  const order = await req.user.createOrder({
    orderDate: Date.now(),
    status: "pending",
    totalAmount,
    shippingMethod: "peyk",
    shippingCost: 0,
  });
  const arr = cartItem.map(
    async (el) =>
      await OrderItem.create({
        _orderId: order.get("_orderId"),
        _productId: el.get("_productId"),
        quantity: el.get("quantity"),
        price: el.get("price"),
      })
  );
  await Promise.all(arr);
  next();
});

export const payment = catchAsync(async (req, res, next) => {});
