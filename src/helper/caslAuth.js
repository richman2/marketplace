import { defineAbility } from "@casl/ability";

export class Authorization {
  constructor(user = null, document = null, action, model = null) {
    this.userData = user;
    this.document = document;
    this.model = model;
    this.action = action;
  }

  async canDo() {
    return this.ability().can(this.action, this.document);
  }
  ability() {
    return defineAbility((can, cannot) => {
      switch (this.userData.user.role) {
        case "admin":
          can("manage", "all");
          break;
        case "user":
          can("update", this.model, { _userId: this.userData.user._userId });
          can("delete", this.model, { _userId: this.userData.user._userI });
          can("read", this.model, { _userId: this.userData.user._userI });
        case "seller":
          can("manage", this.model, { _sellerId: this.userData?.seller?.get("_sellerId") });
      }
    });
  }
}
