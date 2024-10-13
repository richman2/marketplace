import { Op } from "sequelize";
import { sequelize } from "../../../models/db.js";
import { Product } from "../../../models/productModel.js";

export default async (idList) => {
  const t = await sequelize.transaction();
  try {
    const productsId = await Product.findAll({
      where: { _productId: { [Op.in]: idList.map((el) => el[0]) } },
      transaction: t,
    });

    let count = 0;
    const updateProd = productsId.map(async (product) => {
      const idq = [];
      for (let i of idList[count]) {
        idq.push(i);
      }
      count++;
      product.stockQuantity += +idq[1];
      product.saleCount -= +idq[1];
      return product.save({ transaction: t });
    });

    await Promise.all(updateProd);
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw "error";
  }
};
