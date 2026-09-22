export const formatAmount = (amount: number | null, currency: boolean): string | undefined => {
    const formattedAmount =  currency ? `₦${amount?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : amount?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return formattedAmount
}

export const formatId = (id: string) : string => {
        return `VTN-${id.slice(0, 8).toUpperCase().replace(/(.{4})/g, '$1-' )}`
}

export const formatDate = (date: string) : string => {
        return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

    