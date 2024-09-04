import { defineAbility } from "@casl/ability";
import { User } from "../models/userModel.js";

export class Authorization {
  constructor(user = null, document = null, model = null) {
    this.user = user;
    this.document = document;
    this.model = model;
  }

  canDo() {
    return this.ability().can;
  }
  ability() {
    return defineAbility((can, cannot) => {
      switch (this.user.role) {
        case "admin":
          can("manage", "all");
          break;
        case "user":
          can("update", this.model.name, { authorId: user.id });
          can("delete", this.model.name, { authorId: user.id });
          can("read", this.model.name, { authorId: user.id });
        case "seller":
          can("update", this.model.name, {});
      }
    });
  }
  async isSeller(Model, id) {
    const { role } = await Model.findByPk(id, { attributes: { include: ["role"] } });
    if (role !== "seller") {
      return false;
    }
    return true;
  }
}
