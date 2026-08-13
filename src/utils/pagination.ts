const paginate = (items: any, pageNumber: number, pageSize: number): string[] => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
}

export default paginate