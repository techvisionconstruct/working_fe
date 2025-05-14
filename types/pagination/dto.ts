export interface PaginationLinks{
    self: string
    first: string
    last: string
    next?: string
    prev?: string
}

export interface PaginationMeta {
    current_page: number
    total_pages: number
    page_size: number
    total_count: number
}