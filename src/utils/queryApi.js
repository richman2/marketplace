export default class Query {
  constructor() {
    this.option = {};
  }
  sort(sortBy, order) {
    if (sortBy) {
      this.option.order.push([sortBy, order || "ASC"]);
    }
    return this;
  }
  filter(filterBy) {
    if (filterBy) {
      this.option.where = filterBy;
    }
    return this;
  }
  pagination(limit, offset, page) {
    if ((limit, offset)) {
      page = page || 1;
      this.option.limit = this.limit || 100;
      this.option.offset = (this.page - 1) * this.limit;
    }
    return this;
  }
  includeOption(repeat, depth, value) {
    const option = [];
    for (let j = 0; j < repeat; j++) {
      let obj = {};
      let currentLevel = obj;
      for (let i = 0; i < depth[j]; i++) {
        currentLevel["include"] = {
          model: value[j][i][0],
          through: value[j][i][1],
          as: value[j][i][2],
          attributes: value[j][i][3],
          where: value[j][i][4],
        };
        // Add a nested object with a custom value
        currentLevel = currentLevel["include"]; // Move to the next level
      }
      option.push(obj.include);
    }
    this.option.include = option;
    return this;
  }
}
