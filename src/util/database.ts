const paginate = (page: number, pageSize: number = 50) => {
  const offset = (page - 1) * pageSize || 0
  const limit = pageSize || 50
  return {
    offset,
    limit,
  }
}

export default paginate
