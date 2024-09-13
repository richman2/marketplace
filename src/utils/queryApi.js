export default class Query {
  constructor(filter, sort, order, offset, limit, page) {
    this.filter = filter;
    this.sort = sort;
    this.order = order;
    this.offset = offset;
    this.limit = limit;
    this.page = page || 1;
    this.option = {
      where: {},
      order: [],
      limit: this.limit,
      offset: this.offset 
    };
  }
  sort() {
    if (this.sort) {
      this.option.order.push([this.sort, this.order || "ASC"]);
    }
    return this;
  }
  filter() {
    if (this.filter) {
      this.option.where = this.where;
    }
    return this;
  }
  pagination() {
    if ((this.limit, this.offset)) {
      this.page = this.page || 1;
      this.option.limit = this.limit || 100;
      this.option.offset = (this.page - 1) * this.limit;
    }
    return this;
  }
}
