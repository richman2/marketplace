import { defineAbility } from "@casl/ability";

export class Authorization {
  constructor(user = null, document, action, model) {
    this.user = user;
    this.document = document;
    this.model = model;
    this.action = action;
    console.log(this.action)
  }

  canDo() {
    return this.ability().can(this.action, this.document);
  }
  isadmin() {
    if (this.user.get("role") !== "admin") return false;
    return this.ability().can(this.action, "all");
  }
  isSeller() {
    if (this.user.get("role") !== "seller") return false;
    return true;
  }
  ability() {

    return defineAbility((can, cannot) => {
      switch (this.user.get("role")) {
        case "admin":
          can("manage", "all");
          break;
        case "user":
          can("update", this.model, { _userId: this.user.get("_userId") });
          can("delete", this.model, { _userId: this.user.get("_userId") });
          can("read", this.model, { _userId: this.user.get("_userId") });
        case "seller":
          can(['delete', 'update'], this.model, { _sellerId: this.user?.seller.get("_sellerId") });
      }
    });
  }
}
