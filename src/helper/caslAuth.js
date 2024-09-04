import { defineAbility } from "@casl/ability";

class Authorization {
  constructor(user, document, model) {
    this.user = user;
    this.document = document;
    this.model = model;
  }

  canDo() {
    return this.ability().can
  }
  ability() {
    return defineAbility((can, cannot) => {
      switch (user.role) {
        case "admin":
          can("manage", "all");
          break;
        case "user":
          can("update", this.model.name, { authorId: user.id });
          can("delete", this.model.name, { authorId: user.id });
          can("read", this.model.name, { authorId: user.id });
      }
    });
  }
}
