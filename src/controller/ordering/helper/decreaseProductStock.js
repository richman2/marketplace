import { Op } from "sequelize";
import { sequelize } from "../../../models/db.js";
import { Product } from "../../../models/productModel.js";
import { CartItems } from "../../../models/shoppingCartItem.js";
import ErrorApi from "../../../utils/errorApi.js";

export default async (productIdList) => {
  const t = await sequelize.transaction();

  const productsId = await Product.findAll({
    where: { _productId: { [Op.in]: productIdList.map((el) => el[0]) } },
    transaction: t,
  });
  let count = 0;
  const updateProduct = productsId.map(async (product) => {
    const idq = [];
    for (let i of productIdList[count]) {
      idq.push(i);
    }
    count++;
    if (product.get("stockQuantity") > 0) {
      product.stockQuantity -= idq[1];
      product.saleCount += idq[1];
      return await product.save({ transaction: t });
    }
    if (product.get("stockQuantity") <= 0) {
      await CartItems.destroy({ where: { _productId: product.get("_productId") } });
      throw new ErrorApi(`${product.get("productName")} موجودی ناکافی`, 422);
    }
  });

  // let count = 0;
  // const updateProd = productsId.map(async (product) => {
  //   const idq = [];
  //   for (let i of productIdList[count]) {
  //     idq.push(i);
  //   }
  //   count++;
  //   if (product.get("stockQuantity") > 0) {
  //     return Product.update(
  //       { stockQuantity: +product.get("stockQuantity") - idq[1], saleCount: +product.get("saleCount") + idq[1] },
  //       { where: { _productId: product._productId } }
  //     );
  //   }
  //   if (product.get("stockQuantity") <= 0) {
  //     await CartItems.destroy({ where: { _productId: product.get("_productId") } });
  //     throw new ErrorApi(`${product.get("productName")} موجودی ناکافی`, 422);
  //   }
  // });

  await Promise.all(updateProduct);
  await t.commit();
  try {
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
