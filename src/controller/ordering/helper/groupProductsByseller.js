export default (orderItems) => {
  return orderItems.reduce((id, item) => {
    const { _sellerId } = item;
    if (!id[_sellerId]) {
      id[_sellerId] = [];
    }
    id[_sellerId].push(item);
    return id;
  }, {});
};
